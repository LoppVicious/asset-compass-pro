
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

export const calculatePortfolioValue = (positions: Position[]): number => {
  return positions.reduce((total, position) => {
    return total + (position.valor_total || 0);
  }, 0);
};

export const calculateMonthlyReturn = (operations: Operation[]): number => {
  if (operations.length === 0) return 0;
  
  // Simple calculation: assume 5% monthly growth for demo
  // In real app, you'd calculate based on historical data
  return 0.05; // 5%
};

export const calculateSharpeRatio = (positions: Position[]): number => {
  if (positions.length === 0) return 0;
  
  // Simplified Sharpe ratio calculation
  // In real app, you'd use historical returns and risk-free rate
  const totalValue = calculatePortfolioValue(positions);
  if (totalValue === 0) return 0;
  
  // Mock calculation for demo
  return 1.34;
};

export const generateChartData = (operations: Operation[]) => {
  if (operations.length === 0) {
    return [
      { date: "Ene", value: 0 },
      { date: "Feb", value: 0 },
      { date: "Mar", value: 0 },
      { date: "Abr", value: 0 },
      { date: "May", value: 0 },
      { date: "Jun", value: 0 },
    ];
  }

  // Generate sample progression based on operations
  const startValue = 100000;
  return [
    { date: "Ene", value: startValue },
    { date: "Feb", value: startValue * 1.05 },
    { date: "Mar", value: startValue * 0.98 },
    { date: "Abr", value: startValue * 1.12 },
    { date: "May", value: startValue * 1.08 },
    { date: "Jun", value: startValue * 1.25 },
  ];
};

export const generatePieData = (positions: Position[]) => {
  if (positions.length === 0) {
    return [{ name: "Sin datos", value: 100, percentage: 100 }];
  }

  const totalValue = calculatePortfolioValue(positions);
  
  return positions.map(position => ({
    name: position.simbolo,
    value: position.valor_total || 0,
    percentage: totalValue > 0 ? Math.round(((position.valor_total || 0) / totalValue) * 100) : 0
  }));
};
