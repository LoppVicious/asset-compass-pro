
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useOperations } from '@/hooks/useOperations';
import { OperationFormModal } from '@/components/operations/OperationFormModal';
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Portfolio {
  id: string;
  nombre: string;
}

export default function OperationsPage() {
  const {
    data: operations,
    isLoading,
    page,
    setPage,
    search,
    setSearch,
    totalCount,
    canGoNext,
    canGoPrev,
    createOperation,
    updateOperation,
    deleteOperation,
  } = useOperations();

  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOperation, setEditingOperation] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPortfolios = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('portfolios')
        .select('id, nombre')
        .eq('user_id', user.id);

      if (!error && data) {
        setPortfolios(data);
      }
    };

    fetchPortfolios();
  }, [user]);

  const handleCreateOperation = () => {
    setEditingOperation(null);
    setIsModalOpen(true);
  };

  const handleEditOperation = (operation: any) => {
    setEditingOperation(operation);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (editingOperation) {
      return await updateOperation(editingOperation.id, data);
    } else {
      return await createOperation(data);
    }
  };

  const handleDeleteOperation = async (id: string) => {
    await deleteOperation(id);
    setDeleteConfirmId(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (portfolios.length === 0 && !isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4">Operaciones</h1>
            <p className="text-muted-foreground mb-4">
              Necesitas crear un portfolio antes de poder registrar operaciones.
            </p>
            <Button onClick={() => window.location.href = '/portfolios'}>
              Ir a Portfolios
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Operaciones</h1>
            <p className="text-muted-foreground">
              Gestiona todas tus operaciones de compra y venta
            </p>
          </div>
          <Button onClick={handleCreateOperation} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nueva Operación</span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por símbolo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operaciones ({totalCount})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : operations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No se encontraron operaciones</p>
              </div>
            ) : (
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
                              onClick={() => handleEditOperation(operation)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteConfirmId(operation.id)}
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
                      onClick={() => setPage(page - 1)}
                      disabled={!canGoPrev}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={!canGoNext}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <OperationFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          operation={editingOperation}
          portfolios={portfolios}
          isLoading={isLoading}
        />

        <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente la operación.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteConfirmId && handleDeleteOperation(deleteConfirmId)}
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
