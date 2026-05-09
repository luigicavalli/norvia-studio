import { Invoice }                     from "../../../domain/model/Invoice.js";
import { InvoiceItem }                 from "../../../domain/model/InvoiceItem.js";
import type { Client }                 from "../../../domain/model/Client.js";
import type { Workspace }              from "../../../domain/model/Workspace.js";
import type { InvoicePO }             from "../po/InvoicePO.js";
import type { InvoiceItemPO }         from "../po/InvoiceItemPO.js";
import type { ClientPO }              from "../po/ClientPO.js";
import type { WorkspacePO }           from "../po/WorkspacePO.js";
import type { InvoiceDAO }            from "../dao/InvoiceDAO.js";
import type { InvoiceItemDAO }        from "../dao/InvoiceItemDAO.js";
import type { ClientDAO }             from "../dao/ClientDAO.js";
import type { WorkspaceDAO }          from "../dao/WorkspaceDAO.js";
import { InvoicePOConverter }         from "../converter/InvoicePOConverter.js";
import { InvoiceItemPOConverter }     from "../converter/InvoiceItemPOConverter.js";
import { ClientPOConverter }          from "../converter/ClientPOConverter.js";
import { WorkspacePOConverter }       from "../converter/WorkspacePOConverter.js";
import type { InvoiceStatus }         from "../../../domain/enums/InvoiceStatus.js";
import type { InvoiceRepository }     from "../../../domain/repositories/InvoiceRepository.js";
import type { IPersistenceConverter } from "../converter/IPersistenceConverter.js";


export class InvoiceRepositoryImpl implements InvoiceRepository {

    private readonly invoiceConverter:     IPersistenceConverter<InvoicePO, Invoice>         = new InvoicePOConverter();
    private readonly invoiceItemConverter: IPersistenceConverter<InvoiceItemPO, InvoiceItem> = new InvoiceItemPOConverter();
    private readonly clientConverter:      IPersistenceConverter<ClientPO, Client>           = new ClientPOConverter();
    private readonly workspaceConverter:   IPersistenceConverter<WorkspacePO, Workspace>     = new WorkspacePOConverter();

    public constructor(
        private readonly invoiceDao:     InvoiceDAO,
        private readonly invoiceItemDao: InvoiceItemDAO,
        private readonly clientDao:      ClientDAO,
        private readonly workspaceDao:   WorkspaceDAO,
    ) {}

    private async assembleInvoices(records: InvoicePO[]): Promise<Invoice[]> {

        if (records.length === 0) return [];

        const invoiceIds   = records.map(r => r.id);
        const clientIds    = [...new Set(records.map(r => r.client_id))];
        const workspaceIds = [...new Set(records.map(r => r.workspace_id))];

        const [itemPOs, clientPOs, workspacePOs] = await Promise.all([
            this.invoiceItemDao.findByInvoices(invoiceIds),
            this.clientDao.findByIds(clientIds),
            this.workspaceDao.findByIds(workspaceIds),
        ]);

        const clientMap    = new Map(clientPOs.map(c => [c.id, c]));
        const workspaceMap = new Map(workspacePOs.map(w => [w.id, w]));

        const itemsByInvoice = new Map<string, InvoiceItemPO[]>();
        for (const item of itemPOs) {
            const list = itemsByInvoice.get(item.invoice_id) ?? [];
            list.push(item);
            itemsByInvoice.set(item.invoice_id, list);
        }

        return records.map(record => {

            const bo: Invoice = this.invoiceConverter.toBO(record);

            const workspacePo = workspaceMap.get(record.workspace_id);
            if (workspacePo) bo.workspace = this.workspaceConverter.toBO(workspacePo);

            const clientPo = clientMap.get(record.client_id);
            if (clientPo) bo.client = this.clientConverter.toBO(clientPo);

            bo.items = (itemsByInvoice.get(record.id) ?? []).map(iPo => {
                const itemBo = this.invoiceItemConverter.toBO(iPo);
                itemBo.invoice = bo;
                return itemBo;
            });

            return bo;

        });

    };

    public async findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<Invoice[]> {

        const records = await this.invoiceDao.findByWorkspace(workspaceId, limit, offset);

        return this.assembleInvoices(records);

    };

    public async findByClient(workspaceId: string, clientId: string, limit?: number, offset?: number): Promise<Invoice[]> {

        const records = await this.invoiceDao.findByClient(workspaceId, clientId, limit, offset);

        return this.assembleInvoices(records);

    };

    public async findByProject(projectId: string): Promise<Invoice[]> {

        const records = await this.invoiceDao.findByProject(projectId);

        return this.assembleInvoices(records);

    };

    public async findById(id: string): Promise<Invoice | null> {

        const record = await this.invoiceDao.findById(id);

        if (!record) return null;

        const assembled = await this.assembleInvoices([record]);

        return assembled[0] ?? null;

    };

    public async save(entity: Invoice): Promise<Invoice> {

        const record = await this.invoiceDao.save(this.invoiceConverter.toPO(entity));

        await this.invoiceItemDao.deleteByInvoice(record.id);

        for (const item of entity.items) {
            item.invoice = entity;
            await this.invoiceItemDao.save(this.invoiceItemConverter.toPO(item));
        }

        const assembled = await this.assembleInvoices([record]);

        return assembled[0]!;

    };

    public async updateStatus(invoiceId: string, status: InvoiceStatus): Promise<Invoice> {

        const record = await this.invoiceDao.updateStatus(invoiceId, status);

        const assembled = await this.assembleInvoices([record]);

        return assembled[0]!;

    };

    public async delete(entity: Invoice): Promise<boolean> {

        return this.invoiceDao.delete(this.invoiceConverter.toPO(entity));

    };

};
