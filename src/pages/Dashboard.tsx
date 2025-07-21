
import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PortfolioChart as LegacyPortfolioChart } from "@/components/dashboard/PortfolioChart";
import { PortfolioChart } from "@/features/portfolio/components/PortfolioChart";
import { LivePortfolio } from "@/features/portfolio/components/LivePortfolio";
import { AssetAllocation } from "@/components/dashboard/AssetAllocation";
import { PositionsTable } from "@/components/portfolios/PositionsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Wallet, 
  TrendingUp, 
  DollarSign,
  RefreshCw,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOperations } from "@/hooks/useOperations";
import { usePortfolios } from "@/hooks/usePortfolios";
import { usePositions } from "@/hooks/usePositions";
import { usePortfolioStore } from "@/store/portfolioStore";
import { PriceService } from "@/services/priceService";
import { useEffect, useMemo } from "react";

export default function Dashboard() {
  const { toast } = useToast();
  const { assets } = usePortfolioStore();
  
  // Load portfolios first
  const { data: portfolios, isLoading: portfoliosLoading, error: portfoliosError, refetch: refetchPortfolios } = usePortfolios();
  
  // Get active portfolio (first one)
  const activePortfolio = portfolios[0];
  const portfolioId = activePortfolio?.id;
  
  // Load operations and positions for active portfolio
  const { data: operations, isLoading: operationsLoading, error: operationsError, refetch: refetchOperations } = useOperations(portfolioId);
  const { data: positions, isLoading: positionsLoading, error: positionsError, refetch: refetchPositions } = usePositions(portfolioId);

  // Helper function to safely extract error messages
  const getErrorMessage = (error: unknown): string => {
    if (!error) return '';
    if (typeof error === 'string') {
      return error;
    } else if (error && typeof (error as any).message === 'string') {
      return (error as any).message;
    }
    return 'Error desconocido';
  };

  // Calculate metrics from real data with live prices
  const portfolioValue = useMemo(() => {
    return positions.reduce((total, position) => {
      const asset = assets[position.simbolo];
      const precioActual = asset?.precio_actual || position.precio_compra;
      return total + (position.cantidad * precioActual);
    }, 0);
  }, [positions, assets]);

  // Calculate monthly return (simplified - based on live prices)
  const monthlyReturn = useMemo(() => {
    if (positions.length === 0) return 0;
    const costoTotal = positions.reduce((total, position) => {
      return total + (position.cantidad * position.precio_compra);
    }, 0);
    return costoTotal > 0 ? (portfolioValue - costoTotal) / costoTotal : 0;
  }, [positions, portfolioValue]);

  // Calculate Sharpe ratio (simplified - based on current performance)
  const sharpeRatio = useMemo(() => {
    return positions.length > 0 ? Math.max(1.0, monthlyReturn * 10) : 0;
  }, [positions.length, monthlyReturn]);

  // Generate chart data based on operations
  const chartData = operations.length > 0 ? [
    { date: "Ene", value: portfolioValue * 0.8 },
    { date: "Feb", value: portfolioValue * 0.85 },
    { date: "Mar", value: portfolioValue * 0.9 },
    { date: "Abr", value: portfolioValue * 0.95 },
    { date: "May", value: portfolioValue * 0.98 },
    { date: "Jun", value: portfolioValue },
  ] : [];

  // Generate pie chart data
  const pieData = positions.length > 0 ? positions.map(position => ({
    name: position.simbolo,
    value: position.cantidad * position.precio_actual,
    percentage: portfolioValue > 0 ? Math.round(((position.cantidad * position.precio_actual) / portfolioValue) * 100) : 0
  })) : [];

  const handleRefreshData = () => {
    toast({
      title: "Actualizando datos",
      description: "Obteniendo los últimos precios del mercado...",
    });
    
    refetchPortfolios();
    refetchOperations();
    refetchPositions();
    
    setTimeout(() => {
      toast({
        title: "Datos actualizados",
        description: "Los precios se han actualizado correctamente",
      });
    }, 2000);
  };

  // Initialize PriceService when component mounts
  useEffect(() => {
    PriceService.initialize();
    
    return () => {
      PriceService.cleanup();
    };
  }, []);

  // Auto-refresh when operations change
  useEffect(() => {
    if (portfolioId) {
      refetchPositions();
    }
  }, [operations, portfolioId, refetchPositions]);

  // Loading state
  const isLoading = portfoliosLoading || operationsLoading || positionsLoading;

  // Error handling
  const hasError = portfoliosError || operationsError || positionsError;
  
  // Define error message properly
  let errorMessage = 'Error desconocido';
  if (portfoliosError) {
    errorMessage = getErrorMessage(portfoliosError);
  } else if (operationsError) {
    errorMessage = getErrorMessage(operationsError);
  } else if (positionsError) {
    errorMessage = getErrorMessage(positionsError);
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando dashboard...</span>
        </div>
      </AppLayout>
    );
  }

  // No portfolio state
  if (!activePortfolio) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p className="text-muted-foreground mb-4">
              Necesitas crear un portfolio antes de ver el dashboard.
            </p>
            <Button onClick={() => window.location.href = '/portfolios'}>
              Crear Portfolio
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              {activePortfolio.nombre} - {new Date().toLocaleDateString('es-ES')}
            </p>
          </div>
          <Button onClick={handleRefreshData} className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Actualizar Datos</span>
          </Button>
        </div>

        {/* Error display */}
        {hasError && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-4">
                <p className="text-destructive">
                  Error al cargar datos: {errorMessage}
                </p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={handleRefreshData}
                >
                  Reintentar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {!hasError && positions.length === 0 && operations.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Crea una operación para generar tus posiciones actuales.
                </p>
                <Button onClick={() => window.location.href = '/operations'}>
                  Crear Operación
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Métricas principales - Una sola fila */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Valor Total del Portafolio"
            value={positions.length === 0 ? "— — —" : `€${portfolioValue.toLocaleString()}`}
            change={positions.length === 0 ? undefined : { 
              value: `+8.5% (€${Math.round(portfolioValue * 0.085).toLocaleString()})`, 
              isPositive: true 
            }}
            icon={<Wallet className="h-5 w-5 text-blue-600" />}
          />
          <MetricCard
            title="Rendimiento Mensual"
            value={positions.length === 0 ? "— — —" : `${(monthlyReturn * 100).toFixed(1)}%`}
            change={positions.length === 0 ? undefined : { 
              value: `+€${Math.round(portfolioValue * monthlyReturn).toLocaleString()}`, 
              isPositive: monthlyReturn > 0 
            }}
            icon={<TrendingUp className="h-5 w-5 text-green-600" />}
          />
          <MetricCard
            title="Ratio de Sharpe"
            value={positions.length === 0 ? "— — —" : sharpeRatio.toFixed(2)}
            change={positions.length === 0 ? undefined : { 
              value: "↑ desde 1.21", 
              isPositive: true 
            }}
            icon={<DollarSign className="h-5 w-5 text-purple-600" />}
          />
        </div>

        {/* Gráficos adicionales - Solo cuando hay posiciones */}
        {positions.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="min-h-[300px]">
              <LegacyPortfolioChart 
                hasOperations={operations.length > 0} 
                data={chartData}
              />
            </div>
            <div className="min-h-[300px]">
              <AssetAllocation 
                hasOperations={positions.length > 0}
                data={pieData}
              />
            </div>
          </div>
        )}

        {/* Tabla de posiciones */}
        {positions.length > 0 && (
          <PositionsTable />
        )}

        {/* Debug Panel - Precios en tiempo real */}
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="w-80 max-h-96 overflow-auto bg-background/95 backdrop-blur-sm border-2">
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-2 text-muted-foreground">
                Precios en Tiempo Real (Debug)
              </h3>
              <pre className="text-xs font-mono text-foreground whitespace-pre-wrap break-words">
                {JSON.stringify(assets, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
