import type { TeamMember }             from "../../../domain/model/TeamMember.js";
import type { TeamMemberPO }           from "../po/TeamMemberPO.js";
import type { TeamMemberDAO }          from "../dao/TeamMemberDAO.js";
import { TeamMemberPOConverter }       from "../converter/TeamMemberPOConverter.js";
import type { TeamMemberRepository }   from "../../../domain/repositories/TeamMemberRepository.js";
import type { IPersistenceConverter }  from "../converter/IPersistenceConverter.js";


export class TeamMemberRepositoryImpl implements TeamMemberRepository {

    private readonly converter: IPersistenceConverter<TeamMemberPO, TeamMember> = new TeamMemberPOConverter();

    public constructor(private readonly dao: TeamMemberDAO) {}

    public async findByWorkspace(workspaceId: string): Promise<TeamMember[]> {

        const records: TeamMemberPO[] = await this.dao.findByWorkspace(workspaceId);

        return records.map((r) => this.converter.toBO(r));

    };

    public async findByWorkspaceAndUser(workspaceId: string, userId: string): Promise<TeamMember | null> {

        const record: TeamMemberPO | null = await this.dao.findByUserId(workspaceId, userId);

        return record ? this.converter.toBO(record) : null;

    };

    public async findByWorkspaceAndEmail(workspaceId: string, email: string): Promise<TeamMember | null> {

        const record: TeamMemberPO | null = await this.dao.findByEmail(workspaceId, email);

        return record ? this.converter.toBO(record) : null;

    };

    public async findById(id: string): Promise<TeamMember | null> {

        const record: TeamMemberPO | null = await this.dao.findById(id);

        return record ? this.converter.toBO(record) : null;

    };

    public async save(entity: TeamMember): Promise<TeamMember> {

        const record: TeamMemberPO = await this.dao.save(this.converter.toPO(entity));

        return this.converter.toBO(record);

    };

    public async delete(entity: TeamMember): Promise<boolean> {

        return this.dao.delete(this.converter.toPO(entity));

    };

};
