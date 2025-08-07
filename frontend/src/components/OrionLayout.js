import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  PlusCircle, Edit, Trash2, Upload, ShoppingCart, Send, Calendar, Package, Bell, 
  Menu, X, Home, BarChart3, Building2, Archive, DollarSign, Settings, Users,
  ChevronDown, ChevronRight, Truck, HelpCircle, BookOpen, Star, ExternalLink
} from 'lucide-react';

const OrionLayout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Estados para submenus
  const [expandedMenus, setExpandedMenus] = useState({
    empresa: false,
    fornecedores: false,
    estoque: false,
    vendas: false,
    financeiro: false,
    utilitarios: false
  });

  // Estado para dropdown de usuário
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate('/login');
  };

  const isCurrentPath = (path) => location.pathname === path;

  const UserDropdown = () => {
    const handleToggleDropdown = (e) => {
      e.stopPropagation();
      setShowUserDropdown(!showUserDropdown);
    };

    const handleMenuClick = (e, section) => {
      e.stopPropagation();
      setShowUserDropdown(false);
      navigate(section);
    };

    return (
      <div className="user-dropdown relative">
        <button
          onClick={handleToggleDropdown}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium">{user?.name || 'Usuário'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'usuario@exemplo.com'}</p>
          </div>
          <ChevronDown size={16} className="text-gray-400" />
        </button>

        {showUserDropdown && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 border border-gray-200 z-50">
            <div className="py-2">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuário'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'usuario@exemplo.com'}</p>
              </div>
              <button
                onClick={(e) => handleMenuClick(e, '/profile')}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Users size={16} className="mr-3" />
                Meu Perfil
              </button>
              <button
                onClick={(e) => handleMenuClick(e, '/settings')}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Settings size={16} className="mr-3" />
                Configurações
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <X size={16} className="mr-3" />
                Sair
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const TopMenu = () => {
    return (
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Bell size={20} />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <HelpCircle size={20} />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <BookOpen size={20} />
        </button>
      </div>
    );
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard'
    },
    {
      id: 'empresa',
      label: 'Empresa',
      icon: Building2,
      hasSubmenu: true,
      submenu: [
        { id: 'filiais', label: 'Filiais', path: '/filiais' },
        { id: 'colaboradores', label: 'Colaboradores', path: '/colaboradores' },
        { id: 'clientes', label: 'Clientes', path: '/clientes' },
        { id: 'produtos', label: 'Produtos', path: '/products' }
      ]
    },
    {
      id: 'fornecedores',
      label: 'Fornecedores',
      icon: Truck,
      hasSubmenu: true,
      submenu: [
        { id: 'gerenciar-fornecedores', label: 'Gerenciar', path: '/suppliers' },
        { id: 'tipos-fornecedores', label: 'Tipos', path: '/supplier-types' },
        { id: 'contratos-fornecedores', label: 'Contratos', path: '/supplier-contracts' }
      ]
    },
    {
      id: 'estoque',
      label: 'Estoque',
      icon: Archive,
      hasSubmenu: true,
      submenu: [
        { id: 'estoque-atual', label: 'Estoque Atual', path: '/inventory' },
        { id: 'pedidos', label: 'Pedidos', path: '/orders' },
        { id: 'enviar-fornecedor', label: 'Enviar Fornecedor', path: '/send-supplier' }
      ]
    },
    {
      id: 'vendas',
      label: 'Vendas',
      icon: DollarSign,
      hasSubmenu: true,
      submenu: [
        { id: 'gerenciar-vendas', label: 'Gerenciar Vendas', path: '/sales-manage' },
        { id: 'relatorios-vendas', label: 'Relatórios', path: '/reports' },
        { id: 'metas-vendas', label: 'Metas', path: '/sales-goals' }
      ]
    },
    {
      id: 'financeiro',
      label: 'Financeiro',
      icon: BarChart3,
      hasSubmenu: true,
      submenu: [
        { id: 'fluxo-caixa', label: 'Fluxo de Caixa', path: '/cash-flow' },
        { id: 'contas-pagar', label: 'Contas a Pagar', path: '/accounts-payable' },
        { id: 'relatorios-financeiros', label: 'Relatórios', path: '/financial-reports' }
      ]
    },
    {
      id: 'utilitarios',
      label: 'Utilitários',
      icon: Settings,
      hasSubmenu: true,
      submenu: [
        { id: 'backup', label: 'Backup', path: '/backup' },
        { id: 'configuracoes', label: 'Configurações', path: '/settings' },
        { id: 'logs-sistema', label: 'Logs do Sistema', path: '/system-logs' }
      ]
    }
  ];

  // Se não estiver autenticado, não renderizar o layout
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`min-h-screen flex transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Sidebar */}
      <div 
        className={`${sidebarHovered ? 'w-64' : 'w-16'} transition-all duration-300 flex flex-col ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-slate-800 text-white'
        }`}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        {/* Header */}
        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-slate-700'}`}>
          <div className="flex items-center justify-center">
            {sidebarHovered ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center relative">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-blue-200 rounded-full"></div>
                  <div className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-blue-300 rounded-full"></div>
                </div>
                <h1 className="text-lg font-bold truncate">Orion</h1>
              </div>
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center relative">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-blue-200 rounded-full"></div>
                <div className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-blue-300 rounded-full"></div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isExpanded = expandedMenus[item.id];
            const hasActiveSubmenu = item.submenu?.some(sub => isCurrentPath(sub.path));
            const isActive = isCurrentPath(item.path) || hasActiveSubmenu;

            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.hasSubmenu) {
                      toggleMenu(item.id);
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon size={20} className="flex-shrink-0" />
                    {sidebarHovered && <span className="ml-3 truncate">{item.label}</span>}
                  </div>
                  {sidebarHovered && item.hasSubmenu && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  )}
                </button>

                {/* Submenu */}
                {sidebarHovered && item.hasSubmenu && isExpanded && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.submenu.map(subItem => (
                      <button
                        key={subItem.id}
                        onClick={() => navigate(subItem.path)}
                        className={`w-full text-left p-2 pl-8 rounded text-sm transition-colors ${
                          isCurrentPath(subItem.path)
                            ? 'bg-blue-600 text-white'
                            : isDarkMode
                              ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                              : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User info */}
        {sidebarHovered && (
          <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-slate-700'}`}>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name || 'Usuário'}</p>
                <p className="text-xs text-gray-400">{user?.role || 'Administrador'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className={`shadow-sm border-b px-6 py-4 transition-colors duration-200 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center relative">
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-blue-200 rounded-full"></div>
                  <div className="absolute bottom-0.5 left-0.5 w-0.5 h-0.5 bg-blue-300 rounded-full"></div>
                </div>
                <h2 className={`text-lg font-semibold transition-colors duration-200 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Orion Gestor de Restaurante
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <TopMenu />
              <div className={`text-sm transition-colors duration-200 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {new Date().toLocaleDateString('pt-BR')}
              </div>
              <UserDropdown />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Top Info Section */}
          <div className={`mb-6 rounded-lg shadow-sm border p-6 transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold transition-colors duration-200 ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>Bem vindo (a), {user?.name || 'Usuário'}!</h3>
                  <p className={`text-sm transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Este é o seu painel de controle</p>
                </div>
              </div>
              
              <div className={`rounded-lg p-4 min-w-72 transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-blue-800 to-blue-900 text-white' 
                  : 'bg-gradient-to-r from-slate-800 to-slate-900 text-white'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-slate-700 px-2 py-1 rounded">Plus</span>
                  <div className="text-yellow-400">👑</div>
                </div>
                <h4 className="font-semibold mb-1">Plano Plus</h4>
                <p className="text-xs text-gray-300 mb-3">Acesse recursos exclusivos e suporte premium</p>
                <div className="flex gap-2">
                  <button className="bg-white text-slate-800 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100 transition-colors">
                    Assinar agora
                  </button>
                  <button className="border border-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-slate-700 transition-colors flex items-center gap-1">
                    Saiba mais →
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-500" />
                <span className={`text-sm font-medium transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Primeiros passos</span>
              </div>
              <div className="flex-1 max-w-md">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Progresso</span>
                  <span className={`text-sm font-medium transition-colors duration-200 ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>82%</span>
                </div>
                <div className={`w-full rounded-full h-2 transition-colors duration-200 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default OrionLayout; 