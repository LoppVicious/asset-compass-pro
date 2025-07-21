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
  private static positionsChannel: any = null;
  private static isSubscribed = false;
  private static currentSymbols: Set<string> = new Set();
  private static priceIntervals: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Inicializa el servicio conectándose a las posiciones y estableciendo suscripciones
   */
  static async initialize(): Promise<void> {
    console.log('Initializing PriceService...');
    
    try {
      // 1. Obtener todas las posiciones actuales
      await this.loadCurrentPositions();
      
      // 2. Cargar precios reales más recientes y sembrar el estado
      await this.loadAndSeedRealPrices();
      
      // 3. Establecer suscripción a cambios en posiciones
      this.subscribeToPositionsChanges();
      
      // 4. Iniciar suscripciones de precios para símbolos actuales
      this.updatePriceSubscriptions();
      
    } catch (error) {
      console.error('Error initializing PriceService:', error);
      const { setError } = usePortfolioStore.getState();
      setError('Error al inicializar el servicio de precios');
    }
  }

  /**
   * Carga precios reales desde Supabase y los establece como base en el store
   */
  private static async loadAndSeedRealPrices(): Promise<void> {
    if (this.currentSymbols.size === 0) {
      console.log('No symbols to load prices for');
      return;
    }

    try {
      const symbols = Array.from(this.currentSymbols);
      const realPrices = await this.getLatestPrices(symbols);
      const { updateAssetPrice } = usePortfolioStore.getState();

      console.log('Loading real prices for symbols:', symbols);
      
      realPrices.forEach((priceData) => {
        console.log(`Seeding real price for ${priceData.simbolo}: ${priceData.precio_cierre}`);
        updateAssetPrice(priceData.simbolo, priceData.precio_cierre);
      });

      console.log(`Seeded ${realPrices.length} real prices from Supabase`);
    } catch (error) {
      console.error('Error loading real prices:', error);
    }
  }

  /**
   * Carga las posiciones actuales y extrae los símbolos únicos
   */
  private static async loadCurrentPositions(): Promise<void> {
    try {
      const { data: positions, error } = await supabase
        .from('positions')
        .select('simbolo');

      if (error) {
        console.error('Error loading positions:', error);
        return;
      }

      // Extraer símbolos únicos
      const symbols = [...new Set(positions?.map(p => p.simbolo) || [])];
      this.currentSymbols = new Set(symbols);
      
      console.log('Loaded current symbols:', Array.from(this.currentSymbols));
    } catch (error) {
      console.error('Error in loadCurrentPositions:', error);
    }
  }

  /**
   * Establece suscripción a cambios en la tabla de posiciones
   */
  private static subscribeToPositionsChanges(): void {
    if (this.positionsChannel) {
      supabase.removeChannel(this.positionsChannel);
    }

    this.positionsChannel = supabase
      .channel('positions-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'positions',
        },
        async (payload) => {
          console.log('Positions changed:', payload);
          
          // Recargar posiciones y actualizar suscripciones
          await this.loadCurrentPositions();
          this.updatePriceSubscriptions();
        }
      )
      .subscribe((status) => {
        console.log('Positions subscription status:', status);
      });
  }

  /**
   * Actualiza las suscripciones de precios basándose en los símbolos actuales
   */
  private static updatePriceSubscriptions(): void {
    console.log('Updating price subscriptions for symbols:', Array.from(this.currentSymbols));
    
    // Limpiar suscripciones previas
    this.clearPriceSubscriptions();
    
    if (this.currentSymbols.size === 0) {
      console.log('No symbols to subscribe to');
      return;
    }

    // Establecer nueva suscripción a precios históricos
    this.subscribeToHistoricalPrices();
    
    // Iniciar simulación de precios para cada símbolo
    this.startPriceSimulationForSymbols(Array.from(this.currentSymbols));
  }

  /**
   * Suscribe a actualizaciones en la tabla historical_prices
   */
  private static subscribeToHistoricalPrices(): void {
    const { updateAssetPrice, setLoading, setError } = usePortfolioStore.getState();
    
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
          
          // Solo actualizar si el símbolo está en nuestras posiciones actuales
          if (this.currentSymbols.has(newPrice.simbolo)) {
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
          
          if (this.currentSymbols.has(updatedPrice.simbolo)) {
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
  }

  /**
   * Inicia simulación de precios para símbolos específicos
   */
  private static startPriceSimulationForSymbols(symbols: string[]): void {
    const { updateAssetPrice, assets } = usePortfolioStore.getState();

    symbols.forEach((symbol) => {
      // Limpiar intervalo previo si existe
      if (this.priceIntervals.has(symbol)) {
        clearInterval(this.priceIntervals.get(symbol)!);
      }

      // Obtener precio actual del store o usar fallback
      const currentAsset = assets[symbol];
      if (!currentAsset || !currentAsset.precio_actual) {
        console.warn(`No real price found for ${symbol}, skipping simulation`);
        return;
      }

      // Crear nuevo intervalo para este símbolo
      const interval = setInterval(() => {
        if (!this.isSubscribed || !this.currentSymbols.has(symbol)) {
          clearInterval(interval);
          this.priceIntervals.delete(symbol);
          return;
        }

        const { assets: latestAssets } = usePortfolioStore.getState();
        const basePrice = latestAssets[symbol]?.precio_actual || currentAsset.precio_actual;
        
        // Variación aleatoria de ±2%
        const variation = (Math.random() - 0.5) * 0.04;
        const newPrice = basePrice * (1 + variation);
        
        console.log(`Updating price for ${symbol}: ${newPrice.toFixed(2)} (base: ${basePrice})`);
        updateAssetPrice(symbol, Number(newPrice.toFixed(2)));
        
      }, 3000 + Math.random() * 2000); // Intervalo variable entre 3-5 segundos

      this.priceIntervals.set(symbol, interval);
    });

    console.log(`Started price simulation for ${symbols.length} symbols based on real prices`);
  }

  /**
   * Limpia todas las suscripciones de precios
   */
  private static clearPriceSubscriptions(): void {
    // Limpiar canal de tiempo real
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }

    // Limpiar intervalos de simulación
    this.priceIntervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.priceIntervals.clear();

    this.isSubscribed = false;
  }

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
   * Método legacy - usar initialize() en su lugar
   * @deprecated
   */
  static subscribeToLivePrices(symbols: string[] = []): void {
    console.warn('subscribeToLivePrices is deprecated. Use initialize() instead.');
    this.initialize();
  }

  /**
   * Método legacy para compatibilidad - usar cleanup() en su lugar
   * @deprecated
   */
  static unsubscribeFromLivePrices(): void {
    console.warn('unsubscribeFromLivePrices is deprecated. Use cleanup() instead.');
    this.cleanup();
  }

  /**
   * Desuscribirse de todas las actualizaciones
   */
  static cleanup(): void {
    console.log('Cleaning up PriceService...');
    
    // Limpiar suscripciones de precios
    this.clearPriceSubscriptions();
    
    // Limpiar suscripción a posiciones
    if (this.positionsChannel) {
      supabase.removeChannel(this.positionsChannel);
      this.positionsChannel = null;
    }

    // Limpiar estado
    this.currentSymbols.clear();
    
    console.log('PriceService cleanup completed');
  }

  /**
   * Obtiene el estado de la suscripción
   */
  static getSubscriptionStatus(): boolean {
    return this.isSubscribed;
  }

  /**
   * Obtiene los símbolos actualmente suscritos
   */
  static getCurrentSymbols(): string[] {
    return Array.from(this.currentSymbols);
  }

  /**
   * Fuerza la actualización de suscripciones
   */
  static async forceUpdate(): Promise<void> {
    console.log('Force updating PriceService...');
    await this.loadCurrentPositions();
    this.updatePriceSubscriptions();
  }
}