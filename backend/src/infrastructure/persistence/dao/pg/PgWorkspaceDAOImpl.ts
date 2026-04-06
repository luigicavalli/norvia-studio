import { type Pool }         from 'pg';
import { type WorkspacePO }  from '../../po/WorkspacePO.js';
import { type WorkspaceDAO } from '../WorkspaceDAO.js';


export class PgWorkspaceDAOImpl implements WorkspaceDAO {

    public constructor(private readonly pool: Pool) {}

    public async findAll(): Promise<WorkspacePO[]> {

        const { rows } = await this.pool.query('SELECT * FROM workspaces');

        return rows;

    };

    public async findById(id: string): Promise<WorkspacePO | null> {

        const { rows } = await this.pool.query(
            'SELECT * FROM workspaces WHERE id = $1',
            [ id ]
        );

        return rows[0] ?? null;

    };

    public async findByIds(ids: string[]): Promise<WorkspacePO[]> {

        const { rows } = await this.pool.query(
            'SELECT * FROM workspaces WHERE id = ANY($1)',
            [ ids ]
        );

        return rows;

    };

    public async findBySlug(slug: string): Promise<WorkspacePO | null> {

        const { rows } = await this.pool.query(
            'SELECT * FROM workspaces WHERE slug = $1',
            [ slug ]
        );

        return rows[0] ?? null;

    };

    public async save(entity: WorkspacePO): Promise<WorkspacePO> {

        const { rows } = await this.pool.query(
            `INSERT INTO workspaces (id, name, slug, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (id) DO UPDATE SET
                name       = EXCLUDED.name,
                slug       = EXCLUDED.slug,
                updated_at = EXCLUDED.updated_at
            RETURNING *`,
            [ entity.id, entity.name, entity.slug, entity.created_at, entity.updated_at ]
        );

        return rows[0];

    };

    public async delete(entity: WorkspacePO): Promise<boolean> {

        const { rowCount } = await this.pool.query(
            'DELETE FROM workspaces WHERE id = $1',
            [ entity.id ]
        );

        return (rowCount ?? 0) > 0;

    };

};
