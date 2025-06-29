
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Position {
  id: string;
  simbolo: string;
  cantidad: number;
  precio_compra: number;
  fecha_compra: string;
  tipo_activo: string;
  portfolio_id: string;
  precio_actual?: number;
  valor_total?: number;
}

export const usePositions = (portfolioId?: string) => {
  const [data, setData] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPositions = async () => {
    if (!portfolioId) {
      setData([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data: positions, error: positionsError } = await supabase
        .from('positions')
        .select('*')
        .eq('portfolio_id', portfolioId);

      if (positionsError) {
        if (positionsError.code === 'PGRST116' || positionsError.message.includes('no rows')) {
          setData([]);
          return;
        }
        throw positionsError;
      }

      // Get current prices for each symbol
      const symbolsToFetch = positions?.map(p => p.simbolo) || [];
      let pricesData: any[] = [];

      if (symbolsToFetch.length > 0) {
        const { data: prices, error: pricesError } = await supabase
          .from('historical_prices')
          .select('simbolo, precio_cierre')
          .in('simbolo', symbolsToFetch)
          .order('fecha', { ascending: false });

        if (!pricesError) {
          pricesData = prices || [];
        }
      }

      // Merge positions with current prices
      const positionsWithPrices = positions?.map(position => {
        const currentPrice = pricesData.find(p => p.simbolo === position.simbolo)?.precio_cierre || position.precio_compra;
        return {
          ...position,
          precio_actual: currentPrice,
          valor_total: position.cantidad * currentPrice
        };
      }) || [];

      setData(positionsWithPrices);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      toast({
        title: "Error",
        description: `Error al cargar posiciones: ${message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [portfolioId]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchPositions,
  };
};
