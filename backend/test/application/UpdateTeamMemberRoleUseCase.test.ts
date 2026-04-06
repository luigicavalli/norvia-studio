import { UpdateTeamMemberRoleUseCase } from '../../src/application/use-case/UpdateTeamMemberRoleUseCase.js';
import { TeamMemberRoles }             from '../../src/domain/enums/TeamMemberRoles.js';
import { assertAppError }              from '../helpers/assertAppError.js';
import {
    makeTeamMember,
    makeMockTeamMemberRepository,
} from '../helpers/factories.js';

describe('UpdateTeamMemberRoleUseCase', () => {

    function makeUseCase() {
        const teamMemberRepo = makeMockTeamMemberRepository();
        const useCase        = new UpdateTeamMemberRoleUseCase(teamMemberRepo as any);
        return { useCase, teamMemberRepo };
    }

    const workspaceId      = 'ws-1';
    const requestingUserId = 'requester-user';
    const memberId         = 'target-member-id';
    const newRole          = TeamMemberRoles.ADMIN;

    it('throws FORBIDDEN (403) when the requester is not a member', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(null);

        await assertAppError(
            () => useCase.execute({ memberId, workspaceId, role: newRole, requestingUserId }),
            403,
            'FORBIDDEN',
        );
    });

    it('throws FORBIDDEN (403) when the requester is a MEMBER (no update permission)', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();
        const requester = makeTeamMember({ userId: requestingUserId, role: TeamMemberRoles.MEMBER });

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(requester);

        await assertAppError(
            () => useCase.execute({ memberId, workspaceId, role: newRole, requestingUserId }),
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
            () => useCase.execute({ memberId, workspaceId, role: newRole, requestingUserId }),
            404,
            'TEAM_MEMBER_NOT_FOUND',
        );
    });

    it('allows ADMIN to update a team member role', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();
        const requester = makeTeamMember({ userId: requestingUserId, role: TeamMemberRoles.ADMIN });
        const target    = makeTeamMember({ id: memberId, role: TeamMemberRoles.MEMBER });
        const saved     = makeTeamMember({ id: memberId, role: newRole });

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(requester);
        teamMemberRepo.findById.mockResolvedValue(target);
        teamMemberRepo.save.mockResolvedValue(saved);

        const result = await useCase.execute({ memberId, workspaceId, role: newRole, requestingUserId });

        expect(result).toBe(saved);
        expect(teamMemberRepo.save).toHaveBeenCalledTimes(1);

        const savedArg = teamMemberRepo.save.mock.calls[0][0];
        expect(savedArg.role).toBe(newRole);
    });

    it('allows OWNER to update a team member role', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();
        const requester = makeTeamMember({ userId: requestingUserId, role: TeamMemberRoles.OWNER });
        const target    = makeTeamMember({ id: memberId, role: TeamMemberRoles.MEMBER });
        const saved     = makeTeamMember({ id: memberId, role: TeamMemberRoles.ADMIN });

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(requester);
        teamMemberRepo.findById.mockResolvedValue(target);
        teamMemberRepo.save.mockResolvedValue(saved);

        const result = await useCase.execute({ memberId, workspaceId, role: TeamMemberRoles.ADMIN, requestingUserId });

        expect(result).toBe(saved);
    });

});
