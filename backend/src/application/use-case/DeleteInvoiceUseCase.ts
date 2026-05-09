import type { Invoice }           from "../../domain/model/Invoice.js";
import type { IUseCase }          from "./IUseCase.js";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository.js";


export class DeleteInvoiceUseCase implements IUseCase<Invoice, boolean> {

    public constructor(private readonly invoiceRepository: InvoiceRepository) {}

    public async execute(input: Invoice): Promise<boolean> {

        return this.invoiceRepository.delete(input);

    }

}
