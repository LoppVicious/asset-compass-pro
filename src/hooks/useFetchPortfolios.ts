
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Portfolio {
  id: string;
  nombre: string;
  fecha_creacion: string;
  user_id: string;
}

export const useFetchPortfolios = () => {
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['portfolios', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .order('fecha_creacion', { ascending: false });

      if (error) throw error;
      return data as Portfolio[];
    },
    enabled: !!user,
  });

  return {
    data: data || [],
    isLoading,
    error,
    refetch,
  };
};
