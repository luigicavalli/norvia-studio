/* eslint-disable @typescript-eslint/no-explicit-any */
import { type SupabaseClient } from '@supabase/supabase-js';
import { type QuotePO }        from '../../po/QuotePO.js';
import { type QuoteDAO }       from '../QuoteDAO.js';
import { type QuoteStatuses }  from '../../../../domain/enums/QuoteStatuses.js';


export class SupabaseQuoteDAOImpl implements QuoteDAO {

    public constructor(private readonly client: SupabaseClient<any, string, any>) {}

    public async findAll(): Promise<QuotePO[]> {

        const { data, error } = await this.client.from('quotes').select('*');
        if (error) throw error;
        return data;

    };

    public async findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<QuotePO[]> {

        let query = this.client
            .from('quotes')
            .select('*')
            .eq('workspace_id', workspaceId)
            .order('issue_date', { ascending: false });
        if (offset !== undefined) query = query.range(offset, offset + (limit ?? 99999) - 1);
        else if (limit !== undefined) query = query.limit(limit);

        const { data, error } = await query;
        if (error) throw error;
        return data;

    };

    public async findById(id: string): Promise<QuotePO | null> {

        const { data, error } = await this.client
            .from('quotes')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error) throw error;
        return data;

    };

    public async findByIds(ids: string[]): Promise<QuotePO[]> {

        const { data, error } = await this.client
            .from('quotes')
            .select('*')
            .in('id', ids);
        if (error) throw error;
        return data;

    };

    public async findByClient(workspaceId: string, clientId: string, limit?: number, offset?: number): Promise<QuotePO[]> {

        let query = this.client
            .from('quotes')
            .select('*')
            .eq('workspace_id', workspaceId)
            .eq('client_id', clientId)
            .order('issue_date', { ascending: false });
        if (offset !== undefined) query = query.range(offset, offset + (limit ?? 99999) - 1);
        else if (limit !== undefined) query = query.limit(limit);

        const { data, error } = await query;
        if (error) throw error;
        return data;

    };

    public async save(entity: QuotePO): Promise<QuotePO> {

        const { data, error } = await this.client
            .from('quotes')
            .upsert(entity, { onConflict: 'id' })
            .select()
            .single();
        if (error) throw error;
        return data;

    };

    public async updateStatus(quoteId: string, status: QuoteStatuses): Promise<QuotePO> {

        const { data, error } = await this.client
            .from('quotes')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', quoteId)
            .select()
            .single();
        if (error) throw error;
        return data;

    };

    public async delete(entity: QuotePO): Promise<boolean> {

        const { data, error } = await this.client
            .from('quotes')
            .delete()
            .eq('id', entity.id)
            .select('id');
        if (error) throw error;
        return data.length > 0;

    };

};
