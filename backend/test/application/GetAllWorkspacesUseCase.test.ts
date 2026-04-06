import { GetAllWorkspacesUseCase } from '../../src/application/use-case/GetAllWorkspacesUseCase.js';
import { makeWorkspace, makeMockWorkspaceRepository } from '../helpers/factories.js';

describe('GetAllWorkspacesUseCase', () => {

    function makeUseCase() {
        const workspaceRepo = makeMockWorkspaceRepository();
        const useCase       = new GetAllWorkspacesUseCase(workspaceRepo as any);
        return { useCase, workspaceRepo };
    }

    it('calls findByUserId with the correct userId and returns the result', async () => {
        const { useCase, workspaceRepo } = makeUseCase();
        const userId     = 'user-abc';
        const workspaces = [makeWorkspace({ id: 'ws-1' }), makeWorkspace({ id: 'ws-2' })];

        workspaceRepo.findByUserId.mockResolvedValue(workspaces);

        const result = await useCase.execute(userId);

        expect(workspaceRepo.findByUserId).toHaveBeenCalledWith(userId);
        expect(result).toBe(workspaces);
    });

    it('returns an empty array when the user has no workspaces', async () => {
        const { useCase, workspaceRepo } = makeUseCase();

        workspaceRepo.findByUserId.mockResolvedValue([]);

        const result = await useCase.execute('user-no-ws');

        expect(result).toEqual([]);
    });

});
