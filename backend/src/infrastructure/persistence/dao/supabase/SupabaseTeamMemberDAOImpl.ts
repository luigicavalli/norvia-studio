/* eslint-disable @typescript-eslint/no-explicit-any */
import { type SupabaseClient } from '@supabase/supabase-js';
import { type TeamMemberPO }   from '../../po/TeamMemberPO.js';
import { type TeamMemberDAO }  from '../TeamMemberDAO.js';


export class SupabaseTeamMemberDAOImpl implements TeamMemberDAO {

    public constructor(private readonly client: SupabaseClient<any, string, any>) {}

    public async findAll(): Promise<TeamMemberPO[]> {

        const { data, error } = await this.client.from('team_members').select('*');
        if (error) throw error;
        return data;

    };

    public async findByWorkspace(workspaceId: string): Promise<TeamMemberPO[]> {

        const { data, error } = await this.client
            .from('team_members')
            .select('*')
            .eq('workspace_id', workspaceId);
        if (error) throw error;
        return data;

    };

    public async findById(id: string): Promise<TeamMemberPO | null> {

        const { data, error } = await this.client
            .from('team_members')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error) throw error;
        return data;

    };

    public async findByUserId(workspaceId: string, userId: string): Promise<TeamMemberPO | null> {

        const { data, error } = await this.client
            .from('team_members')
            .select('*')
            .eq('workspace_id', workspaceId)
            .eq('user_id', userId)
            .maybeSingle();
        if (error) throw error;
        return data;

    };

    public async findByIds(ids: string[]): Promise<TeamMemberPO[]> {

        const { data, error } = await this.client
            .from('team_members')
            .select('*')
            .in('id', ids);
        if (error) throw error;
        return data;

    };

    public async save(entity: TeamMemberPO): Promise<TeamMemberPO> {

        const { data, error } = await this.client
            .from('team_members')
            .upsert(entity, { onConflict: 'id' })
            .select()
            .single();
        if (error) throw error;
        return data;

    };

    public async delete(entity: TeamMemberPO): Promise<boolean> {

        const { data, error } = await this.client
            .from('team_members')
            .delete()
            .eq('id', entity.id)
            .select('id');
        if (error) throw error;
        return data.length > 0;

    };

};
