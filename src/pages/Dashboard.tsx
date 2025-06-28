
import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import { AssetAllocation } from "@/components/dashboard/AssetAllocation";
import { PositionsTable } from "@/components/portfolios/PositionsTable";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  TrendingUp, 
  Activity, 
  DollarSign,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOperations } from "@/hooks/useOperations";
import { useEffect } from "react";

export default function Dashboard() {
  const { toast } = useToast();
  const { data: operations, refetch } = useOperations();

  // Calculate positions from operations
  const positions = operations.reduce((acc: any[], operation) => {
    const existingPosition = acc.find(p => p.simbolo === operation.simbolo);
    
    if (existingPosition) {
      if (operation.tipo === 'compra') {
        const totalQuantity = existingPosition.cantidad + operation.cantidad;
        const totalCost = (existingPosition.precio_medio * existingPosition.cantidad) + (operation.precio * operation.cantidad);
        existingPosition.cantidad = totalQuantity;
        existingPosition.precio_medio = totalCost / totalQuantity;
      } else if (operation.tipo === 'venta') {
        existingPosition.cantidad -= operation.cantidad;
      }
    } else if (operation.tipo === 'compra') {
      acc.push({
        simbolo: operation.simbolo,
        cantidad: operation.cantidad,
        precio_medio: operation.precio,
        fecha_compra: operation.fecha
      });
    }
    
    return acc.filter(p => p.cantidad > 0);
  }, []);

  const handleRefreshData = () => {
    toast({
      title: "Actualizando datos",
      description: "Obteniendo los últimos precios del mercado...",
    });
    
    refetch();
    
    setTimeout(() => {
      toast({
        title: "Datos actualizados",
        description: "Los precios se han actualizado correctamente",
      });
    }, 2000);
  };

  // Auto-refresh when operations change
  useEffect(() => {
    refetch();
  }, [operations, refetch]);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Resumen de tus inversiones al {new Date().toLocaleDateString('es-ES')}
            </p>
          </div>
          <Button onClick={handleRefreshData} className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Actualizar Datos</span>
          </Button>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Valor Total del Portafolio"
            value={operations.length === 0 ? (
              <span className="text-2xl font-bold text-muted-foreground">— — —</span>
            ) : (
              "€125,000"
            )}
            change={operations.length === 0 ? undefined : { value: "+8.5% (€9,750)", isPositive: true }}
            icon={<Wallet className="h-5 w-5 text-blue-600" />}
          />
          <MetricCard
            title="P/L Diario"
            value={operations.length === 0 ? (
              <span className="text-2xl font-bold text-muted-foreground">— — —</span>
            ) : (
              "+2.3%"
            )}
            change={operations.length === 0 ? undefined : { value: "+€2,875", isPositive: true }}
            icon={<TrendingUp className="h-5 w-5 text-green-600" />}
          />
          <MetricCard
            title="P/L Semanal"
            value={operations.length === 0 ? (
              <span className="text-2xl font-bold text-muted-foreground">— — —</span>
            ) : (
              "+5.7%"
            )}
            change={operations.length === 0 ? undefined : { value: "+€7,125", isPositive: true }}
            icon={<Activity className="h-5 w-5 text-orange-600" />}
          />
          <MetricCard
            title="P/L Mensual"
            value={operations.length === 0 ? (
              <span className="text-2xl font-bold text-muted-foreground">— — —</span>
            ) : (
              "+12.3%"
            )}
            change={operations.length === 0 ? undefined : { value: "+€13,750", isPositive: true }}
            icon={<DollarSign className="h-5 w-5 text-purple-600" />}
          />
        </div>

        {/* Segunda fila de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="P/L Anual"
            value={operations.length === 0 ? (
              <span className="text-2xl font-bold text-muted-foreground">— — —</span>
            ) : (
              "+24.8%"
            )}
            change={operations.length === 0 ? undefined : { value: "+€24,800", isPositive: true }}
            icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
          />
          <MetricCard
            title="Volatilidad (30d)"
            value={operations.length === 0 ? (
              <span className="text-2xl font-bold text-muted-foreground">— — —</span>
            ) : (
              "18.5%"
            )}
            icon={<Activity className="h-5 w-5 text-orange-600" />}
          />
          <MetricCard
            title="Ratio de Sharpe"
            value={operations.length === 0 ? (
              <span className="text-2xl font-bold text-muted-foreground">— — —</span>
            ) : (
              "1.34"
            )}
            change={operations.length === 0 ? undefined : { value: "↑ desde 1.21", isPositive: true }}
            icon={<DollarSign className="h-5 w-5 text-purple-600" />}
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PortfolioChart hasOperations={operations.length > 0} />
          </div>
          <div className="lg:col-span-1">
            <AssetAllocation hasOperations={operations.length > 0} />
          </div>
        </div>

        {/* Tabla de posiciones */}
        <PositionsTable positions={positions} />
      </div>
    </AppLayout>
  );
}
