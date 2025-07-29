import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, Edit, Trash2, Upload, ShoppingCart, Send, Calendar, Package, Bell, 
  Menu, X, Home, BarChart3, Building2, Archive, DollarSign, Settings, Users,
  ChevronDown, ChevronRight, Truck, HelpCircle, BookOpen, Star, ExternalLink
} from 'lucide-react';

const { useStoredState } = hatch;

const OrionApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useStoredState('isLoggedIn', false);
  const [currentUser, setCurrentUser] = useStoredState('currentUser', null);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [produtos, setProdutos] = useStoredState('produtos', []);
  const [estoque, setEstoque] = useStoredState('estoque', {});
  const [pedidos, setPedidos] = useStoredState('pedidos', {});
  const [fornecedores, setFornecedores] = useStoredState('fornecedores', []);
  const [isDarkMode, setIsDarkMode] = useStoredState('isDarkMode', false);
  
  // Estados para modais e formulários
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterFornecedor, setFilterFornecedor] = useState('');
  const [showTopMenuDropdowns, setShowTopMenuDropdowns] = useState({
    novidades: false,
    ajuda: false,
    notificacoes: false,
    aprenda: false
  });

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
      // Verificar se clicou fora do menu superior
      if (!event.target.closest('.top-menu-dropdown')) {
        setShowTopMenuDropdowns({
          novidades: false,
          ajuda: false,
          notificacoes: false,
          aprenda: false
        });
      }
      
      // Verificar se clicou fora do dropdown do usuário
      if (!event.target.closest('.user-dropdown')) {
        setShowUserDropdown(false);
      }
    };

    // Adicionar listener tanto para click quanto para mousedown
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowUserDropdown]);

  // Dados de exemplo para demonstração
  useEffect(() => {
    if (produtos.length === 0) {
      const exemplosProdutos = [
        { id: 1, nome: 'Tomate', unidade: 'kg', fornecedor: 'Hortifruti Silva', preco: 8.50, estoqueIdeal: 20 },
        { id: 2, nome: 'Arroz', unidade: 'kg', fornecedor: 'Distribuidora Grãos', preco: 4.20, estoqueIdeal: 50 },
        { id: 3, nome: 'Frango', unidade: 'kg', fornecedor: 'Açougue Central', preco: 12.80, estoqueIdeal: 30 },
        { id: 4, nome: 'Cebola', unidade: 'kg', fornecedor: 'Hortifruti Silva', preco: 3.50, estoqueIdeal: 15 },
        { id: 5, nome: 'Óleo', unidade: 'L', fornecedor: 'Distribuidora Grãos', preco: 6.90, estoqueIdeal: 10 }
      ];
      setProdutos(exemplosProdutos);
      
      const exemplosFornecedores = [
        { nome: 'Hortifruti Silva', telefone: '5511999887766', especialidade: 'Frutas e Verduras' },
        { nome: 'Distribuidora Grãos', telefone: '5511888776655', especialidade: 'Grãos e Cereais' },
        { nome: 'Açougue Central', telefone: '5511777665544', especialidade: 'Carnes' }
      ];
      setFornecedores(exemplosFornecedores);
    }
  }, [produtos, setProdutos, setFornecedores]);

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const toggleTopMenu = (menuKey) => {
    setShowTopMenuDropdowns(prev => ({
      novidades: false,
      ajuda: false,
      notificacoes: false,
      aprenda: false,
      [menuKey]: !prev[menuKey]
    }));
  };

  const LoginScreen = () => {
    const [loginData, setLoginData] = useState({
      email: '',
      password: '',
      remember: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const handleLogin = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      
      // Simular autenticação
      setTimeout(() => {
        if (loginData.email && loginData.password) {
          const userData = {
            id: 1,
            name: loginData.email.split('@')[0],
            email: loginData.email,
            role: 'Administrador',
            avatar: loginData.email.charAt(0).toUpperCase()
          };
          
          setCurrentUser(userData);
          setIsLoggedIn(true);
        } else {
          alert('Por favor, preencha todos os campos');
        }
        setIsLoading(false);
      }, 1500);
    };

    const handleRegister = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      
      setTimeout(() => {
        if (loginData.email && loginData.password) {
          const userData = {
            id: 1,
            name: loginData.email.split('@')[0],
            email: loginData.email,
            role: 'Usuário',
            avatar: loginData.email.charAt(0).toUpperCase()
          };
          
          setCurrentUser(userData);
          setIsLoggedIn(true);
        } else {
          alert('Por favor, preencha todos os campos');
        }
        setIsLoading(false);
      }, 1500);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
              <Package className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Orion</h1>
            <p className="text-blue-200">Gestor de Compras</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {showRegister ? 'Criar Conta' : 'Bem-vindo de volta'}
              </h2>
              <p className="text-gray-600">
                {showRegister 
                  ? 'Preencha os dados para criar sua conta' 
                  : 'Entre com suas credenciais para acessar o sistema'
                }
              </p>
            </div>

            <form onSubmit={showRegister ? handleRegister : handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>

              {!showRegister && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={loginData.remember}
                      onChange={(e) => setLoginData({...loginData, remember: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Lembrar de mim</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {showRegister ? 'Criando conta...' : 'Entrando...'}
                  </div>
                ) : (
                  showRegister ? 'Criar Conta' : 'Entrar'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">ou</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Toggle Login/Register */}
            <div className="text-center">
              <p className="text-gray-600">
                {showRegister ? 'Já tem uma conta?' : 'Não tem uma conta?'}
                <button
                  type="button"
                  onClick={() => setShowRegister(!showRegister)}
                  className="ml-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  {showRegister ? 'Fazer login' : 'Criar conta'}
                </button>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2 font-medium">Credenciais de demonstração:</p>
              <p className="text-xs text-gray-500">E-mail: admin@orion.com</p>
              <p className="text-xs text-gray-500">Senha: 123456</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-blue-200 text-sm">
              © 2025 Orion Gestor de Compras. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const UserDropdown = () => {
    const handleToggleDropdown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Toggle dropdown clicked', !showUserDropdown); // Debug
      setShowUserDropdown(prev => !prev);
    };

    const handleMenuClick = (e, section) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Menu item clicked', section); // Debug
      setCurrentSection(section);
      setShowUserDropdown(false);
    };

    const handleLogout = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Logout clicked'); // Debug
      setIsLoggedIn(false);
      setCurrentUser(null);
      setShowUserDropdown(false);
    };

    return (
      <div className="relative user-dropdown">
        <button
          type="button"
          onClick={handleToggleDropdown}
          className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
            isDarkMode 
              ? 'text-gray-300 hover:bg-gray-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {currentUser?.avatar || 'A'}
            </div>
            <div className="text-left">
              <div className={`font-medium transition-colors duration-200 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{currentUser?.name || 'Anderson'}</div>
              <div className={`text-xs transition-colors duration-200 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>{currentUser?.email || 'admin@orion.com'}</div>
            </div>
          </div>
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showUserDropdown && (
          <div 
            className={`absolute right-0 top-full mt-2 w-72 rounded-lg shadow-lg z-50 border transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600' 
                : 'bg-white border-gray-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-4 border-b transition-colors duration-200 ${
              isDarkMode ? 'border-gray-700' : 'border-gray-100'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {currentUser?.avatar || 'A'}
                </div>
                <div>
                  <div className={`font-semibold transition-colors duration-200 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{currentUser?.name || 'Anderson'}</div>
                  <div className={`text-sm transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>{currentUser?.email || 'admin@orion.com'}</div>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button 
                type="button"
                onClick={(e) => handleMenuClick(e, 'perfil')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users size={16} className="text-blue-600" />
                <span>Perfil</span>
              </button>
              
              <button 
                type="button"
                onClick={(e) => handleMenuClick(e, 'meu-plano')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <BarChart3 size={16} className="text-purple-600" />
                <span>Meu plano</span>
              </button>
              
              <button 
                type="button"
                onClick={(e) => handleMenuClick(e, 'indicacoes')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Building2 size={16} className="text-green-600" />
                <span>Indicações</span>
              </button>
              
              <hr className={`my-2 transition-colors duration-200 ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`} />
              
              <button 
                type="button"
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                }`}
              >
                <X size={16} />
                <span>Sair</span>
              </button>
            </div>

            <div className={`p-4 border-t rounded-b-lg transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-900 border-gray-700' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className={`text-xs space-y-1 transition-colors duration-200 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <div><span className="font-medium">Empresa:</span> orion</div>
                <div><span className="font-medium">ID de suporte:</span> 14964</div>
                <div><span className="font-medium">Equipe responsável:</span> Comercial</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const TopMenu = () => {
    return (
      <div className="flex items-center space-x-1 top-menu-dropdown">
        {/* Toggle Tema Escuro/Claro */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
            isDarkMode 
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
        >
          {isDarkMode ? (
            <>
              <span>☀️</span>
              <span>Claro</span>
            </>
          ) : (
            <>
              <span>🌙</span>
              <span>Escuro</span>
            </>
          )}
        </button>
        
        {/* Separador */}
        <div className="h-6 w-px bg-gray-300 mx-2"></div>
        {/* Novidades */}
        <div className="relative">
          <button
            onClick={() => toggleTopMenu('novidades')}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
          >
            <Star size={16} />
            <span>Novidades</span>
            <ExternalLink size={12} />
            <ChevronDown size={14} className={`transition-transform ${showTopMenuDropdowns.novidades ? 'rotate-180' : ''}`} />
          </button>
          {showTopMenuDropdowns.novidades && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4">
                <h4 className="font-medium text-gray-800 mb-2">Últimas Atualizações</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-blue-50 rounded text-xs">
                    <div className="font-medium text-blue-800">Dashboard Analytics</div>
                    <div className="text-blue-600">Novos gráficos de performance</div>
                  </div>
                  <div className="p-2 bg-green-50 rounded text-xs">
                    <div className="font-medium text-green-800">WhatsApp Integration</div>
                    <div className="text-green-600">Envio automático para fornecedores</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ajuda */}
        <div className="relative">
          <button
            onClick={() => toggleTopMenu('ajuda')}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
          >
            <HelpCircle size={16} />
            <span>Ajuda</span>
            <ChevronDown size={14} className={`transition-transform ${showTopMenuDropdowns.ajuda ? 'rotate-180' : ''}`} />
          </button>
          {showTopMenuDropdowns.ajuda && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                  📖 Manual do usuário
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                  💬 Suporte técnico
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                  🎥 Tutoriais em vídeo
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                  ❓ FAQ - Perguntas frequentes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notificações */}
        <div className="relative">
          <button
            onClick={() => toggleTopMenu('notificacoes')}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors relative"
          >
            <Bell size={16} />
            <span>Notificações</span>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            <ChevronDown size={14} className={`transition-transform ${showTopMenuDropdowns.notificacoes ? 'rotate-180' : ''}`} />
          </button>
          {showTopMenuDropdowns.notificacoes && (
            <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4">
                <h4 className="font-medium text-gray-800 mb-3">Notificações Recentes</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-2 bg-red-50 rounded">
                    <Bell size={16} className="text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-red-800">Estoque Crítico</div>
                      <div className="text-xs text-red-600">Tomate está abaixo do estoque mínimo</div>
                      <div className="text-xs text-gray-500 mt-1">há 2 horas</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 bg-yellow-50 rounded">
                    <Package size={16} className="text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-yellow-800">Pedido Pendente</div>
                      <div className="text-xs text-yellow-600">Pedido #1234 aguardando confirmação</div>
                      <div className="text-xs text-gray-500 mt-1">há 5 horas</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 bg-blue-50 rounded">
                    <Users size={16} className="text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-800">Novo Usuário</div>
                      <div className="text-xs text-blue-600">João Silva foi adicionado ao sistema</div>
                      <div className="text-xs text-gray-500 mt-1">ontem</div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <button className="text-sm text-blue-600 hover:text-blue-800">Ver todas as notificações</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Aprenda a usar */}
        <div className="relative">
          <button
            onClick={() => toggleTopMenu('aprenda')}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
          >
            <BookOpen size={16} />
            <span>Aprenda a usar</span>
            <ChevronDown size={14} className={`transition-transform ${showTopMenuDropdowns.aprenda ? 'rotate-180' : ''}`} />
          </button>
          {showTopMenuDropdowns.aprenda && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4">
                <h4 className="font-medium text-gray-800 mb-3">Guias de Uso</h4>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm">
                    🚀 Primeiros passos
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm">
                    📦 Gerenciar produtos
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm">
                    📊 Controle de estoque
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm">
                    🛒 Gerar pedidos
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm">
                    📱 Integração WhatsApp
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Progresso:</span> 3 de 5 guias concluídos
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botão Importar dados */}
        <button
          onClick={handleImportExcel}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
        >
          <Upload size={16} />
          Importar dados
        </button>
      </div>
    );
  };

  const ProductModal = ({ product, onSave, onClose }) => {
    const [formData, setFormData] = useState({
      nome: product?.nome || '',
      unidade: product?.unidade || '',
      fornecedor: product?.fornecedor || '',
      preco: product?.preco || '',
      estoqueIdeal: product?.estoqueIdeal || ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const newProduct = {
        id: product?.id || Date.now(),
        ...formData,
        preco: parseFloat(formData.preco),
        estoqueIdeal: parseInt(formData.estoqueIdeal)
      };
      onSave(newProduct);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            {product ? 'Editar Produto' : 'Adicionar Produto'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Nome do Produto</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Unidade</label>
                <select
                  value={formData.unidade}
                  onChange={(e) => setFormData({...formData, unidade: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="kg">kg</option>
                  <option value="L">L</option>
                  <option value="un">un</option>
                  <option value="pct">pct</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Fornecedor</label>
                <input
                  type="text"
                  value={formData.fornecedor}
                  onChange={(e) => setFormData({...formData, fornecedor: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Preço Estimado (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => setFormData({...formData, preco: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Estoque Ideal</label>
                <input
                  type="number"
                  value={formData.estoqueIdeal}
                  onChange={(e) => setFormData({...formData, estoqueIdeal: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleSaveProduct = (product) => {
    if (editingProduct) {
      setProdutos(prev => prev.map(p => p.id === product.id ? product : p));
    } else {
      setProdutos(prev => [...prev, product]);
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProdutos(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleImportExcel = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.onchange = (e) => {
      alert('Funcionalidade de importação seria implementada aqui com uma biblioteca como xlsx');
    };
    input.click();
  };

  // PÁGINAS DO USUÁRIO
  const Perfil = () => {
    const [perfilData, setPerfilData] = useState({
      nome: currentUser?.name || 'Anderson',
      email: currentUser?.email || 'admin@orion.com',
      telefone: '(11) 99999-9999',
      cargo: currentUser?.role || 'Administrador',
      empresa: 'orion',
      foto: currentUser?.avatar || 'A',
      dataIngresso: '15/01/2024',
      ultimoAcesso: new Date().toLocaleString('pt-BR')
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
      setCurrentUser(prev => ({
        ...prev,
        name: perfilData.nome,
        email: perfilData.email,
        role: perfilData.cargo
      }));
      setIsEditing(false);
      alert('Perfil atualizado com sucesso!');
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Meu Perfil</h2>
          <p className="text-gray-600">Gerencie suas informações pessoais e preferências</p>
        </div>

        <div className={`rounded-lg shadow-sm border p-6 transition-colors duration-200 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {perfilData.foto}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{perfilData.nome}</h3>
                <p className="text-gray-600">{perfilData.cargo}</p>
                <p className="text-sm text-gray-500">{perfilData.empresa}</p>
              </div>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <Edit size={16} />
              {isEditing ? 'Salvar' : 'Editar Perfil'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
              {isEditing ? (
                <input
                  type="text"
                  value={perfilData.nome}
                  onChange={(e) => setPerfilData({...perfilData, nome: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900 py-2">{perfilData.nome}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
              {isEditing ? (
                <input
                  type="email"
                  value={perfilData.email}
                  onChange={(e) => setPerfilData({...perfilData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900 py-2">{perfilData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
              {isEditing ? (
                <input
                  type="text"
                  value={perfilData.telefone}
                  onChange={(e) => setPerfilData({...perfilData, telefone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900 py-2">{perfilData.telefone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
              {isEditing ? (
                <select
                  value={perfilData.cargo}
                  onChange={(e) => setPerfilData({...perfilData, cargo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Usuário">Usuário</option>
                </select>
              ) : (
                <p className="text-gray-900 py-2">{perfilData.cargo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
              <p className="text-gray-900 py-2">{perfilData.empresa}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data de Ingresso</label>
              <p className="text-gray-900 py-2">{perfilData.dataIngresso}</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Último Acesso</label>
              <p className="text-gray-900 py-2">{perfilData.ultimoAcesso}</p>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          )}
        </div>

        {/* Seção de Segurança */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Segurança</h3>
          <div className="space-y-4">
            <button className="w-full md:w-auto bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">
              Alterar Senha
            </button>
            <button className="w-full md:w-auto bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors ml-0 md:ml-2">
              Desativar Conta
            </button>
          </div>
        </div>
      </div>
    );
  };

  const MeuPlano = () => {
    const planos = [
      {
        nome: 'Básico',
        preco: 'Grátis',
        recursos: ['Até 100 produtos', 'Relatórios básicos', 'Suporte por email'],
        atual: false
      },
      {
        nome: 'Plus',
        preco: 'R$ 49,90/mês',
        recursos: ['Produtos ilimitados', 'Relatórios avançados', 'Suporte prioritário', 'Backup automático', 'Integração WhatsApp'],
        atual: true
      },
      {
        nome: 'Enterprise',
        preco: 'R$ 149,90/mês',
        recursos: ['Todos os recursos Plus', 'Múltiplas filiais', 'API personalizada', 'Suporte 24/7', 'Gerenciamento de usuários', 'Relatórios personalizados'],
        atual: false
      }
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Meu Plano</h2>
          <p className="text-gray-600">Gerencie sua assinatura e acesse recursos premium</p>
        </div>

        {/* Plano Atual */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Plano Atual: Plus 👑</h3>
              <p className="text-blue-100">Você tem acesso a recursos premium!</p>
              <p className="text-sm text-blue-200 mt-1">Renovação em: 23/02/2025</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">R$ 49,90</p>
              <p className="text-blue-200">por mês</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors">
              Gerenciar Assinatura
            </button>
            <button className="border border-blue-300 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              Baixar Fatura
            </button>
          </div>
        </div>

        {/* Comparação de Planos */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Comparar Planos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planos.map((plano, index) => (
              <div key={index} className={`rounded-lg border-2 p-6 ${
                plano.atual 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 bg-white'
              }`}>
                <div className="text-center mb-4">
                  {plano.atual && (
                    <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium mb-2">
                      Plano Atual
                    </span>
                  )}
                  <h4 className="text-xl font-semibold text-gray-800">{plano.nome}</h4>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{plano.preco}</p>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plano.recursos.map((recurso, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {recurso}
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-2 px-4 rounded font-medium transition-colors ${
                  plano.atual
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                  {plano.atual ? 'Plano Atual' : 'Escolher Plano'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Histórico de Faturas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Histórico de Faturas</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plano</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">23/01/2025</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Plus</td>
                  <td className="px-4 py-3 text-sm text-gray-900">R$ 49,90</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Pago</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Baixar PDF</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">23/12/2024</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Plus</td>
                  <td className="px-4 py-3 text-sm text-gray-900">R$ 49,90</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Pago</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Baixar PDF</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const Indicacoes = () => {
    const [indicacoes, setIndicacoes] = useStoredState('indicacoes', [
      { id: 1, nome: 'João Silva', email: 'joao@empresa.com', status: 'ativo', dataIndicacao: '15/01/2025', comissao: 'R$ 25,00' },
      { id: 2, nome: 'Maria Costa', email: 'maria@loja.com', status: 'pendente', dataIndicacao: '20/01/2025', comissao: 'R$ 0,00' }
    ]);
    const [emailIndicacao, setEmailIndicacao] = useState('');
    const [nomeIndicacao, setNomeIndicacao] = useState('');

    const enviarIndicacao = () => {
      if (!emailIndicacao || !nomeIndicacao) {
        alert('Preencha todos os campos!');
        return;
      }

      const novaIndicacao = {
        id: Date.now(),
        nome: nomeIndicacao,
        email: emailIndicacao,
        status: 'pendente',
        dataIndicacao: new Date().toLocaleDateString('pt-BR'),
        comissao: 'R$ 0,00'
      };

      setIndicacoes(prev => [...prev, novaIndicacao]);
      setEmailIndicacao('');
      setNomeIndicacao('');
      alert('Indicação enviada com sucesso!');
    };

    const totalComissoes = indicacoes
      .filter(i => i.status === 'ativo')
      .reduce((total, i) => total + parseFloat(i.comissao.replace('R$ ', '').replace(',', '.')), 0);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Programa de Indicações</h2>
          <p className="text-gray-600">Indique amigos e ganhe comissões por cada assinatura</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Indicações</p>
                <p className="text-2xl font-bold text-gray-900">{indicacoes.length}</p>
              </div>
              <Users className="text-blue-600" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Indicações Ativas</p>
                <p className="text-2xl font-bold text-green-600">{indicacoes.filter(i => i.status === 'ativo').length}</p>
              </div>
              <Building2 className="text-green-600" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{indicacoes.filter(i => i.status === 'pendente').length}</p>
              </div>
              <Calendar className="text-yellow-600" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Comissões Totais</p>
                <p className="text-2xl font-bold text-purple-600">R$ {totalComissoes.toFixed(2)}</p>
              </div>
              <DollarSign className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        {/* Como Funciona */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Como Funciona o Programa de Indicações? 🎯</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl font-bold">1</span>
              </div>
              <p className="font-medium">Indique um amigo</p>
              <p className="text-sm text-green-100">Envie um convite por email</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl font-bold">2</span>
              </div>
              <p className="font-medium">Ele assina o Orion</p>
              <p className="text-sm text-green-100">Qualquer plano pago</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl font-bold">3</span>
              </div>
              <p className="font-medium">Você ganha R$ 25</p>
              <p className="text-sm text-green-100">Para cada indicação ativa</p>
            </div>
          </div>
        </div>

        {/* Formulário de Indicação */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Fazer Nova Indicação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Indicado</label>
              <input
                type="text"
                value={nomeIndicacao}
                onChange={(e) => setNomeIndicacao(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail do Indicado</label>
              <input
                type="email"
                value={emailIndicacao}
                onChange={(e) => setEmailIndicacao(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="email@empresa.com"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={enviarIndicacao}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Enviar Indicação
            </button>
          </div>
        </div>

        {/* Lista de Indicações */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Suas Indicações</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comissão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {indicacoes.map((indicacao) => (
                  <tr key={indicacao.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{indicacao.nome}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{indicacao.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{indicacao.dataIndicacao}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        indicacao.status === 'ativo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {indicacao.status === 'ativo' ? 'Ativo' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{indicacao.comissao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const Dashboard = () => {
    const totalProdutos = produtos.length;
    const estoqueAtual = estoque[selectedDate] || {};
    const produtosCriticos = produtos.filter(p => {
      const quantidade = estoqueAtual[p.id] || 0;
      return quantidade < p.estoqueIdeal * 0.3;
    }).length;

    // Dados simulados para gráficos
    const vendasSemanais = [
      { dia: 'Seg', vendas: 150, pedidos: 8 },
      { dia: 'Ter', vendas: 230, pedidos: 12 },
      { dia: 'Qua', vendas: 180, pedidos: 9 },
      { dia: 'Qui', vendas: 320, pedidos: 15 },
      { dia: 'Sex', vendas: 280, pedidos: 14 },
      { dia: 'Sáb', vendas: 420, pedidos: 18 },
      { dia: 'Dom', vendas: 350, pedidos: 16 }
    ];

    const produtosMaisVendidos = [
      { nome: 'Tomate', quantidade: 45, cor: '#ef4444' },
      { nome: 'Arroz', quantidade: 38, cor: '#3b82f6' },
      { nome: 'Frango', quantidade: 32, cor: '#10b981' },
      { nome: 'Cebola', quantidade: 28, cor: '#f59e0b' },
      { nome: 'Óleo', quantidade: 25, cor: '#8b5cf6' }
    ];

    const fornecedoresTop = [
      { nome: 'Hortifruti Silva', pedidos: 12, valor: 2850.50, crescimento: '+15%' },
      { nome: 'Distribuidora Grãos', pedidos: 8, valor: 1920.30, crescimento: '+8%' },
      { nome: 'Açougue Central', pedidos: 6, valor: 1450.75, crescimento: '+22%' }
    ];

    const custoMensal = 8450.50;
    const economiaEstimada = 320.75;
    const mediaCompras = 15;

    return (
      <div className="space-y-6">
        {/* Header com data e período */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h2>
            <p className="text-gray-600">Visão geral do sistema de gestão de compras</p>
          </div>
          <div className="flex items-center gap-4">
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
              <option>Últimos 90 dias</option>
            </select>
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
              {new Date().toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>

        {/* Cards de Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total de Produtos</p>
                <p className="text-3xl font-bold">{totalProdutos}</p>
                <p className="text-xs text-blue-100 mt-1">+3 este mês</p>
              </div>
              <Package className="text-blue-200" size={32} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Produtos Críticos</p>
                <p className="text-3xl font-bold">{produtosCriticos}</p>
                <p className="text-xs text-red-100 mt-1">Atenção necessária</p>
              </div>
              <Bell className="text-red-200" size={32} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Pedidos Mês</p>
                <p className="text-3xl font-bold">{Object.keys(pedidos).length}</p>
                <p className="text-xs text-green-100 mt-1">+12% vs mês anterior</p>
              </div>
              <ShoppingCart className="text-green-200" size={32} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Fornecedores</p>
                <p className="text-3xl font-bold">{fornecedores.length}</p>
                <p className="text-xs text-purple-100 mt-1">Ativos</p>
              </div>
              <Building2 className="text-purple-200" size={32} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Custo Mensal</p>
                <p className="text-3xl font-bold">R$ {custoMensal.toLocaleString('pt-BR')}</p>
                <p className="text-xs text-orange-100 mt-1">-5% vs mês anterior</p>
              </div>
              <DollarSign className="text-orange-200" size={32} />
            </div>
          </div>
        </div>

        {/* Gráficos e Dados */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico de Vendas Semanais */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Tendência de Compras</h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Valor (R$)
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Pedidos
                </span>
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between space-x-2">
              {vendasSemanais.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full max-w-8 flex flex-col items-center space-y-1">
                    {/* Barra de Vendas */}
                    <div 
                      className="w-6 bg-blue-500 rounded-t"
                      style={{ height: `${(item.vendas / 420) * 200}px` }}
                    ></div>
                    {/* Barra de Pedidos */}
                    <div 
                      className="w-4 bg-green-500 rounded-t"
                      style={{ height: `${(item.pedidos / 18) * 100}px` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">{item.dia}</span>
                  <span className="text-xs text-gray-500">R$ {item.vendas}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Produtos Mais Comprados */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Produtos Mais Comprados</h3>
            <div className="space-y-4">
              {produtosMaisVendidos.map((produto, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: produto.cor }}
                    ></div>
                    <span className="text-sm font-medium text-gray-900">{produto.nome}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{produto.quantidade}</span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          backgroundColor: produto.cor,
                          width: `${(produto.quantidade / 45) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cards de Métricas Secundárias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-600">Economia Estimada</h4>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="text-green-600" size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">R$ {economiaEstimada.toFixed(2)}</p>
            <p className="text-sm text-green-600 mt-1">+15% este mês</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-600">Média de Compras</h4>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="text-blue-600" size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{mediaCompras}</p>
            <p className="text-sm text-blue-600 mt-1">por semana</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-600">Eficiência</h4>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Archive className="text-purple-600" size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">94%</p>
            <p className="text-sm text-purple-600 mt-1">do estoque otimizado</p>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-200 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Clicou em Atualizar Estoque');
                setCurrentSection('estoque');
              }}
              className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-200 border cursor-pointer select-none ${
                isDarkMode
                  ? 'bg-gradient-to-r from-blue-900/50 to-blue-800/50 hover:from-blue-800/60 hover:to-blue-700/60 border-blue-700'
                  : 'bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200'
              }`}
              role="button"
              tabIndex={0}
            >
              <Package className="text-blue-600" size={20} />
              <span className={`font-medium transition-colors duration-200 ${
                isDarkMode ? 'text-blue-200' : 'text-blue-900'
              }`}>Atualizar Estoque</span>
            </div>
            
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Clicou em Gerar Pedido');
                setCurrentSection('pedido');
              }}
              className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-200 border cursor-pointer select-none ${
                isDarkMode
                  ? 'bg-gradient-to-r from-green-900/50 to-green-800/50 hover:from-green-800/60 hover:to-green-700/60 border-green-700'
                  : 'bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200'
              }`}
              role="button"
              tabIndex={0}
            >
              <ShoppingCart className="text-green-600" size={20} />
              <span className={`font-medium transition-colors duration-200 ${
                isDarkMode ? 'text-green-200' : 'text-green-900'
              }`}>Gerar Pedido</span>
            </div>
            
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Clicou em Adicionar Produto');
                setShowProductModal(true);
                setEditingProduct(null);
              }}
              className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-200 border cursor-pointer select-none ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-900/50 to-purple-800/50 hover:from-purple-800/60 hover:to-purple-700/60 border-purple-700'
                  : 'bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200'
              }`}
              role="button"
              tabIndex={0}
            >
              <PlusCircle className="text-purple-600" size={20} />
              <span className={`font-medium transition-colors duration-200 ${
                isDarkMode ? 'text-purple-200' : 'text-purple-900'
              }`}>Adicionar Produto</span>
            </div>

            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Clicou em Gerenciar Fornecedores');
                setCurrentSection('gerenciar-fornecedores');
              }}
              className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-200 border cursor-pointer select-none ${
                isDarkMode
                  ? 'bg-gradient-to-r from-orange-900/50 to-orange-800/50 hover:from-orange-800/60 hover:to-orange-700/60 border-orange-700'
                  : 'bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border-orange-200'
              }`}
              role="button"
              tabIndex={0}
            >
              <Truck className="text-orange-600" size={20} />
              <span className={`font-medium transition-colors duration-200 ${
                isDarkMode ? 'text-orange-200' : 'text-orange-900'
              }`}>Gerenciar Fornecedores</span>
            </div>
          </div>
        </div>

        {/* Top Fornecedores e Produtos com Estoque Baixo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Fornecedores */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Fornecedores</h3>
            <div className="space-y-4">
              {fornecedoresTop.map((fornecedor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{fornecedor.nome}</p>
                    <p className="text-sm text-gray-600">{fornecedor.pedidos} pedidos</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">R$ {fornecedor.valor.toLocaleString('pt-BR')}</p>
                    <p className="text-sm text-green-600">{fornecedor.crescimento}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lista de Produtos com Estoque Baixo */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Produtos com Estoque Baixo</h3>
              <span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded-full">
                {produtosCriticos} críticos
              </span>
            </div>
            <div className="space-y-3">
              {produtos.slice(0, 5).map(produto => {
                const quantidade = estoqueAtual[produto.id] || 0;
                const isLow = quantidade < produto.estoqueIdeal * 0.5;
                const isCritical = quantidade < produto.estoqueIdeal * 0.3;
                const porcentagem = (quantidade / produto.estoqueIdeal) * 100;
                
                return (
                  <div key={produto.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-900">{produto.nome}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isCritical ? 'bg-red-100 text-red-800' : 
                          isLow ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {isCritical ? 'Crítico' : isLow ? 'Baixo' : 'OK'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${
                              isCritical ? 'bg-red-500' : 
                              isLow ? 'bg-yellow-500' : 
                              'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(porcentagem, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {quantidade}/{produto.estoqueIdeal} {produto.unidade}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button 
              onClick={() => setCurrentSection('estoque')}
              className="w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver todos os produtos →
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ListaProdutos = () => {
    const filteredProducts = produtos.filter(produto => 
      !filterFornecedor || produto.fornecedor === filterFornecedor
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Lista de Produtos</h2>
            <p className="text-gray-600">Gerencie todos os produtos do restaurante</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filterFornecedor}
              onChange={(e) => setFilterFornecedor(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os fornecedores</option>
              {[...new Set(produtos.map(p => p.fornecedor))].map(fornecedor => (
                <option key={fornecedor} value={fornecedor}>{fornecedor}</option>
              ))}
            </select>
            <button
              onClick={handleImportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              <Upload size={16} />
              Importar Excel
            </button>
            <button
              onClick={() => setShowProductModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <PlusCircle size={16} />
              Adicionar Produto
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome do Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fornecedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço Estimado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque Ideal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((produto) => (
                  <tr key={produto.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {produto.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {produto.unidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {produto.fornecedor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      R$ {produto.preco.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {produto.estoqueIdeal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(produto);
                            setShowProductModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(produto.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const EstoqueAtual = () => {
    const [estoqueAtual, setEstoqueAtual] = useState(estoque[selectedDate] || {});

    const handleSaveEstoque = () => {
      setEstoque(prev => ({
        ...prev,
        [selectedDate]: estoqueAtual
      }));
      alert('Estoque salvo com sucesso!');
    };

    const handleQuantityChange = (produtoId, quantity) => {
      setEstoqueAtual(prev => ({
        ...prev,
        [produtoId]: parseInt(quantity) || 0
      }));
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Estoque Atual</h2>
            <p className="text-gray-600">Controle de estoque diário</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setEstoqueAtual(estoque[e.target.value] || {});
                }}
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleSaveEstoque}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              <Package size={16} />
              Salvar Estoque
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque Ideal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade Atual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {produtos.map((produto) => {
                  const quantidade = estoqueAtual[produto.id] || 0;
                  const isLow = quantidade < produto.estoqueIdeal * 0.3;
                  const isMinimum = quantidade < produto.estoqueIdeal * 0.5;
                  
                  return (
                    <tr key={produto.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {produto.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {produto.unidade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {produto.estoqueIdeal}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={quantidade}
                          onChange={(e) => handleQuantityChange(produto.id, e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isLow ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <Bell size={12} className="mr-1" />
                            Crítico
                          </span>
                        ) : isMinimum ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Baixo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            OK
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const Pedido = () => {
    const [pedidoAtual, setPedidoAtual] = useState({});
    const estoqueAtual = estoque[selectedDate] || {};

    const calcularNecessidade = (produto) => {
      const atual = estoqueAtual[produto.id] || 0;
      const ideal = produto.estoqueIdeal || 0;
      return Math.max(0, ideal - atual);
    };

    const handlePedidoChange = (produtoId, quantidade) => {
      setPedidoAtual(prev => ({
        ...prev,
        [produtoId]: parseInt(quantidade) || 0
      }));
    };

    const gerarPedido = () => {
      const pedidoComData = {
        data: selectedDate,
        produtos: pedidoAtual,
        timestamp: new Date().toISOString()
      };
      
      setPedidos(prev => ({
        ...prev,
        [Date.now()]: pedidoComData
      }));
      
      setCurrentSection('enviar');
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Geração de Pedido</h2>
            <p className="text-gray-600">Compare estoque atual com ideal e gere pedidos</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">Data: {selectedDate}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque Atual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque Ideal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sugestão
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade a Pedir
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fornecedor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {produtos.map((produto) => {
                  const atual = estoqueAtual[produto.id] || 0;
                  const necessidade = calcularNecessidade(produto);
                  const pedido = pedidoAtual[produto.id] || necessidade;
                  
                  return (
                    <tr key={produto.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {produto.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {atual} {produto.unidade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {produto.estoqueIdeal} {produto.unidade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className={necessidade > 0 ? 'text-orange-600 font-medium' : 'text-gray-400'}>
                          {necessidade} {produto.unidade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={pedido}
                          onChange={(e) => handlePedidoChange(produto.id, e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {produto.fornecedor}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={gerarPedido}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <ShoppingCart size={16} />
            Gerar Pedido
          </button>
        </div>
      </div>
    );
  };

  const EnviarFornecedor = () => {
    const ultimoPedido = Object.values(pedidos).sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    )[0];

    if (!ultimoPedido) {
      return (
        <div className="text-center py-12">
          <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Nenhum pedido gerado ainda.</p>
        </div>
      );
    }

    const pedidosPorFornecedor = {};
    
    Object.entries(ultimoPedido.produtos).forEach(([produtoId, quantidade]) => {
      if (quantidade > 0) {
        const produto = produtos.find(p => p.id === parseInt(produtoId));
        if (produto) {
          if (!pedidosPorFornecedor[produto.fornecedor]) {
            pedidosPorFornecedor[produto.fornecedor] = [];
          }
          pedidosPorFornecedor[produto.fornecedor].push({
            nome: produto.nome,
            quantidade: quantidade,
            unidade: produto.unidade
          });
        }
      }
    });

    const enviarWhatsApp = (fornecedor, itens) => {
      const fornecedorData = fornecedores.find(f => f.nome === fornecedor);
      const telefone = fornecedorData?.telefone || '';
      
      const mensagem = `Olá, ${fornecedor}, segue pedido do Orion:\n\n${
        itens.map(item => `- ${item.nome}: ${item.quantidade} ${item.unidade}`).join('\n')
      }\n\nPara entrega amanhã cedo.\nObrigado!`;
      
      const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, '_blank');
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Enviar para Fornecedor</h2>
            <p className="text-gray-600">Pedido de {ultimoPedido.data}</p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(pedidosPorFornecedor).map(([fornecedor, itens]) => (
            <div key={fornecedor} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{fornecedor}</h3>
                  <p className="text-sm text-gray-600">
                    {fornecedores.find(f => f.nome === fornecedor)?.especialidade}
                  </p>
                </div>
                <button
                  onClick={() => enviarWhatsApp(fornecedor, itens)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  <Send size={16} />
                  Enviar WhatsApp
                </button>
              </div>

              <div className="space-y-2">
                {itens.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm text-gray-900 font-medium">{item.nome}</span>
                    <span className="text-sm text-gray-600">{item.quantidade} {item.unidade}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // COMPONENTES PARA VENDAS
  const VendasGerenciar = () => {
    const [vendas, setVendas] = useStoredState('vendas', [
      { id: 1, data: '2025-01-23', cliente: 'Mesa 01', total: 85.50, status: 'finalizada', items: ['Frango grelhado', 'Arroz', 'Feijão'] },
      { id: 2, data: '2025-01-23', cliente: 'Mesa 05', total: 142.30, status: 'finalizada', items: ['Picanha', 'Batata frita', 'Salada'] },
      { id: 3, data: '2025-01-23', cliente: 'Balcão', total: 32.80, status: 'pendente', items: ['Hambúrguer', 'Refrigerante'] }
    ]);

    const totalVendas = vendas.reduce((sum, venda) => sum + venda.total, 0);
    const vendasHoje = vendas.filter(v => v.data === new Date().toISOString().split('T')[0]);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gerenciar Vendas</h2>
          <p className="text-gray-600">Controle todas as vendas do restaurante</p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vendas</p>
                <p className="text-2xl font-bold text-gray-900">R$ {totalVendas.toFixed(2)}</p>
              </div>
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vendas Hoje</p>
                <p className="text-2xl font-bold text-gray-900">{vendasHoje.length}</p>
              </div>
              <ShoppingCart className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold text-gray-900">R$ {(totalVendas / vendas.length).toFixed(2)}</p>
              </div>
              <BarChart3 className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{vendas.filter(v => v.status === 'pendente').length}</p>
              </div>
              <Bell className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        {/* Lista de Vendas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Vendas Recentes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vendas.map((venda) => (
                  <tr key={venda.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(venda.data).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{venda.cliente}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{venda.items.join(', ')}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">R$ {venda.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        venda.status === 'finalizada' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {venda.status === 'finalizada' ? 'Finalizada' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">Ver</button>
                      <button className="text-green-600 hover:text-green-800">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const VendasRelatorios = () => {
    const vendas = [
      { mes: 'Jan', valor: 15420.50 },
      { mes: 'Fev', valor: 18320.30 },
      { mes: 'Mar', valor: 22150.80 },
      { mes: 'Abr', valor: 19850.20 },
      { mes: 'Mai', valor: 25680.40 }
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Relatórios de Vendas</h2>
          <p className="text-gray-600">Análise detalhada do desempenho de vendas</p>
        </div>

        {/* Gráfico de Vendas Mensais */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Vendas por Mês</h3>
          <div className="h-64 flex items-end justify-between space-x-4">
            {vendas.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                  style={{ height: `${(item.valor / 25680.40) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{item.mes}</span>
                <span className="text-xs text-gray-500">R$ {item.valor.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Relatórios Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Produtos</h3>
            <div className="space-y-3">
              {['Frango Grelhado', 'Picanha', 'Hambúrguer', 'Peixe Assado'].map((produto, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-900">{produto}</span>
                  <span className="text-sm font-medium text-gray-600">{25 - index * 3} vendas</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Crescimento</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Este mês</span>
                <span className="text-sm font-medium text-green-600">+15.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Última semana</span>
                <span className="text-sm font-medium text-green-600">+8.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ontem</span>
                <span className="text-sm font-medium text-blue-600">R$ 1.234,50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // COMPONENTES PARA FINANCEIRO
  const FinanceiroFluxoCaixa = () => {
    const [transacoes, setTransacoes] = useStoredState('transacoes', [
      { id: 1, data: '2025-01-23', descricao: 'Venda Mesa 01', tipo: 'entrada', valor: 85.50, categoria: 'Vendas' },
      { id: 2, data: '2025-01-23', descricao: 'Compra Ingredientes', tipo: 'saida', valor: 320.80, categoria: 'Compras' },
      { id: 3, data: '2025-01-22', descricao: 'Venda Balcão', tipo: 'entrada', valor: 142.30, categoria: 'Vendas' },
      { id: 4, data: '2025-01-22', descricao: 'Pagamento Fornecedor', tipo: 'saida', valor: 850.00, categoria: 'Fornecedores' }
    ]);

    const totalEntradas = transacoes.filter(t => t.tipo === 'entrada').reduce((sum, t) => sum + t.valor, 0);
    const totalSaidas = transacoes.filter(t => t.tipo === 'saida').reduce((sum, t) => sum + t.valor, 0);
    const saldo = totalEntradas - totalSaidas;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Fluxo de Caixa</h2>
          <p className="text-gray-600">Controle de entradas e saídas financeiras</p>
        </div>

        {/* Cards Financeiros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Entradas</p>
                <p className="text-2xl font-bold">R$ {totalEntradas.toFixed(2)}</p>
              </div>
              <DollarSign className="text-green-200" size={24} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Total Saídas</p>
                <p className="text-2xl font-bold">R$ {totalSaidas.toFixed(2)}</p>
              </div>
              <DollarSign className="text-red-200" size={24} />
            </div>
          </div>

          <div className={`bg-gradient-to-br ${saldo >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} text-white rounded-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${saldo >= 0 ? 'text-blue-100' : 'text-orange-100'} text-sm`}>Saldo Atual</p>
                <p className="text-2xl font-bold">R$ {saldo.toFixed(2)}</p>
              </div>
              <BarChart3 className={`${saldo >= 0 ? 'text-blue-200' : 'text-orange-200'}`} size={24} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Transações</p>
                <p className="text-2xl font-bold">{transacoes.length}</p>
              </div>
              <Package className="text-purple-200" size={24} />
            </div>
          </div>
        </div>

        {/* Lista de Transações */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Transações Recentes</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              Nova Transação
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transacoes.map((transacao) => (
                  <tr key={transacao.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(transacao.data).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{transacao.descricao}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{transacao.categoria}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        transacao.tipo === 'entrada' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transacao.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      R$ {transacao.valor.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const FinanceiroContas = () => {
    const [contas, setContas] = useStoredState('contas', [
      { id: 1, descricao: 'Energia Elétrica', vencimento: '2025-01-28', valor: 450.80, status: 'pendente', categoria: 'Utilidades' },
      { id: 2, descricao: 'Água', vencimento: '2025-01-25', valor: 180.50, status: 'pago', categoria: 'Utilidades' },
      { id: 3, descricao: 'Aluguel', vencimento: '2025-02-01', valor: 2500.00, status: 'pendente', categoria: 'Aluguel' },
      { id: 4, descricao: 'Internet', vencimento: '2025-01-30', valor: 120.00, status: 'pago', categoria: 'Comunicação' }
    ]);

    const contasPendentes = contas.filter(c => c.status === 'pendente');
    const totalPendente = contasPendentes.reduce((sum, c) => sum + c.valor, 0);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Contas a Pagar</h2>
          <p className="text-gray-600">Gestão de contas e pagamentos</p>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contas Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{contasPendentes.length}</p>
              </div>
              <Bell className="text-orange-600" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total a Pagar</p>
                <p className="text-2xl font-bold text-red-600">R$ {totalPendente.toFixed(2)}</p>
              </div>
              <DollarSign className="text-red-600" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contas Pagas</p>
                <p className="text-2xl font-bold text-green-600">{contas.filter(c => c.status === 'pago').length}</p>
              </div>
              <Package className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Lista de Contas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Todas as Contas</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              Nova Conta
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contas.map((conta) => (
                  <tr key={conta.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{conta.descricao}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{conta.categoria}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(conta.vencimento).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">R$ {conta.valor.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        conta.status === 'pago' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {conta.status === 'pago' ? 'Pago' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {conta.status === 'pendente' ? (
                        <button className="text-green-600 hover:text-green-800 mr-2">Pagar</button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                      <button className="text-blue-600 hover:text-blue-800">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // COMPONENTES PARA UTILITÁRIOS
  const UtilitariosBackup = () => {
    const [backups, setBackups] = useStoredState('backups', [
      { id: 1, data: '2025-01-23 08:00', tipo: 'Automático', tamanho: '2.3 MB', status: 'sucesso' },
      { id: 2, data: '2025-01-22 08:00', tipo: 'Automático', tamanho: '2.1 MB', status: 'sucesso' },
      { id: 3, data: '2025-01-21 08:00', tipo: 'Manual', tamanho: '2.2 MB', status: 'sucesso' }
    ]);

    const fazerBackup = () => {
      const novoBackup = {
        id: Date.now(),
        data: new Date().toLocaleString('pt-BR'),
        tipo: 'Manual',
        tamanho: '2.4 MB',
        status: 'sucesso'
      };
      setBackups(prev => [novoBackup, ...prev]);
      alert('Backup realizado com sucesso!');
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Backup & Restauração</h2>
          <p className="text-gray-600">Gerencie backups dos seus dados</p>
        </div>

        {/* Ações de Backup */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={fazerBackup}
              className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Archive className="text-blue-600" size={20} />
              <span className="text-blue-900 font-medium">Fazer Backup Agora</span>
            </button>
            
            <button className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <Upload className="text-green-600" size={20} />
              <span className="text-green-900 font-medium">Restaurar Backup</span>
            </button>
            
            <button className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Settings className="text-purple-600" size={20} />
              <span className="text-purple-900 font-medium">Configurar Automático</span>
            </button>
          </div>
        </div>

        {/* Lista de Backups */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Histórico de Backups</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tamanho</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {backups.map((backup) => (
                  <tr key={backup.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{backup.data}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{backup.tipo}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{backup.tamanho}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-800">
                        {backup.status === 'sucesso' ? 'Sucesso' : 'Erro'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">Download</button>
                      <button className="text-green-600 hover:text-green-800">Restaurar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const UtilitariosConfiguracoes = () => {
    const [configuracoes, setConfiguracoes] = useStoredState('configuracoes', {
      empresa: {
        nome: 'Orion Restaurante',
        cnpj: '12.345.678/0001-90',
        endereco: 'Rua das Flores, 123',
        telefone: '(11) 99999-9999',
        email: 'contato@orion.com'
      },
      sistema: {
        backup_automatico: true,
        notificacoes_email: true,
        modo_escuro: isDarkMode,
        idioma: 'pt-BR'
      }
    });

    const [aba, setAba] = useState('empresa');

    const salvarConfiguracoes = () => {
      alert('Configurações salvas com sucesso!');
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Configurações</h2>
          <p className="text-gray-600">Personalize o sistema conforme suas necessidades</p>
        </div>

        {/* Abas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setAba('empresa')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  aba === 'empresa'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Empresa
              </button>
              <button
                onClick={() => setAba('sistema')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  aba === 'sistema'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Sistema
              </button>
            </nav>
          </div>

          <div className="p-6">
            {aba === 'empresa' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Informações da Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa</label>
                    <input
                      type="text"
                      value={configuracoes.empresa.nome}
                      onChange={(e) => setConfiguracoes(prev => ({
                        ...prev,
                        empresa: { ...prev.empresa, nome: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
                    <input
                      type="text"
                      value={configuracoes.empresa.cnpj}
                      onChange={(e) => setConfiguracoes(prev => ({
                        ...prev,
                        empresa: { ...prev.empresa, cnpj: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                    <input
                      type="text"
                      value={configuracoes.empresa.endereco}
                      onChange={(e) => setConfiguracoes(prev => ({
                        ...prev,
                        empresa: { ...prev.empresa, endereco: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                    <input
                      type="text"
                      value={configuracoes.empresa.telefone}
                      onChange={(e) => setConfiguracoes(prev => ({
                        ...prev,
                        empresa: { ...prev.empresa, telefone: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {aba === 'sistema' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Configurações do Sistema</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Backup Automático</p>
                      <p className="text-sm text-gray-600">Realizar backup diário automaticamente</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={configuracoes.sistema.backup_automatico}
                      onChange={(e) => setConfiguracoes(prev => ({
                        ...prev,
                        sistema: { ...prev.sistema, backup_automatico: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Notificações por Email</p>
                      <p className="text-sm text-gray-600">Receber alertas importantes por email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={configuracoes.sistema.notificacoes_email}
                      onChange={(e) => setConfiguracoes(prev => ({
                        ...prev,
                        sistema: { ...prev.sistema, notificacoes_email: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Modo Escuro</p>
                      <p className="text-sm text-gray-600">Ativar tema escuro para toda a interface</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={isDarkMode}
                      onChange={(e) => {
                        setIsDarkMode(e.target.checked);
                        setConfiguracoes(prev => ({
                          ...prev,
                          sistema: { ...prev.sistema, modo_escuro: e.target.checked }
                        }));
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={salvarConfiguracoes}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // COMPONENTES FUNCIONAIS PARA EMPRESA
  const EmpresaFiliais = () => {
    const [filiais, setFiliais] = useStoredState('filiais', [
      { id: 1, nome: 'Filial Centro', endereco: 'R. das Palmeiras, 123', telefone: '(11) 3333-4444', status: 'ativa', gerente: 'Carlos Silva' },
      { id: 2, nome: 'Filial Shopping', endereco: 'Av. Paulista, 456', telefone: '(11) 5555-6666', status: 'ativa', gerente: 'Ana Costa' },
      { id: 3, nome: 'Filial Norte', endereco: 'R. das Flores, 789', telefone: '(11) 7777-8888', status: 'inativa', gerente: 'João Santos' }
    ]);
    const [showModal, setShowModal] = useState(false);
    const [editingFilial, setEditingFilial] = useState(null);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Filiais</h2>
            <p className="text-gray-600">Gerencie todas as filiais da empresa</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PlusCircle size={16} />
            Nova Filial
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Filiais</p>
                <p className="text-2xl font-bold text-gray-900">{filiais.length}</p>
              </div>
              <Building2 className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Filiais Ativas</p>
                <p className="text-2xl font-bold text-green-600">{filiais.filter(f => f.status === 'ativa').length}</p>
              </div>
              <Package className="text-green-600" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Filiais Inativas</p>
                <p className="text-2xl font-bold text-red-600">{filiais.filter(f => f.status === 'inativa').length}</p>
              </div>
              <Bell className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endereço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gerente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filiais.map((filial) => (
                  <tr key={filial.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{filial.nome}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{filial.endereco}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{filial.telefone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{filial.gerente}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        filial.status === 'ativa' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {filial.status === 'ativa' ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const EmpresaColaboradores = () => {
    const [colaboradores, setColaboradores] = useStoredState('colaboradores', [
      { id: 1, nome: 'Carlos Silva', cargo: 'Gerente', email: 'carlos@orion.com', telefone: '(11) 99999-0001', status: 'ativo', salario: 5500.00 },
      { id: 2, nome: 'Ana Costa', cargo: 'Supervisora', email: 'ana@orion.com', telefone: '(11) 99999-0002', status: 'ativo', salario: 4200.00 },
      { id: 3, nome: 'João Santos', cargo: 'Cozinheiro', email: 'joao@orion.com', telefone: '(11) 99999-0003', status: 'ativo', salario: 2800.00 },
      { id: 4, nome: 'Maria Silva', cargo: 'Garçonete', email: 'maria@orion.com', telefone: '(11) 99999-0004', status: 'inativo', salario: 2200.00 }
    ]);

    const totalColaboradores = colaboradores.length;
    const colaboradoresAtivos = colaboradores.filter(c => c.status === 'ativo').length;
    const folhaPagamento = colaboradores.filter(c => c.status === 'ativo').reduce((total, c) => total + c.salario, 0);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Colaboradores</h2>
            <p className="text-gray-600">Gerencie equipe e recursos humanos</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2">
            <PlusCircle size={16} />
            Novo Colaborador
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalColaboradores}</p>
              </div>
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-green-600">{colaboradoresAtivos}</p>
              </div>
              <Package className="text-green-600" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inativos</p>
                <p className="text-2xl font-bold text-red-600">{totalColaboradores - colaboradoresAtivos}</p>
              </div>
              <Bell className="text-red-600" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Folha Pagamento</p>
                <p className="text-2xl font-bold text-purple-600">R$ {folhaPagamento.toLocaleString('pt-BR')}</p>
              </div>
              <DollarSign className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cargo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salário</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {colaboradores.map((colaborador) => (
                  <tr key={colaborador.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{colaborador.nome}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{colaborador.cargo}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{colaborador.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{colaborador.telefone}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">R$ {colaborador.salario.toLocaleString('pt-BR')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        colaborador.status === 'ativo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {colaborador.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const EmpresaClientes = () => {
    const [clientes, setClientes] = useStoredState('clientes', [
      { id: 1, nome: 'João da Silva', email: 'joao@email.com', telefone: '(11) 99999-1111', categoria: 'VIP', ultimaVisita: '2025-01-23', totalGasto: 1250.80 },
      { id: 2, nome: 'Maria Santos', email: 'maria@email.com', telefone: '(11) 99999-2222', categoria: 'Premium', ultimaVisita: '2025-01-22', totalGasto: 890.50 },
      { id: 3, nome: 'Carlos Costa', email: 'carlos@email.com', telefone: '(11) 99999-3333', categoria: 'Regular', ultimaVisita: '2025-01-20', totalGasto: 450.30 },
      { id: 4, nome: 'Ana Oliveira', email: 'ana@email.com', telefone: '(11) 99999-4444', categoria: 'VIP', ultimaVisita: '2025-01-23', totalGasto: 2100.00 }
    ]);

    const clientesVIP = clientes.filter(c => c.categoria === 'VIP').length;
    const clientesTotais = clientes.length;
    const receitaTotal = clientes.reduce((total, c) => total + c.totalGasto, 0);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
            <p className="text-gray-600">Gerencie relacionamento com clientes</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2">
            <PlusCircle size={16} />
            Novo Cliente
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{clientesTotais}</p>
              </div>
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clientes VIP</p>
                <p className="text-2xl font-bold text-purple-600">{clientesVIP}</p>
              </div>
              <Star className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-green-600">R$ {receitaTotal.toLocaleString('pt-BR')}</p>
              </div>
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold text-orange-600">R$ {(receitaTotal / clientesTotais).toLocaleString('pt-BR')}</p>
              </div>
              <BarChart3 className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última Visita</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Gasto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{cliente.nome}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cliente.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cliente.telefone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        cliente.categoria === 'VIP' ? 'bg-purple-100 text-purple-800' :
                        cliente.categoria === 'Premium' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {cliente.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(cliente.ultimaVisita).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">R$ {cliente.totalGasto.toLocaleString('pt-BR')}</td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">
                        <Edit size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Send size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // COMPONENTES FUNCIONAIS PARA FORNECEDORES
  const FornecedoresGerenciar = () => {
    const [fornecedoresList, setFornecedoresList] = useStoredState('fornecedoresList', [
      { id: 1, nome: 'Hortifruti Silva', contato: 'Sr. Silva', telefone: '(11) 3333-1111', email: 'silva@hortifruti.com', categoria: 'Frutas e Verduras', status: 'ativo', rating: 4.8 },
      { id: 2, nome: 'Distribuidora Grãos', contato: 'Ana Costa', telefone: '(11) 4444-2222', email: 'ana@graos.com', categoria: 'Grãos e Cereais', status: 'ativo', rating: 4.5 },
      { id: 3, nome: 'Açougue Central', contato: 'João Carnes', telefone: '(11) 5555-3333', email: 'joao@acougue.com', categoria: 'Carnes', status: 'ativo', rating: 4.7 },
      { id: 4, nome: 'Laticínios Norte', contato: 'Maria Leite', telefone: '(11) 6666-4444', email: 'maria@laticinios.com', categoria: 'Laticínios', status: 'inativo', rating: 3.9 }
    ]);

    const fornecedoresAtivos = fornecedoresList.filter(f => f.status === 'ativo').length;
    const ratingMedio = fornecedoresList.reduce((sum, f) => sum + f.rating, 0) / fornecedoresList.length;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gerenciar Fornecedores</h2>
            <p className="text-gray-600">Controle completo de fornecedores e parcerias</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2">
            <PlusCircle size={16} />
            Novo Fornecedor
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{fornecedoresList.length}</p>
              </div>
              <Truck className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-green-600">{fornecedoresAtivos}</p>
              </div>
              <Package className="text-green-600" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rating Médio</p>
                <p className="text-2xl font-bold text-yellow-600">{ratingMedio.toFixed(1)}</p>
              </div>
              <Star className="text-yellow-600" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categorias</p>
                <p className="text-2xl font-bold text-purple-600">{[...new Set(fornecedoresList.map(f => f.categoria))].length}</p>
              </div>
              <Archive className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fornecedor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {fornecedoresList.map((fornecedor) => (
                  <tr key={fornecedor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{fornecedor.nome}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{fornecedor.contato}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{fornecedor.telefone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{fornecedor.categoria}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center">
                        <Star className="text-yellow-400 mr-1" size={14} fill="currentColor" />
                        <span className="font-medium">{fornecedor.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        fornecedor.status === 'ativo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {fornecedor.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">
                        <Edit size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-800 mr-2">
                        <Send size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      component: Dashboard
    },
    {
      id: 'empresa',
      label: 'Empresa',
      icon: Building2,
      hasSubmenu: true,
      submenu: [
        { id: 'filiais', label: 'Filiais', component: EmpresaFiliais },
        { id: 'colaboradores', label: 'Colaboradores', component: EmpresaColaboradores },
        { id: 'clientes', label: 'Clientes', component: EmpresaClientes },
        { id: 'fornecedores-empresa', label: 'Fornecedores', component: () => <div className="p-6"><h2 className="text-2xl font-bold text-gray-800">Fornecedores da Empresa</h2><p className="text-gray-600 mt-2">Funcionalidade em desenvolvimento...</p></div> },
        { id: 'produtos', label: 'Produtos', component: ListaProdutos }
      ]
    },
    {
      id: 'fornecedores',
      label: 'Fornecedores',
      icon: Truck,
      hasSubmenu: true,
      submenu: [
        { id: 'gerenciar-fornecedores', label: 'Gerenciar', component: FornecedoresGerenciar },
        { id: 'tipos-fornecedores', label: 'Tipos', component: () => <div className="p-6"><h2 className="text-2xl font-bold text-gray-800">Tipos de Fornecedores</h2><p className="text-gray-600 mt-2">Funcionalidade em desenvolvimento...</p></div> },
        { id: 'contratos-fornecedores', label: 'Contratos', component: () => <div className="p-6"><h2 className="text-2xl font-bold text-gray-800">Contratos</h2><p className="text-gray-600 mt-2">Funcionalidade em desenvolvimento...</p></div> }
      ]
    },
    {
      id: 'estoque',
      label: 'Estoque',
      icon: Archive,
      hasSubmenu: true,
      submenu: [
        { id: 'estoque', label: 'Estoque Atual', component: EstoqueAtual },
        { id: 'pedido', label: 'Pedidos', component: Pedido },
        { id: 'enviar', label: 'Enviar Fornecedor', component: EnviarFornecedor }
      ]
    },
    {
      id: 'vendas',
      label: 'Vendas',
      icon: DollarSign,
      hasSubmenu: true,
      submenu: [
        { id: 'vendas-gerenciar', label: 'Gerenciar Vendas', component: VendasGerenciar },
        { id: 'vendas-relatorios', label: 'Relatórios', component: VendasRelatorios },
        { id: 'vendas-metas', label: 'Metas', component: () => <div className="p-6"><h2 className="text-2xl font-bold text-gray-800">Metas de Vendas</h2><p className="text-gray-600 mt-2">Funcionalidade em desenvolvimento...</p></div> }
      ]
    },
    {
      id: 'financeiro',
      label: 'Financeiro',
      icon: BarChart3,
      hasSubmenu: true,
      submenu: [
        { id: 'financeiro-fluxo', label: 'Fluxo de Caixa', component: FinanceiroFluxoCaixa },
        { id: 'financeiro-contas', label: 'Contas a Pagar', component: FinanceiroContas },
        { id: 'financeiro-relatorios', label: 'Relatórios', component: () => <div className="p-6"><h2 className="text-2xl font-bold text-gray-800">Relatórios Financeiros</h2><p className="text-gray-600 mt-2">Funcionalidade em desenvolvimento...</p></div> }
      ]
    },
    {
      id: 'utilitarios',
      label: 'Utilitários',
      icon: Settings,
      hasSubmenu: true,
      submenu: [
        { id: 'utilitarios-backup', label: 'Backup', component: UtilitariosBackup },
        { id: 'utilitarios-config', label: 'Configurações', component: UtilitariosConfiguracoes },
        { id: 'utilitarios-logs', label: 'Logs do Sistema', component: () => <div className="p-6"><h2 className="text-2xl font-bold text-gray-800">Logs do Sistema</h2><p className="text-gray-600 mt-2">Funcionalidade em desenvolvimento...</p></div> }
      ]
    }
  ];

  const renderContent = () => {
    // Páginas do usuário
    if (currentSection === 'perfil') return <Perfil />;
    if (currentSection === 'meu-plano') return <MeuPlano />;
    if (currentSection === 'indicacoes') return <Indicacoes />;

    // Buscar em items de primeiro nível
    const mainItem = menuItems.find(item => item.id === currentSection);
    if (mainItem && mainItem.component) {
      return <mainItem.component />;
    }

    // Buscar em submenus
    for (const item of menuItems) {
      if (item.submenu) {
        const subItem = item.submenu.find(sub => sub.id === currentSection);
        if (subItem && subItem.component) {
          return <subItem.component />;
        }
      }
    }

    return <Dashboard />;
  };

  // Se não estiver logado, mostrar tela de login
  if (!isLoggedIn) {
    return <LoginScreen />;
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
            const hasActiveSubmenu = item.submenu?.some(sub => sub.id === currentSection);
            const isActive = item.id === currentSection || hasActiveSubmenu;

            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.hasSubmenu) {
                      toggleMenu(item.id);
                    } else {
                      setCurrentSection(item.id);
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
                        onClick={() => setCurrentSection(subItem.id)}
                        className={`w-full text-left p-2 pl-8 rounded text-sm transition-colors ${
                          currentSection === subItem.id
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
                {currentUser?.avatar || 'A'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{currentUser?.name || 'Anderson'}</p>
                <p className="text-xs text-gray-400">{currentUser?.role || 'Administrador'}</p>
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
                  Orion Gestor de Compras
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
                  {currentUser?.avatar || 'A'}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold transition-colors duration-200 ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>Bem vindo (a), {currentUser?.name || 'Anderson'}!</h3>
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

          {renderContent()}
        </main>
      </div>

      {/* Modals */}
      {showProductModal && (
        <ProductModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default OrionApp;