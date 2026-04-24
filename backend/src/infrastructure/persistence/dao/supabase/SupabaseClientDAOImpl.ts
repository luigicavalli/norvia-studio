/* eslint-disable @typescript-eslint/no-explicit-any */
import { type SupabaseClient } from '@supabase/supabase-js';
import { type ClientPO }       from '../../po/ClientPO.js';
import { type ClientDAO }      from '../ClientDAO.js';


export class SupabaseClientDAOImpl implements ClientDAO {

    public constructor(private readonly client: SupabaseClient<any, string, any>) {}

    public async findAll(limit?: number, offset?: number): Promise<ClientPO[]> {

        let query = this.client.from('clients').select('*').order('created_at', { ascending: false });
        if (offset !== undefined) query = query.range(offset, offset + (limit ?? 99999) - 1);
        else if (limit !== undefined) query = query.limit(limit);

        const { data, error } = await query;
        if (error) throw error;
        return data;

    };

    public async findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<ClientPO[]> {

        let query = this.client
            .from('clients')
            .select('*')
            .eq('workspace_id', workspaceId)
            .order('created_at', { ascending: false });
        if (offset !== undefined) query = query.range(offset, offset + (limit ?? 99999) - 1);
        else if (limit !== undefined) query = query.limit(limit);

        const { data, error } = await query;
        if (error) throw error;
        return data;

    };

    public async findById(id: string): Promise<ClientPO | null> {

        const { data, error } = await this.client
            .from('clients')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error) throw error;
        return data;

    };

    public async findByIds(ids: string[]): Promise<ClientPO[]> {

        const { data, error } = await this.client
            .from('clients')
            .select('*')
            .in('id', ids);
        if (error) throw error;
        return data;

    };

    public async findByCompany(workspaceId: string, companyId: string, limit?: number, offset?: number): Promise<ClientPO[]> {

        let query = this.client
            .from('clients')
            .select('*')
            .eq('workspace_id', workspaceId)
            .eq('company_id', companyId)
            .order('created_at', { ascending: false });
        if (offset !== undefined) query = query.range(offset, offset + (limit ?? 99999) - 1);
        else if (limit !== undefined) query = query.limit(limit);

        const { data, error } = await query;
        if (error) throw error;
        return data;

    };

    public async findByEmail(workspaceId: string, email: string): Promise<ClientPO | null> {

        const { data, error } = await this.client
            .from('clients')
            .select('*')
            .eq('workspace_id', workspaceId)
            .eq('email', email)
            .maybeSingle();
        if (error) throw error;
        return data;

    };

    public async save(entity: ClientPO): Promise<ClientPO> {

        const { data, error } = await this.client
            .from('clients')
            .upsert(entity, { onConflict: 'id' })
            .select()
            .single();
        if (error) throw error;
        return data;

    };

    public async delete(entity: ClientPO): Promise<boolean> {

        const { data, error } = await this.client
            .from('clients')
            .delete()
            .eq('id', entity.id)
            .select('id');
        if (error) throw error;
        return data.length > 0;

    };

};
