
interface Position {
  simbolo: string;
  cantidad: number;
  precio_actual?: number;
  valor_total?: number;
}

interface Operation {
  simbolo: string;
  cantidad: number;
  precio: number;
  tipo: string;
  fecha: string;
}

export const computeValorTotal = (positions: Position[]): number => {
  return positions.reduce((total, position) => {
    return total + (position.valor_total || 0);
  }, 0);
};

export const computeRendimientoMensual = (operations: Operation[]): number => {
  if (operations.length === 0) return 0;
  
  // Simplified calculation: assume 5% monthly growth for demo
  // In real app, you'd calculate based on historical data
  return 0.05; // 5%
};

export const computeSharpeRatio = (positions: Position[]): number => {
  if (positions.length === 0) return 0;
  
  // Simplified Sharpe ratio calculation
  // In real app, you'd use historical returns and risk-free rate
  const totalValue = computeValorTotal(positions);
  if (totalValue === 0) return 0;
  
  // Mock calculation for demo
  return 1.34;
};
