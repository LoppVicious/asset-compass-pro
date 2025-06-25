
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, ArrowUpRight, ArrowDownLeft, DollarSign } from "lucide-react";

const sampleOperations = [
  {
    id: 1,
    date: "2024-01-15",
    type: "buy",
    symbol: "VWCE",
    quantity: 50,
    price: 105.50,
    total: 5275,
    fees: 2.50,
  },
  {
    id: 2,
    date: "2024-01-12",
    type: "dividend",
    symbol: "SPY",
    quantity: 60,
    price: 2.15,
    total: 129,
    fees: 0,
  },
  {
    id: 3,
    date: "2024-01-10",
    type: "sell",
    symbol: "BTC",
    quantity: 0.25,
    price: 42000,
    total: 10500,
    fees: 15.75,
  },
  {
    id: 4,
    date: "2024-01-08",
    type: "buy",
    symbol: "EUNL",
    quantity: 100,
    price: 150.00,
    total: 15000,
    fees: 7.50,
  },
];

const operationTypeConfig = {
  buy: { label: "Compra", icon: ArrowDownLeft, color: "bg-green-100 text-green-800" },
  sell: { label: "Venta", icon: ArrowUpRight, color: "bg-red-100 text-red-800" },
  dividend: { label: "Dividendo", icon: DollarSign, color: "bg-blue-100 text-blue-800" },
};

export default function Operations() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Operaciones</h1>
            <p className="text-muted-foreground">
              Historial completo de todas tus transacciones
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nueva Operación</span>
          </Button>
        </div>

        {/* Resumen de operaciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Operaciones este mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+3 desde el mes pasado</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Volumen total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€45,250</div>
              <p className="text-xs text-muted-foreground">Suma de todas las operaciones</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Comisiones pagadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€127.50</div>
              <p className="text-xs text-muted-foreground">0.28% del volumen total</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de operaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Operaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Activo</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Comisiones</TableHead>
                  <TableHead className="text-right">Neto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleOperations.map((operation) => {
                  const config = operationTypeConfig[operation.type as keyof typeof operationTypeConfig];
                  const Icon = config.icon;
                  const netAmount = operation.type === 'buy' 
                    ? -(operation.total + operation.fees)
                    : operation.total - operation.fees;

                  return (
                    <TableRow key={operation.id} className="hover:bg-muted/50">
                      <TableCell>
                        {new Date(operation.date).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={config.color}>
                          <Icon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{operation.symbol}</TableCell>
                      <TableCell className="text-right">{operation.quantity}</TableCell>
                      <TableCell className="text-right">
                        €{operation.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        €{operation.total.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        €{operation.fees.toFixed(2)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${
                        netAmount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {netAmount > 0 ? '+' : ''}€{netAmount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
