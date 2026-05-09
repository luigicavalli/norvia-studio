import { Invoice }                            from "../../domain/model/Invoice.js";
import type { InvoiceDTO }                    from "../dto/InvoiceDTO.js";
import type { IDTOConverter }                 from "../converter/IDTOConverter.js";
import { InvoiceDTOConverter }                from "../converter/InvoiceDTOConverter.js";
import type { InvoiceStatus }                 from "../../domain/enums/InvoiceStatus.js";
import type { GetInvoiceByIdUseCase }         from "../../application/use-case/GetInvoiceByIdUseCase.js";
import type { CreateInvoiceUseCase }          from "../../application/use-case/CreateInvoiceUseCase.js";
import type { UpdateInvoiceUseCase }          from "../../application/use-case/UpdateInvoiceUseCase.js";
import type { DeleteInvoiceUseCase }          from "../../application/use-case/DeleteInvoiceUseCase.js";
import type { UpdateInvoiceStatusUseCase }    from "../../application/use-case/UpdateInvoiceStatusUseCase.js";
import type { GetInvoicesByClientUseCase }    from "../../application/use-case/GetInvoicesByClientUseCase.js";
import type { GetInvoicesByWorkspaceUseCase } from "../../application/use-case/GetInvoicesByWorkspaceUseCase.js";


export class InvoiceController {

    private readonly converter: IDTOConverter<InvoiceDTO, Invoice> = new InvoiceDTOConverter();

    public constructor(
        private readonly getInvoicesByWorkspaceUC: GetInvoicesByWorkspaceUseCase,
        private readonly getInvoicesByClientUC:    GetInvoicesByClientUseCase,
        private readonly getInvoiceByIdUC:         GetInvoiceByIdUseCase,
        private readonly createInvoiceUC:          CreateInvoiceUseCase,
        private readonly updateInvoiceUC:          UpdateInvoiceUseCase,
        private readonly updateInvoiceStatusUC:    UpdateInvoiceStatusUseCase,
        private readonly deleteInvoiceUC:          DeleteInvoiceUseCase,
    ) {}

    public async getByWorkspace(workspaceId: string, userId: string, limit?: number, offset?: number): Promise<InvoiceDTO[]> {

        const records = await this.getInvoicesByWorkspaceUC.execute({ workspaceId, userId, ...(limit !== undefined && { limit }), ...(offset !== undefined && { offset }) });

        return records.map(r => this.converter.toDTO(r));

    };

    public async getByClient(workspaceId: string, clientId: string, userId: string, limit?: number, offset?: number): Promise<InvoiceDTO[]> {

        const records = await this.getInvoicesByClientUC.execute({ workspaceId, clientId, userId, ...(limit !== undefined && { limit }), ...(offset !== undefined && { offset }) });

        return records.map(r => this.converter.toDTO(r));

    };

    public async getById(id: string): Promise<InvoiceDTO> {

        const record = await this.getInvoiceByIdUC.execute(id);

        return this.converter.toDTO(record);

    };

    public async save(dto: InvoiceDTO): Promise<void> {

        const invoice = this.converter.toBO(dto);

        await this.createInvoiceUC.execute(invoice);

    };

    public async update(dto: InvoiceDTO): Promise<void> {

        const invoice = this.converter.toBO(dto);

        await this.updateInvoiceUC.execute(invoice);

    };

    public async updateStatus(invoiceId: string, status: InvoiceStatus): Promise<void> {

        await this.updateInvoiceStatusUC.execute({ invoiceId, status });

    };

    public async delete(id: string): Promise<void> {

        const invoice = new Invoice();
        invoice.id = id;

        await this.deleteInvoiceUC.execute(invoice);

    };

};
