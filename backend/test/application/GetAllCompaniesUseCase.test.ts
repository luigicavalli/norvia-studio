import { GetAllCompaniesUseCase } from '../../src/application/use-case/GetAllCompaniesUseCase.js';
import { assertAppError }         from '../helpers/assertAppError.js';
import {
    makeCompany,
    makeTeamMember,
    makeMockCompanyRepository,
    makeMockTeamMemberRepository,
} from '../helpers/factories.js';

describe('GetAllCompaniesUseCase', () => {

    function makeUseCase() {
        const companyRepo    = makeMockCompanyRepository();
        const teamMemberRepo = makeMockTeamMemberRepository();
        const useCase        = new GetAllCompaniesUseCase(companyRepo as any, teamMemberRepo as any);
        return { useCase, companyRepo, teamMemberRepo };
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

    it('returns companies from findByWorkspace when the user is a member', async () => {
        const { useCase, companyRepo, teamMemberRepo } = makeUseCase();
        const member    = makeTeamMember({ userId });
        const companies = [makeCompany({ id: 'c-1' }), makeCompany({ id: 'c-2' })];

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(member);
        companyRepo.findByWorkspace.mockResolvedValue(companies);

        const result = await useCase.execute({ workspaceId, userId });

        expect(companyRepo.findByWorkspace).toHaveBeenCalledWith(workspaceId, undefined, undefined);
        expect(result).toBe(companies);
    });

    it('passes limit and offset through to the repository', async () => {
        const { useCase, companyRepo, teamMemberRepo } = makeUseCase();
        const member = makeTeamMember({ userId });

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(member);
        companyRepo.findByWorkspace.mockResolvedValue([]);

        await useCase.execute({ workspaceId, userId, limit: 5, offset: 10 });

        expect(companyRepo.findByWorkspace).toHaveBeenCalledWith(workspaceId, 5, 10);
    });

});
