/**
 * --
 * BO
 * --
 */
import { Company } from "../../domain/model/Company.js";

/**
 * ---
 * DTO
 * ---
 */
import { CompanyDTO } from "../dto/CompanyDTO.js";

/**
 * ----------
 * INTERFACES
 * ----------
 */
import type { IDTOConverter } from "./IDTOConverter.js";


export class CompanyDTOConverter implements IDTOConverter<CompanyDTO, Company> {

    toBO(dto: CompanyDTO): Company {

        const companyBO: Company = new Company();

        companyBO.id        = dto.id;
        companyBO.name      = dto.name;
        companyBO.taxCode   = dto.taxCode;
        companyBO.email     = dto.email;
        companyBO.phone     = dto.phone;
        companyBO.address   = dto.address;
        companyBO.city      = dto.city;
        companyBO.zipCode   = dto.zipCode;
        companyBO.country   = dto.country;
        companyBO.website   = dto.website;
        companyBO.createdAt = dto.createdAt;
        companyBO.updatedAt = dto.updatedAt;

        return companyBO;

    }

    toDTO(bo: Company): CompanyDTO {

        const companyDTO: CompanyDTO = new CompanyDTO();

        companyDTO.id        = bo.id;
        companyDTO.name      = bo.name;
        companyDTO.taxCode   = bo.taxCode;
        companyDTO.email     = bo.email;
        companyDTO.phone     = bo.phone;
        companyDTO.address   = bo.address;
        companyDTO.city      = bo.city;
        companyDTO.zipCode   = bo.zipCode;
        companyDTO.country   = bo.country;
        companyDTO.website   = bo.website;
        companyDTO.createdAt = bo.createdAt;
        companyDTO.updatedAt = bo.updatedAt;

        return companyDTO;

    }

};
