import type { Invoice }           from "../../domain/model/Invoice.js";
import type { IUseCase }          from "./IUseCase.js";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository.js";


export class UpdateInvoiceUseCase implements IUseCase<Invoice, Invoice> {

    public constructor(private readonly invoiceRepository: InvoiceRepository) {}

    public async execute(input: Invoice): Promise<Invoice> {

        return this.invoiceRepository.save(input);

    }

}
