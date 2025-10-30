import { createClient } from './client';

export const checkSupabaseConnection = async () => {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error checking Supabase connection:', error);
    return { success: false, error };
  }
};

export const fetchTableData = async (tableName: string) => {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching data from ${tableName}:`, error);
    return { data: null, error };
  }
};
