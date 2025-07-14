import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Pause, Play, RefreshCw } from 'lucide-react';
import { useAssets, useAssetsLoading, useAssetsError, usePortfolioStore } from '@/store/portfolioStore';
import { PriceService } from '@/services/priceService';
import { cn } from '@/lib/utils';

interface LivePortfolioProps {
  portfolioId?: string;
  symbols?: string[];
}

export function LivePortfolio({ portfolioId, symbols = [] }: LivePortfolioProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const assets = useAssets();
  const isLoading = useAssetsLoading();
  const error = useAssetsError();
  const { clearAssets } = usePortfolioStore();

  const assetsList = Object.values(assets);

  useEffect(() => {
    // Actualizar timestamp cuando cambien los assets
    if (assetsList.length > 0) {
      setLastUpdate(new Date());
    }
  }, [assetsList]);

  const handleSubscribe = () => {
    if (!isSubscribed) {
      PriceService.subscribeToLivePrices(symbols);
      setIsSubscribed(true);
    } else {
      PriceService.unsubscribeFromLivePrices();
      setIsSubscribed(false);
    }
  };

  const handleRefresh = () => {
    clearAssets();
    if (isSubscribed) {
      PriceService.unsubscribeFromLivePrices();
      setTimeout(() => {
        PriceService.subscribeToLivePrices(symbols);
      }, 100);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatPercentage = (percentage: number): string => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const getVariationColor = (variation: number): string => {
    if (variation > 0) return 'text-green-600';
    if (variation < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getVariationIcon = (variation: number) => {
    if (variation > 0) return <TrendingUp className="h-4 w-4" />;
    if (variation < 0) return <TrendingDown className="h-4 w-4" />;
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Cotizaciones en Tiempo Real
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
            <Button
              variant={isSubscribed ? "destructive" : "default"}
              size="sm"
              onClick={handleSubscribe}
              disabled={isLoading}
            >
              {isSubscribed ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "h-2 w-2 rounded-full",
              isSubscribed ? "bg-green-500 animate-pulse" : "bg-gray-400"
            )} />
            <span>
              {isSubscribed ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          {lastUpdate && (
            <span>
              Última actualización: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {isLoading && assetsList.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Cargando cotizaciones...</span>
          </div>
        ) : assetsList.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No hay activos en seguimiento.
              {!isSubscribed && ' Haz clic en "Iniciar" para comenzar.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {assetsList.map((asset) => (
              <div
                key={asset.simbolo}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="font-medium text-lg">
                    {asset.simbolo}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Live
                  </Badge>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-semibold text-lg">
                      {formatPrice(asset.precio_actual)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {asset.ultimo_update.toLocaleTimeString()}
                    </div>
                  </div>

                  <div className={cn(
                    "flex items-center space-x-1 font-medium",
                    getVariationColor(asset.variacion_porcentual)
                  )}>
                    {getVariationIcon(asset.variacion_porcentual)}
                    <span>
                      {formatPercentage(asset.variacion_porcentual)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}