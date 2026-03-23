import { ClientStatuses } from "../../../domain/enums/ClientStatuses.js";
import { Currencies } from "../../../domain/enums/Currencies.js";
import { ProjectPriorities } from "../../../domain/enums/ProjectPriorities.js";
import { ProjectStatuses } from "../../../domain/enums/ProjectStatuses.js";

export class EnumParsers {

    public static toClientStatusBO(status: string): ClientStatuses {
        switch (status) {
            case 'ACTIVE':
                return ClientStatuses.ACTIVE;
            case 'INACTIVE':
                return ClientStatuses.INACTIVE;
            case 'PROSPECT':
                return ClientStatuses.PROSPECT;
            case 'UNKNOWN':
                return ClientStatuses.UNKNOWN;
            default:
                return ClientStatuses.UNKNOWN;
        }
    };

    public static toProjectStatusBO(status: string): ProjectStatuses {
        switch (status) {
            case 'ACTIVE':
                return ProjectStatuses.ACTIVE;
            case 'CANCELLED':
                return ProjectStatuses.CANCELLED;
            case 'COMPLETED':
                return ProjectStatuses.COMPLETED;
            case 'ON_HOLD':
                return ProjectStatuses.ON_HOLD;
            case 'DRAFT':
                return ProjectStatuses.DRAFT;
            case 'UNKNOWN':
                return ProjectStatuses.UNKNOWN;
            default:
                return ProjectStatuses.UNKNOWN;
        }
    };

    public static toProjectPriorityBO(status: string): ProjectPriorities {
        switch (status) {
            case 'CRITICAL':
                return ProjectPriorities.CRITICAL;
            case 'HIGH':
                return ProjectPriorities.HIGH;
            case 'MEDIUM':
                return ProjectPriorities.MEDIUM;
            case 'LOW':
                return ProjectPriorities.LOW;
            case 'UNKNOWN':
                return ProjectPriorities.UNKNOWN;
            default:
                return ProjectPriorities.UNKNOWN;
        }
    };

    public static toCurrenciesBO(currency: string): Currencies {
        switch (currency) {
            case 'EUR':
                return Currencies.EUR;
            case 'GBP':
                return Currencies.GBP;
            case 'USD':
                return Currencies.USD;
            default:
                return Currencies.EUR;
        }
    };

};