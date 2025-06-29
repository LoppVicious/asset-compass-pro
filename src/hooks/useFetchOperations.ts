
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

export const useFetchOperations = (portfolioId?: string) => {
  const [data, setData] = useState<Operation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);
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

      if (portfoliosError) {
        if (portfoliosError.code === 'PGRST116' || portfoliosError.message.includes('no rows')) {
          setData([]);
          setTotalCount(0);
          return;
        }
        throw portfoliosError;
      }

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

      // Filter by specific portfolio if provided
      if (portfolioId) {
        query = query.eq('portfolio_id', portfolioId);
      }

      // Add search filter if provided
      if (search.trim()) {
        query = query.ilike('simbolo', `%${search}%`);
      }

      // Add pagination
      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data: operations, error: operationsError, count } = await query;

      if (operationsError) {
        if (operationsError.code === 'PGRST116' || operationsError.message.includes('no rows')) {
          setData([]);
          setTotalCount(0);
          return;
        }
        throw operationsError;
      }

      setData(operations || []);
      setTotalCount(count || 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOperations();
  }, [user, page, search, portfolioId]);

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
    refetch: fetchOperations,
  };
};
