import { Assignment }                          from "../../domain/model/Assignment.js";
import { Project }                             from "../../domain/model/Project.js";
import { TeamMember }                          from "../../domain/model/TeamMember.js";
import type { AssignmentDTO }                  from "../dto/AssignmentDTO.js";
import type { IDTOConverter }                  from "../converter/IDTOConverter.js";
import { AssignmentDTOConverter }              from "../converter/AssignmentDTOConverter.js";
import type { CreateAssignmentUseCase }           from "../../application/use-case/CreateAssignmentUseCase.js";
import type { DeleteAssignmentUseCase }           from "../../application/use-case/DeleteAssignmentUseCase.js";
import type { GetAssignmentsByProjectUseCase }    from "../../application/use-case/GetAssignmentsByProjectUseCase.js";
import type { GetAssignmentsByWorkspaceUseCase }  from "../../application/use-case/GetAssignmentsByWorkspaceUseCase.js";


export class AssignmentController {

    private readonly converter: IDTOConverter<AssignmentDTO, Assignment> = new AssignmentDTOConverter();

    public constructor(
        private readonly getAssignmentsByWorkspaceUC: GetAssignmentsByWorkspaceUseCase,
        private readonly getAssignmentsByProjectUC:   GetAssignmentsByProjectUseCase,
        private readonly createAssignmentUC:          CreateAssignmentUseCase,
        private readonly deleteAssignmentUC:          DeleteAssignmentUseCase,
    ) {}

    public async getByWorkspace(workspaceId: string, userId: string): Promise<AssignmentDTO[]> {

        const records = await this.getAssignmentsByWorkspaceUC.execute({ workspaceId, userId });

        return records.map(r => this.converter.toDTO(r));

    };

    public async getByProject(projectId: string, workspaceId: string, userId: string): Promise<AssignmentDTO[]> {

        const records = await this.getAssignmentsByProjectUC.execute({ projectId, workspaceId, userId });

        return records.map(r => this.converter.toDTO(r));

    };

    public async save(projectId: string, teamMemberId: string, workspaceId: string, userId: string): Promise<void> {

        const assignment = new Assignment();
        assignment.id        = crypto.randomUUID();
        assignment.createdAt = new Date();

        const project = new Project();
        project.id = projectId;
        assignment.project = project;

        const teamMember = new TeamMember();
        teamMember.id = teamMemberId;
        assignment.teamMember = teamMember;

        await this.createAssignmentUC.execute({ assignment, workspaceId, userId });

    };

    public async delete(id: string): Promise<void> {

        const assignment = new Assignment();
        assignment.id = id;

        await this.deleteAssignmentUC.execute(assignment);

    };

};
