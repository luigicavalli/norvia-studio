import { TeamMember }                          from "../../domain/model/TeamMember.js";
import type { TeamMemberDTO }                  from "../dto/TeamMemberDTO.js";
import type { IDTOConverter }                  from "../converter/IDTOConverter.js";
import { TeamMemberDTOConverter }              from "../converter/TeamMemberDTOConverter.js";
import type { TeamMemberRoles }                from "../../domain/enums/TeamMemberRoles.js";
import type { GetWorkspaceMembersUseCase }     from "../../application/use-case/GetWorkspaceMembersUseCase.js";
import type { AddTeamMemberUseCase }           from "../../application/use-case/AddTeamMemberUseCase.js";
import type { InviteTeamMemberUseCase }        from "../../application/use-case/InviteTeamMemberUseCase.js";
import type { UpdateTeamMemberRoleUseCase }    from "../../application/use-case/UpdateTeamMemberRoleUseCase.js";
import type { RemoveTeamMemberUseCase }        from "../../application/use-case/RemoveTeamMemberUseCase.js";


export class TeamMemberController {

    private readonly converter: IDTOConverter<TeamMemberDTO, TeamMember> = new TeamMemberDTOConverter();

    public constructor(
        private readonly getWorkspaceMembersUC:  GetWorkspaceMembersUseCase,
        private readonly addTeamMemberUC:        AddTeamMemberUseCase,
        private readonly inviteTeamMemberUC:     InviteTeamMemberUseCase,
        private readonly updateTeamMemberRoleUC: UpdateTeamMemberRoleUseCase,
        private readonly removeTeamMemberUC:     RemoveTeamMemberUseCase
    ) {}

    public async getByWorkspace(workspaceId: string, requestingUserId: string): Promise<TeamMemberDTO[]> {

        const members: TeamMember[] = await this.getWorkspaceMembersUC.execute({ workspaceId, requestingUserId });

        return members.map((m) => this.converter.toDTO(m));

    };

    public async add(workspaceId: string, newUserId: string, role: TeamMemberRoles, requestingUserId: string): Promise<TeamMemberDTO> {

        const member: TeamMember = await this.addTeamMemberUC.execute({ workspaceId, newUserId, role, requestingUserId });

        return this.converter.toDTO(member);

    };

    public async invite(workspaceId: string, email: string, role: TeamMemberRoles, requestingUserId: string): Promise<TeamMemberDTO> {

        const member: TeamMember = await this.inviteTeamMemberUC.execute({ workspaceId, email, role, requestingUserId });

        return this.converter.toDTO(member);

    };

    public async updateRole(memberId: string, workspaceId: string, role: TeamMemberRoles, requestingUserId: string): Promise<TeamMemberDTO> {

        const member: TeamMember = await this.updateTeamMemberRoleUC.execute({ memberId, workspaceId, role, requestingUserId });

        return this.converter.toDTO(member);

    };

    public async remove(memberId: string, workspaceId: string, requestingUserId: string): Promise<void> {

        await this.removeTeamMemberUC.execute({ memberId, workspaceId, requestingUserId });

    };

};
