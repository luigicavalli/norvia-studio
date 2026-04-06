import { Workspace }                       from "../../domain/model/Workspace.js";
import type { WorkspaceDTO }               from "../dto/WorkspaceDTO.js";
import type { IDTOConverter }              from "../converter/IDTOConverter.js";
import { WorkspaceDTOConverter }           from "../converter/WorkspaceDTOConverter.js";
import type { GetAllWorkspacesUseCase }    from "../../application/use-case/GetAllWorkspacesUseCase.js";
import type { GetWorkspaceByIdUseCase }    from "../../application/use-case/GetWorkspaceByIdUseCase.js";
import type { GetWorkspaceBySlugUseCase }  from "../../application/use-case/GetWorkspaceBySlugUseCase.js";
import type { CreateWorkspaceUseCase }     from "../../application/use-case/CreateWorkspaceUseCase.js";
import type { UpdateWorkspaceUseCase }     from "../../application/use-case/UpdateWorkspaceUseCase.js";
import type { DeleteWorkspaceUseCase }     from "../../application/use-case/DeleteWorkspaceUseCase.js";


export class WorkspaceController {

    private readonly converter: IDTOConverter<WorkspaceDTO, Workspace> = new WorkspaceDTOConverter();

    public constructor(
        private readonly getAllWorkspacesUC:   GetAllWorkspacesUseCase,
        private readonly getWorkspaceByIdUC:   GetWorkspaceByIdUseCase,
        private readonly getWorkspaceBySlugUC: GetWorkspaceBySlugUseCase,
        private readonly createWorkspaceUC:    CreateWorkspaceUseCase,
        private readonly updateWorkspaceUC:    UpdateWorkspaceUseCase,
        private readonly deleteWorkspaceUC:    DeleteWorkspaceUseCase
    ) {}

    public async getAll(userId: string): Promise<WorkspaceDTO[]> {

        const workspaces: Workspace[] = await this.getAllWorkspacesUC.execute(userId);

        return workspaces.map((w) => this.converter.toDTO(w));

    };

    public async getById(id: string): Promise<WorkspaceDTO> {

        const workspace: Workspace = await this.getWorkspaceByIdUC.execute(id);

        return this.converter.toDTO(workspace);

    };

    public async getBySlug(slug: string): Promise<WorkspaceDTO> {

        const workspace: Workspace = await this.getWorkspaceBySlugUC.execute(slug);

        return this.converter.toDTO(workspace);

    };

    public async save(dto: WorkspaceDTO, userId: string): Promise<void> {

        const workspace: Workspace = this.converter.toBO(dto);

        await this.createWorkspaceUC.execute({ workspace, userId });

    };

    public async update(dto: WorkspaceDTO, userId: string): Promise<void> {

        const workspace: Workspace = this.converter.toBO(dto);

        await this.updateWorkspaceUC.execute({ workspace, userId });

    };

    public async delete(id: string, userId: string): Promise<void> {

        const workspace = new Workspace();
        workspace.id = id;

        await this.deleteWorkspaceUC.execute({ workspace, userId });

    };

};
