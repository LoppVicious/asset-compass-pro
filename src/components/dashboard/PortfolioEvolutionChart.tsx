
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartData {
  date: string;
  value: number;
}

interface PortfolioEvolutionChartProps {
  data: ChartData[];
  hasData: boolean;
}

export function PortfolioEvolutionChart({ data, hasData }: PortfolioEvolutionChartProps) {
  const chartData = hasData ? data : [
    { date: "Ene", value: 0 },
    { date: "Feb", value: 0 },
    { date: "Mar", value: 0 },
    { date: "Abr", value: 0 },
    { date: "May", value: 0 },
    { date: "Jun", value: 0 },
  ];

  return (
    <Card className="min-h-[300px]">
      <CardHeader>
        <CardTitle>Evolución del Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              {hasData && (
                <Tooltip
                  formatter={(value: number) => [`€${value.toLocaleString()}`, "Valor"]}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              )}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={hasData ? "#3b82f6" : "#e5e7eb"} 
                strokeWidth={2}
                dot={{ fill: hasData ? "#3b82f6" : "#e5e7eb", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
