
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface Operation {
  id: string;
  tipo: string;
  cantidad: number;
  precio: number;
  fecha: string;
  simbolo: string;
  portfolio_id: string;
}

interface Portfolio {
  id: string;
  nombre: string;
}

interface OperationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<{ success: boolean; error?: string }>;
  operation?: Operation | null;
  portfolios: Portfolio[];
  isLoading: boolean;
}

export const OperationFormModal: React.FC<OperationFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  operation,
  portfolios,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    tipo: 'compra',
    cantidad: '',
    precio: '',
    fecha: new Date().toISOString().split('T')[0],
    simbolo: '',
    portfolio_id: '',
  });

  useEffect(() => {
    if (operation) {
      setFormData({
        tipo: operation.tipo,
        cantidad: operation.cantidad.toString(),
        precio: operation.precio.toString(),
        fecha: operation.fecha.split('T')[0],
        simbolo: operation.simbolo,
        portfolio_id: operation.portfolio_id,
      });
    } else {
      setFormData({
        tipo: 'compra',
        cantidad: '',
        precio: '',
        fecha: new Date().toISOString().split('T')[0],
        simbolo: '',
        portfolio_id: portfolios.length > 0 ? portfolios[0].id : '',
      });
    }
  }, [operation, portfolios, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.portfolio_id) {
      return;
    }

    const data = {
      tipo: formData.tipo,
      cantidad: parseFloat(formData.cantidad),
      precio: parseFloat(formData.precio),
      fecha: formData.fecha,
      simbolo: formData.simbolo.toUpperCase(),
      portfolio_id: formData.portfolio_id,
    };

    const result = await onSubmit(data);
    if (result.success) {
      onClose();
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const maxDate = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {operation ? 'Editar Operación' : 'Nueva Operación'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="portfolio">Portfolio</Label>
            <Select
              value={formData.portfolio_id}
              onValueChange={(value) => handleChange('portfolio_id', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un portfolio" />
              </SelectTrigger>
              <SelectContent>
                {portfolios.map((portfolio) => (
                  <SelectItem key={portfolio.id} value={portfolio.id}>
                    {portfolio.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value) => handleChange('tipo', value)}
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compra">Compra</SelectItem>
                <SelectItem value="venta">Venta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="simbolo">Símbolo</Label>
            <Input
              id="simbolo"
              value={formData.simbolo}
              onChange={(e) => handleChange('simbolo', e.target.value)}
              placeholder="Ej: AAPL"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input
                id="cantidad"
                type="number"
                step="0.001"
                min="0"
                value={formData.cantidad}
                onChange={(e) => handleChange('cantidad', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio">Precio</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                min="0"
                value={formData.precio}
                onChange={(e) => handleChange('precio', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={formData.fecha}
              max={maxDate}
              onChange={(e) => handleChange('fecha', e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {operation ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
