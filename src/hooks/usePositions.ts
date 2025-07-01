
import { useQuery } from '@tanstack/react-query';
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
  const { toast } = useToast();

  const fetchPositions = async (): Promise<Position[]> => {
    if (!portfolioId) {
      return [];
    }

    // Fetch positions
    const { data: positions, error: positionsError } = await supabase
      .from('positions')
      .select('id, simbolo, cantidad, precio_compra, fecha_compra')
      .eq('portfolio_id', portfolioId);

    if (positionsError) {
      throw positionsError;
    }

    if (!positions || positions.length === 0) {
      return [];
    }

    // Get unique symbols
    const symbols = [...new Set(positions.map(p => p.simbolo))];

    // Fetch latest prices for each symbol
    const { data: prices, error: pricesError } = await supabase
      .from('historical_prices')
      .select('simbolo, fecha, precio_cierre')
      .in('simbolo', symbols)
      .order('fecha', { ascending: false });

    if (pricesError) {
      console.warn('Error fetching prices:', pricesError);
    }

    // Get the most recent price for each symbol
    const latestPrices = new Map();
    if (prices) {
      prices.forEach(price => {
        if (!latestPrices.has(price.simbolo)) {
          latestPrices.set(price.simbolo, price.precio_cierre);
        }
      });
    }

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

    return positionsWithPl;
  };

  const query = useQuery({
    queryKey: ['positions', portfolioId],
    queryFn: fetchPositions,
    enabled: !!portfolioId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchInterval: false,
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Error al cargar posiciones: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
