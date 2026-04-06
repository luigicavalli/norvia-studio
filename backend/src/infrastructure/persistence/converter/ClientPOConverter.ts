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

/**
 * ----------
 * INTERFACES
 * ----------
 */
import type { IPersistenceConverter } from "./IPersistenceConverter.js";


export class ClientPOConverter implements IPersistenceConverter<ClientPO, Client> {

    public toBO(po: ClientPO): Client {

        const clientBO: Client = new Client();

            clientBO.id        = po.id;
            clientBO.firstName = po.first_name;
            clientBO.lastName  = po.last_name;
            clientBO.email     = po.email;
            clientBO.phone     = po.phone;

            clientBO.company   = new Company();

            clientBO.vatNumber = po.vat_number;
            clientBO.status    = po.status as ClientStatuses;
            clientBO.notes     = po.notes;
            clientBO.createdAt = po.created_at;
            clientBO.updatedAt = po.updated_at;

        return clientBO;

    };

    public toPO(bo: Client): ClientPO {

        const clientPO: ClientPO = new ClientPO();

            clientPO.id         = bo.id;
            clientPO.first_name = bo.firstName;
            clientPO.last_name  = bo.lastName;
            clientPO.email      = bo.email;
            clientPO.phone      = bo.phone;
            clientPO.company_id = bo.company.id;
            clientPO.vat_number = bo.vatNumber;
            clientPO.status     = bo.status;
            clientPO.notes      = bo.notes;
            clientPO.created_at = bo.createdAt;
            clientPO.updated_at = bo.updatedAt;

        return clientPO;

    };

};
