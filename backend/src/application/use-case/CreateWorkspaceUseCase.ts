import { randomUUID }                  from 'crypto';
import { TeamMember }                  from '../../domain/model/TeamMember.js';
import { TeamMemberRoles }             from '../../domain/enums/TeamMemberRoles.js';
import { TeamMemberStatuses }          from '../../domain/enums/TeamMemberStatuses.js';
import { AppErrors }                   from "../error/AppError.js";
import type { Workspace }              from "../../domain/model/Workspace.js";
import type { IUseCase }               from "./IUseCase.js";
import type { WorkspaceRepository }    from "../../domain/repositories/WorkspaceRepository.js";
import type { TeamMemberRepository }   from "../../domain/repositories/TeamMemberRepository.js";
import type { ClerkInvitationService } from '../../infrastructure/clerk/ClerkInvitationService.js';


type CreateWorkspaceInput = { workspace: Workspace; userId: string };

export class CreateWorkspaceUseCase implements IUseCase<CreateWorkspaceInput, Workspace> {

    public constructor(
        private readonly workspaceRepository:  WorkspaceRepository,
        private readonly teamMemberRepository: TeamMemberRepository,
        private readonly clerkService:         ClerkInvitationService,
    ) {}

    public async execute(input: CreateWorkspaceInput): Promise<Workspace> {

        const existing: Workspace | null = await this.workspaceRepository.findBySlug(input.workspace.slug);

        if (existing) {
            throw AppErrors.conflict('Slug already in use', 'WORKSPACE_SLUG_CONFLICT');
        }

        const saved: Workspace = await this.workspaceRepository.save(input.workspace);

        const { firstName, lastName } = await this.clerkService.getUser(input.userId);

        const owner = new TeamMember();
        owner.id        = randomUUID();
        owner.workspace = saved;
        owner.userId    = input.userId;
        owner.firstName = firstName;
        owner.lastName  = lastName;
        owner.email     = null;
        owner.status    = TeamMemberStatuses.ACTIVE;
        owner.role      = TeamMemberRoles.OWNER;
        owner.createdAt = new Date();
        owner.updatedAt = new Date();

        await this.teamMemberRepository.save(owner);

        return saved;

    }

}
