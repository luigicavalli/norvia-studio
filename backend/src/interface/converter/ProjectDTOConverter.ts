/**
 * ----
 * ENUM
 * ----
 */
import type { ClientStatuses }    from "../../domain/enums/ClientStatuses.js";
import type { Currencies }        from "../../domain/enums/Currencies.js";
import type { ProjectStatuses }   from "../../domain/enums/ProjectStatuses.js";
import type { ProjectPriorities } from "../../domain/enums/ProjectPriorities.js";

/**
 * --
 * BO
 * --
 */
import { Client }  from "../../domain/model/Client.js";
import { Company } from "../../domain/model/Company.js";
import { Project } from "../../domain/model/Project.js";

/**
 * ---
 * DTO
 * ---
 */
import type { ClientDTO }  from "../dto/ClientDTO.js";
import type { CompanyDTO } from "../dto/CompanyDTO.js";
import type { ProjectDTO } from "../dto/ProjectDTO.js";

/**
 * ----------
 * INTERFACES
 * ----------
 */
import type { IDTOConverter } from "./IDTOConverter.js";
import { Budget } from "../../domain/model/Budget.js";


export class ProjectDTOConverter implements IDTOConverter<ProjectDTO, Project> {

    toBO(dto: ProjectDTO): Project {

        const projectBO: Project = new Project();

        projectBO.id          = dto.id;
        projectBO.name        = dto.name;
        projectBO.description = dto.description;

        projectBO.client = new Client();
        projectBO.client.id        = dto.client.id;
        projectBO.client.firstName = dto.client.firstName;
        projectBO.client.lastName  = dto.client.lastName;
        projectBO.client.email     = dto.client.email;
        projectBO.client.phone     = dto.client.phone;

        projectBO.client.company = new Company();
        projectBO.client.company.id        = dto.client.company.id;
        projectBO.client.company.name      = dto.client.company.name;
        projectBO.client.company.taxCode   = dto.client.company.taxCode;
        projectBO.client.company.email     = dto.client.company.email;
        projectBO.client.company.phone     = dto.client.company.phone;
        projectBO.client.company.address   = dto.client.company.address;
        projectBO.client.company.city      = dto.client.company.city;
        projectBO.client.company.zipCode   = dto.client.company.zipCode;
        projectBO.client.company.country   = dto.client.company.country;
        projectBO.client.company.website   = dto.client.company.website;
        projectBO.client.company.createdAt = dto.client.company.createdAt;
        projectBO.client.company.updatedAt = dto.client.company.updatedAt;

        projectBO.client.vatNumber = dto.client.vatNumber;
        projectBO.client.status    = dto.client.status as ClientStatuses;
        projectBO.client.notes     = dto.client.notes;
        projectBO.client.createdAt = dto.client.createdAt;
        projectBO.client.updatedAt = dto.client.updatedAt;

        projectBO.status          = dto.status as ProjectStatuses;
        projectBO.priority        = dto.priority as ProjectPriorities;

        projectBO.budget = new Budget();
        projectBO.budget.amount   = dto.budgetAmount;
        projectBO.budget.currency = dto.budgetCurrency as Currencies;

        projectBO.startDate   = dto.startDate;
        projectBO.dueDate     = dto.dueDate;
        projectBO.completedAt = dto.completedAt ?? undefined;
        projectBO.createdAt   = dto.createdAt;
        projectBO.updatedAt   = dto.updatedAt;

        return projectBO;

    }

    toDTO(bo: Project): ProjectDTO {

        const projectDTO: ProjectDTO = {} as ProjectDTO;

        projectDTO.id          = bo.id;
        projectDTO.name        = bo.name;
        projectDTO.description = bo.description;

        projectDTO.client = {} as ClientDTO;
        projectDTO.client.id        = bo.client.id;
        projectDTO.client.firstName = bo.client.firstName;
        projectDTO.client.lastName  = bo.client.lastName;
        projectDTO.client.email     = bo.client.email;
        projectDTO.client.phone     = bo.client.phone;

        projectDTO.client.company = {} as CompanyDTO;
        projectDTO.client.company.id        = bo.client.company.id;
        projectDTO.client.company.name      = bo.client.company.name;
        projectDTO.client.company.taxCode   = bo.client.company.taxCode;
        projectDTO.client.company.email     = bo.client.company.email;
        projectDTO.client.company.phone     = bo.client.company.phone;
        projectDTO.client.company.address   = bo.client.company.address;
        projectDTO.client.company.city      = bo.client.company.city;
        projectDTO.client.company.zipCode   = bo.client.company.zipCode;
        projectDTO.client.company.country   = bo.client.company.country;
        projectDTO.client.company.website   = bo.client.company.website;
        projectDTO.client.company.createdAt = bo.client.company.createdAt;
        projectDTO.client.company.updatedAt = bo.client.company.updatedAt;

        projectDTO.client.vatNumber = bo.client.vatNumber;
        projectDTO.client.status    = bo.client.status;
        projectDTO.client.notes     = bo.client.notes;
        projectDTO.client.createdAt = bo.client.createdAt;
        projectDTO.client.updatedAt = bo.client.updatedAt;

        projectDTO.status         = bo.status;
        projectDTO.priority       = bo.priority;
        projectDTO.budgetAmount   = bo.budget.amount;
        projectDTO.budgetCurrency = bo.budget.currency;
        projectDTO.startDate      = bo.startDate;
        projectDTO.dueDate        = bo.dueDate;
        projectDTO.completedAt    = bo.completedAt ?? null;
        projectDTO.createdAt      = bo.createdAt;
        projectDTO.updatedAt      = bo.updatedAt;

        return projectDTO;

    }

};