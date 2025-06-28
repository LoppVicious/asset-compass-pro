
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const sampleData = [
  { name: "VWCE (ETF)", value: 45000, percentage: 36 },
  { name: "BTC", value: 31250, percentage: 25 },
  { name: "SPY (ETF)", value: 25000, percentage: 20 },
  { name: "EUNL (ETF)", value: 15000, percentage: 12 },
  { name: "Bonos EUR", value: 8750, percentage: 7 },
];

const emptyData = [
  { name: "Sin datos", value: 100, percentage: 100 },
];

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'];

interface AssetAllocationProps {
  hasOperations: boolean;
}

export function AssetAllocation({ hasOperations }: AssetAllocationProps) {
  const chartData = hasOperations ? sampleData : emptyData;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Activos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={hasOperations ? 2 : 0}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={hasOperations ? COLORS[index % COLORS.length] : "#e5e7eb"} 
                  />
                ))}
              </Pie>
              {hasOperations && (
                <>
                  <Tooltip 
                    formatter={(value: number) => [`€${value.toLocaleString()}`, "Valor"]}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => {
                      const item = sampleData.find(data => data.name === value);
                      return item ? `${value} (${item.percentage}%)` : value;
                    }}
                  />
                </>
              )}
            </PieChart>
          </ResponsiveContainer>
          {!hasOperations && (
            <div className="text-center mt-4 text-muted-foreground text-sm">
              Crea operaciones para ver la distribución de activos
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
