
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowRight, BarChart3, PieChart, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const LandingPage: React.FC = () => {
  // Datos ficticios para los gráficos
  const evolutionData = [
    { date: 'Lun', value: 12000 },
    { date: 'Mar', value: 12100 },
    { date: 'Mie', value: 11950 },
    { date: 'Jue', value: 12200 },
    { date: 'Vie', value: 12300 },
    { date: 'Sab', value: 12250 },
    { date: 'Dom', value: 12345.67 },
  ];

  const expositionData = [
    { name: 'AAPL', value: 35, color: '#3b82f6' },
    { name: 'MSFT', value: 25, color: '#10b981' },
    { name: 'GOOG', value: 15, color: '#f59e0b' },
    { name: 'Otros', value: 25, color: '#8b5cf6' },
  ];

  const positionsData = [
    { ticker: 'AAPL', cantidad: 10, precioCompra: 130.00, precioActual: 135.50, plPercent: 4.23 },
    { ticker: 'MSFT', cantidad: 5, precioCompra: 250.00, precioActual: 255.00, plPercent: 2.00 },
    { ticker: 'GOOG', cantidad: 2, precioCompra: 2500.00, precioActual: 2450.00, plPercent: -2.00 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header Público */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Asset Compass Pro
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Gestiona tu portafolio
            <span className="text-blue-600 block">
              como un pro
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Prueba gratis la experiencia completa antes de registrarte. 
            Ve cómo Asset Compass Pro puede transformar la gestión de tus inversiones.
          </p>

          {/* Mockup placeholder */}
          <div className="relative mb-12">
            <div className="bg-white rounded-2xl shadow-2xl p-8 mx-auto max-w-4xl border">
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Dashboard Preview</h3>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-40 rounded-lg flex items-center justify-center">
                <div className="text-gray-500 text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Vista previa del dashboard completo abajo</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-200 rounded-full opacity-20"></div>
          </div>
        </div>
      </section>

      {/* Preview Completo del Dashboard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Dashboard Completo
          </h2>
          <p className="text-lg text-gray-600">
            Así se vería tu portafolio en Asset Compass Pro
          </p>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valor Total
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€12,345.67</div>
              <p className="text-xs text-muted-foreground">Portafolio total</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                P/L Diario
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+€123.45</div>
              <p className="text-xs text-green-600">+1.01% hoy</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sharpe Ratio
              </CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.23</div>
              <p className="text-xs text-muted-foreground">Rendimiento ajustado</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Gráfico de Evolución */}
          <Card>
            <CardHeader>
              <CardTitle>Evolución Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: number) => [`€${value.toLocaleString()}`, "Valor"]}
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart de Exposición */}
          <Card>
            <CardHeader>
              <CardTitle>Exposición por Activo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={expositionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {expositionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, "Exposición"]}
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {expositionData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Posiciones */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Posiciones Actuales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio Compra</TableHead>
                  <TableHead>Precio Actual</TableHead>
                  <TableHead>P/L %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positionsData.map((position) => (
                  <TableRow key={position.ticker}>
                    <TableCell className="font-medium">{position.ticker}</TableCell>
                    <TableCell>{position.cantidad}</TableCell>
                    <TableCell>€{position.precioCompra.toFixed(2)}</TableCell>
                    <TableCell>€{position.precioActual.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className={`flex items-center ${
                        position.plPercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {position.plPercent >= 0 ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {position.plPercent >= 0 ? '+' : ''}{position.plPercent.toFixed(2)}%
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action Fijo */}
      <div className="sticky bottom-0 bg-white border-t shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                Registrarse Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
