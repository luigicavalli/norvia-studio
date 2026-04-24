/* eslint-disable @typescript-eslint/no-explicit-any */
import { type SupabaseClient }  from '@supabase/supabase-js';
import { type InvoiceItemPO }   from '../../po/InvoiceItemPO.js';
import { type InvoiceItemDAO }  from '../InvoiceItemDAO.js';


export class SupabaseInvoiceItemDAOImpl implements InvoiceItemDAO {

    public constructor(private readonly client: SupabaseClient<any, string, any>) {}

    public async findAll(): Promise<InvoiceItemPO[]> {

        const { data, error } = await this.client.from('invoice_items').select('*');
        if (error) throw error;
        return data;

    };

    public async findById(id: string): Promise<InvoiceItemPO | null> {

        const { data, error } = await this.client
            .from('invoice_items')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error) throw error;
        return data;

    };

    public async findByInvoice(invoiceId: string): Promise<InvoiceItemPO[]> {

        const { data, error } = await this.client
            .from('invoice_items')
            .select('*')
            .eq('invoice_id', invoiceId);
        if (error) throw error;
        return data;

    };

    public async save(entity: InvoiceItemPO): Promise<InvoiceItemPO> {

        const { data, error } = await this.client
            .from('invoice_items')
            .upsert(entity, { onConflict: 'id' })
            .select()
            .single();
        if (error) throw error;
        return data;

    };

    public async delete(entity: InvoiceItemPO): Promise<boolean> {

        const { data, error } = await this.client
            .from('invoice_items')
            .delete()
            .eq('id', entity.id)
            .select('id');
        if (error) throw error;
        return data.length > 0;

    };

};
