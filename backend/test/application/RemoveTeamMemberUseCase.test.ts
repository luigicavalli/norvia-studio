import { RemoveTeamMemberUseCase } from '../../src/application/use-case/RemoveTeamMemberUseCase.js';
import { TeamMemberRoles }         from '../../src/domain/enums/TeamMemberRoles.js';
import { assertAppError }          from '../helpers/assertAppError.js';
import {
    makeTeamMember,
    makeMockTeamMemberRepository,
} from '../helpers/factories.js';

describe('RemoveTeamMemberUseCase', () => {

    function makeUseCase() {
        const teamMemberRepo = makeMockTeamMemberRepository();
        const useCase        = new RemoveTeamMemberUseCase(teamMemberRepo as any);
        return { useCase, teamMemberRepo };
    }

    const workspaceId      = 'ws-1';
    const requestingUserId = 'requester-user';
    const memberId         = 'target-member-id';

    it('throws FORBIDDEN (403) when the requester is not a member', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(null);

        await assertAppError(
            () => useCase.execute({ memberId, workspaceId, requestingUserId }),
            403,
            'FORBIDDEN',
        );
    });

    it('throws FORBIDDEN (403) when the requester is a MEMBER (no remove permission)', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();
        const requester = makeTeamMember({ userId: requestingUserId, role: TeamMemberRoles.MEMBER });

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(requester);

        await assertAppError(
            () => useCase.execute({ memberId, workspaceId, requestingUserId }),
            403,
            'FORBIDDEN',
        );
    });

    it('throws NOT_FOUND (404) when the target member does not exist', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();
        const requester = makeTeamMember({ userId: requestingUserId, role: TeamMemberRoles.ADMIN });

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(requester);
        teamMemberRepo.findById.mockResolvedValue(null);

        await assertAppError(
            () => useCase.execute({ memberId, workspaceId, requestingUserId }),
            404,
            'TEAM_MEMBER_NOT_FOUND',
        );
    });

    it('throws FORBIDDEN (403) when the target member is the OWNER', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();
        const requester = makeTeamMember({ userId: requestingUserId, role: TeamMemberRoles.ADMIN });
        const target    = makeTeamMember({ id: memberId, role: TeamMemberRoles.OWNER });

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(requester);
        teamMemberRepo.findById.mockResolvedValue(target);

        await assertAppError(
            () => useCase.execute({ memberId, workspaceId, requestingUserId }),
            403,
            'FORBIDDEN',
        );
    });

    it('allows ADMIN to remove a MEMBER', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();
        const requester = makeTeamMember({ userId: requestingUserId, role: TeamMemberRoles.ADMIN });
        const target    = makeTeamMember({ id: memberId, role: TeamMemberRoles.MEMBER });

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(requester);
        teamMemberRepo.findById.mockResolvedValue(target);
        teamMemberRepo.delete.mockResolvedValue(true);

        const result = await useCase.execute({ memberId, workspaceId, requestingUserId });

        expect(result).toBe(true);
        expect(teamMemberRepo.delete).toHaveBeenCalledWith(target);
    });

    it('allows OWNER to remove a MEMBER', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();
        const requester = makeTeamMember({ userId: requestingUserId, role: TeamMemberRoles.OWNER });
        const target    = makeTeamMember({ id: memberId, role: TeamMemberRoles.MEMBER });

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(requester);
        teamMemberRepo.findById.mockResolvedValue(target);
        teamMemberRepo.delete.mockResolvedValue(true);

        const result = await useCase.execute({ memberId, workspaceId, requestingUserId });

        expect(result).toBe(true);
    });

});
