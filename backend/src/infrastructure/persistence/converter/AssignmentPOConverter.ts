import { Assignment }                 from "../../../domain/model/Assignment.js";
import { AssignmentPO }               from "../po/AssignmentPO.js";
import type { IPersistenceConverter } from "./IPersistenceConverter.js";


export class AssignmentPOConverter implements IPersistenceConverter<AssignmentPO, Assignment> {

    public toBO(po: AssignmentPO): Assignment {

        const assignmentBo: Assignment = new Assignment();

            assignmentBo.id        = po.id;
            assignmentBo.createdAt = po.created_at;

        return assignmentBo;

    };

    public toPO(bo: Assignment): AssignmentPO {

        const assignmentPo: AssignmentPO = new AssignmentPO();

            assignmentPo.id             = bo.id;
            assignmentPo.project_id     = bo.project.id;
            assignmentPo.team_member_id = bo.teamMember.id;
            assignmentPo.created_at     = bo.createdAt;

        return assignmentPo;

    };

};
