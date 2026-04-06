import { AddTeamMemberUseCase } from '../../src/application/use-case/AddTeamMemberUseCase.js';
import { TeamMemberRoles }      from '../../src/domain/enums/TeamMemberRoles.js';
import { assertAppError }       from '../helpers/assertAppError.js';
import {
    makeTeamMember,
    makeMockTeamMemberRepository,
} from '../helpers/factories.js';

describe('AddTeamMemberUseCase', () => {

    function makeUseCase() {
        const teamMemberRepo = makeMockTeamMemberRepository();
        const useCase        = new AddTeamMemberUseCase(teamMemberRepo as any);
        return { useCase, teamMemberRepo };
    }

    const workspaceId      = 'ws-1';
    const requestingUserId = 'requester-user';
    const newUserId        = 'new-user';
    const role             = TeamMemberRoles.MEMBER;

    it('throws FORBIDDEN (403) when the requester is not a member', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(null);

        await assertAppError(
            () => useCase.execute({ workspaceId, newUserId, role, requestingUserId }),
            403,
            'FORBIDDEN',
        );
    });

    it('throws FORBIDDEN (403) when the requester is a MEMBER (no add permission)', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();
        const requester = makeTeamMember({ userId: requestingUserId, role: TeamMemberRoles.MEMBER });

        // first call is for the requester, second for the new user
        teamMemberRepo.findByWorkspaceAndUser
            .mockResolvedValueOnce(requester)
            .mockResolvedValueOnce(null);

        await assertAppError(
            () => useCase.execute({ workspaceId, newUserId, role, requestingUserId }),
            403,
            'FORBIDDEN',
        );
    });

    it('throws CONFLICT (409) when the new user is already a member', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();
        const requester  = makeTeamMember({ userId: requestingUserId, role: TeamMemberRoles.ADMIN });
        const existingMember = makeTeamMember({ userId: newUserId });

        teamMemberRepo.findByWorkspaceAndUser
            .mockResolvedValueOnce(requester)
            .mockResolvedValueOnce(existingMember);

        await assertAppError(
            () => useCase.execute({ workspaceId, newUserId, role, requestingUserId }),
            409,
            'TEAM_MEMBER_ALREADY_EXISTS',
        );
    });

    it('allows ADMIN to add a new team member', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();
        const requester  = makeTeamMember({ userId: requestingUserId, role: TeamMemberRoles.ADMIN });
        const savedMember = makeTeamMember({ userId: newUserId, role });

        teamMemberRepo.findByWorkspaceAndUser
            .mockResolvedValueOnce(requester)
            .mockResolvedValueOnce(null);
        teamMemberRepo.save.mockResolvedValue(savedMember);

        const result = await useCase.execute({ workspaceId, newUserId, role, requestingUserId });

        expect(result).toBe(savedMember);
        expect(teamMemberRepo.save).toHaveBeenCalledTimes(1);

        const memberArg = teamMemberRepo.save.mock.calls[0][0];
        expect(memberArg.userId).toBe(newUserId);
        expect(memberArg.role).toBe(role);
        expect(memberArg.workspace.id).toBe(workspaceId);
    });

    it('allows OWNER to add a new team member', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();
        const requester  = makeTeamMember({ userId: requestingUserId, role: TeamMemberRoles.OWNER });
        const savedMember = makeTeamMember({ userId: newUserId, role: TeamMemberRoles.ADMIN });

        teamMemberRepo.findByWorkspaceAndUser
            .mockResolvedValueOnce(requester)
            .mockResolvedValueOnce(null);
        teamMemberRepo.save.mockResolvedValue(savedMember);

        const result = await useCase.execute({ workspaceId, newUserId, role: TeamMemberRoles.ADMIN, requestingUserId });

        expect(result).toBe(savedMember);
    });

});
