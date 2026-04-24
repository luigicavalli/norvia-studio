/* eslint-disable @typescript-eslint/no-explicit-any */
import { type SupabaseClient } from '@supabase/supabase-js';
import { type QuoteItemPO }    from '../../po/QuoteItemPO.js';
import { type QuoteItemDAO }   from '../QuoteItemDAO.js';


export class SupabaseQuoteItemDAOImpl implements QuoteItemDAO {

    public constructor(private readonly client: SupabaseClient<any, string, any>) {}

    public async findAll(): Promise<QuoteItemPO[]> {

        const { data, error } = await this.client.from('quote_items').select('*');
        if (error) throw error;
        return data;

    };

    public async findById(id: string): Promise<QuoteItemPO | null> {

        const { data, error } = await this.client
            .from('quote_items')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error) throw error;
        return data;

    };

    public async findByQuote(quoteId: string): Promise<QuoteItemPO[]> {

        const { data, error } = await this.client
            .from('quote_items')
            .select('*')
            .eq('quote_id', quoteId);
        if (error) throw error;
        return data;

    };

    public async save(entity: QuoteItemPO): Promise<QuoteItemPO> {

        const { data, error } = await this.client
            .from('quote_items')
            .upsert(entity, { onConflict: 'id' })
            .select()
            .single();
        if (error) throw error;
        return data;

    };

    public async delete(entity: QuoteItemPO): Promise<boolean> {

        const { data, error } = await this.client
            .from('quote_items')
            .delete()
            .eq('id', entity.id)
            .select('id');
        if (error) throw error;
        return data.length > 0;

    };

};
