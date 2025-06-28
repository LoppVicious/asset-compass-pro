
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PortfolioFormData {
  name: string;
}

interface PortfolioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PortfolioFormData) => void;
  initialValues?: PortfolioFormData;
  title?: string;
}

export const PortfolioFormModal: React.FC<PortfolioFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  title = 'Nuevo Portfolio',
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PortfolioFormData>({
    defaultValues: initialValues || { name: '' },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(initialValues || { name: '' });
    }
  }, [isOpen, initialValues, reset]);

  const handleFormSubmit = (data: PortfolioFormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Portfolio</Label>
            <Input
              id="name"
              {...register('name', {
                required: 'El nombre es requerido',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres',
                },
              })}
              placeholder="Ingresa el nombre del portfolio"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
