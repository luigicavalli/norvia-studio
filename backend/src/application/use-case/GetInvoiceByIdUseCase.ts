import { AppErrors }              from "../error/AppError.js";
import type { Invoice }           from "../../domain/model/Invoice.js";
import type { IUseCase }          from "./IUseCase.js";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository.js";


export class GetInvoiceByIdUseCase implements IUseCase<string, Invoice> {

    public constructor(private readonly invoiceRepository: InvoiceRepository) {}

    public async execute(id: string): Promise<Invoice> {

        const invoice: Invoice | null = await this.invoiceRepository.findById(id);

        if (!invoice) {
            throw AppErrors.notFound('Invoice not found', 'INVOICE_NOT_FOUND');
        }

        return invoice;

    }

}
