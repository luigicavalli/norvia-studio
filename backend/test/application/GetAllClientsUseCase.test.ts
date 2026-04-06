import { GetAllClientsUseCase } from '../../src/application/use-case/GetAllClientsUseCase.js';
import { assertAppError }       from '../helpers/assertAppError.js';
import {
    makeClient,
    makeTeamMember,
    makeMockClientRepository,
    makeMockTeamMemberRepository,
} from '../helpers/factories.js';

describe('GetAllClientsUseCase', () => {

    function makeUseCase() {
        const clientRepo     = makeMockClientRepository();
        const teamMemberRepo = makeMockTeamMemberRepository();
        const useCase        = new GetAllClientsUseCase(clientRepo as any, teamMemberRepo as any);
        return { useCase, clientRepo, teamMemberRepo };
    }

    const workspaceId = 'ws-1';
    const userId      = 'user-1';

    it('throws FORBIDDEN (403) when the user is not a member of the workspace', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(null);

        await assertAppError(
            () => useCase.execute({ workspaceId, userId }),
            403,
            'FORBIDDEN',
        );
    });

    it('returns clients from findByWorkspace when the user is a member', async () => {
        const { useCase, clientRepo, teamMemberRepo } = makeUseCase();
        const member  = makeTeamMember({ userId });
        const clients = [makeClient({ id: 'cl-1' }), makeClient({ id: 'cl-2' })];

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(member);
        clientRepo.findByWorkspace.mockResolvedValue(clients);

        const result = await useCase.execute({ workspaceId, userId });

        expect(clientRepo.findByWorkspace).toHaveBeenCalledWith(workspaceId, undefined, undefined);
        expect(result).toBe(clients);
    });

    it('passes limit and offset through to the repository', async () => {
        const { useCase, clientRepo, teamMemberRepo } = makeUseCase();
        const member = makeTeamMember({ userId });

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(member);
        clientRepo.findByWorkspace.mockResolvedValue([]);

        await useCase.execute({ workspaceId, userId, limit: 3, offset: 6 });

        expect(clientRepo.findByWorkspace).toHaveBeenCalledWith(workspaceId, 3, 6);
    });

});
