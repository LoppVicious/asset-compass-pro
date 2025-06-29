
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Operation {
  id: string;
  tipo: string;
  cantidad: number;
  precio: number;
  fecha: string;
  simbolo: string;
  portfolio_id: string;
}

interface OperationsTableProps {
  operations: Operation[];
  totalCount: number;
  page: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  onEdit: (operation: Operation) => void;
  onDelete: (id: string) => void;
}

export const OperationsTable: React.FC<OperationsTableProps> = ({
  operations,
  totalCount,
  page,
  canGoNext,
  canGoPrev,
  onNextPage,
  onPrevPage,
  onEdit,
  onDelete,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (operations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No se encontraron operaciones</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Símbolo</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {operations.map((operation) => (
            <TableRow key={operation.id}>
              <TableCell>{formatDate(operation.fecha)}</TableCell>
              <TableCell>
                <Badge variant={operation.tipo === 'compra' ? 'default' : 'destructive'}>
                  {operation.tipo}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">{operation.simbolo}</TableCell>
              <TableCell className="text-right">{operation.cantidad}</TableCell>
              <TableCell className="text-right">{formatCurrency(operation.precio)}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(operation.cantidad * operation.precio)}
              </TableCell>
              <TableCell>
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(operation)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(operation.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Página {page + 1} de {Math.ceil(totalCount / 10)}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevPage}
            disabled={!canGoPrev}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={!canGoNext}
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};
