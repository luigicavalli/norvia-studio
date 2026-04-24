/* eslint-disable @typescript-eslint/no-explicit-any */
import { type SupabaseClient } from '@supabase/supabase-js';
import { type InvoicePO }      from '../../po/InvoicePO.js';
import { type InvoiceDAO }     from '../InvoiceDAO.js';
import { type InvoiceStatus }  from '../../../../domain/enums/InvoiceStatus.js';


export class SupabaseInvoiceDAOImpl implements InvoiceDAO {

    public constructor(private readonly client: SupabaseClient<any, string, any>) {}

    public async findAll(): Promise<InvoicePO[]> {

        const { data, error } = await this.client.from('invoices').select('*');
        if (error) throw error;
        return data;

    };

    public async findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<InvoicePO[]> {

        let query = this.client
            .from('invoices')
            .select('*')
            .eq('workspace_id', workspaceId)
            .order('issue_date', { ascending: false });
        if (offset !== undefined) query = query.range(offset, offset + (limit ?? 99999) - 1);
        else if (limit !== undefined) query = query.limit(limit);

        const { data, error } = await query;
        if (error) throw error;
        return data;

    };

    public async findById(id: string): Promise<InvoicePO | null> {

        const { data, error } = await this.client
            .from('invoices')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error) throw error;
        return data;

    };

    public async findByClient(workspaceId: string, clientId: string, limit?: number, offset?: number): Promise<InvoicePO[]> {

        let query = this.client
            .from('invoices')
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

    public async findByProject(projectId: string): Promise<InvoicePO[]> {

        const { data, error } = await this.client
            .from('invoices')
            .select('*')
            .eq('project_id', projectId)
            .order('issue_date', { ascending: false });
        if (error) throw error;
        return data;

    };

    public async save(entity: InvoicePO): Promise<InvoicePO> {

        const { data, error } = await this.client
            .from('invoices')
            .upsert(entity, { onConflict: 'id' })
            .select()
            .single();
        if (error) throw error;
        return data;

    };

    public async updateStatus(invoiceId: string, status: InvoiceStatus): Promise<InvoicePO> {

        const { data, error } = await this.client
            .from('invoices')
            .update({
                status,
                paid_at:    status === 'PAID' ? new Date().toISOString() : null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', invoiceId)
            .select()
            .single();
        if (error) throw error;
        return data;

    };

    public async delete(entity: InvoicePO): Promise<boolean> {

        const { data, error } = await this.client
            .from('invoices')
            .delete()
            .eq('id', entity.id)
            .select('id');
        if (error) throw error;
        return data.length > 0;

    };

};
