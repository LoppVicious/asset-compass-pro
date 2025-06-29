
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface CreatePortfolioData {
  name: string;
}

interface UpdatePortfolioData {
  name: string;
}

export const useMutatePortfolio = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
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

  const updateMutation = useMutation({
    mutationFn: async ({ id, data: updateData }: { id: string; data: UpdatePortfolioData }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('portfolios')
        .update({ 
          nombre: updateData.name,
          user_id: user.id 
        })
        .eq('id', id)
        .eq('user_id', user.id)
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

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

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
    createPortfolio: createMutation.mutate,
    updatePortfolio: (id: string, data: UpdatePortfolioData) => 
      updateMutation.mutate({ id, data }),
    deletePortfolio: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
