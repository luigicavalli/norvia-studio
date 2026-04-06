import type { Quote }                 from "../../../domain/model/Quote.js";
import type { Client }                from "../../../domain/model/Client.js";
import type { Project }               from "../../../domain/model/Project.js";
import type { QuotePO }               from "../po/QuotePO.js";
import type { QuoteDAO }              from "../dao/QuoteDAO.js";
import type { ClientPO }              from "../po/ClientPO.js";
import type { ProjectPO }             from "../po/ProjectPO.js";
import type { ClientDAO }             from "../dao/ClientDAO.js";
import type { Workspace }             from "../../../domain/model/Workspace.js";
import type { ProjectDAO }            from "../dao/ProjectDAO.js";
import type { Assignment }            from "../../../domain/model/Assignment.js";
import type { TeamMember }            from "../../../domain/model/TeamMember.js";
import type { WorkspacePO }           from "../po/WorkspacePO.js";
import { QuotePOConverter }           from "../converter/QuotePOConverter.js";
import type { WorkspaceDAO }          from "../dao/WorkspaceDAO.js";
import { ClientPOConverter }          from "../converter/ClientPOConverter.js";
import type { AssignmentPO }          from "../po/AssignmentPO.js";
import type { TeamMemberPO }          from "../po/TeamMemberPO.js";
import type { AssignmentDAO }         from "../dao/AssignmentDAO.js";
import type { TeamMemberDAO }         from "../dao/TeamMemberDAO.js";
import { ProjectPOConverter }         from "../converter/ProjectPOConverter.js";
import { WorkspacePOConverter }       from "../converter/WorkspacePOConverter.js";
import type { ProjectStatuses }       from "../../../domain/enums/ProjectStatuses.js";
import { AssignmentPOConverter }      from "../converter/AssignmentPOConverter.js";
import { TeamMemberPOConverter }      from "../converter/TeamMemberPOConverter.js";
import type { ProjectRepository }     from "../../../domain/repositories/ProjectRepository.js";
import type { IPersistenceConverter } from "../converter/IPersistenceConverter.js";


export class ProjectRepositoryImpl implements ProjectRepository {

    private readonly projectConverter:    IPersistenceConverter<ProjectPO, Project>       = new ProjectPOConverter();
    private readonly workspaceConverter:  IPersistenceConverter<WorkspacePO, Workspace>   = new WorkspacePOConverter();
    private readonly clientConverter:     IPersistenceConverter<ClientPO, Client>         = new ClientPOConverter();
    private readonly assignmentConverter: IPersistenceConverter<AssignmentPO, Assignment> = new AssignmentPOConverter();
    private readonly teamMemberConverter: IPersistenceConverter<TeamMemberPO, TeamMember> = new TeamMemberPOConverter();
    private readonly quoteConverter:      IPersistenceConverter<QuotePO, Quote>           = new QuotePOConverter();

    public constructor(
        private readonly projectDao:    ProjectDAO,
        private readonly workspaceDao:  WorkspaceDAO,
        private readonly assignmentDao: AssignmentDAO,
        private readonly teamMemberDao: TeamMemberDAO,
        private readonly clientDao:     ClientDAO,
        private readonly quoteDao:      QuoteDAO
    ) {}

