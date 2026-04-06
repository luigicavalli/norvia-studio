import type { Pool }       from "pg";
import { CompanyPO }       from "../../po/CompanyPO.js";
import type { CompanyDAO } from "../CompanyDAO.js";


export class PgCompanyDAOImpl implements CompanyDAO {

    public constructor(private readonly pool: Pool) {}

    public async findAll(limit?: number, offset?: number): Promise<CompanyPO[]> {

        const params: unknown[] = [];
        let query = 'SELECT * FROM companies';

        if (limit  !== undefined) { params.push(limit);  query += ` LIMIT $${params.length}`;  }
        if (offset !== undefined) { params.push(offset); query += ` OFFSET $${params.length}`; }

        const { rows } = await this.pool.query(query, params);

        return rows;

    };

    public async findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<CompanyPO[]> {

        const params: unknown[] = [ workspaceId ];
        let query = 'SELECT * FROM companies WHERE workspace_id = $1';

        if (limit  !== undefined) { params.push(limit);  query += ` LIMIT $${params.length}`;  }
        if (offset !== undefined) { params.push(offset); query += ` OFFSET $${params.length}`; }

        const { rows } = await this.pool.query(query, params);

        return rows;

    };

    public async findById(id: string): Promise<CompanyPO | null> {

        const { rows } = await this.pool.query(
            'SELECT * FROM companies WHERE id = $1',
            [ id ]
        );

        return rows[0] ?? null;

    };

    public async findByTaxCode(workspaceId: string, taxCode: string): Promise<CompanyPO | null> {

        const { rows } = await this.pool.query(
            'SELECT * FROM companies WHERE workspace_id = $1 AND tax_code = $2',
            [ workspaceId, taxCode ]
        );

        return rows[0] ?? null;

    };

    public async save(entity: CompanyPO): Promise<CompanyPO> {

        const { rows } = await this.pool.query(
            `INSERT INTO companies (
                id, workspace_id, name, tax_code, email,
                phone, address, city, zip_code, country,
                website, created_at, updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
            ) ON CONFLICT (id) DO UPDATE SET
                name       = EXCLUDED.name,
                tax_code   = EXCLUDED.tax_code,
                email      = EXCLUDED.email,
                phone      = EXCLUDED.phone,
                address    = EXCLUDED.address,
                city       = EXCLUDED.city,
                zip_code   = EXCLUDED.zip_code,
                country    = EXCLUDED.country,
                website    = EXCLUDED.website,
                updated_at = EXCLUDED.updated_at
            RETURNING *`,
            [
                entity.id, entity.workspace_id, entity.name, entity.tax_code, entity.email,
                entity.phone, entity.address, entity.city, entity.zip_code, entity.country,
                entity.website, entity.created_at, entity.updated_at
            ]
        );

        return rows[0];

    };

    public async delete(entity: CompanyPO): Promise<boolean> {

        const { rowCount } = await this.pool.query(
            'DELETE FROM companies WHERE id = $1',
            [ entity.id ]
        );

        return (rowCount ?? 0) > 0;

    };

};
