/**
 * ----
 * ENUM
 * ----
 */
import type { ClientStatuses } from "../../domain/enums/ClientStatuses.js";

/**
 * --
 * BO
 * --
 */
import { Client }  from "../../domain/model/Client.js";
import { Company } from "../../domain/model/Company.js";

/**
 * ---
 * DTO
 * ---
 */
import { ClientDTO }  from "../dto/ClientDTO.js";
import { CompanyDTO } from "../dto/CompanyDTO.js";

/**
 * ----------
 * INTERFACES
 * ----------
 */
import type { IDTOConverter } from "./IDTOConverter.js";


export class ClientDTOConverter implements IDTOConverter<ClientDTO, Client> {

    toBO(dto: ClientDTO): Client {

        const clientBO: Client = new Client();

        clientBO.id        = dto.id;
        clientBO.firstName = dto.firstName;
        clientBO.lastName  = dto.lastName;
        clientBO.email     = dto.email;
        clientBO.phone     = dto.phone;

        clientBO.company = new Company();
        clientBO.company.id        = dto.company.id;
        clientBO.company.name      = dto.company.name;
        clientBO.company.taxCode   = dto.company.taxCode;
        clientBO.company.email     = dto.company.email;
        clientBO.company.phone     = dto.company.phone;
        clientBO.company.address   = dto.company.address;
        clientBO.company.city      = dto.company.city;
        clientBO.company.zipCode   = dto.company.zipCode;
        clientBO.company.country   = dto.company.country;
        clientBO.company.website   = dto.company.website;
        clientBO.company.createdAt = dto.company.createdAt;
        clientBO.company.updatedAt = dto.company.updatedAt;

        clientBO.vatNumber = dto.vatNumber;
        clientBO.status    = dto.status as ClientStatuses;
        clientBO.notes     = dto.notes;
        clientBO.createdAt = dto.createdAt;
        clientBO.updatedAt = dto.updatedAt;

        return clientBO;

    }

    toDTO(bo: Client): ClientDTO {

        const clientDTO: ClientDTO = new ClientDTO();

        clientDTO.id        = bo.id;
        clientDTO.firstName = bo.firstName;
        clientDTO.lastName  = bo.lastName;
        clientDTO.email     = bo.email;
        clientDTO.phone     = bo.phone;

        clientDTO.company = new CompanyDTO();
        clientDTO.company.id        = bo.company.id;
        clientDTO.company.name      = bo.company.name;
        clientDTO.company.taxCode   = bo.company.taxCode;
        clientDTO.company.email     = bo.company.email;
        clientDTO.company.phone     = bo.company.phone;
        clientDTO.company.address   = bo.company.address;
        clientDTO.company.city      = bo.company.city;
        clientDTO.company.zipCode   = bo.company.zipCode;
        clientDTO.company.country   = bo.company.country;
        clientDTO.company.website   = bo.company.website;
        clientDTO.company.createdAt = bo.company.createdAt;
        clientDTO.company.updatedAt = bo.company.updatedAt;

        clientDTO.vatNumber = bo.vatNumber;
        clientDTO.status    = bo.status;
        clientDTO.notes     = bo.notes;
        clientDTO.createdAt = bo.createdAt;
        clientDTO.updatedAt = bo.updatedAt;

        return clientDTO;

    }

};
