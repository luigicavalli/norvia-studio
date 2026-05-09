import { Invoice }              from "../../domain/model/Invoice.js";
import { InvoiceItem }         from "../../domain/model/InvoiceItem.js";
import { Client }              from "../../domain/model/Client.js";
import { Workspace }           from "../../domain/model/Workspace.js";
import { Project }             from "../../domain/model/Project.js";
import type { Currencies }     from "../../domain/enums/Currencies.js";
import type { InvoiceStatus }  from "../../domain/enums/InvoiceStatus.js";
import type { InvoiceDTO }     from "../dto/InvoiceDTO.js";
import type { InvoiceItemDTO } from "../dto/InvoiceItemDTO.js";
import type { IDTOConverter }  from "./IDTOConverter.js";


export class InvoiceDTOConverter implements IDTOConverter<InvoiceDTO, Invoice> {

    toBO(dto: InvoiceDTO): Invoice {

        const bo = new Invoice();

        bo.id        = dto.id;
        bo.number    = dto.number;
        bo.status    = dto.status as InvoiceStatus;
        bo.issueDate = new Date(dto.issueDate);
        bo.dueDate   = new Date(dto.dueDate);
        bo.paidAt    = dto.paidAt ? new Date(dto.paidAt) : undefined;
        bo.notes     = dto.notes ?? '';
        bo.createdAt = new Date(dto.createdAt);
        bo.updatedAt = new Date(dto.updatedAt);

        bo.workspace    = new Workspace();
        bo.workspace.id = dto.workspaceId;

        bo.client    = new Client();
        bo.client.id = dto.clientId;

        if (dto.projectId) {
            bo.project    = new Project();
            bo.project.id = dto.projectId;
        }

        bo.items = (dto.items ?? []).map(iDto => {
            const item = new InvoiceItem();
            item.id          = iDto.id;
            item.description = iDto.description;
            item.quantity    = iDto.quantity;
            item.unitPrice   = iDto.unitPrice;
            item.currency    = iDto.currency as Currencies;
            item.invoice     = bo;
            return item;
        });

        return bo;

    }

    toDTO(bo: Invoice): InvoiceDTO {

        const dto: InvoiceDTO = {} as InvoiceDTO;

        dto.id          = bo.id;
        dto.workspaceId = bo.workspace.id;
        dto.clientId    = bo.client.id;
        dto.clientName  = bo.client
            ? [bo.client.firstName, bo.client.lastName].filter(Boolean).join(' ')
            : '';
        dto.projectId   = bo.project?.id ?? null;
        dto.number      = bo.number;
        dto.status      = bo.status;
        dto.issueDate   = bo.issueDate;
        dto.dueDate     = bo.dueDate;
        dto.paidAt      = bo.paidAt ?? null;
        dto.notes       = bo.notes;
        dto.createdAt   = bo.createdAt;
        dto.updatedAt   = bo.updatedAt;

        dto.items = (bo.items ?? []).map(item => {
            const iDTO: InvoiceItemDTO = {} as InvoiceItemDTO;
            iDTO.id          = item.id;
            iDTO.invoiceId   = bo.id;
            iDTO.description = item.description;
            iDTO.quantity    = item.quantity;
            iDTO.unitPrice   = item.unitPrice;
            iDTO.currency    = item.currency;
            return iDTO;
        });

        return dto;

    }

}
