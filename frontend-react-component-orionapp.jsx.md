```javascript
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
              ? 'bg-gray-800 text-white hover:bg-gray-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
        >
          {isDarkMode ? (
            <>
              <span className="text-white">☀️</span>
              <span className="text-white">Claro</span>
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
                <p className="text-3xl font-bold">{forn

export default OrionApp;
```
