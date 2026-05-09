import { InvoiceItem }              from "../../../domain/model/InvoiceItem.js";
import { InvoiceItemPO }            from "../po/InvoiceItemPO.js";
import type { Currencies }          from "../../../domain/enums/Currencies.js";
import type { IPersistenceConverter } from "./IPersistenceConverter.js";


export class InvoiceItemPOConverter implements IPersistenceConverter<InvoiceItemPO, InvoiceItem> {

    public toBO(po: InvoiceItemPO): InvoiceItem {

        const bo = new InvoiceItem();

        bo.id          = po.id;
        bo.description = po.description;
        bo.quantity    = po.quantity;
        bo.unitPrice   = po.unit_price;
        bo.currency    = po.currency as Currencies;

        return bo;

    };

    public toPO(bo: InvoiceItem): InvoiceItemPO {

        const po = new InvoiceItemPO();

        po.id          = bo.id;
        po.invoice_id  = bo.invoice.id;
        po.description = bo.description;
        po.quantity    = bo.quantity;
        po.unit_price  = bo.unitPrice;
        po.currency    = bo.currency;

        return po;

    };

};
