
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetchOperations } from '@/hooks/useFetchOperations';
import { useMutateOperation } from '@/hooks/useMutateOperation';
import { usePortfolios } from '@/hooks/usePortfolios';
import { OperationFormModal } from '@/components/operations/OperationFormModal';
import { OperationsTable } from '@/components/operations/OperationsTable';
import { DeleteConfirmationDialog } from '@/components/operations/DeleteConfirmationDialog';
import { Plus, Search, Loader2 } from 'lucide-react';

interface Portfolio {
  id: string;
  nombre: string;
}

export default function OperationsPage() {
  const { data: portfolios, isLoading: portfoliosLoading } = usePortfolios();
  
  const {
    data: operations,
    isLoading,
    error,
    page,
    setPage,
    search,
    setSearch,
    totalCount,
    canGoNext,
    canGoPrev,
    refetch,
  } = useFetchOperations();

  const {
    createOperation,
    updateOperation,
    deleteOperation,
  } = useMutateOperation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOperation, setEditingOperation] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleCreateOperation = () => {
    setEditingOperation(null);
    setIsModalOpen(true);
  };

  const handleEditOperation = (operation: any) => {
    setEditingOperation(operation);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    let result;
    if (editingOperation) {
      result = await updateOperation(editingOperation.id, data);
    } else {
      result = await createOperation(data);
    }
    
    if (result.success) {
      setIsModalOpen(false);
      refetch();
    }
    
    return result;
  };

  const handleDeleteOperation = async () => {
    if (deleteConfirmId) {
      const result = await deleteOperation(deleteConfirmId);
      if (result.success) {
        refetch();
      }
      setDeleteConfirmId(null);
    }
  };

  if (portfoliosLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (portfolios.length === 0) {
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

        {error && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-4">
                <p className="text-destructive">Error: {error}</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Inténtalo de nuevo más tarde
                </p>
              </div>
            </CardContent>
          </Card>
        )}

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
            ) : (
              <OperationsTable
                operations={operations}
                totalCount={totalCount}
                page={page}
                canGoNext={canGoNext}
                canGoPrev={canGoPrev}
                onNextPage={() => setPage(page + 1)}
                onPrevPage={() => setPage(page - 1)}
                onEdit={handleEditOperation}
                onDelete={setDeleteConfirmId}
              />
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

        <DeleteConfirmationDialog
          isOpen={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
          onConfirm={handleDeleteOperation}
        />
      </div>
    </AppLayout>
  );
}
