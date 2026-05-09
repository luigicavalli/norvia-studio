import { Project }                         from "../../../domain/model/Project.js";
import type { Assignment }                 from "../../../domain/model/Assignment.js";
import type { TeamMember }                 from "../../../domain/model/TeamMember.js";
import type { AssignmentPO }              from "../po/AssignmentPO.js";
import type { TeamMemberPO }              from "../po/TeamMemberPO.js";
import type { AssignmentDAO }             from "../dao/AssignmentDAO.js";
import type { TeamMemberDAO }             from "../dao/TeamMemberDAO.js";
import { AssignmentPOConverter }          from "../converter/AssignmentPOConverter.js";
import { TeamMemberPOConverter }          from "../converter/TeamMemberPOConverter.js";
import type { AssignmentRepository }      from "../../../domain/repositories/AssignmentRepository.js";
import type { IPersistenceConverter }     from "../converter/IPersistenceConverter.js";


export class AssignmentRepositoryImpl implements AssignmentRepository {

    private readonly assignmentConverter: IPersistenceConverter<AssignmentPO, Assignment> = new AssignmentPOConverter();
    private readonly teamMemberConverter: IPersistenceConverter<TeamMemberPO, TeamMember> = new TeamMemberPOConverter();

    public constructor(
        private readonly assignmentDao:  AssignmentDAO,
        private readonly teamMemberDao:  TeamMemberDAO,
    ) {}

    private async assembleAssignments(records: AssignmentPO[]): Promise<Assignment[]> {

        if (records.length === 0) return [];

        const teamMemberIds = [...new Set(records.map(r => r.team_member_id))];
        const teamMemberPOs = await this.teamMemberDao.findByIds(teamMemberIds);

        const teamMemberMap = new Map(teamMemberPOs.map(tm => [tm.id, tm]));

        return records.map(record => {

            const assignmentBo: Assignment = this.assignmentConverter.toBO(record);

            const projectStub = new Project();
            projectStub.id = record.project_id;
            assignmentBo.project = projectStub;

            const teamMemberPo = teamMemberMap.get(record.team_member_id);
            if (teamMemberPo) assignmentBo.teamMember = this.teamMemberConverter.toBO(teamMemberPo);

            return assignmentBo;

        });

    };

    public async findByProject(projectId: string): Promise<Assignment[]> {

        const records = await this.assignmentDao.findByProject(projectId);

        return this.assembleAssignments(records);

    };

    public async findByTeamMember(teamMemberId: string): Promise<Assignment[]> {

        const records = await this.assignmentDao.findByTeamMember(teamMemberId);

        return this.assembleAssignments(records);

    };

    public async findById(id: string): Promise<Assignment | null> {

        const record = await this.assignmentDao.findById(id);

        if (!record) return null;

        const assembled = await this.assembleAssignments([record]);

        return assembled[0] ?? null;

    };

    public async save(entity: Assignment): Promise<Assignment> {

        const record = await this.assignmentDao.save(this.assignmentConverter.toPO(entity));

        const assembled = await this.assembleAssignments([record]);

        return assembled[0]!;

    };

    public async delete(entity: Assignment): Promise<boolean> {

        return this.assignmentDao.delete(this.assignmentConverter.toPO(entity));

    };

};
