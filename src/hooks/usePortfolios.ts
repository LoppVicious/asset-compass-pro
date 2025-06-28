
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Portfolio {
  id: string;
  nombre: string;
  fecha_creacion: string;
  user_id: string;
}

interface CreatePortfolioData {
  name: string;
}

interface UpdatePortfolioData {
  name: string;
}

export const usePortfolios = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch portfolios
  const { data, isLoading, error } = useQuery({
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

  // Create portfolio mutation
  const createPortfolioMutation = useMutation({
    mutationFn: async (portfolioData: CreatePortfolioData) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('portfolios')
        .insert({
          nombre: portfolioData.name,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      toast({
        title: 'Portfolio creado',
        description: 'El portfolio se ha creado exitosamente.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'No se pudo crear el portfolio.',
        variant: 'destructive',
      });
      console.error('Error creating portfolio:', error);
    },
  });

  // Update portfolio mutation
  const updatePortfolioMutation = useMutation({
    mutationFn: async ({ id, data: updateData }: { id: string; data: UpdatePortfolioData }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('portfolios')
        .update({ 
          nombre: updateData.name,
          user_id: user.id 
        })
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user can only update their own portfolios
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      toast({
        title: 'Portfolio actualizado',
        description: 'El portfolio se ha actualizado exitosamente.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el portfolio.',
        variant: 'destructive',
      });
      console.error('Error updating portfolio:', error);
    },
  });

  // Delete portfolio mutation
  const deletePortfolioMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Ensure user can only delete their own portfolios

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      toast({
        title: 'Portfolio eliminado',
        description: 'El portfolio se ha eliminado exitosamente.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el portfolio.',
        variant: 'destructive',
      });
      console.error('Error deleting portfolio:', error);
    },
  });

  return {
    data: data || [],
    isLoading,
    error,
    createPortfolio: createPortfolioMutation.mutate,
    updatePortfolio: (id: string, data: UpdatePortfolioData) => 
      updatePortfolioMutation.mutate({ id, data }),
    deletePortfolio: deletePortfolioMutation.mutate,
    isCreating: createPortfolioMutation.isPending,
    isUpdating: updatePortfolioMutation.isPending,
    isDeleting: deletePortfolioMutation.isPending,
  };
};
