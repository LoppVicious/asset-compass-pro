
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Position {
  id: string;
  simbolo: string;
  cantidad: number;
  precio_compra: number;
  precio_actual: number;
  pl: number;
  plPercent: number;
}

export const usePositions = (portfolioId?: string) => {
  const [data, setData] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchPositions = async () => {
    if (!portfolioId) {
      setData([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching positions for portfolio:', portfolioId);
      
      // Fetch positions
      const { data: positions, error: positionsError } = await supabase
        .from('positions')
        .select('id, simbolo, cantidad, precio_compra, fecha_compra')
        .eq('portfolio_id', portfolioId);

      if (positionsError) {
        console.error('Error fetching positions:', positionsError);
        throw positionsError;
      }

      console.log('Positions fetched:', positions);

      if (!positions || positions.length === 0) {
        setData([]);
        return;
      }

      // Get unique symbols
      const symbols = [...new Set(positions.map(p => p.simbolo))];
      console.log('Unique symbols:', symbols);

      // Fetch latest prices for each symbol
      const { data: prices, error: pricesError } = await supabase
        .from('historical_prices')
        .select('simbolo, fecha, precio_cierre')
        .in('simbolo', symbols)
        .order('fecha', { ascending: false });

      if (pricesError) {
        console.warn('Error fetching prices:', pricesError);
      }

      console.log('Prices fetched:', prices);

      // Get the most recent price for each symbol
      const latestPrices = new Map();
      if (prices) {
        prices.forEach(price => {
          if (!latestPrices.has(price.simbolo)) {
            latestPrices.set(price.simbolo, price.precio_cierre);
          }
        });
      }

      console.log('Latest prices map:', latestPrices);

      // Combine positions with current prices and calculate P/L
      const positionsWithPl = positions.map(position => {
        const precio_actual = latestPrices.get(position.simbolo) || position.precio_compra;
        const pl = (precio_actual - position.precio_compra) * position.cantidad;
        const plPercent = ((precio_actual / position.precio_compra) - 1) * 100;

        return {
          id: position.id,
          simbolo: position.simbolo,
          cantidad: position.cantidad,
          precio_compra: position.precio_compra,
          precio_actual,
          pl,
          plPercent
        };
      });

      console.log('Positions with P/L:', positionsWithPl);
      setData(positionsWithPl);
    } catch (err) {
      console.error('Error in fetchPositions:', err);
      const errorObj = err instanceof Error ? err : new Error('Error desconocido');
      setError(errorObj);
      toast({
        title: "Error",
        description: `Error al cargar posiciones: ${errorObj.message}`,
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
