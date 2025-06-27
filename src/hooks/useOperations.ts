
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Operation {
  id: string;
  tipo: string;
  cantidad: number;
  precio: number;
  fecha: string;
  simbolo: string;
  portfolio_id: string;
}

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

export const useOperations = () => {
  const [data, setData] = useState<Operation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const ITEMS_PER_PAGE = 10;

  const fetchOperations = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // First get user's portfolios
      const { data: portfolios, error: portfoliosError } = await supabase
        .from('portfolios')
        .select('id')
        .eq('user_id', user.id);

      if (portfoliosError) throw portfoliosError;

      if (!portfolios || portfolios.length === 0) {
        setData([]);
        setTotalCount(0);
        return;
      }

      const portfolioIds = portfolios.map(p => p.id);

      // Build query
      let query = supabase
        .from('operations')
        .select('*', { count: 'exact' })
        .in('portfolio_id', portfolioIds)
        .order('fecha', { ascending: false });

      // Add search filter if provided
      if (search.trim()) {
        query = query.ilike('simbolo', `%${search}%`);
      }

      // Add pagination
      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data: operations, error: operationsError, count } = await query;

      if (operationsError) throw operationsError;

      setData(operations || []);
      setTotalCount(count || 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      toast({
        title: "Error",
        description: `Error al cargar operaciones: ${message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createOperation = async (operationData: CreateOperationData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('operations')
        .insert([operationData]);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Operación creada correctamente",
      });

      await fetchOperations();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: "Error",
        description: `Error al crear operación: ${message}`,
        variant: "destructive",
      });
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateOperation = async (id: string, operationData: UpdateOperationData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('operations')
        .update(operationData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Operación actualizada correctamente",
      });

      await fetchOperations();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: "Error",
        description: `Error al actualizar operación: ${message}`,
        variant: "destructive",
      });
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOperation = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('operations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Operación eliminada correctamente",
      });

      await fetchOperations();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: "Error",
        description: `Error al eliminar operación: ${message}`,
        variant: "destructive",
      });
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOperations();
  }, [user, page, search]);

  const canGoNext = (page + 1) * ITEMS_PER_PAGE < totalCount;
  const canGoPrev = page > 0;

  return {
    data,
    isLoading,
    error,
    page,
    setPage,
    search,
    setSearch,
    totalCount,
    canGoNext,
    canGoPrev,
    createOperation,
    updateOperation,
    deleteOperation,
    refetch: fetchOperations,
  };
};
