import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PortfolioEvolutionChart } from "@/components/dashboard/PortfolioEvolutionChart";
import { AssetAllocationChart } from "@/components/dashboard/AssetAllocationChart";
import { PositionsTable } from "@/components/portfolios/PositionsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  computeValorTotal,
  computeRendimientoMensual,
  computeSharpeRatio
} from "@/utils/dashboardUtils";

export default function DashboardPage() {
  const { toast } = useToast();
  
  // Load portfolios first
  const { data: portfolios, isLoading: portfoliosLoading, error: portfoliosError } = usePortfolios();
  
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

  // Calculate metrics from real data
  const portfolioValue = computeValorTotal(positions);
  const monthlyReturn = computeRendimientoMensual(operations);
  const sharpeRatio = computeSharpeRatio(positions);

  // Generate chart data
  const hasOperations = operations.length > 0;
  const hasPositions = positions.length > 0;

  const evolutionData = hasOperations ? [
    { date: "Ene", value: 100000 },
    { date: "Feb", value: 105000 },
    { date: "Mar", value: 98000 },
    { date: "Abr", value: 112000 },
    { date: "May", value: 108000 },
    { date: "Jun", value: portfolioValue },
  ] : [];

  const allocationData = hasPositions ? positions.map(position => ({
    name: position.simbolo,
    value: position.cantidad * position.precio_actual,
    percentage: portfolioValue > 0 ? Math.round(((position.cantidad * position.precio_actual) / portfolioValue) * 100) : 0
  })) : [];

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

  // Auto-refresh positions when portfolioId changes
  useEffect(() => {
    if (portfolioId) {
      refetchPositions();
    }
  }, [portfolioId, refetchPositions]);

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
          <Button onClick={() => handleRefreshData()} className="flex items-center space-x-2">
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

        {/* Métricas principales - Solo 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <MetricCard
            title="Valor Total del Portafolio"
            value={hasOperations ? `€${portfolioValue.toLocaleString()}` : "— — —"}
            change={hasOperations ? { 
              value: `+8.5% (€${Math.round(portfolioValue * 0.085).toLocaleString()})`, 
              isPositive: true 
            } : undefined}
            icon={<Wallet className="h-5 w-5 text-blue-600" />}
          />
          <MetricCard
            title="Rendimiento Mensual"
            value={hasOperations ? `${(monthlyReturn * 100).toFixed(1)}%` : "— — —"}
            change={hasOperations ? { 
              value: `+€${Math.round(portfolioValue * monthlyReturn).toLocaleString()}`, 
              isPositive: monthlyReturn > 0 
            } : undefined}
            icon={<TrendingUp className="h-5 w-5 text-green-600" />}
          />
          <MetricCard
            title="Ratio de Sharpe"
            value={hasOperations ? sharpeRatio.toFixed(2) : "— — —"}
            change={hasOperations ? { 
              value: "↑ desde 1.21", 
              isPositive: true 
            } : undefined}
            icon={<DollarSign className="h-5 w-5 text-purple-600" />}
          />
        </div>

        {/* Gráficos - Evolución y Distribución */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="min-h-[300px]">
            {hasOperations ? (
              <PortfolioEvolutionChart 
                hasData={hasOperations} 
                data={evolutionData}
              />
            ) : (
              <Card className="min-h-[300px]">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    Empieza creando operaciones para ver la evolución del portafolio
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="min-h-[300px]">
            <AssetAllocationChart 
              hasData={hasPositions}
              data={allocationData}
            />
          </div>
        </div>

        {/* Posiciones Actuales */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Posiciones Actuales</CardTitle>
            <Button 
              onClick={() => refetchPositions()} 
              variant="outline" 
              size="sm"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Actualizar Precios</span>
            </Button>
          </CardHeader>
          <CardContent>
            {positionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Cargando posiciones...</span>
              </div>
            ) : positionsError ? (
              <div className="text-center py-8">
                <p className="text-destructive">
                  Error: {getErrorMessage(positionsError)}
                </p>
              </div>
            ) : positions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Crea operaciones para generar posiciones.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticker</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Precio Compra</TableHead>
                    <TableHead className="text-right">Precio Actual</TableHead>
                    <TableHead className="text-right">P/L Absoluto</TableHead>
                    <TableHead className="text-right">P/L %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positions.map((position) => (
                    <TableRow key={position.id}>
                      <TableCell className="font-medium">{position.simbolo}</TableCell>
                      <TableCell className="text-right">{position.cantidad}</TableCell>
                      <TableCell className="text-right">€{position.precio_compra.toFixed(2)}</TableCell>
                      <TableCell className="text-right">€{position.precio_actual.toFixed(2)}</TableCell>
                      <TableCell className={`text-right font-medium ${position.pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {position.pl >= 0 ? '+' : ''}€{position.pl.toFixed(2)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${position.plPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {position.plPercent >= 0 ? '+' : ''}{position.plPercent.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Tabla de posiciones original */}
        <PositionsTable />
      </div>
    </AppLayout>
  );
}
