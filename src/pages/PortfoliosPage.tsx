
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePortfolios } from '@/hooks/usePortfolios';
import { PortfolioFormModal } from '@/components/portfolios/PortfolioFormModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Briefcase, Edit, Trash2, Loader2 } from 'lucide-react';

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
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
  } = usePortfolios();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPortfolio, setDeletingPortfolio] = useState<Portfolio | null>(null);

  const handleCreatePortfolio = (data: { name: string }) => {
    createPortfolio(data);
    setIsCreateModalOpen(false);
  };

  const handleEditPortfolio = (data: { name: string }) => {
    if (editingPortfolio) {
      updatePortfolio(editingPortfolio.id, data);
      setIsEditModalOpen(false);
      setEditingPortfolio(null);
    }
  };

  const handleDeletePortfolio = () => {
    if (deletingPortfolio) {
      deletePortfolio(deletingPortfolio.id);
      setIsDeleteDialogOpen(false);
      setDeletingPortfolio(null);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
                        onClick={() => openEditModal(portfolio)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(portfolio)}
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
              onClick={() => setIsCreateModalOpen(true)}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 h-full min-h-[200px]">
                <Plus className="h-12 w-12 text-muted-foreground mb-2" />
                <span className="text-muted-foreground">Crear Nuevo Portfolio</span>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Portfolio Modal */}
        <PortfolioFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreatePortfolio}
          title="Nuevo Portfolio"
        />

        {/* Edit Portfolio Modal */}
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

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente el portfolio
                "{deletingPortfolio?.nombre}" y todos sus datos asociados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeletePortfolio}>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
