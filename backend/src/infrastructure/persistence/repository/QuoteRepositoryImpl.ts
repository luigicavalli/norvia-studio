import { Quote }                        from "../../../domain/model/Quote.js";
import { QuoteItem }                    from "../../../domain/model/QuoteItem.js";
import type { Client }                  from "../../../domain/model/Client.js";
import type { Workspace }               from "../../../domain/model/Workspace.js";
import type { QuotePO }                 from "../po/QuotePO.js";
import type { QuoteItemPO }             from "../po/QuoteItemPO.js";
import type { ClientPO }                from "../po/ClientPO.js";
import type { WorkspacePO }             from "../po/WorkspacePO.js";
import type { QuoteDAO }                from "../dao/QuoteDAO.js";
import type { QuoteItemDAO }            from "../dao/QuoteItemDAO.js";
import type { ClientDAO }               from "../dao/ClientDAO.js";
import type { WorkspaceDAO }            from "../dao/WorkspaceDAO.js";
import { QuotePOConverter }             from "../converter/QuotePOConverter.js";
import { QuoteItemPOConverter }         from "../converter/QuoteItemPOConverter.js";
import { ClientPOConverter }            from "../converter/ClientPOConverter.js";
import { WorkspacePOConverter }         from "../converter/WorkspacePOConverter.js";
import type { QuoteStatuses }           from "../../../domain/enums/QuoteStatuses.js";
import type { QuoteRepository }         from "../../../domain/repositories/QuoteRepository.js";
import type { IPersistenceConverter }   from "../converter/IPersistenceConverter.js";


export class QuoteRepositoryImpl implements QuoteRepository {

    private readonly quoteConverter:     IPersistenceConverter<QuotePO, Quote>         = new QuotePOConverter();
    private readonly quoteItemConverter: IPersistenceConverter<QuoteItemPO, QuoteItem> = new QuoteItemPOConverter();
    private readonly clientConverter:    IPersistenceConverter<ClientPO, Client>       = new ClientPOConverter();
    private readonly workspaceConverter: IPersistenceConverter<WorkspacePO, Workspace> = new WorkspacePOConverter();

    public constructor(
        private readonly quoteDao:     QuoteDAO,
        private readonly quoteItemDao: QuoteItemDAO,
        private readonly clientDao:    ClientDAO,
        private readonly workspaceDao: WorkspaceDAO,
    ) {}

    private async assembleQuotes(records: QuotePO[]): Promise<Quote[]> {

        if (records.length === 0) return [];

        const quoteIds     = records.map(r => r.id);
        const clientIds    = [...new Set(records.map(r => r.client_id))];
        const workspaceIds = [...new Set(records.map(r => r.workspace_id))];

        const [itemPOs, clientPOs, workspacePOs] = await Promise.all([
            this.quoteItemDao.findByQuotes(quoteIds),
            this.clientDao.findByIds(clientIds),
            this.workspaceDao.findByIds(workspaceIds),
        ]);

        const clientMap    = new Map(clientPOs.map(c => [c.id, c]));
        const workspaceMap = new Map(workspacePOs.map(w => [w.id, w]));

        const itemsByQuote = new Map<string, QuoteItemPO[]>();
        for (const item of itemPOs) {
            const list = itemsByQuote.get(item.quote_id) ?? [];
            list.push(item);
            itemsByQuote.set(item.quote_id, list);
        }

        return records.map(record => {

            const quoteBo: Quote = this.quoteConverter.toBO(record);

            const workspacePo = workspaceMap.get(record.workspace_id);
            if (workspacePo) quoteBo.workspace = this.workspaceConverter.toBO(workspacePo);

            const clientPo = clientMap.get(record.client_id);
            if (clientPo) quoteBo.client = this.clientConverter.toBO(clientPo);

            const quoteItems = (itemsByQuote.get(record.id) ?? []).map(iPo => {
                const itemBo = this.quoteItemConverter.toBO(iPo);
                itemBo.quote = quoteBo;
                return itemBo;
            });
            quoteBo.items = quoteItems;

            return quoteBo;

        });

    };

    public async findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<Quote[]> {

        const records = await this.quoteDao.findByWorkspace(workspaceId, limit, offset);

        return this.assembleQuotes(records);

    };

    public async findByClient(workspaceId: string, clientId: string, limit?: number, offset?: number): Promise<Quote[]> {

        const records = await this.quoteDao.findByClient(workspaceId, clientId, limit, offset);

        return this.assembleQuotes(records);

    };

    public async findById(id: string): Promise<Quote | null> {

        const record = await this.quoteDao.findById(id);

        if (!record) return null;

        const assembled = await this.assembleQuotes([record]);

        return assembled[0] ?? null;

    };

    public async save(entity: Quote): Promise<Quote> {

        const record = await this.quoteDao.save(this.quoteConverter.toPO(entity));

        // Replace items: delete existing, insert new ones
        await this.quoteItemDao.deleteByQuote(record.id);

        for (const item of entity.items) {
            item.quote = entity;
            await this.quoteItemDao.save(this.quoteItemConverter.toPO(item));
        }

        const assembled = await this.assembleQuotes([record]);

        return assembled[0]!;

    };

    public async updateStatus(quoteId: string, status: QuoteStatuses): Promise<Quote> {

        const record = await this.quoteDao.updateStatus(quoteId, status);

        const assembled = await this.assembleQuotes([record]);

        return assembled[0]!;

    };

    public async delete(entity: Quote): Promise<boolean> {

        return this.quoteDao.delete(this.quoteConverter.toPO(entity));

    };

};
