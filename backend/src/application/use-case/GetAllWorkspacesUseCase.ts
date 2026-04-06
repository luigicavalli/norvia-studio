import type { Workspace }           from "../../domain/model/Workspace.js";
import type { IUseCase }            from "./IUseCase.js";
import type { WorkspaceRepository } from "../../domain/repositories/WorkspaceRepository.js";


export class GetAllWorkspacesUseCase implements IUseCase<string, Workspace[]> {

    public constructor(private readonly workspaceRepository: WorkspaceRepository) {}

    public async execute(userId: string): Promise<Workspace[]> {

        return this.workspaceRepository.findByUserId(userId);

    }

}
