import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogIn, LogOut, Settings } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsDropdownOpen(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    
    switch (user.userType) {
      case 'admin':
        return '/admin/dashboard';
      case 'candidate':
        return '/candidate/dashboard';
      case 'employer':
        return '/employer/dashboard';
      default:
        return '/dashboard';
    }
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    
    if (user.userType === 'employer' && user.companyName) {
      return user.companyName;
    }
    
    return `${user.firstName} ${user.lastName}`;
  };

  const getUserTypeLabel = () => {
    switch (user?.userType) {
      case 'admin':
        return 'Administrateur';
      case 'candidate':
        return 'Candidat';
      case 'employer':
        return 'Employeur';
      default:
        return '';
    }
  };

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Le Concept', href: '/concept' },
    { name: 'Pour les Professionnels', href: '/professionals' },
    { name: 'Pour les Candidats', href: '/candidates' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold text-primary-500">
              YALLA EXTRA
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-500 border-b-2 border-primary-500 pb-1'
                    : 'text-text-primary hover:text-primary-500'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-500" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-text-primary">{getUserDisplayName()}</div>
                    <div className="text-xs text-text-secondary">{getUserTypeLabel()}</div>
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-2">
                    <Link
                      to={getDashboardLink()}
                      className="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-secondary-50"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Tableau de bord
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-secondary-50"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Paramètres
                    </Link>
                    <hr className="my-2 border-secondary-200" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-danger-500 hover:bg-danger-50"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center px-4 py-2 text-text-primary hover:text-primary-500 transition-colors duration-200"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="flex items-center px-6 py-2 bg-accent-500 text-white rounded-full hover:bg-accent-600 transition-colors duration-200"
                >
                  <User className="w-4 h-4 mr-2" />
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-text-secondary hover:text-primary-500 hover:bg-secondary-50"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary-200">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-medium py-2 px-4 rounded-md transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary-500 bg-primary-50'
                      : 'text-text-primary hover:text-primary-500 hover:bg-secondary-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="border-t border-secondary-200 pt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2">
                      <div className="text-sm font-medium text-text-primary">{getUserDisplayName()}</div>
                      <div className="text-xs text-text-secondary">{getUserTypeLabel()}</div>
                    </div>
                    <Link
                      to={getDashboardLink()}
                      className="flex items-center px-4 py-2 text-text-primary hover:text-primary-500 rounded-md hover:bg-secondary-50 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Tableau de bord
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-danger-500 hover:bg-danger-50 rounded-md transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Se déconnecter
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link
                      to="/login"
                      className="flex items-center px-4 py-2 text-text-primary hover:text-primary-500 rounded-md hover:bg-secondary-50 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Connexion
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center px-4 py-2 bg-accent-500 text-white rounded-md hover:bg-accent-600 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      S'inscrire
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;