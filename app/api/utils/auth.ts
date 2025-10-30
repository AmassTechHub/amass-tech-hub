import { createServerClient } from '@/lib/supabase/server';

type UserRole = 'user' | 'admin';

interface UserData {
  role: UserRole;
}

export async function requireAdmin() {
  const supabase = createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  const { data: userData, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single<UserData>();

  if (error || !userData || userData.role !== 'admin') {
    throw new Error('Forbidden');
  }

  return { user };
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  const supabase = createServerClient();
  const { data: user, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single<UserData>();

  if (error || !user) {
    console.error('Error checking admin status:', error);
    return false;
  }

  return user.role === 'admin';
}
