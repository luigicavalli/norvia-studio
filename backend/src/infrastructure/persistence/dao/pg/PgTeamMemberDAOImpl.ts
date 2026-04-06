import { type Pool }           from 'pg';
import { type TeamMemberPO }  from '../../po/TeamMemberPO.js';
import { type TeamMemberDAO } from '../TeamMemberDAO.js';


export class PgTeamMemberDAOImpl implements TeamMemberDAO {

    public constructor(private readonly pool: Pool) {}

    public async findAll(): Promise<TeamMemberPO[]> {

        const { rows } = await this.pool.query('SELECT * FROM team_members');

        return rows;

    };

    public async findByWorkspace(workspaceId: string): Promise<TeamMemberPO[]> {

        const { rows } = await this.pool.query(
            'SELECT * FROM team_members WHERE workspace_id = $1',
            [ workspaceId ]
        );

        return rows;

    };

    public async findById(id: string): Promise<TeamMemberPO | null> {

        const { rows } = await this.pool.query(
            'SELECT * FROM team_members WHERE id = $1',
            [ id ]
        );

        return rows[0] ?? null;

    };

    public async findByUserId(workspaceId: string, userId: string): Promise<TeamMemberPO | null> {

        const { rows } = await this.pool.query(
            'SELECT * FROM team_members WHERE workspace_id = $1 AND user_id = $2',
            [ workspaceId, userId ]
        );

        return rows[0] ?? null;

    };

    public async findByIds(ids: string[]): Promise<TeamMemberPO[]> {

        const { rows } = await this.pool.query(
            'SELECT * FROM team_members WHERE id = ANY($1)',
            [ ids ]
        );

        return rows;

    };

    public async save(entity: TeamMemberPO): Promise<TeamMemberPO> {

        const { rows } = await this.pool.query(
            `INSERT INTO team_members (id, workspace_id, user_id, role, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO UPDATE SET
                role       = EXCLUDED.role,
                updated_at = EXCLUDED.updated_at
            RETURNING *`,
            [ entity.id, entity.workspace_id, entity.user_id, entity.role, entity.created_at, entity.updated_at ]
        );

        return rows[0];

    };

    public async delete(entity: TeamMemberPO): Promise<boolean> {

        const { rowCount } = await this.pool.query(
            'DELETE FROM team_members WHERE id = $1',
            [ entity.id ]
        );

        return (rowCount ?? 0) > 0;

    };

};
