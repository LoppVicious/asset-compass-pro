import { supabase } from '@/integrations/supabase/client';
import { usePortfolioStore } from '@/store/portfolioStore';

export interface PriceData {
  simbolo: string;
  precio_cierre: number;
  fecha: string;
}

export interface LivePriceData {
  simbolo: string;
  precio: number;
  timestamp: string;
  variacion: number;
  variacion_porcentual: number;
}

export class PriceService {
  private static realtimeChannel: any = null;
  private static isSubscribed = false;

  /**
   * Obtiene el precio histórico más reciente para un símbolo
   */
  static async getLatestPrice(simbolo: string): Promise<PriceData | null> {
    try {
      const { data, error } = await supabase
        .from('historical_prices')
        .select('*')
        .eq('simbolo', simbolo)
        .order('fecha', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching latest price:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getLatestPrice:', error);
      return null;
    }
  }

  /**
   * Obtiene los precios históricos más recientes para múltiples símbolos
   */
  static async getLatestPrices(simbolos: string[]): Promise<PriceData[]> {
    try {
      const { data, error } = await supabase
        .from('historical_prices')
        .select('*')
        .in('simbolo', simbolos)
        .order('fecha', { ascending: false });

      if (error) {
        console.error('Error fetching latest prices:', error);
        return [];
      }

      // Obtener solo el precio más reciente por símbolo
      const latestPrices = new Map<string, PriceData>();
      
      data?.forEach((price) => {
        if (!latestPrices.has(price.simbolo)) {
          latestPrices.set(price.simbolo, price);
        }
      });

      return Array.from(latestPrices.values());
    } catch (error) {
      console.error('Error in getLatestPrices:', error);
      return [];
    }
  }

  /**
   * Obtiene el historial de precios para un símbolo en un rango de fechas
   */
  static async getPriceHistory(
    simbolo: string, 
    fechaInicio?: string, 
    fechaFin?: string
  ): Promise<PriceData[]> {
    try {
      let query = supabase
        .from('historical_prices')
        .select('*')
        .eq('simbolo', simbolo)
        .order('fecha', { ascending: true });

      if (fechaInicio) {
        query = query.gte('fecha', fechaInicio);
      }

      if (fechaFin) {
        query = query.lte('fecha', fechaFin);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching price history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPriceHistory:', error);
      return [];
    }
  }

  /**
   * Inserta un nuevo precio histórico
   */
  static async insertPrice(priceData: Omit<PriceData, 'fecha'> & { fecha?: string }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('historical_prices')
        .insert({
          simbolo: priceData.simbolo,
          precio_cierre: priceData.precio_cierre,
          fecha: priceData.fecha || new Date().toISOString().split('T')[0],
        });

      if (error) {
        console.error('Error inserting price:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in insertPrice:', error);
      return false;
    }
  }

  /**
   * Suscribe a actualizaciones en tiempo real de precios
   */
  static subscribeToLivePrices(symbols: string[] = []): void {
    if (this.isSubscribed) {
      console.log('Already subscribed to live prices');
      return;
    }

    const { updateAssetPrice, setLoading, setError } = usePortfolioStore.getState();
    
    // Suscripción a cambios en la tabla historical_prices
    this.realtimeChannel = supabase
      .channel('live-prices')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'historical_prices',
        },
        (payload) => {
          console.log('New price received:', payload);
          const newPrice = payload.new as PriceData;
          
          // Actualizar el store con el nuevo precio
          if (symbols.length === 0 || symbols.includes(newPrice.simbolo)) {
            updateAssetPrice(newPrice.simbolo, newPrice.precio_cierre);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'historical_prices',
        },
        (payload) => {
          console.log('Price updated:', payload);
          const updatedPrice = payload.new as PriceData;
          
          if (symbols.length === 0 || symbols.includes(updatedPrice.simbolo)) {
            updateAssetPrice(updatedPrice.simbolo, updatedPrice.precio_cierre);
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          this.isSubscribed = true;
          setError(null);
          setLoading(false);
        } else if (status === 'CHANNEL_ERROR') {
          setError('Error connecting to real-time price feed');
          this.isSubscribed = false;
          setLoading(false);
        } else {
          setLoading(true);
        }
      });

    // También conectar al Edge Function para datos simulados
    this.connectToLiveFeed(symbols);
  }

  /**
   * Conecta al Edge Function para datos de mercado en tiempo real
   */
  private static async connectToLiveFeed(symbols: string[]): Promise<void> {
    try {
      const response = await fetch('/api/live-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbols }),
      });

      if (!response.ok) {
        console.error('Error connecting to live price feed');
        return;
      }

      // Simular actualizaciones periódicas
      this.startPriceSimulation(symbols);
    } catch (error) {
      console.error('Error in connectToLiveFeed:', error);
    }
  }

  /**
   * Simula actualizaciones de precios para demostración
   */
  private static startPriceSimulation(symbols: string[]): void {
    const { updateAssetPrice } = usePortfolioStore.getState();
    
    // Símbolos de ejemplo si no se proporcionan
    const defaultSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'];
    const activeSymbols = symbols.length > 0 ? symbols : defaultSymbols;

    // Simular precios iniciales
    const basePrices: Record<string, number> = {
      'AAPL': 150.00,
      'GOOGL': 2800.00,
      'MSFT': 300.00,
      'TSLA': 200.00,
      'AMZN': 3200.00,
    };

    // Actualizar precios cada 3 segundos
    const interval = setInterval(() => {
      if (!this.isSubscribed) {
        clearInterval(interval);
        return;
      }

      activeSymbols.forEach((symbol) => {
        const basePrice = basePrices[symbol] || 100;
        // Variación aleatoria de ±2%
        const variation = (Math.random() - 0.5) * 0.04;
        const newPrice = basePrice * (1 + variation);
        
        updateAssetPrice(symbol, Number(newPrice.toFixed(2)));
        
        // Actualizar precio base para la próxima iteración
        basePrices[symbol] = newPrice;
      });
    }, 3000);

    // Limpiar el intervalo después de 5 minutos para evitar consumo excesivo
    setTimeout(() => {
      clearInterval(interval);
    }, 5 * 60 * 1000);
  }

  /**
   * Desuscribirse de las actualizaciones en tiempo real
   */
  static unsubscribeFromLivePrices(): void {
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
      this.isSubscribed = false;
      console.log('Unsubscribed from live prices');
    }
  }

  /**
   * Obtiene el estado de la suscripción
   */
  static getSubscriptionStatus(): boolean {
    return this.isSubscribed;
  }
}