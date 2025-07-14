import { useEffect } from 'react';
import { PriceService } from '@/services/priceService';
import { usePortfolioStore } from '@/store/portfolioStore';

interface UseLivePricesOptions {
  symbols?: string[];
  autoStart?: boolean;
  interval?: number;
}

export function useLivePrices({
  symbols = [],
  autoStart = false,
  interval = 3000
}: UseLivePricesOptions = {}) {
  const { assets, isLoading, error, setLoading, setError } = usePortfolioStore();

  useEffect(() => {
    if (autoStart) {
      startLivePrices();
    }

    return () => {
      stopLivePrices();
    };
  }, [autoStart, symbols]);

  const startLivePrices = () => {
    try {
      setLoading(true);
      setError(null);
      PriceService.subscribeToLivePrices(symbols);
    } catch (error) {
      setError('Error al iniciar suscripción de precios');
      setLoading(false);
    }
  };

  const stopLivePrices = () => {
    PriceService.unsubscribeFromLivePrices();
    setLoading(false);
  };

  const isSubscribed = PriceService.getSubscriptionStatus();

  return {
    assets: Object.values(assets),
    isLoading,
    error,
    isSubscribed,
    startLivePrices,
    stopLivePrices,
    restart: () => {
      stopLivePrices();
      setTimeout(startLivePrices, 100);
    }
  };
}