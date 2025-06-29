
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useFetchPortfolios } from '@/hooks/useFetchPortfolios';
import { useMutatePortfolio } from '@/hooks/useMutatePortfolio';
import { PortfolioFormModal } from '@/components/portfolios/PortfolioFormModal';
import { PortfoliosGrid } from '@/components/portfolios/PortfoliosGrid';
import { PortfolioDeleteDialog } from '@/components/portfolios/PortfolioDeleteDialog';
import { Button } from '@/components/ui/button';
import { Plus, Briefcase, Loader2 } from 'lucide-react';

interface Portfolio {
  id: string;
  nombre: string;
  fecha_creacion: string;
  user_id: string;
}

export default function PortfoliosPage() {
  const {
    data: portfolios,
    isLoading,
    refetch,
  } = useFetchPortfolios();

  const {
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
  } = useMutatePortfolio();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPortfolio, setDeletingPortfolio] = useState<Portfolio | null>(null);

  const handleCreatePortfolio = (data: { name: string }) => {
    createPortfolio(data);
    setIsCreateModalOpen(false);
    setTimeout(() => refetch(), 1000);
  };

  const handleEditPortfolio = (data: { name: string }) => {
    if (editingPortfolio) {
      updatePortfolio(editingPortfolio.id, data);
      setIsEditModalOpen(false);
      setEditingPortfolio(null);
      setTimeout(() => refetch(), 1000);
    }
  };

  const handleDeletePortfolio = () => {
    if (deletingPortfolio) {
      deletePortfolio(deletingPortfolio.id);
      setIsDeleteDialogOpen(false);
      setDeletingPortfolio(null);
      setTimeout(() => refetch(), 1000);
    }
  };

  const openEditModal = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (portfolio: Portfolio) => {
    setDeletingPortfolio(portfolio);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Portfolios</h1>
            <p className="text-muted-foreground">
              Gestiona y monitorea todos tus portfolios de inversión
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Portfolio</span>
          </Button>
        </div>

        {portfolios.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aún no tienes portfolios</h3>
            <p className="text-muted-foreground mb-6">
              Crea tu primer portfolio para comenzar a gestionar tus inversiones
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear primer Portfolio
            </Button>
          </div>
        ) : (
          <PortfoliosGrid
            portfolios={portfolios}
            onEdit={openEditModal}
            onDelete={openDeleteDialog}
            onCreateNew={() => setIsCreateModalOpen(true)}
          />
        )}

        <PortfolioFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreatePortfolio}
          title="Nuevo Portfolio"
        />

        <PortfolioFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingPortfolio(null);
          }}
          onSubmit={handleEditPortfolio}
          initialValues={editingPortfolio ? { name: editingPortfolio.nombre } : undefined}
          title="Editar Portfolio"
        />

        <PortfolioDeleteDialog
          isOpen={isDeleteDialogOpen}
          portfolio={deletingPortfolio}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setDeletingPortfolio(null);
          }}
          onConfirm={handleDeletePortfolio}
        />
      </div>
    </AppLayout>
  );
}
