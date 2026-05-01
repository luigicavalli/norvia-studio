import { TeamMemberPOConverter } from '../../src/infrastructure/persistence/converter/TeamMemberPOConverter.js';
import { TeamMemberPO }          from '../../src/infrastructure/persistence/po/TeamMemberPO.js';
import { TeamMember }            from '../../src/domain/model/TeamMember.js';
import { Workspace }             from '../../src/domain/model/Workspace.js';
import { TeamMemberRoles }       from '../../src/domain/enums/TeamMemberRoles.js';

describe('TeamMemberPOConverter', () => {

    const converter = new TeamMemberPOConverter();

    const now = new Date('2024-04-01T08:00:00Z');

    function makePO(): TeamMemberPO {
        const po          = new TeamMemberPO();
        po.id           = 'tm-uuid-1';
        po.workspace_id = 'ws-uuid-1';
        po.user_id      = 'clerk-user-1';
        po.role         = TeamMemberRoles.ADMIN;
        po.created_at   = now;
        po.updated_at   = now;
        return po;
    }

    function makeBO(): TeamMember {
        const workspace = new Workspace();
        workspace.id = 'ws-uuid-2';

        const bo        = new TeamMember();
        bo.id        = 'tm-uuid-2';
        bo.workspace = workspace;
        bo.userId    = 'clerk-user-2';
        bo.role      = TeamMemberRoles.MEMBER;
        bo.createdAt = now;
        bo.updatedAt = now;
        return bo;
    }

    describe('toBO', () => {

        it('maps all PO fields onto a TeamMember instance', () => {
            const po = makePO();
            const bo = converter.toBO(po);

            expect(bo).toBeInstanceOf(TeamMember);
            expect(bo.id).toBe(po.id);
            expect(bo.userId).toBe(po.user_id);
            expect(bo.role).toBe(po.role);
            expect(bo.createdAt).toBe(po.created_at);
            expect(bo.updatedAt).toBe(po.updated_at);
        });

        it('hydrates workspace with correct id from workspace_id', () => {
            const po = makePO();
            const bo = converter.toBO(po);

            expect(bo.workspace).toBeInstanceOf(Workspace);
            expect(bo.workspace.id).toBe(po.workspace_id);
        });

    });

    describe('toPO', () => {

        it('maps all TeamMember fields onto a TeamMemberPO instance', () => {
            const bo = makeBO();
            const po = converter.toPO(bo);

            expect(po).toBeInstanceOf(TeamMemberPO);
            expect(po.id).toBe(bo.id);
            expect(po.workspace_id).toBe(bo.workspace.id);
            expect(po.user_id).toBe(bo.userId);
            expect(po.role).toBe(bo.role);
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
            expect(result.workspace_id).toBe(po.workspace_id);
            expect(result.user_id).toBe(po.user_id);
            expect(result.role).toBe(po.role);
            expect(result.created_at).toBe(po.created_at);
            expect(result.updated_at).toBe(po.updated_at);
        });

        it('toPO then toBO returns a TeamMember equivalent to the original', () => {
            const bo     = makeBO();
            const po     = converter.toPO(bo);
            const result = converter.toBO(po);

            expect(result.id).toBe(bo.id);
            expect(result.workspace.id).toBe(bo.workspace.id);
            expect(result.userId).toBe(bo.userId);
            expect(result.role).toBe(bo.role);
            expect(result.createdAt).toBe(bo.createdAt);
            expect(result.updatedAt).toBe(bo.updatedAt);
        });

    });

});
