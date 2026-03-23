import type { Project }               from "../../../domain/model/Project.js";
import type { ProjectPO }             from "../po/ProjectPO.js";
import type { ProjectDAO }            from "../dao/ProjectDAO.js";
import { ProjectPOConverter }         from "../converter/ProjectPOConverter.js";
import type { ProjectPOFlat }         from "../po/ProjectPOFlat.js";
import type { ProjectStatuses }       from "../../../domain/enums/ProjectStatuses.js";
import type { ProjectRepository }     from "../../../domain/repositories/ProjectRepository.js";
import { ProjectPOFlatConverter }     from "../converter/ProjectPOFlatConverter.js";
import type { IPersistenceConverter } from "../converter/IPersistenceConverter.js";


export class ProjectRepositoryImpl implements ProjectRepository {

    private readonly converter:     IPersistenceConverter<ProjectPO, Project>     = new ProjectPOConverter();
    private readonly flatConverter: IPersistenceConverter<ProjectPOFlat, Project> = new ProjectPOFlatConverter();

    public constructor(private readonly dao: ProjectDAO) {}

    public async findAll(limit?: number, offset?: number): Promise<Project[]> {

        const projects: Project[] = [];

        const records: ProjectPOFlat[] = await this.dao.findAll(limit, offset);

        records.forEach((record: ProjectPOFlat) => {
            const project: Project = this.flatConverter.toBO(record);

            projects.push(project);
        });

        return projects;

    };

    public async findByClient(clientId: string, limit?: number, offset?: number): Promise<Project[]> {
        
        const projects: Project[] = [];

        const records: ProjectPOFlat[] = await this.dao.findByClient(clientId, limit, offset);

        records.forEach((record: ProjectPOFlat) => {
            const project: Project = this.flatConverter.toBO(record);

            projects.push(project);
        });

        return projects;

    };

    public async updateStatus(projectId: string, status: ProjectStatuses): Promise<Project> {
        
        const updatedRecord: ProjectPO = await this.dao.updateStatus(projectId, status);

        const project: Project = this.converter.toBO(updatedRecord);

        return project;

    };

    public async findByNameAndClient(projectName: string, clientId: string, limit?: number, offset?: number): Promise<Project[]> {
        
        const projects: Project[] = [];

        const records: ProjectPOFlat[] = await this.dao.findByNameAndClient(projectName, clientId, limit, offset);

        records.forEach((record: ProjectPOFlat) => {
            const project: Project = this.flatConverter.toBO(record);

            projects.push(project);
        });

        return projects;

    }

    public async findById(id: string): Promise<Project | null> {
        
        const record: ProjectPOFlat | null = await this.dao.findById(id);

        if (!record) {
            return null;
        }
        
        const project: Project = this.flatConverter.toBO(record);

        return project;

    };

    public async save(entity: Project): Promise<Project> {
        
        const projectPO: ProjectPO = this.converter.toPO(entity).flatten() as ProjectPO;

        const record: ProjectPO = await this.dao.save(projectPO);

        const createdProject: Project = this.converter.toBO(record);

        return createdProject;

    };

    public async delete(entity: Project): Promise<boolean> {

        const projectPO: ProjectPO = this.converter.toPO(entity).flatten() as ProjectPO;
        
        const success: boolean = await this.dao.delete(projectPO);

        return success ? true : false;

    };
    
};