import { GetWorkspaceMembersUseCase } from '../../src/application/use-case/GetWorkspaceMembersUseCase.js';
import { TeamMemberRoles }            from '../../src/domain/enums/TeamMemberRoles.js';
import { assertAppError }             from '../helpers/assertAppError.js';
import {
    makeTeamMember,
    makeMockTeamMemberRepository,
} from '../helpers/factories.js';

describe('GetWorkspaceMembersUseCase', () => {

    function makeUseCase() {
        const teamMemberRepo = makeMockTeamMemberRepository();
        const useCase        = new GetWorkspaceMembersUseCase(teamMemberRepo as any);
        return { useCase, teamMemberRepo };
    }

    const workspaceId      = 'ws-1';
    const requestingUserId = 'user-1';

    it('throws FORBIDDEN (403) when the requesting user is not a member', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(null);

        await assertAppError(
            () => useCase.execute({ workspaceId, requestingUserId }),
            403,
            'FORBIDDEN',
        );
    });

    it('returns the member list when the requesting user is a member', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();
        const requester = makeTeamMember({ userId: requestingUserId, role: TeamMemberRoles.MEMBER });
        const members   = [requester, makeTeamMember({ id: 'tm-2', userId: 'user-2', role: TeamMemberRoles.ADMIN })];

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(requester);
        teamMemberRepo.findByWorkspace.mockResolvedValue(members);

        const result = await useCase.execute({ workspaceId, requestingUserId });

        expect(teamMemberRepo.findByWorkspace).toHaveBeenCalledWith(workspaceId);
        expect(result).toBe(members);
    });

});
