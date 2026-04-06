import { WorkspaceDTOConverter } from '../../src/interface/converter/WorkspaceDTOConverter.js';
import { Workspace }             from '../../src/domain/model/Workspace.js';
import type { WorkspaceDTO }     from '../../src/interface/dto/WorkspaceDTO.js';

describe('WorkspaceDTOConverter', () => {

    const converter = new WorkspaceDTOConverter();

    const now = new Date('2024-06-15T10:00:00Z');

    const dto: WorkspaceDTO = {
        id:        'ws-uuid-1',
        name:      'My Workspace',
        slug:      'my-workspace',
        createdAt: now,
        updatedAt: now,
    };

    describe('toBO', () => {

        it('maps all DTO fields onto a Workspace instance', () => {
            const bo = converter.toBO(dto);

            expect(bo).toBeInstanceOf(Workspace);
            expect(bo.id).toBe(dto.id);
            expect(bo.name).toBe(dto.name);
            expect(bo.slug).toBe(dto.slug);
            expect(bo.createdAt).toBe(dto.createdAt);
            expect(bo.updatedAt).toBe(dto.updatedAt);
        });

    });

    describe('toDTO', () => {

        it('maps all Workspace fields onto a plain DTO object', () => {
            const bo = new Workspace();
            bo.id        = 'ws-uuid-2';
            bo.name      = 'Another Workspace';
            bo.slug      = 'another-workspace';
            bo.createdAt = now;
            bo.updatedAt = now;

            const result = converter.toDTO(bo);

            expect(result.id).toBe(bo.id);
            expect(result.name).toBe(bo.name);
            expect(result.slug).toBe(bo.slug);
            expect(result.createdAt).toBe(bo.createdAt);
            expect(result.updatedAt).toBe(bo.updatedAt);
        });

    });

    describe('round-trip', () => {

        it('toBO then toDTO returns an equivalent DTO', () => {
            const bo     = converter.toBO(dto);
            const result = converter.toDTO(bo);

            expect(result).toEqual(dto);
        });

        it('toDTO then toBO returns a Workspace with equivalent data', () => {
            const bo       = new Workspace();
            bo.id        = dto.id;
            bo.name      = dto.name;
            bo.slug      = dto.slug;
            bo.createdAt = dto.createdAt;
            bo.updatedAt = dto.updatedAt;

            const resultDto = converter.toDTO(bo);
            const resultBo  = converter.toBO(resultDto);

            expect(resultBo.id).toBe(bo.id);
            expect(resultBo.name).toBe(bo.name);
            expect(resultBo.slug).toBe(bo.slug);
        });

    });

});
