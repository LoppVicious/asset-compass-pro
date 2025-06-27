
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold text-gray-900 hover:text-gray-700">
              Asset Compass Pro
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <nav className="flex items-center space-x-2">
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm">Dashboard</Button>
                  </Link>
                  <Link to="/portfolios">
                    <Button variant="ghost" size="sm">Portfolios</Button>
                  </Link>
                  <Link to="/operations">
                    <Button variant="ghost" size="sm">Operaciones</Button>
                  </Link>
                  <Link to="/settings">
                    <Button variant="ghost" size="sm">Settings</Button>
                  </Link>
                </nav>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar sesión</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Entrar</Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="sm">Registrarse</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
