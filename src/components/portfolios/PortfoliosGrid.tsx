
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Edit, Trash2, Plus } from 'lucide-react';

interface Portfolio {
  id: string;
  nombre: string;
  fecha_creacion: string;
  user_id: string;
}

interface PortfoliosGridProps {
  portfolios: Portfolio[];
  onEdit: (portfolio: Portfolio) => void;
  onDelete: (portfolio: Portfolio) => void;
  onCreateNew: () => void;
}

export const PortfoliosGrid: React.FC<PortfoliosGridProps> = ({
  portfolios,
  onEdit,
  onDelete,
  onCreateNew,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {portfolios.map((portfolio) => (
        <Card key={portfolio.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <span>{portfolio.nombre}</span>
              </CardTitle>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(portfolio)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(portfolio)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Creado</span>
                <span className="text-sm">{formatDate(portfolio.fecha_creacion)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Add new portfolio card */}
      <Card
        className="border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer"
        onClick={onCreateNew}
      >
        <CardContent className="flex flex-col items-center justify-center p-6 h-full min-h-[200px]">
          <Plus className="h-12 w-12 text-muted-foreground mb-2" />
          <span className="text-muted-foreground">Crear Nuevo Portfolio</span>
        </CardContent>
      </Card>
    </div>
  );
};
