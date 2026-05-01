import { GetProjectsByClientUseCase } from '../../src/application/use-case/GetProjectsByClientUseCase.js';
import { assertAppError }             from '../helpers/assertAppError.js';
import {
    makeProject,
    makeTeamMember,
    makeMockProjectRepository,
    makeMockTeamMemberRepository,
} from '../helpers/factories.js';

describe('GetProjectsByClientUseCase', () => {

    function makeUseCase() {
        const projectRepo    = makeMockProjectRepository();
        const teamMemberRepo = makeMockTeamMemberRepository();
        const useCase        = new GetProjectsByClientUseCase(projectRepo as any, teamMemberRepo as any);
        return { useCase, projectRepo, teamMemberRepo };
    }

    const workspaceId = 'ws-1';
    const clientId    = 'client-1';
    const userId      = 'user-1';

    it('throws FORBIDDEN (403) when the user is not a member of the workspace', async () => {
        const { useCase, teamMemberRepo } = makeUseCase();

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(null);

        await assertAppError(
            () => useCase.execute({ workspaceId, clientId, userId }),
            403,
            'FORBIDDEN',
        );
    });

    it('returns projects from findByClient when the user is a member', async () => {
        const { useCase, projectRepo, teamMemberRepo } = makeUseCase();
        const member   = makeTeamMember({ userId });
        const projects = [makeProject({ id: 'p-1' })];

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(member);
        projectRepo.findByClient.mockResolvedValue(projects);

        const result = await useCase.execute({ workspaceId, clientId, userId });

        expect(projectRepo.findByClient).toHaveBeenCalledWith(workspaceId, clientId, undefined, undefined);
        expect(result).toBe(projects);
    });

    it('passes limit and offset through to the repository', async () => {
        const { useCase, projectRepo, teamMemberRepo } = makeUseCase();
        const member = makeTeamMember({ userId });

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(member);
        projectRepo.findByClient.mockResolvedValue([]);

        await useCase.execute({ workspaceId, clientId, userId, limit: 10, offset: 5 });

        expect(projectRepo.findByClient).toHaveBeenCalledWith(workspaceId, clientId, 10, 5);
    });

});
