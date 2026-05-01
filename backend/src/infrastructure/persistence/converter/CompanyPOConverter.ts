/**
 * --
 * BO
 * --
 */
import { Company } from "../../../domain/model/Company.js";

/**
 * --
 * PO
 * --
 */
import { CompanyPO } from "../po/CompanyPO.js";

/**
 * ----------
 * INTERFACES
 * ----------
 */
import type { IPersistenceConverter } from "./IPersistenceConverter.js";


export class CompanyPOConverter implements IPersistenceConverter<CompanyPO, Company> {

    toBO(po: CompanyPO): Company {

        const companyBO: Company = new Company();

        companyBO.id        = po.id;
        companyBO.name      = po.name;
        companyBO.taxCode   = po.tax_code;
        companyBO.email     = po.email;
        companyBO.phone     = po.phone;
        companyBO.address   = po.address;
        companyBO.city      = po.city;
        companyBO.zipCode   = po.zip_code;
        companyBO.country   = po.country;
        companyBO.website   = po.website;
        companyBO.createdAt = po.created_at;
        companyBO.updatedAt = po.updated_at;

        return companyBO;

    }

    toPO(bo: Company): CompanyPO {

        const companyPO: CompanyPO = new CompanyPO();

        companyPO.id           = bo.id;
        companyPO.workspace_id = bo.workspace.id;
        companyPO.name         = bo.name;
        companyPO.tax_code   = bo.taxCode;
        companyPO.email      = bo.email;
        companyPO.phone      = bo.phone;
        companyPO.address    = bo.address;
        companyPO.city       = bo.city;
        companyPO.zip_code   = bo.zipCode;
        companyPO.country    = bo.country;
        companyPO.website    = bo.website;
        companyPO.created_at = bo.createdAt;
        companyPO.updated_at = bo.updatedAt;

        return companyPO;

    }

};
