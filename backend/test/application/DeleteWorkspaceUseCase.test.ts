import { DeleteWorkspaceUseCase } from '../../src/application/use-case/DeleteWorkspaceUseCase.js';
import { TeamMemberRoles }        from '../../src/domain/enums/TeamMemberRoles.js';
import { assertAppError }         from '../helpers/assertAppError.js';
import {
    makeWorkspace,
    makeTeamMember,
    makeMockWorkspaceRepository,
    makeMockTeamMemberRepository,
} from '../helpers/factories.js';

describe('DeleteWorkspaceUseCase', () => {

    function makeUseCase() {
        const workspaceRepo  = makeMockWorkspaceRepository();
        const teamMemberRepo = makeMockTeamMemberRepository();
        const useCase        = new DeleteWorkspaceUseCase(workspaceRepo as any, teamMemberRepo as any);
        return { useCase, workspaceRepo, teamMemberRepo };
    }

    const workspace = makeWorkspace({ id: 'ws-1' });
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

    it('throws FORBIDDEN (403) when the user is an ADMIN (not the OWNER)', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();
        const admin = makeTeamMember({ role: TeamMemberRoles.ADMIN });

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(admin);

        await assertAppError(
            () => useCase.execute({ workspace, userId }),
            403,
            'FORBIDDEN',
        );
    });

    it('throws FORBIDDEN (403) when the user is a MEMBER', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();
        const member = makeTeamMember({ role: TeamMemberRoles.MEMBER });

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(member);

        await assertAppError(
            () => useCase.execute({ workspace, userId }),
            403,
            'FORBIDDEN',
        );
    });

    it('allows OWNER to delete the workspace', async () => {
        const { useCase, workspaceRepo, teamMemberRepo } = makeUseCase();
        const owner = makeTeamMember({ role: TeamMemberRoles.OWNER });

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(owner);
        workspaceRepo.delete.mockResolvedValue(true);

        const result = await useCase.execute({ workspace, userId });

        expect(result).toBe(true);
        expect(workspaceRepo.delete).toHaveBeenCalledWith(workspace);
    });

});
