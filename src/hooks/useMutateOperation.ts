
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateOperationData {
  tipo: string;
  cantidad: number;
  precio: number;
  fecha: string;
  simbolo: string;
  portfolio_id: string;
}

interface UpdateOperationData {
  tipo?: string;
  cantidad?: number;
  precio?: number;
  fecha?: string;
  simbolo?: string;
}

export const useMutateOperation = () => {
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async (operationData: CreateOperationData) => {
      const { error } = await supabase
        .from('operations')
        .insert([operationData]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Operación creada correctamente",
      });
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: "Error",
        description: `Error al crear operación: ${message}`,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOperationData }) => {
      const { error } = await supabase
        .from('operations')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Operación actualizada correctamente",
      });
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: "Error",
        description: `Error al actualizar operación: ${message}`,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('operations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Operación eliminada correctamente",
      });
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: "Error",
        description: `Error al eliminar operación: ${message}`,
        variant: "destructive",
      });
    },
  });

  return {
    createOperation: async (data: CreateOperationData) => {
      try {
        await createMutation.mutateAsync(data);
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    },
    updateOperation: async (id: string, data: UpdateOperationData) => {
      try {
        await updateMutation.mutateAsync({ id, data });
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    },
    deleteOperation: async (id: string) => {
      try {
        await deleteMutation.mutateAsync(id);
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    },
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
