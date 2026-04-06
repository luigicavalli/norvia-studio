import { Project }                         from "../../domain/model/Project.js";
import type { ProjectDTO }                 from "../dto/ProjectDTO.js";
import type { IDTOConverter }              from "../converter/IDTOConverter.js";
import { ProjectDTOConverter }             from "../converter/ProjectDTOConverter.js";
import type { ProjectStatuses }            from "../../domain/enums/ProjectStatuses.js";
import type { UpdateProjectUseCase }       from "../../application/use-case/UpdateProjectUseCase.js";
import type { CreateProjectUseCase }       from "../../application/use-case/CreateProjectUseCase.js";
import type { DeleteProjectUseCase }       from "../../application/use-case/DeleteProjectUseCase.js";
import type { GetAllProjectsUseCase }      from "../../application/use-case/GetAllProjectsUseCase.js";
import type { GetProjectByIdUseCase }      from "../../application/use-case/GetProjectByIdUseCase.js";
import type { GetProjectsByClientUseCase } from "../../application/use-case/GetProjectsByClientUseCase.js";
import type { UpdateProjectStatusUseCase } from "../../application/use-case/UpdateProjectStatusUseCase.js";


export class ProjectController {

    private readonly converter: IDTOConverter<ProjectDTO, Project> = new ProjectDTOConverter();

    public constructor(
        private readonly getAllProjectsUC:      GetAllProjectsUseCase,
        private readonly getProjectsByClientUC: GetProjectsByClientUseCase,
        private readonly getProjectByIdUC:      GetProjectByIdUseCase,
        private readonly createProjectUC:       CreateProjectUseCase,
        private readonly updateProjectUC:       UpdateProjectUseCase,
        private readonly updateProjectStatusUC: UpdateProjectStatusUseCase,
        private readonly deleteProjectUC:       DeleteProjectUseCase
    ) {}

    public async getAll(workspaceId: string, userId: string, limit?: number, offset?: number): Promise<ProjectDTO[]> {

        const projectDTOs: ProjectDTO[] = [];

        const records: Project[] = await this.getAllProjectsUC.execute({ workspaceId, userId, limit, offset });

        records.forEach((record: Project) => {
            const projectDTO: ProjectDTO = this.converter.toDTO(record);

            projectDTOs.push(projectDTO);
        });

        return projectDTOs;

    };

    public async getByClient(workspaceId: string, clientId: string, userId: string, limit?: number, offset?: number): Promise<ProjectDTO[]> {

        const projectDTOs: ProjectDTO[] = [];

        const records: Project[] = await this.getProjectsByClientUC.execute({ workspaceId, clientId, userId, limit, offset });

        records.forEach((record: Project) => {
            const projectDTO: ProjectDTO = this.converter.toDTO(record);

            projectDTOs.push(projectDTO);
        });

        return projectDTOs;

    };

    public async getById(id: string): Promise<ProjectDTO | null> {

        const record: Project | null = await this.getProjectByIdUC.execute(id);

        if (!record) {
            return null;
        }

        const projectDTO: ProjectDTO = this.converter.toDTO(record);

        return projectDTO;

    };

    public async save(projectDTO: ProjectDTO): Promise<void> {

        const project: Project = this.converter.toBO(projectDTO);

        await this.createProjectUC.execute(project);

    };

    public async update(projectDTO: ProjectDTO): Promise<void> {

        const project: Project = this.converter.toBO(projectDTO);

        await this.updateProjectUC.execute(project);

    };

    public async updateStatus(projectId: string, projectStatus: ProjectStatuses): Promise<void> {

        await this.updateProjectStatusUC.execute({ projectId, projectStatus });

    };

    public async delete(id: string): Promise<void> {

        const project = new Project();
        project.id = id;

        await this.deleteProjectUC.execute(project);

    };

};