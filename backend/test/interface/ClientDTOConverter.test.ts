import { ClientDTOConverter } from '../../src/interface/converter/ClientDTOConverter.js';
import { ClientStatuses }     from '../../src/domain/enums/ClientStatuses.js';
import type { ClientDTO }     from '../../src/interface/dto/ClientDTO.js';
import type { CompanyDTO }    from '../../src/interface/dto/CompanyDTO.js';

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
    notes:     'VIP client',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-07-01'),
});

describe('ClientDTOConverter', () => {

    const converter = new ClientDTOConverter();

    describe('toBO', () => {

        it('maps all client fields to the BO', () => {
            const dto = makeClientDTO();
            const bo  = converter.toBO(dto);

            expect(bo.id).toBe(dto.id);
            expect(bo.firstName).toBe(dto.firstName);
            expect(bo.lastName).toBe(dto.lastName);
            expect(bo.email).toBe(dto.email);
            expect(bo.phone).toBe(dto.phone);
            expect(bo.vatNumber).toBe(dto.vatNumber);
            expect(bo.status).toBe(ClientStatuses.ACTIVE);
            expect(bo.notes).toBe(dto.notes);
            expect(bo.createdAt).toBe(dto.createdAt);
            expect(bo.updatedAt).toBe(dto.updatedAt);
        });

        it('maps nested company fields to the BO', () => {
            const dto = makeClientDTO();
            const bo  = converter.toBO(dto);

            expect(bo.company.id).toBe(dto.company.id);
            expect(bo.company.name).toBe(dto.company.name);
            expect(bo.company.taxCode).toBe(dto.company.taxCode);
            expect(bo.company.email).toBe(dto.company.email);
            expect(bo.company.phone).toBe(dto.company.phone);
            expect(bo.company.address).toBe(dto.company.address);
            expect(bo.company.city).toBe(dto.company.city);
            expect(bo.company.zipCode).toBe(dto.company.zipCode);
            expect(bo.company.country).toBe(dto.company.country);
            expect(bo.company.website).toBe(dto.company.website);
        });

    });

    describe('toDTO', () => {

        it('round-trips all fields correctly', () => {
            const dto    = makeClientDTO();
            const bo     = converter.toBO(dto);
            const result = converter.toDTO(bo);

            expect(result.id).toBe(dto.id);
            expect(result.firstName).toBe(dto.firstName);
            expect(result.lastName).toBe(dto.lastName);
            expect(result.email).toBe(dto.email);
            expect(result.phone).toBe(dto.phone);
            expect(result.vatNumber).toBe(dto.vatNumber);
            expect(result.status).toBe(dto.status);
            expect(result.notes).toBe(dto.notes);
            expect(result.company.id).toBe(dto.company.id);
            expect(result.company.name).toBe(dto.company.name);
            expect(result.company.city).toBe(dto.company.city);
        });

    });

});
