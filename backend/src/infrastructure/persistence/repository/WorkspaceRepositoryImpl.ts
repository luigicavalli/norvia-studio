import type { Workspace }             from "../../../domain/model/Workspace.js";
import type { WorkspacePO }           from "../po/WorkspacePO.js";
import type { WorkspaceDAO }          from "../dao/WorkspaceDAO.js";
import { WorkspacePOConverter }       from "../converter/WorkspacePOConverter.js";
import type { WorkspaceRepository }   from "../../../domain/repositories/WorkspaceRepository.js";
import type { IPersistenceConverter } from "../converter/IPersistenceConverter.js";


export class WorkspaceRepositoryImpl implements WorkspaceRepository {

    private readonly converter: IPersistenceConverter<WorkspacePO, Workspace> = new WorkspacePOConverter();

    public constructor(private readonly dao: WorkspaceDAO) {}

    public async findAll(): Promise<Workspace[]> {

        const records: WorkspacePO[] = await this.dao.findAll();

        return records.map((r) => this.converter.toBO(r));

    };

    public async findById(id: string): Promise<Workspace | null> {

        const record: WorkspacePO | null = await this.dao.findById(id);

        return record ? this.converter.toBO(record) : null;

    };

    public async findByUserId(userId: string): Promise<Workspace[]> {

        const records: WorkspacePO[] = await this.dao.findByUserId(userId);

        return records.map((r) => this.converter.toBO(r));

    };

    public async findBySlug(slug: string): Promise<Workspace | null> {

        const record: WorkspacePO | null = await this.dao.findBySlug(slug);

        return record ? this.converter.toBO(record) : null;

    };

    public async save(entity: Workspace): Promise<Workspace> {

        const record: WorkspacePO = await this.dao.save(this.converter.toPO(entity));

        return this.converter.toBO(record);

    };

    public async delete(entity: Workspace): Promise<boolean> {

        return this.dao.delete(this.converter.toPO(entity));

    };

};
