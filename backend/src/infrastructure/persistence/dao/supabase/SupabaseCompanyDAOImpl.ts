/* eslint-disable @typescript-eslint/no-explicit-any */
import { type SupabaseClient } from '@supabase/supabase-js';
import { type CompanyPO }      from '../../po/CompanyPO.js';
import { type CompanyDAO }     from '../CompanyDAO.js';


export class SupabaseCompanyDAOImpl implements CompanyDAO {

    public constructor(private readonly client: SupabaseClient<any, string, any>) {}

    public async findAll(limit?: number, offset?: number): Promise<CompanyPO[]> {

        let query = this.client.from('companies').select('*');
        if (offset !== undefined) query = query.range(offset, offset + (limit ?? 99999) - 1);
        else if (limit !== undefined) query = query.limit(limit);

        const { data, error } = await query;
        if (error) throw error;
        return data;

    };

    public async findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<CompanyPO[]> {

        let query = this.client
            .from('companies')
            .select('*')
            .eq('workspace_id', workspaceId);
        if (offset !== undefined) query = query.range(offset, offset + (limit ?? 99999) - 1);
        else if (limit !== undefined) query = query.limit(limit);

        const { data, error } = await query;
        if (error) throw error;
        return data;

    };

    public async findById(id: string): Promise<CompanyPO | null> {

        const { data, error } = await this.client
            .from('companies')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error) throw error;
        return data;

    };

    public async findByTaxCode(workspaceId: string, taxCode: string): Promise<CompanyPO | null> {

        const { data, error } = await this.client
            .from('companies')
            .select('*')
            .eq('workspace_id', workspaceId)
            .eq('tax_code', taxCode)
            .maybeSingle();
        if (error) throw error;
        return data;

    };

    public async save(entity: CompanyPO): Promise<CompanyPO> {

        const { data, error } = await this.client
            .from('companies')
            .upsert(entity, { onConflict: 'id' })
            .select()
            .single();
        if (error) throw error;
        return data;

    };

    public async delete(entity: CompanyPO): Promise<boolean> {

        const { data, error } = await this.client
            .from('companies')
            .delete()
            .eq('id', entity.id)
            .select('id');
        if (error) throw error;
        return data.length > 0;

    };

};
