import { Client }                     from "../../../domain/model/Client.js";
import { Company }                    from "../../../domain/model/Company.js";
import { EnumParsers }                from "./EnumParsers.js";
import { type ClientPOFlat }          from "../po/ClientPOFlat.js";
import { type IPersistenceConverter } from "./IPersistenceConverter.js";


export class ClientPOFlatConverter implements IPersistenceConverter<ClientPOFlat, Client> {

    toBO(po: ClientPOFlat): Client {
        
        const clientBo: Client = new Client();

        clientBo.id        = po.client_id;
        clientBo.firstName = po.client_first_name;
        clientBo.lastName  = po.client_last_name;
        clientBo.email     = po.client_email;
        clientBo.phone     = po.client_phone;

        clientBo.company = new Company();
        clientBo.company.id      = po.client_company_id;
        clientBo.company.name    = po.client_company_name;
        clientBo.company.taxCode = po.client_company_tax_code;
        clientBo.company.email   = po.client_company_email;
        clientBo.company.phone   = po.client_company_phone;
        clientBo.company.address = po.client_company_address;
        clientBo.company.city    = po.client_company_city;
        clientBo.company.zipCode = po.client_company_zip_code;
        clientBo.company.country = po.client_company_country;
        clientBo.company.website = po.client_company_website;

        clientBo.vatNumber = po.client_vat_number;
        clientBo.status    = EnumParsers.toClientStatusBO(po.client_status);
        clientBo.notes     = po.client_notes;
        clientBo.createdAt = po.client_created_at;
        clientBo.updatedAt = po.client_updated_at;

        return clientBo;

    };

    toPO(bo: Client): ClientPOFlat {
        void bo;

        throw new Error("Method not implemented.");
    };
    
};