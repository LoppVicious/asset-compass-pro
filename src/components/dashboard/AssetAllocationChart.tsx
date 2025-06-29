
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface PieData {
  name: string;
  value: number;
  percentage: number;
}

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'];

interface AssetAllocationChartProps {
  data: PieData[];
  hasData: boolean;
}

export function AssetAllocationChart({ data, hasData }: AssetAllocationChartProps) {
  const chartData = hasData ? data : [{ name: "Sin datos", value: 100, percentage: 100 }];
  
  return (
    <Card className="min-h-[300px]">
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
                paddingAngle={0}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={hasData ? COLORS[index % COLORS.length] : "#e5e7eb"} 
                  />
                ))}
              </Pie>
              {hasData && (
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
                      const item = data.find(d => d.name === value);
                      return item ? `${value} (${item.percentage}%)` : value;
                    }}
                  />
                </>
              )}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
