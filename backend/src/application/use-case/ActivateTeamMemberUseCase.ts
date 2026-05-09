import { TeamMember }                 from "../../domain/model/TeamMember.js";
import { TeamMemberStatuses }         from "../../domain/enums/TeamMemberStatuses.js";
import type { IUseCase }              from "./IUseCase.js";
import type { TeamMemberRepository }  from "../../domain/repositories/TeamMemberRepository.js";


interface ActivateTeamMemberInput {
    email:     string;
    userId:    string;
    firstName: string | null;
    lastName:  string | null;
}

export class ActivateTeamMemberUseCase implements IUseCase<ActivateTeamMemberInput, void> {

    public constructor(private readonly teamMemberRepository: TeamMemberRepository) {}

    public async execute(input: ActivateTeamMemberInput): Promise<void> {

        const members: TeamMember[] = await this.teamMemberRepository.findAllByEmail(input.email);

        const pending = members.filter(m => m.status === TeamMemberStatuses.PENDING);

        await Promise.all(pending.map(member => {
            member.userId    = input.userId;
            member.firstName = input.firstName;
            member.lastName  = input.lastName;
            member.status    = TeamMemberStatuses.ACTIVE;
            member.updatedAt = new Date();
            return this.teamMemberRepository.save(member);
        }));

    }

}