    private async assembleProjects(records: ProjectPO[]): Promise<Project[]> {

        if (records.length === 0) return [];

        // Batch fetch all referenced entities
        const workspaceIds  = [...new Set(records.map(r => r.workspace_id))];
        const clientIds     = [...new Set(records.map(r => r.client_id))];
        const projectIds    = records.map(r => r.id);
        const quoteIds      = [...new Set(
            records.map(r => r.quote_id).filter((id): id is string => id !== null)
        )];

        const [workspacePOs, clientPOs, assignmentPOs, quotePOs] = await Promise.all([
            this.workspaceDao.findByIds(workspaceIds),
            this.clientDao.findByIds(clientIds),
            this.assignmentDao.findByProjects(projectIds),
            quoteIds.length > 0 ? this.quoteDao.findByIds(quoteIds) : Promise.resolve([]),
        ]);

        // Batch fetch team members referenced by assignments
        const teamMemberIds = [...new Set(assignmentPOs.map(a => a.team_member_id))];
        const teamMemberPOs = teamMemberIds.length > 0
            ? await this.teamMemberDao.findByIds(teamMemberIds)
            : [];

        // Build lookup maps
        const workspaceMap  = new Map(workspacePOs.map(w  => [w.id, w]));
        const clientMap     = new Map(clientPOs.map(c     => [c.id, c]));
        const teamMemberMap = new Map(teamMemberPOs.map(tm => [tm.id, tm]));
        const quoteMap      = new Map(quotePOs.map(q      => [q.id, q]));

        // Group assignments by project
        const assignmentsByProject = new Map<string, AssignmentPO[]>();

        for (const a of assignmentPOs) {
            const list = assignmentsByProject.get(a.project_id) ?? [];

            list.push(a);

            assignmentsByProject.set(a.project_id, list);
        }

        // Assemble domain objects
        return records.map(record => {

            const projectBo: Project = this.projectConverter.toBO(record);

            const workspacePo = workspaceMap.get(record.workspace_id);

            if (workspacePo) projectBo.workspace = this.workspaceConverter.toBO(workspacePo);

            const clientPo = clientMap.get(record.client_id);

            if (clientPo) projectBo.client = this.clientConverter.toBO(clientPo);

            const projectAssignments = assignmentsByProject.get(record.id) ?? [];

            const assignments: Assignment[] = projectAssignments.map(aPo => {
                const assignmentBo: Assignment = this.assignmentConverter.toBO(aPo);

                const teamMemberPo: TeamMemberPO | undefined = teamMemberMap.get(aPo.team_member_id);

                if (teamMemberPo) assignmentBo.teamMember = this.teamMemberConverter.toBO(teamMemberPo);

                return assignmentBo;
            });

            projectBo.assignments = assignments;

            if (record.quote_id) {
                const quotePo = quoteMap.get(record.quote_id);
                
                if (quotePo) projectBo.quote = this.quoteConverter.toBO(quotePo);
            }

            return projectBo;

        });

    };

    public async findAll(limit?: number, offset?: number): Promise<Project[]> {

        const records: ProjectPO[] = await this.projectDao.findAll(limit, offset);

        return this.assembleProjects(records);

    };

    public async findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<Project[]> {

        const records: ProjectPO[] = await this.projectDao.findByWorkspace(workspaceId, limit, offset);

        return this.assembleProjects(records);

    };

    public async findById(id: string): Promise<Project | null> {

        const record: ProjectPO | null = await this.projectDao.findById(id);

        if (!record) return null;

        const assembled = await this.assembleProjects([record]);

        return assembled[0] ?? null;

    };

    public async findByClient(workspaceId: string, clientId: string, limit?: number, offset?: number): Promise<Project[]> {

        const records: ProjectPO[] = await this.projectDao.findByClient(workspaceId, clientId, limit, offset);

        return this.assembleProjects(records);

    };

    public async findByNameAndClient(workspaceId: string, projectName: string, clientId: string, limit?: number, offset?: number): Promise<Project[]> {

        const records: ProjectPO[] = await this.projectDao.findByNameAndClient(workspaceId, projectName, clientId, limit, offset);

        return this.assembleProjects(records);

    };

    public async updateStatus(projectId: string, status: ProjectStatuses): Promise<Project> {

        const record: ProjectPO = await this.projectDao.updateStatus(projectId, status);

        const assembled = await this.assembleProjects([record]);

        return assembled[0]!;

    };

    public async save(entity: Project): Promise<Project> {

        const record: ProjectPO = await this.projectDao.save(this.projectConverter.toPO(entity));

        const assembled = await this.assembleProjects([record]);

        return assembled[0]!;

    };

    public async delete(entity: Project): Promise<boolean> {

        return this.projectDao.delete(this.projectConverter.toPO(entity));

    };

};
