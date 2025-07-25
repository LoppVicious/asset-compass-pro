
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartData {
  date: string;
  value: number;
}

interface PortfolioChartProps {
  hasOperations: boolean;
  data?: ChartData[];
}

export function PortfolioChart({ hasOperations, data = [] }: PortfolioChartProps) {
  return (
    <Card className="min-h-[300px]">
      <CardHeader>
        <CardTitle>Evolución del Portafolio</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasOperations ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Empieza creando operaciones para ver la evolución del portafolio
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number) => [`€${value.toLocaleString()}`, "Valor"]}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
