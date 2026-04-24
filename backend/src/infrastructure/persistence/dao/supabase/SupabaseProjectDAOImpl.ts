/* eslint-disable @typescript-eslint/no-explicit-any */
import { type SupabaseClient }  from '@supabase/supabase-js';
import { type ProjectPO }       from '../../po/ProjectPO.js';
import { type ProjectDAO }      from '../ProjectDAO.js';
import { type ProjectStatuses } from '../../../../domain/enums/ProjectStatuses.js';


export class SupabaseProjectDAOImpl implements ProjectDAO {

    public constructor(private readonly client: SupabaseClient<any, string, any>) {}

    public async findAll(limit?: number, offset?: number): Promise<ProjectPO[]> {

        let query = this.client.from('projects').select('*').order('created_at', { ascending: false });
        if (offset !== undefined) query = query.range(offset, offset + (limit ?? 99999) - 1);
        else if (limit !== undefined) query = query.limit(limit);

        const { data, error } = await query;
        if (error) throw error;
        return data;

    };

    public async findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<ProjectPO[]> {

        let query = this.client
            .from('projects')
            .select('*')
            .eq('workspace_id', workspaceId)
            .order('created_at', { ascending: false });
        if (offset !== undefined) query = query.range(offset, offset + (limit ?? 99999) - 1);
        else if (limit !== undefined) query = query.limit(limit);

        const { data, error } = await query;
        if (error) throw error;
        return data;

    };

    public async findById(id: string): Promise<ProjectPO | null> {

        const { data, error } = await this.client
            .from('projects')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error) throw error;
        return data;

    };

    public async findByClient(workspaceId: string, clientId: string, limit?: number, offset?: number): Promise<ProjectPO[]> {

        let query = this.client
            .from('projects')
            .select('*')
            .eq('workspace_id', workspaceId)
            .eq('client_id', clientId)
            .order('created_at', { ascending: false });
        if (offset !== undefined) query = query.range(offset, offset + (limit ?? 99999) - 1);
        else if (limit !== undefined) query = query.limit(limit);

        const { data, error } = await query;
        if (error) throw error;
        return data;

    };

    public async findByNameAndClient(workspaceId: string, projectName: string, clientId: string, limit?: number, offset?: number): Promise<ProjectPO[]> {

        let query = this.client
            .from('projects')
            .select('*')
            .eq('workspace_id', workspaceId)
            .eq('name', projectName)
            .eq('client_id', clientId);
        if (offset !== undefined) query = query.range(offset, offset + (limit ?? 99999) - 1);
        else if (limit !== undefined) query = query.limit(limit);

        const { data, error } = await query;
        if (error) throw error;
        return data;

    };

    public async save(entity: ProjectPO): Promise<ProjectPO> {

        const { data, error } = await this.client
            .from('projects')
            .upsert(entity, { onConflict: 'id' })
            .select()
            .single();
        if (error) throw error;
        return data;

    };

    public async updateStatus(projectId: string, status: ProjectStatuses): Promise<ProjectPO> {

        const { data, error } = await this.client
            .from('projects')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', projectId)
            .select()
            .single();
        if (error) throw error;
        return data;

    };

    public async delete(entity: ProjectPO): Promise<boolean> {

        const { data, error } = await this.client
            .from('projects')
            .delete()
            .eq('id', entity.id)
            .select('id');
        if (error) throw error;
        return data.length > 0;

    };

};
