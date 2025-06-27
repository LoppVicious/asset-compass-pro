import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, BarChart3, PieChart, TrendingUp, TrendingDown, Moon, Sun } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
const LandingPage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || !savedTheme && prefersDark;
    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Animation variants
  const fadeInVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  const staggerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Datos ficticios para los gráficos
  const evolutionData = [{
    date: 'Lun',
    value: 12000
  }, {
    date: 'Mar',
    value: 12100
  }, {
    date: 'Mie',
    value: 11950
  }, {
    date: 'Jue',
    value: 12200
  }, {
    date: 'Vie',
    value: 12300
  }, {
    date: 'Sab',
    value: 12250
  }, {
    date: 'Dom',
    value: 12345.67
  }];
  const expositionData = [{
    name: 'AAPL',
    value: 35,
    color: '#3b82f6'
  }, {
    name: 'MSFT',
    value: 25,
    color: '#10b981'
  }, {
    name: 'GOOG',
    value: 15,
    color: '#f59e0b'
  }, {
    name: 'Otros',
    value: 25,
    color: '#8b5cf6'
  }];
  const positionsData = [{
    ticker: 'AAPL',
    cantidad: 10,
    precioCompra: 130.00,
    precioActual: 135.50,
    plPercent: 4.23
  }, {
    ticker: 'MSFT',
    cantidad: 5,
    precioCompra: 250.00,
    precioActual: 255.00,
    plPercent: 2.00
  }, {
    ticker: 'GOOG',
    cantidad: 2,
    precioCompra: 2500.00,
    precioActual: 2450.00,
    plPercent: -2.00
  }];
  const ChartSkeleton = () => <div className="h-64 w-full">
      <Skeleton className="h-full w-full animate-pulse" />
    </div>;
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Público */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 dark:bg-gray-800/80 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Asset Compass Pro
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={toggleDarkMode} aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
                {isDarkMode ? <Sun className="h-4 w-4" aria-label="Cambiar a modo claro" /> : <Moon className="h-4 w-4" aria-label="Cambiar a modo oscuro" />}
              </Button>
              <Link to="/login">
                <Button variant="ghost" size="sm" aria-label="Iniciar sesión">
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" aria-label="Crear cuenta nueva">
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-[32px]">
        <motion.div className="text-center mb-16" initial="hidden" animate="visible" variants={fadeInVariants}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            Gestiona tu portafolio
            <span className="block text-blue-700">
              como un pro
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            Prueba gratis la experiencia completa antes de registrarte. 
            Ve cómo Asset Compass Pro puede transformar la gestión de tus inversiones.
          </p>
        </motion.div>
      </section>

      {/* Preview Completo del Dashboard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div className="text-center mb-12" initial="hidden" animate="visible" variants={fadeInVariants}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Dashboard Completo
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Así se vería tu portafolio en Asset Compass Pro
          </p>
        </motion.div>

        {/* Cards de Métricas */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" initial="hidden" animate="visible" variants={staggerVariants}>
          <motion.div variants={fadeInVariants}>
            <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                  Valor Total
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground dark:text-gray-400" aria-label="Icono de valor total" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-white">€12,345.67</div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">Portafolio total</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInVariants}>
            <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                  P/L Diario
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" aria-label="Icono de tendencia alcista" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+€123.45</div>
                <p className="text-xs text-green-600">+1.01% hoy</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInVariants}>
            <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                  Sharpe Ratio
                </CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground dark:text-gray-400" aria-label="Icono de ratio Sharpe" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-white">1.23</div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">Rendimiento ajustado</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Gráficos */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12" initial="hidden" animate="visible" variants={staggerVariants}>
          {/* Gráfico de Evolución */}
          <motion.div variants={fadeInVariants}>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Evolución Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64" aria-label="Gráfico de evolución semanal del portafolio">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={evolutionData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={value => `€${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value: number) => [`€${value.toLocaleString()}`, "Valor"]} contentStyle={{
                      backgroundColor: isDarkMode ? '#374151' : 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: isDarkMode ? 'white' : 'black'
                    }} />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{
                      fill: "#3b82f6",
                      strokeWidth: 2,
                      r: 4
                    }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pie Chart de Exposición */}
          <motion.div variants={fadeInVariants}>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Exposición por Activo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64" aria-label="Gráfico circular de exposición por activo en el portafolio">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie data={expositionData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="value">
                        {expositionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value}%`, "Exposición"]} contentStyle={{
                      backgroundColor: isDarkMode ? '#374151' : 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: isDarkMode ? 'white' : 'black'
                    }} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {expositionData.map((item, index) => <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{
                    backgroundColor: item.color
                  }}></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {item.name} ({item.value}%)
                      </span>
                    </div>)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Tabla de Posiciones */}
        <motion.div className="mb-12" initial="hidden" animate="visible" variants={fadeInVariants}>
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Posiciones Actuales</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="dark:border-gray-700">
                    <TableHead className="dark:text-gray-300">Ticker</TableHead>
                    <TableHead className="dark:text-gray-300">Cantidad</TableHead>
                    <TableHead className="dark:text-gray-300">Precio Compra</TableHead>
                    <TableHead className="dark:text-gray-300">Precio Actual</TableHead>
                    <TableHead className="dark:text-gray-300">P/L %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positionsData.map(position => <TableRow key={position.ticker} className="dark:border-gray-700">
                      <TableCell className="font-medium dark:text-white">{position.ticker}</TableCell>
                      <TableCell className="dark:text-gray-300">{position.cantidad}</TableCell>
                      <TableCell className="dark:text-gray-300">€{position.precioCompra.toFixed(2)}</TableCell>
                      <TableCell className="dark:text-gray-300">€{position.precioActual.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className={`flex items-center ${position.plPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {position.plPercent >= 0 ? <TrendingUp className="h-4 w-4 mr-1" aria-label="Tendencia positiva" /> : <TrendingDown className="h-4 w-4 mr-1" aria-label="Tendencia negativa" />}
                          {position.plPercent >= 0 ? '+' : ''}{position.plPercent.toFixed(2)}%
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Call to Action Fijo */}
      <div className="sticky bottom-0 bg-white border-t shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-3" aria-label="Registrarse gratuitamente en Asset Compass Pro">
                Registrarse Gratis
                <ArrowRight className="ml-2 h-5 w-5" aria-label="Ir a registro" />
              </Button>
            </Link>
            
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-3" aria-label="Iniciar sesión en Asset Compass Pro">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>;
};
export default LandingPage;