import { createClient } from '../supabase/client';

export async function fetchTableData<T>(table: string, columns = '*'): Promise<{ data: T[] | null; error: any }> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching data from ${table}:`, error);
    return { data: null, error };
  }
}

export async function updateStatus<T>(
  table: string, 
  id: string, 
  status: string
): Promise<{ data: T | null; error: any }> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from(table)
      .update({ 
        status,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`Error updating ${table} status:`, error);
    return { data: null, error };
  }
}
