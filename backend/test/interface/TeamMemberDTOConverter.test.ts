import { TeamMemberDTOConverter } from '../../src/interface/converter/TeamMemberDTOConverter.js';
import { TeamMember }             from '../../src/domain/model/TeamMember.js';
import { Workspace }              from '../../src/domain/model/Workspace.js';
import { TeamMemberRoles }        from '../../src/domain/enums/TeamMemberRoles.js';
import type { TeamMemberDTO }     from '../../src/interface/dto/TeamMemberDTO.js';

describe('TeamMemberDTOConverter', () => {

    const converter = new TeamMemberDTOConverter();

    const now = new Date('2024-06-15T10:00:00Z');

    const dto: TeamMemberDTO = {
        id:          'tm-uuid-1',
        workspaceId: 'ws-uuid-1',
        userId:      'clerk-user-1',
        role:        TeamMemberRoles.ADMIN,
        createdAt:   now,
        updatedAt:   now,
    };

    describe('toBO', () => {

        it('maps all DTO fields onto a TeamMember instance', () => {
            const bo = converter.toBO(dto);

            expect(bo).toBeInstanceOf(TeamMember);
            expect(bo.id).toBe(dto.id);
            expect(bo.userId).toBe(dto.userId);
            expect(bo.role).toBe(dto.role);
            expect(bo.createdAt).toBe(dto.createdAt);
            expect(bo.updatedAt).toBe(dto.updatedAt);
        });

        it('creates a workspace stub with the correct id', () => {
            const bo = converter.toBO(dto);

            expect(bo.workspace).toBeInstanceOf(Workspace);
            expect(bo.workspace.id).toBe(dto.workspaceId);
        });

    });

    describe('toDTO', () => {

        it('maps all TeamMember fields onto a plain DTO object', () => {
            const workspace = new Workspace();
            workspace.id = 'ws-uuid-2';

            const bo = new TeamMember();
            bo.id        = 'tm-uuid-2';
            bo.workspace = workspace;
            bo.userId    = 'clerk-user-2';
            bo.role      = TeamMemberRoles.OWNER;
            bo.createdAt = now;
            bo.updatedAt = now;

            const result = converter.toDTO(bo);

            expect(result.id).toBe(bo.id);
            expect(result.workspaceId).toBe(workspace.id);
            expect(result.userId).toBe(bo.userId);
            expect(result.role).toBe(bo.role);
            expect(result.createdAt).toBe(bo.createdAt);
            expect(result.updatedAt).toBe(bo.updatedAt);
        });

    });

    describe('round-trip', () => {

        it('toBO then toDTO returns a DTO equivalent to the original', () => {
            const bo     = converter.toBO(dto);
            const result = converter.toDTO(bo);

            expect(result).toEqual(dto);
        });

    });

});
