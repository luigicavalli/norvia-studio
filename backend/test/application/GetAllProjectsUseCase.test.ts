import { GetAllProjectsUseCase } from '../../src/application/use-case/GetAllProjectsUseCase.js';
import { assertAppError }        from '../helpers/assertAppError.js';
import {
    makeProject,
    makeTeamMember,
    makeMockProjectRepository,
    makeMockTeamMemberRepository,
} from '../helpers/factories.js';

describe('GetAllProjectsUseCase', () => {

    function makeUseCase() {
        const projectRepo    = makeMockProjectRepository();
        const teamMemberRepo = makeMockTeamMemberRepository();
        const useCase        = new GetAllProjectsUseCase(projectRepo as any, teamMemberRepo as any);
        return { useCase, projectRepo, teamMemberRepo };
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

    it('returns projects from findByWorkspace when the user is a member', async () => {
        const { useCase, projectRepo, teamMemberRepo } = makeUseCase();
        const member   = makeTeamMember({ userId });
        const projects = [makeProject({ id: 'p-1' }), makeProject({ id: 'p-2' })];

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(member);
        projectRepo.findByWorkspace.mockResolvedValue(projects);

        const result = await useCase.execute({ workspaceId, userId });

        expect(projectRepo.findByWorkspace).toHaveBeenCalledWith(workspaceId, undefined, undefined);
        expect(result).toBe(projects);
    });

    it('passes limit and offset through to the repository', async () => {
        const { useCase, projectRepo, teamMemberRepo } = makeUseCase();
        const member = makeTeamMember({ userId });

        teamMemberRepo.findByWorkspaceAndUser.mockResolvedValue(member);
        projectRepo.findByWorkspace.mockResolvedValue([]);

        await useCase.execute({ workspaceId, userId, limit: 10, offset: 20 });

        expect(projectRepo.findByWorkspace).toHaveBeenCalledWith(workspaceId, 10, 20);
    });

});
