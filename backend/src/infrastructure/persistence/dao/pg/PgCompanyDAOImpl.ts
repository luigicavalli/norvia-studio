import type { Pool } from "pg";
import type { CompanyDAO } from "../CompanyDAO.js";
import { CompanyPO } from "../../po/CompanyPO.js";


export class PgCompanyDAOImpl implements CompanyDAO {

    public constructor(private readonly pool: Pool) {}

    public async findById(id: string): Promise<CompanyPO | null> {
    
        let company: CompanyPO = new CompanyPO();

        const { rows } = await this.pool.query(
            'SELECT * FROM companies WHERE id = $1',
            [ id ]
        );

        company = rows[0];

        return company ?? null;

    };

    public async findByTaxCode(taxCode: string): Promise<CompanyPO | null> {

        let company: CompanyPO = new CompanyPO();
        
        const { rows } = await this.pool.query('SELECT * FROM companies WHERE tax_code = $1', [ taxCode ]);

        company = rows[0];

        return company ?? null;

    };

    public async findAll(limit?: number, offset?: number): Promise<CompanyPO[]> {
    
        let companies: CompanyPO[] = [];

        const params: unknown[] = [];

        let query = 'SELECT * FROM companies';

        if (limit  !== undefined) params.push(limit);  query += ` LIMIT $${params.length}`;
        if (offset !== undefined) params.push(offset); query += ` OFFSET $${params.length}`;

        const { rows } = await this.pool.query(query);

        companies = rows;

        return companies;

    };

    public async save(entity: CompanyPO): Promise<CompanyPO> {
        
        const values = [
            entity.name,
            entity.tax_code,
            entity.email,
            entity.phone,
            entity.address,
            entity.city,
            entity.zip_code,
            entity.country,
            entity.website,
            entity.created_at,
            entity.updated_at
        ];

        const { rows } = await this.pool.query(
            `INSERT INTO companis (
                name, tax_code, email,
                phone, address, city,
                zip_code, country, website,
                created_at, updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
            ) RETURNING *`, values
        );

        const createdCompany: CompanyPO = rows[0];

        return createdCompany;

    };

    public async delete(entity: CompanyPO): Promise<boolean> {

        const { rows } = await this.pool.query(
            `DELETE FROM companies WHERE id = $1 RETURNING id`,
            [ entity.id ]
        );

        if (rows[0] !== entity.id) {
            return false;
        }

        return true;

    };

};