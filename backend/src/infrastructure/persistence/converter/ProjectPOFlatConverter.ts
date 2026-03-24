import { Budget }                     from "../../../domain/model/Budget.js";
import { Client }                     from "../../../domain/model/Client.js";
import { Project }                    from "../../../domain/model/Project.js";
import { EnumParsers }                from "./EnumParsers.js";
import { type ProjectPOFlat }         from "../po/ProjectPOFlat.js";
import { type IPersistenceConverter } from "./IPersistenceConverter.js";


export class ProjectPOFlatConverter implements IPersistenceConverter<ProjectPOFlat, Project> {

    toBO(po: ProjectPOFlat): Project {

        const projectBo: Project = new Project();

        projectBo.id          = po.project_id;
        projectBo.name        = po.project_name;
        projectBo.description = po.project_description;

        projectBo.client = new Client();
        projectBo.client.id        = po.project_client_id;
        projectBo.client.firstName = po.project_client_first_name;
        projectBo.client.lastName  = po.project_client_last_name;
        projectBo.client.email     = po.project_client_email;

        projectBo.status   = EnumParsers.toProjectStatusBO(po.project_status);
        projectBo.priority = EnumParsers.toProjectPriorityBO(po.project_priority);

        projectBo.budget = new Budget();
        projectBo.budget.amount   = po.project_budget_amount;
        projectBo.budget.currency = EnumParsers.toCurrenciesBO(po.project_budget_currency);

        projectBo.startDate   = po.project_start_date;
        projectBo.dueDate     = po.project_due_date;
        projectBo.completedAt = po.project_completed_at;
        projectBo.createdAt   = po.project_created_at;
        projectBo.updatedAt   = po.project_updated_at;

        return projectBo;

    };

    toPO(bo: Project): ProjectPOFlat {
        void bo;

        throw new Error("Method not implemented.");
    };
    
};