
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, BarChart3, PieChart, TrendingUp } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Gestiona tu
              <span className="text-blue-600 block">
                Portafolio de Inversiones
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Toma el control de tus inversiones con Asset Compass Pro. 
              Analiza, rastrea y optimiza tu portafolio con herramientas 
              profesionales de gestión financiera.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>

            {/* Features Icons */}
            <div className="flex justify-center lg:justify-start space-x-8 text-gray-500">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span className="text-sm">Analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span className="text-sm">Diversificación</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm">Rendimiento</span>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Mockup */}
          <div className="relative">
            <Card className="p-6 shadow-2xl bg-white">
              <div className="space-y-4">
                {/* Dashboard Header */}
                <div className="flex justify-between items-center pb-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Dashboard
                  </h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                {/* Mock Dashboard Content */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">
                      Valor Total
                    </div>
                    <div className="text-2xl font-bold text-blue-900">
                      $124,567
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">
                      Ganancia
                    </div>
                    <div className="text-2xl font-bold text-green-900">
                      +12.5%
                    </div>
                  </div>
                </div>

                {/* Mock Chart */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 h-32 rounded-lg flex items-center justify-center">
                  <div className="flex items-end space-x-2">
                    {[40, 60, 30, 80, 50, 70, 90].map((height, index) => (
                      <div
                        key={index}
                        className="bg-blue-500 rounded-t"
                        style={{ 
                          height: `${height}%`, 
                          width: '12px',
                          opacity: 0.7 + (index * 0.05)
                        }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Mock Portfolio Items */}
                <div className="space-y-2">
                  {['AAPL', 'GOOGL', 'MSFT'].map((symbol, index) => (
                    <div key={symbol} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                      <span className="font-medium text-gray-700">{symbol}</span>
                      <span className="text-green-600 font-medium">
                        +{(2.5 + index * 0.8).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-200 rounded-full opacity-20"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
