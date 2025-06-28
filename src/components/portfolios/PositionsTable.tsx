
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

const samplePositions = [
  {
    symbol: "VWCE",
    name: "Vanguard FTSE All-World",
    type: "ETF",
    quantity: 450,
    avgPrice: 100.00,
    currentPrice: 105.50,
    marketValue: 47475,
    unrealizedPnL: 2475,
    unrealizedPnLPercent: 5.5,
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    type: "Crypto",
    quantity: 0.75,
    avgPrice: 35000,
    currentPrice: 41667,
    marketValue: 31250,
    unrealizedPnL: 5000,
    unrealizedPnLPercent: 19.0,
  },
  {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF",
    type: "ETF",
    quantity: 60,
    avgPrice: 420.00,
    currentPrice: 416.67,
    marketValue: 25000,
    unrealizedPnL: -200,
    unrealizedPnLPercent: -0.8,
  },
];

interface PositionsTableProps {
  positions: any[];
}

export function PositionsTable({ positions }: PositionsTableProps) {
  // Use sample data if no real positions yet, otherwise use real positions
  const displayPositions = positions.length > 0 ? positions : samplePositions;
  const showEmptyState = positions.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Posiciones Actuales</CardTitle>
      </CardHeader>
      <CardContent>
        {showEmptyState ? (
          <p className="text-center py-12 text-muted-foreground">
            Crea una operación para generar tus posiciones actuales.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Precio Medio</TableHead>
                <TableHead className="text-right">Precio Actual</TableHead>
                <TableHead className="text-right">Valor de Mercado</TableHead>
                <TableHead className="text-right">P/L No Realizado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayPositions.map((position, index) => (
                <TableRow key={position.symbol || position.simbolo || index} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{position.symbol || position.simbolo}</div>
                      <div className="text-sm text-muted-foreground">{position.name || position.simbolo}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{position.type || "Activo"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{position.quantity || position.cantidad}</TableCell>
                  <TableCell className="text-right">€{(position.avgPrice || position.precio_medio || 0).toFixed(2)}</TableCell>
                  <TableCell className="text-right">€{(position.currentPrice || position.precio_medio || 0).toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">
                    €{((position.marketValue || (position.cantidad * position.precio_medio)) || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`flex items-center justify-end space-x-1 ${
                      (position.unrealizedPnL || 0) >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {(position.unrealizedPnL || 0) >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <div>
                        <div className="font-medium">
                          €{Math.abs(position.unrealizedPnL || 0).toLocaleString()}
                        </div>
                        <div className="text-xs">
                          {(position.unrealizedPnLPercent || 0) > 0 ? "+" : ""}
                          {(position.unrealizedPnLPercent || 0).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
