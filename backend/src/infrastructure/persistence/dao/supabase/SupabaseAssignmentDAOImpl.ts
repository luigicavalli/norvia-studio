/* eslint-disable @typescript-eslint/no-explicit-any */
import { type SupabaseClient } from '@supabase/supabase-js';
import { type AssignmentPO }   from '../../po/AssignmentPO.js';
import { type AssignmentDAO }  from '../AssignmentDAO.js';


export class SupabaseAssignmentDAOImpl implements AssignmentDAO {

    public constructor(private readonly client: SupabaseClient<any, string, any>) {}

    public async findAll(): Promise<AssignmentPO[]> {

        const { data, error } = await this.client.from('assignments').select('*');
        if (error) throw error;
        return data;

    };

    public async findById(id: string): Promise<AssignmentPO | null> {

        const { data, error } = await this.client
            .from('assignments')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error) throw error;
        return data;

    };

    public async findByProject(projectId: string): Promise<AssignmentPO[]> {

        const { data, error } = await this.client
            .from('assignments')
            .select('*')
            .eq('project_id', projectId);
        if (error) throw error;
        return data;

    };

    public async findByProjects(projectIds: string[]): Promise<AssignmentPO[]> {

        const { data, error } = await this.client
            .from('assignments')
            .select('*')
            .in('project_id', projectIds);
        if (error) throw error;
        return data;

    };

    public async findByTeamMember(teamMemberId: string): Promise<AssignmentPO[]> {

        const { data, error } = await this.client
            .from('assignments')
            .select('*')
            .eq('team_member_id', teamMemberId);
        if (error) throw error;
        return data;

    };

    public async save(entity: AssignmentPO): Promise<AssignmentPO> {

        const { data, error } = await this.client
            .from('assignments')
            .upsert(entity, { onConflict: 'id', ignoreDuplicates: true })
            .select()
            .maybeSingle();
        if (error) throw error;
        return data ?? entity;

    };

    public async delete(entity: AssignmentPO): Promise<boolean> {

        const { data, error } = await this.client
            .from('assignments')
            .delete()
            .eq('id', entity.id)
            .select('id');
        if (error) throw error;
        return data.length > 0;

    };

};
