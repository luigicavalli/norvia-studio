import { type Pool }            from 'pg';
import { ProjectPOFlat }        from '../../po/ProjectPOFlat.js';
import { type ProjectPO }       from '../../po/ProjectPO.js';
import { type ProjectDAO }      from '../ProjectDAO.js';
import { type ProjectStatuses } from '../../../../domain/enums/ProjectStatuses.js';


export class PgProjectDAOImpl implements ProjectDAO {

    public constructor(private readonly pool: Pool) {}

    public async findById(id: string): Promise<ProjectPOFlat | null> {

        let project: ProjectPOFlat = new ProjectPOFlat();

        const { rows } = await this.pool.query(
            'SELECT * FROM projects_flat WHERE project_id = $1',
            [ id ]
        );

        project = rows[0];

        return project ?? null;

    };

    public async findAll(limit?: number, offset?: number): Promise<ProjectPOFlat[]> {

        let projects: ProjectPOFlat[] = [];

        const params: unknown[] = [];

        let query = 'SELECT * FROM projects_flat';

        if (limit  !== undefined) params.push(limit);  query += ` LIMIT $${params.length}`;
        if (offset !== undefined) params.push(offset); query += ` OFFSET $${params.length}`;

        const { rows } = await this.pool.query(query);

        projects = rows;

        return projects;

    };

    public async findByClient(clientId: string, limit?: number, offset?: number): Promise<ProjectPOFlat[]> {

        let projects: ProjectPOFlat[] = [];

        const params: unknown[] = [ clientId ];

        let query = 'SELECT * FROM projects_flat WHERE project_client_id = $1';

        if (limit  !== undefined) params.push(limit);  query += ` LIMIT $${params.length}`;
        if (offset !== undefined) params.push(offset); query += ` OFFSET $${params.length}`;

        const { rows } = await this.pool.query(query, params);

        if (rows.length > 0) {
            projects = rows;
        }

        return projects;

    };

    public async findByNameAndClient(name: string, clientId: string, limit?: number, offset?: number): Promise<ProjectPOFlat[]> {

        let projects: ProjectPOFlat[] = [];

        const params: unknown[] = [ name, clientId ];

        let query = 'SELECT * FROM projects_flat WHERE project_name = $1 AND project_client_id = $2';

        if (limit  !== undefined) params.push(limit);  query += ` LIMIT $${params.length}`;
        if (offset !== undefined) params.push(offset); query += ` OFFSET $${params.length}`;

        const { rows } = await this.pool.query(query, params);

        projects = rows;

        return projects;

    };

    public async save(project: ProjectPO): Promise<ProjectPO> {

        const projectFlattened = project.flatten() as ProjectPO;

        const values = [
            projectFlattened.name,
            projectFlattened.description,
            projectFlattened.client,
            projectFlattened.status,
            projectFlattened.priority,
            projectFlattened.budget_amount,
            projectFlattened.budget_currency,
            projectFlattened.start_date,
            projectFlattened.due_date,
            projectFlattened.completed_at
        ];

        const { rows } = await this.pool.query(
            `INSERT INTO projects (
                name, description, client,
                status, priority, budget_amount,
                budget_currency, start_date, due_date,
                completed_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
            ) RETURNING *`, values
        );

        const createdProject: ProjectPO = rows[0];

        return createdProject;

    };

    public async updateStatus(projectId: string, status: ProjectStatuses): Promise<ProjectPO> {
        
        const { rows } = await this.pool.query(`
            UPDATE projects SET status = $1 WHERE id = $2 RETURNING *`,
            [ status, projectId ]
        );

        const project: ProjectPO = rows[0];

        return project;

    };

    public async delete(project: ProjectPO): Promise<boolean> {
        
        const { rows } = await this.pool.query(
            `DELETE FROM projects WHERE id = $1 RETURNING id`,
            [ project.id ]
        );

        if (rows[0] !== project.id) {
            return false;
        }

        return true;

    };

};