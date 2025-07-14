export interface PortfolioAsset {
  simbolo: string;
  precio_actual: number;
  ultimo_update: Date;
  variacion_diaria: number;
  variacion_porcentual: number;
  cantidad?: number;
  valor_total?: number;
}

export interface Portfolio {
  id: string;
  nombre: string;
  fecha_creacion: string;
  user_id: string;
}

export interface Position {
  id: string;
  portfolio_id: string;
  simbolo: string;
  tipo_activo: string;
  cantidad: number;
  precio_compra: number;
  fecha_compra: string;
}