
import { AppLayout } from "@/components/layout/AppLayout";
import { AddPositionForm } from "@/components/forms/AddPositionForm";
import { PositionsTable } from "@/components/portfolios/PositionsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase } from "lucide-react";

const samplePortfolios = [
  {
    id: 1,
    name: "Portafolio Principal",
    value: 125000,
    positions: 8,
    performance: 12.5,
    lastUpdated: "2024-01-15",
  },
  {
    id: 2,
    name: "Criptomonedas",
    value: 31250,
    positions: 4,
    performance: -5.2,
    lastUpdated: "2024-01-15",
  },
];

export default function Portfolios() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Portafolios</h1>
            <p className="text-muted-foreground">
              Gestiona y monitorea todos tus portafolios de inversión
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nuevo Portafolio</span>
          </Button>
        </div>

        {/* Lista de portafolios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {samplePortfolios.map((portfolio) => (
            <Card key={portfolio.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    <span>{portfolio.name}</span>
                  </CardTitle>
                  <Badge variant={portfolio.performance >= 0 ? "default" : "destructive"}>
                    {portfolio.performance > 0 ? "+" : ""}{portfolio.performance}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Valor Total</span>
                    <span className="font-medium">€{portfolio.value.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Posiciones</span>
                    <span className="font-medium">{portfolio.positions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Última actualización</span>
                    <span className="text-sm">{new Date(portfolio.lastUpdated).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Agregar nuevo portafolio */}
          <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6 h-full min-h-[200px]">
              <Plus className="h-12 w-12 text-muted-foreground mb-2" />
              <span className="text-muted-foreground">Crear Nuevo Portafolio</span>
            </CardContent>
          </Card>
        </div>

        {/* Formulario para agregar posición */}
        <AddPositionForm />

        {/* Tabla de posiciones del portafolio activo */}
        <PositionsTable />
      </div>
    </AppLayout>
  );
}
