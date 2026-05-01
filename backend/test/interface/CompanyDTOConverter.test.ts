import { CompanyDTOConverter } from '../../src/interface/converter/CompanyDTOConverter.js';
import type { CompanyDTO }     from '../../src/interface/dto/CompanyDTO.js';

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

describe('CompanyDTOConverter', () => {

    const converter = new CompanyDTOConverter();

    describe('toBO', () => {

        it('maps all DTO fields to the BO', () => {
            const dto = makeCompanyDTO();
            const bo  = converter.toBO(dto);

            expect(bo.id).toBe(dto.id);
            expect(bo.name).toBe(dto.name);
            expect(bo.taxCode).toBe(dto.taxCode);
            expect(bo.email).toBe(dto.email);
            expect(bo.phone).toBe(dto.phone);
            expect(bo.address).toBe(dto.address);
            expect(bo.city).toBe(dto.city);
            expect(bo.zipCode).toBe(dto.zipCode);
            expect(bo.country).toBe(dto.country);
            expect(bo.website).toBe(dto.website);
            expect(bo.createdAt).toBe(dto.createdAt);
            expect(bo.updatedAt).toBe(dto.updatedAt);
        });

    });

    describe('toDTO', () => {

        it('maps all BO fields to the DTO', () => {
            const dto    = makeCompanyDTO();
            const bo     = converter.toBO(dto);
            const result = converter.toDTO(bo);

            expect(result.id).toBe(dto.id);
            expect(result.name).toBe(dto.name);
            expect(result.taxCode).toBe(dto.taxCode);
            expect(result.email).toBe(dto.email);
            expect(result.phone).toBe(dto.phone);
            expect(result.address).toBe(dto.address);
            expect(result.city).toBe(dto.city);
            expect(result.zipCode).toBe(dto.zipCode);
            expect(result.country).toBe(dto.country);
            expect(result.website).toBe(dto.website);
            expect(result.createdAt).toBe(dto.createdAt);
            expect(result.updatedAt).toBe(dto.updatedAt);
        });

    });

});
