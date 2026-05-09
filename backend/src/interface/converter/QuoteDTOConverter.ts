import { Quote }               from "../../domain/model/Quote.js";
import { QuoteItem }           from "../../domain/model/QuoteItem.js";
import { Client }              from "../../domain/model/Client.js";
import { Workspace }           from "../../domain/model/Workspace.js";
import type { Currencies }     from "../../domain/enums/Currencies.js";
import type { QuoteStatuses }  from "../../domain/enums/QuoteStatuses.js";
import type { QuoteDTO }       from "../dto/QuoteDTO.js";
import type { QuoteItemDTO }   from "../dto/QuoteItemDTO.js";
import type { IDTOConverter }  from "./IDTOConverter.js";


export class QuoteDTOConverter implements IDTOConverter<QuoteDTO, Quote> {

    toBO(dto: QuoteDTO): Quote {

        const quoteBO = new Quote();

        quoteBO.id        = dto.id;
        quoteBO.number    = dto.number;
        quoteBO.status    = dto.status as QuoteStatuses;
        quoteBO.issueDate = new Date(dto.issueDate);
        quoteBO.expiresAt = new Date(dto.expiresAt);
        quoteBO.notes     = dto.notes ?? '';
        quoteBO.createdAt = new Date(dto.createdAt);
        quoteBO.updatedAt = new Date(dto.updatedAt);

        quoteBO.workspace    = new Workspace();
        quoteBO.workspace.id = dto.workspaceId;

        quoteBO.client    = new Client();
        quoteBO.client.id = dto.clientId;

        quoteBO.items = (dto.items ?? []).map(iDto => {
            const item = new QuoteItem();
            item.id          = iDto.id;
            item.description = iDto.description;
            item.quantity    = iDto.quantity;
            item.unitPrice   = iDto.unitPrice;
            item.currency    = iDto.currency as Currencies;
            item.quote       = quoteBO;
            return item;
        });

        return quoteBO;

    }

    toDTO(bo: Quote): QuoteDTO {

        const quoteDTO: QuoteDTO = {} as QuoteDTO;

        quoteDTO.id          = bo.id;
        quoteDTO.workspaceId = bo.workspace.id;
        quoteDTO.clientId    = bo.client.id;
        quoteDTO.clientName  = bo.client
            ? [bo.client.firstName, bo.client.lastName].filter(Boolean).join(' ')
            : '';
        quoteDTO.number      = bo.number;
        quoteDTO.status      = bo.status;
        quoteDTO.issueDate   = bo.issueDate;
        quoteDTO.expiresAt   = bo.expiresAt;
        quoteDTO.notes       = bo.notes;
        quoteDTO.createdAt   = bo.createdAt;
        quoteDTO.updatedAt   = bo.updatedAt;

        quoteDTO.items = (bo.items ?? []).map(item => {
            const iDTO: QuoteItemDTO = {} as QuoteItemDTO;
            iDTO.id          = item.id;
            iDTO.quoteId     = bo.id;
            iDTO.description = item.description;
            iDTO.quantity    = item.quantity;
            iDTO.unitPrice   = item.unitPrice;
            iDTO.currency    = item.currency;
            return iDTO;
        });

        return quoteDTO;

    }

}
