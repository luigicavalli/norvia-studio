import { type Pool }              from 'pg';
import { type InvoiceItemPO }    from '../../po/InvoiceItemPO.js';
import { type InvoiceItemDAO }   from '../InvoiceItemDAO.js';


export class PgInvoiceItemDAOImpl implements InvoiceItemDAO {

    public constructor(private readonly pool: Pool) {}

    public async findAll(): Promise<InvoiceItemPO[]> {

        const { rows } = await this.pool.query('SELECT * FROM invoice_items');

        return rows;

    };

    public async findById(id: string): Promise<InvoiceItemPO | null> {

        const { rows } = await this.pool.query(
            'SELECT * FROM invoice_items WHERE id = $1',
            [ id ]
        );

        return rows[0] ?? null;

    };

    public async findByInvoice(invoiceId: string): Promise<InvoiceItemPO[]> {

        const { rows } = await this.pool.query(
            'SELECT * FROM invoice_items WHERE invoice_id = $1',
            [ invoiceId ]
        );

        return rows;

    };

    public async findByInvoices(invoiceIds: string[]): Promise<InvoiceItemPO[]> {

        if (invoiceIds.length === 0) return [];

        const { rows } = await this.pool.query(
            'SELECT * FROM invoice_items WHERE invoice_id = ANY($1)',
            [ invoiceIds ]
        );

        return rows;

    };

    public async deleteByInvoice(invoiceId: string): Promise<void> {

        await this.pool.query(
            'DELETE FROM invoice_items WHERE invoice_id = $1',
            [ invoiceId ]
        );

    };

    public async save(entity: InvoiceItemPO): Promise<InvoiceItemPO> {

        const { rows } = await this.pool.query(
            `INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price, currency)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO UPDATE SET
                description = EXCLUDED.description,
                quantity    = EXCLUDED.quantity,
                unit_price  = EXCLUDED.unit_price,
                currency    = EXCLUDED.currency
            RETURNING *`,
            [ entity.id, entity.invoice_id, entity.description, entity.quantity, entity.unit_price, entity.currency ]
        );

        return rows[0];

    };

    public async delete(entity: InvoiceItemPO): Promise<boolean> {

        const { rowCount } = await this.pool.query(
            'DELETE FROM invoice_items WHERE id = $1',
            [ entity.id ]
        );

        return (rowCount ?? 0) > 0;

    };

};
