import { ProjectDTOConverter } from '../../src/interface/converter/ProjectDTOConverter.js';
import { ClientStatuses }      from '../../src/domain/enums/ClientStatuses.js';
import { ProjectStatuses }     from '../../src/domain/enums/ProjectStatuses.js';
import { ProjectPriorities }   from '../../src/domain/enums/ProjectPriorities.js';
import { Currencies }          from '../../src/domain/enums/Currencies.js';
import type { ProjectDTO }     from '../../src/interface/dto/ProjectDTO.js';
import type { CompanyDTO }     from '../../src/interface/dto/CompanyDTO.js';
import type { ClientDTO }      from '../../src/interface/dto/ClientDTO.js';

const makeCompanyDTO = (): CompanyDTO => ({
    id:        'co-1',
    name:      'Acme Srl',
    taxCode:   'IT12345678901',
    email:     'info@acme.it',
    phone:     212345678,
    address:   'Via Roma 1',
    city:      'Milano',
    zipCode:   20100,
    country:   'IT',
    website:   'https://acme.it',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-06-01'),
});

const makeClientDTO = (): ClientDTO => ({
    id:        'cl-1',
    firstName: 'Mario',
    lastName:  'Rossi',
    email:     'mario@rossi.it',
    phone:     3331234567,
    company:   makeCompanyDTO(),
    vatNumber: 'IT98765432109',
    status:    ClientStatuses.ACTIVE,
    notes:     'VIP',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-07-01'),
});

const makeProjectDTO = (completedAt: Date | null = null): ProjectDTO => ({
    id:             'pr-1',
    name:           'Website Redesign',
    description:    'Full redesign of corporate website',
    client:         makeClientDTO(),
    status:         ProjectStatuses.ACTIVE,
    priority:       ProjectPriorities.HIGH,
    budgetAmount:   5000,
    budgetCurrency: Currencies.EUR,
    startDate:      new Date('2024-03-01'),
    dueDate:        new Date('2024-09-01'),
    completedAt,
    createdAt:      new Date('2024-03-01'),
    updatedAt:      new Date('2024-08-01'),
});

describe('ProjectDTOConverter', () => {

    const converter = new ProjectDTOConverter();

    describe('toBO', () => {

        it('maps all project fields to the BO', () => {
            const dto = makeProjectDTO();
            const bo  = converter.toBO(dto);

            expect(bo.id).toBe(dto.id);
            expect(bo.name).toBe(dto.name);
            expect(bo.description).toBe(dto.description);
            expect(bo.status).toBe(ProjectStatuses.ACTIVE);
            expect(bo.priority).toBe(ProjectPriorities.HIGH);
            expect(bo.budget.amount).toBe(dto.budgetAmount);
            expect(bo.budget.currency).toBe(Currencies.EUR);
            expect(bo.startDate).toBe(dto.startDate);
            expect(bo.dueDate).toBe(dto.dueDate);
            expect(bo.completedAt).toBeUndefined();
            expect(bo.createdAt).toBe(dto.createdAt);
            expect(bo.updatedAt).toBe(dto.updatedAt);
        });

        it('maps nested client and company fields', () => {
            const dto = makeProjectDTO();
            const bo  = converter.toBO(dto);

            expect(bo.client.id).toBe(dto.client.id);
            expect(bo.client.firstName).toBe(dto.client.firstName);
            expect(bo.client.lastName).toBe(dto.client.lastName);
            expect(bo.client.email).toBe(dto.client.email);
            expect(bo.client.company.id).toBe(dto.client.company.id);
            expect(bo.client.company.name).toBe(dto.client.company.name);
            expect(bo.client.company.city).toBe(dto.client.company.city);
        });

        it('converts null completedAt to undefined', () => {
            const bo = converter.toBO(makeProjectDTO(null));
            expect(bo.completedAt).toBeUndefined();
        });

        it('maps a provided completedAt date', () => {
            const completed = new Date('2024-08-15');
            const bo        = converter.toBO(makeProjectDTO(completed));
            expect(bo.completedAt).toBe(completed);
        });

    });

    describe('toDTO', () => {

        it('round-trips all fields correctly', () => {
            const dto    = makeProjectDTO();
            const bo     = converter.toBO(dto);
            const result = converter.toDTO(bo);

            expect(result.id).toBe(dto.id);
            expect(result.name).toBe(dto.name);
            expect(result.description).toBe(dto.description);
            expect(result.status).toBe(dto.status);
            expect(result.priority).toBe(dto.priority);
            expect(result.budgetAmount).toBe(dto.budgetAmount);
            expect(result.budgetCurrency).toBe(dto.budgetCurrency);
            expect(result.completedAt).toBeNull();
            expect(result.client.id).toBe(dto.client.id);
            expect(result.client.company.id).toBe(dto.client.company.id);
        });

        it('maps a present completedAt through the round-trip', () => {
            const completed = new Date('2024-08-15');
            const dto       = makeProjectDTO(completed);
            const result    = converter.toDTO(converter.toBO(dto));
            expect(result.completedAt).toBe(completed);
        });

    });

});
