import type { Invoice }           from "../../domain/model/Invoice.js";
import type { IUseCase }          from "./IUseCase.js";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository.js";
import type { InvoiceStatus }     from "../../domain/enums/InvoiceStatus.js";


interface UpdateInvoiceStatusInput {
    invoiceId: string;
    status:    InvoiceStatus;
}

export class UpdateInvoiceStatusUseCase implements IUseCase<UpdateInvoiceStatusInput, Invoice> {

    public constructor(private readonly invoiceRepository: InvoiceRepository) {}

    public async execute(input: UpdateInvoiceStatusInput): Promise<Invoice> {

        return this.invoiceRepository.updateStatus(input.invoiceId, input.status);

    }

}
