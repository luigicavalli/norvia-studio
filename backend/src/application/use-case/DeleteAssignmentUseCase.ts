import { AppErrors }                   from "../error/AppError.js";
import type { Assignment }             from "../../domain/model/Assignment.js";
import type { IUseCase }               from "./IUseCase.js";
import type { AssignmentRepository }   from "../../domain/repositories/AssignmentRepository.js";


export class DeleteAssignmentUseCase implements IUseCase<Assignment, boolean> {

    public constructor(private readonly assignmentRepository: AssignmentRepository) {}

    public async execute(input: Assignment): Promise<boolean> {

        const success = await this.assignmentRepository.delete(input);

        if (!success) {
            throw AppErrors.notFound('Assignment not found', 'ASSIGNMENT_NOT_FOUND');
        }

        return success;

    }

}
