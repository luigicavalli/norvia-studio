import { type Pool }           from 'pg';
import { type AssignmentPO }  from '../../po/AssignmentPO.js';
import { type AssignmentDAO } from '../AssignmentDAO.js';


export class PgAssignmentDAOImpl implements AssignmentDAO {

    public constructor(private readonly pool: Pool) {}

    public async findAll(): Promise<AssignmentPO[]> {

        const { rows } = await this.pool.query('SELECT * FROM assignments');

        return rows;

    };

    public async findById(id: string): Promise<AssignmentPO | null> {

        const { rows } = await this.pool.query(
            'SELECT * FROM assignments WHERE id = $1',
            [ id ]
        );

        return rows[0] ?? null;

    };

    public async findByProject(projectId: string): Promise<AssignmentPO[]> {

        const { rows } = await this.pool.query(
            'SELECT * FROM assignments WHERE project_id = $1',
            [ projectId ]
        );

        return rows;

    };

    public async findByProjects(projectIds: string[]): Promise<AssignmentPO[]> {

        const { rows } = await this.pool.query(
            'SELECT * FROM assignments WHERE project_id = ANY($1)',
            [ projectIds ]
        );

        return rows;

    };

    public async findByTeamMember(teamMemberId: string): Promise<AssignmentPO[]> {

        const { rows } = await this.pool.query(
            'SELECT * FROM assignments WHERE team_member_id = $1',
            [ teamMemberId ]
        );

        return rows;

    };

    public async save(entity: AssignmentPO): Promise<AssignmentPO> {

        const { rows } = await this.pool.query(
            `INSERT INTO assignments (id, project_id, team_member_id, created_at)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (id) DO NOTHING
            RETURNING *`,
            [ entity.id, entity.project_id, entity.team_member_id, entity.created_at ]
        );

        return rows[0];

    };

    public async delete(entity: AssignmentPO): Promise<boolean> {

        const { rowCount } = await this.pool.query(
            'DELETE FROM assignments WHERE id = $1',
            [ entity.id ]
        );

        return (rowCount ?? 0) > 0;

    };

};
