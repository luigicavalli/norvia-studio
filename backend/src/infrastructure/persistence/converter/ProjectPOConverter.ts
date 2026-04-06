/**
 * ----
 * ENUM
 * ----
 */
import type { Currencies }        from "../../../domain/enums/Currencies.js";
import type { ProjectStatuses }   from "../../../domain/enums/ProjectStatuses.js";
import type { ProjectPriorities } from "../../../domain/enums/ProjectPriorities.js";

/**
 * --
 * BO
 * --
 */
import { Client }  from "../../../domain/model/Client.js";
import { Budget }  from "../../../domain/model/Budget.js";
import { Project } from "../../../domain/model/Project.js";

/**
 * --
 * PO
 * --
 */
import { ProjectPO } from "../po/ProjectPO.js";

/**
 * ----------
 * INTERFACES
 * ----------
 */
import type { IPersistenceConverter } from "./IPersistenceConverter.js";


export class ProjectPOConverter implements IPersistenceConverter<ProjectPO, Project> {

    public toBO(po: ProjectPO): Project {

        const projectBO: Project = new Project();

            projectBO.id              = po.id;
            projectBO.name            = po.name;
            projectBO.description     = po.description;

            projectBO.client          = new Client();

            projectBO.status          = po.status as ProjectStatuses;
            projectBO.priority        = po.priority as ProjectPriorities;

            projectBO.budget          = new Budget();
            projectBO.budget.amount   = po.budget_amount;
            projectBO.budget.currency = po.budget_currency as Currencies;

            projectBO.startDate       = po.start_date;
            projectBO.dueDate         = po.due_date;
            projectBO.completedAt     = po.completed_at ?? undefined;
            projectBO.createdAt       = po.created_at;
            projectBO.updatedAt       = po.updated_at;

        return projectBO;

    };

    public toPO(bo: Project): ProjectPO {
        
        const projectPO: ProjectPO = new ProjectPO();

            projectPO.id              = bo.id;
            projectPO.workspace_id    = bo.workspace.id;
            projectPO.name            = bo.name;
            projectPO.description     = bo.description;
            projectPO.client_id       = bo.client.id;
            projectPO.quote_id        = bo.quote?.id ?? null;
            projectPO.status          = bo.status;
            projectPO.priority        = bo.priority;
            projectPO.budget_amount   = bo.budget.amount;
            projectPO.budget_currency = bo.budget.currency;
            projectPO.start_date      = bo.startDate;
            projectPO.due_date        = bo.dueDate;
            projectPO.completed_at    = bo.completedAt ?? null;
            projectPO.created_at      = bo.createdAt;
            projectPO.updated_at      = bo.updatedAt;

        return projectPO;

    };

};