import { UpdateWorkspaceUseCase } from '../../src/application/use-case/UpdateWorkspaceUseCase.js';
import { TeamMemberRoles }        from '../../src/domain/enums/TeamMemberRoles.js';
import { assertAppError }         from '../helpers/assertAppError.js';
import {
    makeWorkspace,
    makeTeamMember,
    makeMockWorkspaceRepository,
    makeMockTeamMemberRepository,
} from '../helpers/factories.js';

describe('UpdateWorkspaceUseCase', () => {

    function makeUseCase() {
        const workspaceRepo  = makeMockWorkspaceRepository();
        const teamMemberRepo = makeMockTeamMemberRepository();
        const useCase        = new UpdateWorkspaceUseCase(workspaceRepo as any, teamMemberRepo as any);
        return { useCase, workspaceRepo, teamMemberRepo };
    }

    const workspace = makeWorkspace({ id: 'ws-1', slug: 'my-workspace' });
    const userId    = 'user-1';

    it('throws FORBIDDEN (403) when the user is not a member', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(null);

        await assertAppError(
            () => useCase.execute({ workspace, userId }),
            403,
            'FORBIDDEN',
        );
    });

    it('throws FORBIDDEN (403) when the user is a MEMBER (not ADMIN or OWNER)', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();
        const member = makeTeamMember({ role: TeamMemberRoles.MEMBER });

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(member);

        await assertAppError(
            () => useCase.execute({ workspace, userId }),
            403,
            'FORBIDDEN',
        );
    });

    it('allows ADMIN to update the workspace', async () => {
        const { useCase, workspaceRepo, teamMemberRepo } = makeUseCase();
        const admin   = makeTeamMember({ role: TeamMemberRoles.ADMIN });
        const updated = makeWorkspace({ id: 'ws-1', slug: 'my-workspace', name: 'Updated' });

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(admin);
        workspaceRepo.findBySlug.mockResolvedValue(null);
        workspaceRepo.save.mockResolvedValue(updated);

        const result = await useCase.execute({ workspace, userId });

        expect(result).toBe(updated);
        expect(workspaceRepo.save).toHaveBeenCalledWith(workspace);
    });

    it('allows OWNER to update the workspace', async () => {
        const { useCase, workspaceRepo, teamMemberRepo } = makeUseCase();
        const owner   = makeTeamMember({ role: TeamMemberRoles.OWNER });
        const updated = makeWorkspace({ id: 'ws-1', slug: 'my-workspace', name: 'Updated by owner' });

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(owner);
        workspaceRepo.findBySlug.mockResolvedValue(null);
        workspaceRepo.save.mockResolvedValue(updated);

        const result = await useCase.execute({ workspace, userId });

        expect(result).toBe(updated);
    });

    it('throws CONFLICT (409) when slug belongs to a different workspace', async () => {
        const { useCase, workspaceRepo, teamMemberRepo } = makeUseCase();
        const admin       = makeTeamMember({ role: TeamMemberRoles.ADMIN });
        const otherWorkspace = makeWorkspace({ id: 'ws-OTHER', slug: 'my-workspace' });

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(admin);
        workspaceRepo.findBySlug.mockResolvedValue(otherWorkspace);

        await assertAppError(
            () => useCase.execute({ workspace, userId }),
            409,
            'WORKSPACE_SLUG_CONFLICT',
        );
    });

    it('does NOT throw CONFLICT when slug belongs to the same workspace being updated', async () => {
        const { useCase, workspaceRepo, teamMemberRepo } = makeUseCase();
        const admin       = makeTeamMember({ role: TeamMemberRoles.ADMIN });
        const sameWorkspace = makeWorkspace({ id: 'ws-1', slug: 'my-workspace' }); // same id

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(admin);
        workspaceRepo.findBySlug.mockResolvedValue(sameWorkspace);
        workspaceRepo.save.mockResolvedValue(workspace);

        await expect(useCase.execute({ workspace, userId })).resolves.toBeDefined();
    });

});
