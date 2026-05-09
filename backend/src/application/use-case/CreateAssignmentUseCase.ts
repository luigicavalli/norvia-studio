import { AppErrors }                   from "../error/AppError.js";
import type { Assignment }             from "../../domain/model/Assignment.js";
import type { IUseCase }               from "./IUseCase.js";
import type { AssignmentRepository }   from "../../domain/repositories/AssignmentRepository.js";
import type { TeamMemberRepository }   from "../../domain/repositories/TeamMemberRepository.js";


interface CreateAssignmentInput {
    assignment:  Assignment;
    workspaceId: string;
    userId:      string;
}

export class CreateAssignmentUseCase implements IUseCase<CreateAssignmentInput, Assignment> {

    public constructor(
        private readonly assignmentRepository: AssignmentRepository,
        private readonly teamMemberRepository: TeamMemberRepository,
    ) {}

    public async execute(input: CreateAssignmentInput): Promise<Assignment> {

        const member = await this.teamMemberRepository.findByWorkspaceAndUser(input.workspaceId, input.userId);

        if (!member) {
            throw AppErrors.forbidden('Not a member of this workspace', 'FORBIDDEN');
        }

        return this.assignmentRepository.save(input.assignment);

    }

}
