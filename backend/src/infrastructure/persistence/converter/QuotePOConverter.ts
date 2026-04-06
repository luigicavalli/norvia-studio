import { Quote }                    from "../../../domain/model/Quote.js";
import { QuotePO }                  from "../po/QuotePO.js";
import type { QuoteStatuses }       from "../../../domain/enums/QuoteStatuses.js";
import type { IPersistenceConverter } from "./IPersistenceConverter.js";


export class QuotePOConverter implements IPersistenceConverter<QuotePO, Quote> {

    public toBO(po: QuotePO): Quote {

        const quoteBo: Quote = new Quote();

            quoteBo.id        = po.id;
            quoteBo.number    = po.number;
            quoteBo.status    = po.status as QuoteStatuses;
            quoteBo.issueDate = po.issue_date;
            quoteBo.expiresAt = po.expires_at;
            quoteBo.notes     = po.notes;
            quoteBo.createdAt = po.created_at;
            quoteBo.updatedAt = po.updated_at;

        return quoteBo;

    };

    public toPO(bo: Quote): QuotePO {

        const quotePo: QuotePO = new QuotePO();

            quotePo.id           = bo.id;
            quotePo.workspace_id = bo.workspace.id;
            quotePo.client_id    = bo.client.id;
            quotePo.number       = bo.number;
            quotePo.status       = bo.status;
            quotePo.issue_date   = bo.issueDate;
            quotePo.expires_at   = bo.expiresAt;
            quotePo.notes        = bo.notes;
            quotePo.created_at   = bo.createdAt;
            quotePo.updated_at   = bo.updatedAt;

        return quotePo;

    };

};
