import React, { useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { useAssets } from '@/store/portfolioStore';

interface ChartDataPoint {
  timestamp: string;
  value: number;
  displayTime: string;
}

interface PortfolioChartProps {
  className?: string;
}

export const PortfolioChart = React.memo(({ className }: PortfolioChartProps) => {
  const assets = useAssets();
  const assetsList = Object.values(assets);

  // Calcular valor total del portfolio en tiempo real
  const currentPortfolioValue = useMemo(() => {
    return assetsList.reduce((total, asset) => {
      // Simular cantidad de acciones (en un caso real vendría de las posiciones)
      const simulatedQuantity = 100; // Esto debería venir de las posiciones reales
      return total + (asset.precio_actual * simulatedQuantity);
    }, 0);
  }, [assetsList]);

  // Generar datos históricos simulados para el gráfico
  const chartData = useMemo((): ChartDataPoint[] => {
    const now = new Date();
    const data: ChartDataPoint[] = [];
    
    // Generar 20 puntos de datos históricos
    for (let i = 19; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * 30000)); // Cada 30 segundos
      const baseValue = currentPortfolioValue || 50000; // Valor base si no hay activos
      
      // Simular variación histórica
      const variation = Math.sin(i * 0.3) * 0.02; // ±2% de variación
      const historicalValue = baseValue * (1 + variation);
      
      data.push({
        timestamp: timestamp.toISOString(),
        value: historicalValue,
        displayTime: timestamp.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        })
      });
    }
    
    // Agregar el valor actual como último punto
    if (currentPortfolioValue > 0) {
      data.push({
        timestamp: now.toISOString(),
        value: currentPortfolioValue,
        displayTime: now.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        })
      });
    }
    
    return data;
  }, [currentPortfolioValue]);

  // Calcular cambio porcentual desde el primer punto
  const percentageChange = useMemo(() => {
    if (chartData.length < 2) return 0;
    const firstValue = chartData[0].value;
    const lastValue = chartData[chartData.length - 1].value;
    return ((lastValue - firstValue) / firstValue) * 100;
  }, [chartData]);

  // Formatter personalizado para el tooltip
  const formatTooltip = useCallback((value: number, label: string) => {
    return [
      `€${value.toLocaleString('es-ES', { maximumFractionDigits: 2 })}`,
      'Valor Portfolio'
    ];
  }, []);

  // Formatter para el eje Y
  const formatYAxis = useCallback((value: number) => {
    return `€${(value / 1000).toFixed(0)}k`;
  }, []);

  const hasData = chartData.length > 1 && currentPortfolioValue > 0;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Evolución del Portfolio en Tiempo Real
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge
              variant={percentageChange >= 0 ? "default" : "destructive"}
              className="flex items-center space-x-1"
            >
              <TrendingUp className="h-3 w-3" />
              <span>
                {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%
              </span>
            </Badge>
          </div>
        </div>
        
        {hasData && (
          <div className="text-2xl font-bold text-foreground">
            €{currentPortfolioValue.toLocaleString('es-ES', { maximumFractionDigits: 2 })}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {!hasData ? (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p>Inicia las cotizaciones en tiempo real para ver la evolución del portfolio</p>
              <p className="text-sm mt-2">Los datos se actualizarán automáticamente</p>
            </div>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="displayTime"
                  className="text-xs"
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 10 }}
                  tickFormatter={formatYAxis}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ 
                    r: 4, 
                    stroke: "hsl(var(--primary))",
                    strokeWidth: 2,
                    fill: "hsl(var(--background))"
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

PortfolioChart.displayName = 'PortfolioChart';