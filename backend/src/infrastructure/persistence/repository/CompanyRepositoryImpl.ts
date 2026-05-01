import type { Company }               from "../../../domain/model/Company.js";
import type { Workspace }             from "../../../domain/model/Workspace.js";
import type { CompanyPO }             from "../po/CompanyPO.js";
import type { CompanyDAO }            from "../dao/CompanyDAO.js";
import type { WorkspacePO }           from "../po/WorkspacePO.js";
import type { WorkspaceDAO }          from "../dao/WorkspaceDAO.js";
import { CompanyPOConverter }         from "../converter/CompanyPOConverter.js";
import { WorkspacePOConverter }       from "../converter/WorkspacePOConverter.js";
import type { CompanyRepository }     from "../../../domain/repositories/CompanyRepository.js";
import type { IPersistenceConverter } from "../converter/IPersistenceConverter.js";


export class CompanyRepositoryImpl implements CompanyRepository {

    private readonly companyConverter:   IPersistenceConverter<CompanyPO, Company>     = new CompanyPOConverter();
    private readonly workspaceConverter: IPersistenceConverter<WorkspacePO, Workspace> = new WorkspacePOConverter();

    public constructor(
        private readonly companyDao:   CompanyDAO,
        private readonly workspaceDao: WorkspaceDAO
    ) {}

    private async assembleCompanies(records: CompanyPO[]): Promise<Company[]> {

        if (records.length === 0) return [];

        const workspaceIds = [...new Set(records.map(r => r.workspace_id))];
        const workspacePOs = await this.workspaceDao.findByIds(workspaceIds);
        const workspaceMap = new Map(workspacePOs.map(w => [w.id, w]));

        return records.map(record => {

            const companyBo: Company = this.companyConverter.toBO(record);

            const workspacePo = workspaceMap.get(record.workspace_id);
            if (workspacePo) companyBo.workspace = this.workspaceConverter.toBO(workspacePo);

            return companyBo;

        });

    };

    public async findAll(limit?: number, offset?: number): Promise<Company[]> {

        const records: CompanyPO[] = await this.companyDao.findAll(limit, offset);

        return this.assembleCompanies(records);

    };

    public async findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<Company[]> {

        const records: CompanyPO[] = await this.companyDao.findByWorkspace(workspaceId, limit, offset);

        return this.assembleCompanies(records);

    };

    public async findById(id: string): Promise<Company | null> {

        const record: CompanyPO | null = await this.companyDao.findById(id);

        if (!record) return null;

        const assembled = await this.assembleCompanies([record]);

        return assembled[0] ?? null;

    };

    public async findByTaxCode(workspaceId: string, taxCode: string): Promise<Company | null> {

        const record: CompanyPO | null = await this.companyDao.findByTaxCode(workspaceId, taxCode);

        if (!record) return null;

        const assembled = await this.assembleCompanies([record]);

        return assembled[0] ?? null;

    };

    public async save(entity: Company): Promise<Company> {

        const record: CompanyPO = await this.companyDao.save(this.companyConverter.toPO(entity));

        const assembled = await this.assembleCompanies([record]);

        return assembled[0]!;

    };

    public async delete(entity: Company): Promise<boolean> {

        return this.companyDao.delete(this.companyConverter.toPO(entity));

    };

};
