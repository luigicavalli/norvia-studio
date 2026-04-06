import { WorkspacePOConverter } from '../../src/infrastructure/persistence/converter/WorkspacePOConverter.js';
import { WorkspacePO }          from '../../src/infrastructure/persistence/po/WorkspacePO.js';
import { Workspace }            from '../../src/domain/model/Workspace.js';

describe('WorkspacePOConverter', () => {

    const converter = new WorkspacePOConverter();

    const now = new Date('2024-03-20T12:00:00Z');

    function makePO(): WorkspacePO {
        const po       = new WorkspacePO();
        po.id         = 'ws-uuid-1';
        po.name       = 'Test Workspace';
        po.slug       = 'test-workspace';
        po.created_at = now;
        po.updated_at = now;
        return po;
    }

    function makeBO(): Workspace {
        const bo       = new Workspace();
        bo.id        = 'ws-uuid-2';
        bo.name      = 'Another Workspace';
        bo.slug      = 'another-workspace';
        bo.createdAt = now;
        bo.updatedAt = now;
        return bo;
    }

    describe('toBO', () => {

        it('maps all PO fields onto a Workspace instance', () => {
            const po = makePO();
            const bo = converter.toBO(po);

            expect(bo).toBeInstanceOf(Workspace);
            expect(bo.id).toBe(po.id);
            expect(bo.name).toBe(po.name);
            expect(bo.slug).toBe(po.slug);
            expect(bo.createdAt).toBe(po.created_at);
            expect(bo.updatedAt).toBe(po.updated_at);
        });

    });

    describe('toPO', () => {

        it('maps all Workspace fields onto a WorkspacePO instance', () => {
            const bo = makeBO();
            const po = converter.toPO(bo);

            expect(po).toBeInstanceOf(WorkspacePO);
            expect(po.id).toBe(bo.id);
            expect(po.name).toBe(bo.name);
            expect(po.slug).toBe(bo.slug);
            expect(po.created_at).toBe(bo.createdAt);
            expect(po.updated_at).toBe(bo.updatedAt);
        });

    });

    describe('round-trip', () => {

        it('toBO then toPO returns a PO equivalent to the original', () => {
            const po     = makePO();
            const bo     = converter.toBO(po);
            const result = converter.toPO(bo);

            expect(result.id).toBe(po.id);
            expect(result.name).toBe(po.name);
            expect(result.slug).toBe(po.slug);
            expect(result.created_at).toBe(po.created_at);
            expect(result.updated_at).toBe(po.updated_at);
        });

        it('toPO then toBO returns a Workspace equivalent to the original', () => {
            const bo     = makeBO();
            const po     = converter.toPO(bo);
            const result = converter.toBO(po);

            expect(result.id).toBe(bo.id);
            expect(result.name).toBe(bo.name);
            expect(result.slug).toBe(bo.slug);
            expect(result.createdAt).toBe(bo.createdAt);
            expect(result.updatedAt).toBe(bo.updatedAt);
        });

    });

});
