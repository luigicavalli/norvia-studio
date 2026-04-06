import { type Pool }            from 'pg';
import { type QuoteItemPO }    from '../../po/QuoteItemPO.js';
import { type QuoteItemDAO }   from '../QuoteItemDAO.js';


export class PgQuoteItemDAOImpl implements QuoteItemDAO {

    public constructor(private readonly pool: Pool) {}

    public async findAll(): Promise<QuoteItemPO[]> {

        const { rows } = await this.pool.query('SELECT * FROM quote_items');

        return rows;

    };

    public async findById(id: string): Promise<QuoteItemPO | null> {

        const { rows } = await this.pool.query(
            'SELECT * FROM quote_items WHERE id = $1',
            [ id ]
        );

        return rows[0] ?? null;

    };

    public async findByQuote(quoteId: string): Promise<QuoteItemPO[]> {

        const { rows } = await this.pool.query(
            'SELECT * FROM quote_items WHERE quote_id = $1',
            [ quoteId ]
        );

        return rows;

    };

    public async save(entity: QuoteItemPO): Promise<QuoteItemPO> {

        const { rows } = await this.pool.query(
            `INSERT INTO quote_items (id, quote_id, description, quantity, unit_price, currency)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO UPDATE SET
                description = EXCLUDED.description,
                quantity    = EXCLUDED.quantity,
                unit_price  = EXCLUDED.unit_price,
                currency    = EXCLUDED.currency
            RETURNING *`,
            [ entity.id, entity.quote_id, entity.description, entity.quantity, entity.unit_price, entity.currency ]
        );

        return rows[0];

    };

    public async delete(entity: QuoteItemPO): Promise<boolean> {

        const { rowCount } = await this.pool.query(
            'DELETE FROM quote_items WHERE id = $1',
            [ entity.id ]
        );

        return (rowCount ?? 0) > 0;

    };

};
