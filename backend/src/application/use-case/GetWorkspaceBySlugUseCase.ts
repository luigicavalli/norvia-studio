import { AppErrors }              from "../error/AppError.js";
import type { Workspace }           from "../../domain/model/Workspace.js";
import type { IUseCase }            from "./IUseCase.js";
import type { WorkspaceRepository } from "../../domain/repositories/WorkspaceRepository.js";


export class GetWorkspaceBySlugUseCase implements IUseCase<string, Workspace> {

    public constructor(private readonly workspaceRepository: WorkspaceRepository) {}

    public async execute(slug: string): Promise<Workspace> {

        const workspace: Workspace | null = await this.workspaceRepository.findBySlug(slug);

        if (!workspace) {
            throw AppErrors.notFound('Workspace not found', 'WORKSPACE_NOT_FOUND');
        }

        return workspace;

    }

}
