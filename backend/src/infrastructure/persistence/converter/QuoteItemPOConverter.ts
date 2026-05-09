import { QuoteItem }               from "../../../domain/model/QuoteItem.js";
import { QuoteItemPO }             from "../po/QuoteItemPO.js";
import type { Currencies }         from "../../../domain/enums/Currencies.js";
import type { IPersistenceConverter } from "./IPersistenceConverter.js";


export class QuoteItemPOConverter implements IPersistenceConverter<QuoteItemPO, QuoteItem> {

    public toBO(po: QuoteItemPO): QuoteItem {

        const itemBo = new QuoteItem();

        itemBo.id          = po.id;
        itemBo.description = po.description;
        itemBo.quantity    = po.quantity;
        itemBo.unitPrice   = po.unit_price;
        itemBo.currency    = po.currency as Currencies;

        return itemBo;

    };

    public toPO(bo: QuoteItem): QuoteItemPO {

        const itemPo = new QuoteItemPO();

        itemPo.id          = bo.id;
        itemPo.quote_id    = bo.quote.id;
        itemPo.description = bo.description;
        itemPo.quantity    = bo.quantity;
        itemPo.unit_price  = bo.unitPrice;
        itemPo.currency    = bo.currency;

        return itemPo;

    };

};
