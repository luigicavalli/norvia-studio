import { AppErrors }                   from "../error/AppError.js";
import type { Assignment }             from "../../domain/model/Assignment.js";
import type { TeamMember }             from "../../domain/model/TeamMember.js";
import type { IUseCase }               from "./IUseCase.js";
import type { AssignmentRepository }   from "../../domain/repositories/AssignmentRepository.js";
import type { TeamMemberRepository }   from "../../domain/repositories/TeamMemberRepository.js";


interface GetAssignmentsByProjectInput {
    projectId:   string;
    workspaceId: string;
    userId:      string;
}

export class GetAssignmentsByProjectUseCase implements IUseCase<GetAssignmentsByProjectInput, Assignment[]> {

    public constructor(
        private readonly assignmentRepository:  AssignmentRepository,
        private readonly teamMemberRepository:  TeamMemberRepository,
    ) {}

    public async execute(input: GetAssignmentsByProjectInput): Promise<Assignment[]> {

        const member: TeamMember | null = await this.teamMemberRepository.findByWorkspaceAndUser(input.workspaceId, input.userId);

        if (!member) {
            throw AppErrors.forbidden('Not a member of this workspace', 'FORBIDDEN');
        }

        return this.assignmentRepository.findByProject(input.projectId);

    }

}
