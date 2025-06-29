
import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
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
import { useEffect } from "react";
import {
  calculatePortfolioValue,
  calculateMonthlyReturn,
  calculateSharpeRatio,
  generateChartData,
  generatePieData
} from "@/utils/calculations";

export default function Dashboard() {
  const { toast } = useToast();
  
  // Load portfolios first
  const { data: portfolios, isLoading: portfoliosLoading, error: portfoliosError } = usePortfolios();
  
  // Get active portfolio (first one)
  const activePortfolio = portfolios[0];
  const portfolioId = activePortfolio?.id;
  
  // Load operations and positions for active portfolio
  const { data: operations, isLoading: operationsLoading, error: operationsError, refetch: refetchOperations } = useOperations();
  const { data: positions, isLoading: positionsLoading, error: positionsError, refetch: refetchPositions } = usePositions(portfolioId);

  // Calculate metrics from real data
  const portfolioValue = calculatePortfolioValue(positions);
  const monthlyReturn = calculateMonthlyReturn(operations);
  const sharpeRatio = calculateSharpeRatio(positions);

  // Generate chart data
  const chartData = generateChartData(operations);
  const pieData = generatePieData(positions);

  const handleRefreshData = () => {
    toast({
      title: "Actualizando datos",
      description: "Obteniendo los últimos precios del mercado...",
    });
    
    refetchOperations();
    refetchPositions();
    
    setTimeout(() => {
      toast({
        title: "Datos actualizados",
        description: "Los precios se han actualizado correctamente",
      });
    }, 2000);
  };

  // Auto-refresh when operations change
  useEffect(() => {
    if (portfolioId) {
      refetchPositions();
    }
  }, [operations, portfolioId]);

  // Loading state
  const isLoading = portfoliosLoading || operationsLoading || positionsLoading;

  // Error handling
  const hasError = portfoliosError || operationsError || positionsError;

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
                  Error al cargar datos: {portfoliosError?.message || operationsError || positionsError || 'Error desconocido'}
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

        {/* Métricas principales - Solo 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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

        {/* Gráficos - Evolución y Distribución */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="min-h-[300px]">
            <PortfolioChart 
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

        {/* Tabla de posiciones */}
        <PositionsTable positions={positions} />
      </div>
    </AppLayout>
  );
}
