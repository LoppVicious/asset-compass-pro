import { supabase } from '@/integrations/supabase/client';

export interface PriceData {
  simbolo: string;
  precio_cierre: number;
  fecha: string;
}

export class PriceService {
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
}