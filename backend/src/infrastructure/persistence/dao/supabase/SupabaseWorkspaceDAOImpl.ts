/* eslint-disable @typescript-eslint/no-explicit-any */
import { type SupabaseClient } from '@supabase/supabase-js';
import { type WorkspacePO }    from '../../po/WorkspacePO.js';
import { type WorkspaceDAO }   from '../WorkspaceDAO.js';


export class SupabaseWorkspaceDAOImpl implements WorkspaceDAO {

    public constructor(private readonly client: SupabaseClient<any, string, any>) {}

    public async findAll(): Promise<WorkspacePO[]> {

        const { data, error } = await this.client.from('workspaces').select('*');
        if (error) throw error;
        return data;

    };

    public async findById(id: string): Promise<WorkspacePO | null> {

        const { data, error } = await this.client
            .from('workspaces')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error) throw error;
        return data;

    };

    public async findByIds(ids: string[]): Promise<WorkspacePO[]> {

        const { data, error } = await this.client
            .from('workspaces')
            .select('*')
            .in('id', ids);
        if (error) throw error;
        return data;

    };

    public async findBySlug(slug: string): Promise<WorkspacePO | null> {

        const { data, error } = await this.client
            .from('workspaces')
            .select('*')
            .eq('slug', slug)
            .maybeSingle();
        if (error) throw error;
        return data;

    };

    public async findByUserId(userId: string): Promise<WorkspacePO[]> {

        const { data: members, error: membersError } = await this.client
            .from('team_members')
            .select('workspace_id')
            .eq('user_id', userId);
        if (membersError) throw membersError;

        if (!members.length) return [];

        const workspaceIds = members.map(m => m.workspace_id);

        const { data, error } = await this.client
            .from('workspaces')
            .select('*')
            .in('id', workspaceIds);
        if (error) throw error;
        return data;

    };

    public async save(entity: WorkspacePO): Promise<WorkspacePO> {

        const { data, error } = await this.client
            .from('workspaces')
            .upsert(entity, { onConflict: 'id' })
            .select()
            .single();
        if (error) throw error;
        return data;

    };

    public async delete(entity: WorkspacePO): Promise<boolean> {

        const { data, error } = await this.client
            .from('workspaces')
            .delete()
            .eq('id', entity.id)
            .select('id');
        if (error) throw error;
        return data.length > 0;

    };

};
