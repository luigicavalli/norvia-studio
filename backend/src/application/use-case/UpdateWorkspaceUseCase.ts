import { AppErrors }              from "../error/AppError.js";
import type { Workspace }           from "../../domain/model/Workspace.js";
import type { IUseCase }            from "./IUseCase.js";
import type { WorkspaceRepository } from "../../domain/repositories/WorkspaceRepository.js";


export class UpdateWorkspaceUseCase implements IUseCase<Workspace, Workspace> {

    public constructor(private readonly workspaceRepository: WorkspaceRepository) {}

    public async execute(input: Workspace): Promise<Workspace> {

        const existing: Workspace | null = await this.workspaceRepository.findBySlug(input.slug);

        if (existing && existing.id !== input.id) {
            throw AppErrors.conflict('Slug already in use', 'WORKSPACE_SLUG_CONFLICT');
        }

        return this.workspaceRepository.save(input);

    }

}
