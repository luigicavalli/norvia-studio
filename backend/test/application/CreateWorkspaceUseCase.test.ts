import { CreateWorkspaceUseCase } from '../../src/application/use-case/CreateWorkspaceUseCase.js';
import { TeamMemberRoles }        from '../../src/domain/enums/TeamMemberRoles.js';
import { assertAppError }         from '../helpers/assertAppError.js';
import {
    makeWorkspace,
    makeMockWorkspaceRepository,
    makeMockTeamMemberRepository,
    makeMockClerkService,
} from '../helpers/factories.js';

describe('CreateWorkspaceUseCase', () => {

    function makeUseCase() {
        const workspaceRepo  = makeMockWorkspaceRepository();
        const teamMemberRepo = makeMockTeamMemberRepository();
        const clerkService   = makeMockClerkService();
        const useCase        = new CreateWorkspaceUseCase(workspaceRepo as any, teamMemberRepo as any, clerkService as any);
        return { useCase, workspaceRepo, teamMemberRepo, clerkService };
    }

    it('throws CONFLICT (409) when the slug is already in use', async () => {
        const { useCase, workspaceRepo } = makeUseCase();
        const workspace = makeWorkspace({ slug: 'taken-slug' });

        workspaceRepo.findBySlug.mockResolvedValue(makeWorkspace({ slug: 'taken-slug' }));

        await assertAppError(
            () => useCase.execute({ workspace, userId: 'user-1' }),
            409,
            'WORKSPACE_SLUG_CONFLICT',
        );
    });

    it('saves the workspace and creates an OWNER TeamMember on success', async () => {
        const { useCase, workspaceRepo, teamMemberRepo } = makeUseCase();
        const workspace = makeWorkspace({ id: 'ws-1', slug: 'new-slug' });
        const saved     = makeWorkspace({ id: 'ws-1', slug: 'new-slug' });

        workspaceRepo.findBySlug.mockResolvedValue(null);
        workspaceRepo.save.mockResolvedValue(saved);
        teamMemberRepo.save.mockResolvedValue({});

        const result = await useCase.execute({ workspace, userId: 'user-1' });

        expect(result).toBe(saved);
        expect(workspaceRepo.save).toHaveBeenCalledWith(workspace);
        expect(teamMemberRepo.save).toHaveBeenCalledTimes(1);

        const savedMember = teamMemberRepo.save.mock.calls[0][0];
        expect(savedMember.userId).toBe('user-1');
        expect(savedMember.role).toBe(TeamMemberRoles.OWNER);
        expect(savedMember.workspace).toBe(saved);
    });

});
