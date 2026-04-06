import type { Workspace }           from "../../domain/model/Workspace.js";
import type { IUseCase }            from "./IUseCase.js";
import type { WorkspaceRepository } from "../../domain/repositories/WorkspaceRepository.js";


export class DeleteWorkspaceUseCase implements IUseCase<Workspace, boolean> {

    public constructor(private readonly workspaceRepository: WorkspaceRepository) {}

    public async execute(input: Workspace): Promise<boolean> {

        return this.workspaceRepository.delete(input);

    }

}
