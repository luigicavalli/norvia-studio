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
import { Project } from "../../../domain/model/Project.js";

/**
 * --
 * PO
 * --
 */
import { ClientPO }  from "../po/ClientPO.js";
import { ProjectPO } from "../po/ProjectPO.js";

/**
 * ----------
 * INTERFACES
 * ----------
 */
import type { IPersistenceConverter } from "./IPersistenceConverter.js";
import { Budget } from "../../../domain/model/Budget.js";


export class ProjectPOConverter implements IPersistenceConverter<ProjectPO, Project> {

    toBO(po: ProjectPO): Project {

        const projectBO: Project = new Project();

        projectBO.id          = po.id;
        projectBO.name        = po.name;
        projectBO.description = po.description;

        projectBO.client = new Client();
        projectBO.client.id        = po.client.id;
        projectBO.client.firstName = po.client.first_name;
        projectBO.client.lastName  = po.client.last_name;
        projectBO.client.email     = po.client.email;

        projectBO.status          = po.status as ProjectStatuses;
        projectBO.priority        = po.priority as ProjectPriorities;

        projectBO.budget = new Budget();
        projectBO.budget.amount   = po.budget_amount;
        projectBO.budget.currency = po.budget_currency as Currencies;

        projectBO.startDate   = po.start_date;
        projectBO.dueDate     = po.due_date;
        projectBO.completedAt = po.completed_at ?? null;
        projectBO.createdAt   = po.created_at;
        projectBO.updatedAt   = po.updated_at;

        return projectBO;

    }

    toPO(bo: Project): ProjectPO {
        
        const projectPO: ProjectPO = new ProjectPO();

        projectPO.id          = bo.id;
        projectPO.name        = bo.name;
        projectPO.description = bo.description;

        projectPO.client = new ClientPO();
        projectPO.client.id         = bo.client.id;
        projectPO.client.first_name = bo.client.firstName;
        projectPO.client.last_name  = bo.client.lastName;
        projectPO.client.email      = bo.client.email;

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

    }

};