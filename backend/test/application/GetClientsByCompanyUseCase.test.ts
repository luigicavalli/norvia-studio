import { GetClientsByCompanyUseCase } from '../../src/application/use-case/GetClientsByCompanyUseCase.js';
import { assertAppError }             from '../helpers/assertAppError.js';
import {
    makeClient,
    makeTeamMember,
    makeMockClientRepository,
    makeMockTeamMemberRepository,
} from '../helpers/factories.js';

describe('GetClientsByCompanyUseCase', () => {

    function makeUseCase() {
        const clientRepo     = makeMockClientRepository();
        const teamMemberRepo = makeMockTeamMemberRepository();
        const useCase        = new GetClientsByCompanyUseCase(clientRepo as any, teamMemberRepo as any);
        return { useCase, clientRepo, teamMemberRepo };
    }

    const workspaceId = 'ws-1';
    const companyId   = 'company-1';
    const userId      = 'user-1';

    it('throws FORBIDDEN (403) when the user is not a member of the workspace', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(null);

        await assertAppError(
            () => useCase.execute({ workspaceId, companyId, userId }),
            403,
            'FORBIDDEN',
        );
    });

    it('returns clients from findByCompany when the user is a member', async () => {
        const { useCase, clientRepo, teamMemberRepo } = makeUseCase();
        const member  = makeTeamMember({ userId });
        const clients = [makeClient({ id: 'cl-1' }), makeClient({ id: 'cl-2' })];

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(member);
        clientRepo.findByCompany.mockResolvedValue(clients);

        const result = await useCase.execute({ workspaceId, companyId, userId });

        expect(clientRepo.findByCompany).toHaveBeenCalledWith(workspaceId, companyId, undefined, undefined);
        expect(result).toBe(clients);
    });

    it('passes limit and offset through to the repository', async () => {
        const { useCase, clientRepo, teamMemberRepo } = makeUseCase();
        const member = makeTeamMember({ userId });

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(member);
        clientRepo.findByCompany.mockResolvedValue([]);

        await useCase.execute({ workspaceId, companyId, userId, limit: 15, offset: 30 });

        expect(clientRepo.findByCompany).toHaveBeenCalledWith(workspaceId, companyId, 15, 30);
    });

});
