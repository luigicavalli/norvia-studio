import type { Company }                from "../../domain/model/Company.js";
import type { CompanyDTO }             from "../dto/CompanyDTO.js";
import type { IDTOConverter }          from "../converter/IDTOConverter.js";
import { CompanyDTOConverter }         from "../converter/CompanyDTOConverter.js";
import type { UpdateCompanyUseCase }   from "../../application/use-case/UpdateCompanyUseCase.js";
import type { CreateCompanyUseCase }   from "../../application/use-case/CreateCompanyUseCase.js";
import type { DeleteCompanyUseCase }   from "../../application/use-case/DeleteCompanyUseCase.js";
import type { GetCompanyByIdUseCase }  from "../../application/use-case/GetCompanyByIdUseCase.js";
import type { GetAllCompaniesUseCase } from "../../application/use-case/GetAllCompaniesUseCase.js";


export class CompanyController {

    private readonly converter: IDTOConverter<CompanyDTO, Company> = new CompanyDTOConverter();

    public constructor(
        private readonly getAllCompaniesUC: GetAllCompaniesUseCase,
        private readonly getCompanyByIdUC:  GetCompanyByIdUseCase,
        private readonly createCompanyUC:   CreateCompanyUseCase,
        private readonly updateCompanyUC:   UpdateCompanyUseCase,
        private readonly deleteCompanyUC:   DeleteCompanyUseCase
    ) {}

    public async getAll(limit?: number, offset?: number): Promise<CompanyDTO[]> {

        const companyDTOs: CompanyDTO[] = [];
        
        const records: Company[] = await this.getAllCompaniesUC.execute({ limit, offset });

        records.forEach((record: Company) => {
            const companyDTO: CompanyDTO = this.converter.toDTO(record);

            companyDTOs.push(companyDTO);
        });

        return companyDTOs;

    };

    public async getById(id: string): Promise<CompanyDTO | null> {

        const record: Company = await this.getCompanyByIdUC.execute(id);

        if (!record) {
            return null;
        }

        const companyDTO: CompanyDTO = this.converter.toDTO(record);

        return companyDTO;

    };

    public async save(companyDTO: CompanyDTO): Promise<void> {

        const company: Company = this.converter.toBO(companyDTO);

        await this.createCompanyUC.execute(company);

    };

    public async update(companyDTO: CompanyDTO): Promise<void> {

        const company: Company = this.converter.toBO(companyDTO);

        await this.updateCompanyUC.execute(company);

    };

    public async delete(companyDTO: CompanyDTO): Promise<void> {

        const company: Company = this.converter.toBO(companyDTO);

        await this.deleteCompanyUC.execute(company);

    };

};