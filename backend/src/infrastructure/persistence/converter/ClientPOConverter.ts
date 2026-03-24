/**
 * ----
 * ENUM
 * ----
 */
import type { ClientStatuses } from "../../../domain/enums/ClientStatuses.js";

/**
 * --
 * BO
 * --
 */
import { Client }  from "../../../domain/model/Client.js";
import { Company } from "../../../domain/model/Company.js";

/**
 * --
 * PO
 * --
 */
import { ClientPO }  from "../po/ClientPO.js";
import { CompanyPO } from "../po/CompanyPO.js";

/**
 * ----------
 * INTERFACES
 * ----------
 */
import type { IPersistenceConverter } from "./IPersistenceConverter.js";


export class ClientPOConverter implements IPersistenceConverter<ClientPO, Client> {

    toBO(po: ClientPO): Client {

        const clientBO: Client = new Client();

        clientBO.id        = po.id;
        clientBO.firstName = po.first_name;
        clientBO.lastName  = po.last_name;
        clientBO.email     = po.email;
        clientBO.phone     = po.phone;

        clientBO.company = new Company();
        clientBO.company.id        = po.company.id;
        clientBO.company.name      = po.company.name;
        clientBO.company.taxCode   = po.company.tax_code;
        clientBO.company.email     = po.company.email;
        clientBO.company.phone     = po.company.phone;
        clientBO.company.address   = po.company.address;
        clientBO.company.city      = po.company.city;
        clientBO.company.zipCode   = po.company.zip_code;
        clientBO.company.country   = po.company.country;
        clientBO.company.website   = po.company.website;
        clientBO.company.createdAt = po.company.created_at;
        clientBO.company.updatedAt = po.company.updated_at;

        clientBO.vatNumber = po.vat_number;
        clientBO.status    = po.status as ClientStatuses;
        clientBO.notes     = po.notes;
        clientBO.createdAt = po.created_at;
        clientBO.updatedAt = po.updated_at;

        return clientBO;

    }

    toPO(bo: Client): ClientPO {

        const clientPO: ClientPO = new ClientPO();

        clientPO.id         = bo.id;
        clientPO.first_name = bo.firstName;
        clientPO.last_name  = bo.lastName;
        clientPO.email      = bo.email;
        clientPO.phone      = bo.phone;

        clientPO.company = new CompanyPO();
        clientPO.company.id         = bo.company.id;
        clientPO.company.name       = bo.company.name;
        clientPO.company.tax_code   = bo.company.taxCode;
        clientPO.company.email      = bo.company.email;
        clientPO.company.phone      = bo.company.phone;
        clientPO.company.address    = bo.company.address;
        clientPO.company.city       = bo.company.city;
        clientPO.company.zip_code   = bo.company.zipCode;
        clientPO.company.country    = bo.company.country;
        clientPO.company.website    = bo.company.website;
        clientPO.company.created_at = bo.company.createdAt;
        clientPO.company.updated_at = bo.company.updatedAt;

        clientPO.vat_number = bo.vatNumber;
        clientPO.status     = bo.status;
        clientPO.notes      = bo.notes;
        clientPO.created_at = bo.createdAt;
        clientPO.updated_at = bo.updatedAt;

        return clientPO;

    }

};
