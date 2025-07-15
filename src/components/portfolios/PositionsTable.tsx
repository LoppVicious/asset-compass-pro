
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
import { usePortfolioStore } from "@/store/portfolioStore";
import { useMemo } from "react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PositionsTableProps {}

export function PositionsTable({}: PositionsTableProps) {
  const { assets } = usePortfolioStore();
  
  // Fetch all positions from all portfolios
  const { data: allPositions = [], isLoading } = useQuery({
    queryKey: ['all-positions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('positions')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Format numbers with thousands separators and decimals
  const formatCurrency = (value: number) => {
    return value.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Enrich positions with live prices
  const enrichedPositions = useMemo(() => {
    return allPositions.map(position => {
      const asset = assets[position.simbolo];
      const precioActual = asset?.precio_actual || position.precio_compra;
      const valorMercado = position.cantidad * precioActual;
      const pnlNoRealizado = valorMercado - (position.cantidad * position.precio_compra);
      const pnlPorcentual = ((precioActual - position.precio_compra) / position.precio_compra) * 100;
      
      return {
        ...position,
        precio_actual: precioActual,
        valor_mercado: valorMercado,
        pnl_no_realizado: pnlNoRealizado,
        pnl_porcentual: pnlPorcentual,
      };
    });
  }, [allPositions, assets]);
  
  const showEmptyState = enrichedPositions.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Posiciones Actuales</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center py-12 text-muted-foreground">
            Cargando posiciones...
          </p>
        ) : showEmptyState ? (
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
              {enrichedPositions.map((position, index) => (
                <TableRow key={position.id || index} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{position.simbolo}</div>
                      <div className="text-sm text-muted-foreground">{position.simbolo}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{position.tipo_activo}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{position.cantidad}</TableCell>
                  <TableCell className="text-right">€{formatCurrency(position.precio_compra)}</TableCell>
                  <TableCell className="text-right">€{formatCurrency(position.precio_actual)}</TableCell>
                  <TableCell className="text-right font-medium">
                    €{formatCurrency(position.valor_mercado)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`flex items-center justify-end space-x-1 ${
                      position.pnl_no_realizado >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {position.pnl_no_realizado >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <div>
                        <div className="font-medium">
                          €{formatCurrency(Math.abs(position.pnl_no_realizado))}
                        </div>
                        <div className="text-xs">
                          {position.pnl_porcentual > 0 ? "+" : ""}
                          {position.pnl_porcentual.toFixed(1)}%
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
