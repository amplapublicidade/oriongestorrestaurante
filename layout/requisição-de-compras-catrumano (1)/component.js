// <stdin>
import React, { useState, useEffect } from "https://esm.sh/react@18.2.0";
import {
  PlusCircle,
  Edit,
  Trash2,
  Upload,
  ShoppingCart,
  Send,
  Calendar,
  Package,
  Bell,
  Menu,
  X,
  Home,
  BarChart3,
  Building2,
  Archive,
  DollarSign,
  Settings,
  Users,
  ChevronDown,
  ChevronRight,
  Truck,
  HelpCircle,
  BookOpen,
  Star,
  ExternalLink
} from "https://esm.sh/lucide-react?deps=react@18.2.0,react-dom@18.2.0";
var { useStoredState } = hatch;
var OrionApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useStoredState("isLoggedIn", false);
  const [currentUser, setCurrentUser] = useStoredState("currentUser", null);
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [produtos, setProdutos] = useStoredState("produtos", []);
  const [estoque, setEstoque] = useStoredState("estoque", {});
  const [pedidos, setPedidos] = useStoredState("pedidos", {});
  const [fornecedores, setFornecedores] = useStoredState("fornecedores", []);
  const [isDarkMode, setIsDarkMode] = useStoredState("isDarkMode", false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedDate, setSelectedDate] = useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const [filterFornecedor, setFilterFornecedor] = useState("");
  const [showTopMenuDropdowns, setShowTopMenuDropdowns] = useState({
    novidades: false,
    ajuda: false,
    notificacoes: false,
    aprenda: false
  });
  const [expandedMenus, setExpandedMenus] = useState({
    empresa: false,
    fornecedores: false,
    estoque: false,
    vendas: false,
    financeiro: false,
    utilitarios: false
  });
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".top-menu-dropdown")) {
        setShowTopMenuDropdowns({
          novidades: false,
          ajuda: false,
          notificacoes: false,
          aprenda: false
        });
      }
      if (!event.target.closest(".user-dropdown")) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowUserDropdown]);
  useEffect(() => {
    if (produtos.length === 0) {
      const exemplosProdutos = [
        { id: 1, nome: "Tomate", unidade: "kg", fornecedor: "Hortifruti Silva", preco: 8.5, estoqueIdeal: 20 },
        { id: 2, nome: "Arroz", unidade: "kg", fornecedor: "Distribuidora Gr\xE3os", preco: 4.2, estoqueIdeal: 50 },
        { id: 3, nome: "Frango", unidade: "kg", fornecedor: "A\xE7ougue Central", preco: 12.8, estoqueIdeal: 30 },
        { id: 4, nome: "Cebola", unidade: "kg", fornecedor: "Hortifruti Silva", preco: 3.5, estoqueIdeal: 15 },
        { id: 5, nome: "\xD3leo", unidade: "L", fornecedor: "Distribuidora Gr\xE3os", preco: 6.9, estoqueIdeal: 10 }
      ];
      setProdutos(exemplosProdutos);
      const exemplosFornecedores = [
        { nome: "Hortifruti Silva", telefone: "5511999887766", especialidade: "Frutas e Verduras" },
        { nome: "Distribuidora Gr\xE3os", telefone: "5511888776655", especialidade: "Gr\xE3os e Cereais" },
        { nome: "A\xE7ougue Central", telefone: "5511777665544", especialidade: "Carnes" }
      ];
      setFornecedores(exemplosFornecedores);
    }
  }, [produtos, setProdutos, setFornecedores]);
  const toggleMenu = (menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };
  const toggleTopMenu = (menuKey) => {
    setShowTopMenuDropdowns((prev) => ({
      novidades: false,
      ajuda: false,
      notificacoes: false,
      aprenda: false,
      [menuKey]: !prev[menuKey]
    }));
  };
  const LoginScreen = () => {
    const [loginData, setLoginData] = useState({
      email: "",
      password: "",
      remember: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const handleLogin = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setTimeout(() => {
        if (loginData.email && loginData.password) {
          const userData = {
            id: 1,
            name: loginData.email.split("@")[0],
            email: loginData.email,
            role: "Administrador",
            avatar: loginData.email.charAt(0).toUpperCase()
          };
          setCurrentUser(userData);
          setIsLoggedIn(true);
        } else {
          alert("Por favor, preencha todos os campos");
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
            name: loginData.email.split("@")[0],
            email: loginData.email,
            role: "Usu\xE1rio",
            avatar: loginData.email.charAt(0).toUpperCase()
          };
          setCurrentUser(userData);
          setIsLoggedIn(true);
        } else {
          alert("Por favor, preencha todos os campos");
        }
        setIsLoading(false);
      }, 1500);
    };
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-md" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-8" }, /* @__PURE__ */ React.createElement("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4" }, /* @__PURE__ */ React.createElement(Package, { className: "text-white", size: 32 })), /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold text-white mb-2" }, "Orion"), /* @__PURE__ */ React.createElement("p", { className: "text-blue-200" }, "Gestor de Compras")), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-2xl shadow-2xl p-8" }, /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800 mb-2" }, showRegister ? "Criar Conta" : "Bem-vindo de volta"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, showRegister ? "Preencha os dados para criar sua conta" : "Entre com suas credenciais para acessar o sistema")), /* @__PURE__ */ React.createElement("form", { onSubmit: showRegister ? handleRegister : handleLogin, className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "E-mail"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "email",
        value: loginData.email,
        onChange: (e) => setLoginData({ ...loginData, email: e.target.value }),
        className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
        placeholder: "seu@email.com",
        required: true
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "Senha"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "password",
        value: loginData.password,
        onChange: (e) => setLoginData({ ...loginData, password: e.target.value }),
        className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
        placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
        required: true
      }
    )), !showRegister && /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("label", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        checked: loginData.remember,
        onChange: (e) => setLoginData({ ...loginData, remember: e.target.checked }),
        className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      }
    ), /* @__PURE__ */ React.createElement("span", { className: "ml-2 text-sm text-gray-600" }, "Lembrar de mim")), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "text-sm text-blue-600 hover:text-blue-800 transition-colors"
      },
      "Esqueceu a senha?"
    )), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "submit",
        disabled: isLoading,
        className: "w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      },
      isLoading ? /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" }), showRegister ? "Criando conta..." : "Entrando...") : showRegister ? "Criar Conta" : "Entrar"
    )), /* @__PURE__ */ React.createElement("div", { className: "my-8 flex items-center" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1 border-t border-gray-300" }), /* @__PURE__ */ React.createElement("span", { className: "px-4 text-sm text-gray-500" }, "ou"), /* @__PURE__ */ React.createElement("div", { className: "flex-1 border-t border-gray-300" })), /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, showRegister ? "J\xE1 tem uma conta?" : "N\xE3o tem uma conta?", /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => setShowRegister(!showRegister),
        className: "ml-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
      },
      showRegister ? "Fazer login" : "Criar conta"
    ))), /* @__PURE__ */ React.createElement("div", { className: "mt-6 p-4 bg-gray-50 rounded-lg" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-600 mb-2 font-medium" }, "Credenciais de demonstra\xE7\xE3o:"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500" }, "E-mail: admin@orion.com"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500" }, "Senha: 123456"))), /* @__PURE__ */ React.createElement("div", { className: "text-center mt-8" }, /* @__PURE__ */ React.createElement("p", { className: "text-blue-200 text-sm" }, "\xA9 2025 Orion Gestor de Compras. Todos os direitos reservados."))));
  };
  const UserDropdown = () => {
    const handleToggleDropdown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Toggle dropdown clicked", !showUserDropdown);
      setShowUserDropdown((prev) => !prev);
    };
    const handleMenuClick = (e, section) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Menu item clicked", section);
      setCurrentSection(section);
      setShowUserDropdown(false);
    };
    const handleLogout = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Logout clicked");
      setIsLoggedIn(false);
      setCurrentUser(null);
      setShowUserDropdown(false);
    };
    return /* @__PURE__ */ React.createElement("div", { className: "relative user-dropdown" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: handleToggleDropdown,
        className: `flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`
      },
      /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm" }, currentUser?.avatar || "A"), /* @__PURE__ */ React.createElement("div", { className: "text-left" }, /* @__PURE__ */ React.createElement("div", { className: `font-medium transition-colors duration-200 ${isDarkMode ? "text-white" : "text-gray-900"}` }, currentUser?.name || "Anderson"), /* @__PURE__ */ React.createElement("div", { className: `text-xs transition-colors duration-200 ${isDarkMode ? "text-gray-400" : "text-gray-500"}` }, currentUser?.email || "admin@orion.com"))),
      /* @__PURE__ */ React.createElement(ChevronDown, { size: 16, className: `text-gray-400 transition-transform ${showUserDropdown ? "rotate-180" : ""}` })
    ), showUserDropdown && /* @__PURE__ */ React.createElement(
      "div",
      {
        className: `absolute right-0 top-full mt-2 w-72 rounded-lg shadow-lg z-50 border transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"}`,
        onClick: (e) => e.stopPropagation()
      },
      /* @__PURE__ */ React.createElement("div", { className: `p-4 border-b transition-colors duration-200 ${isDarkMode ? "border-gray-700" : "border-gray-100"}` }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg" }, currentUser?.avatar || "A"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: `font-semibold transition-colors duration-200 ${isDarkMode ? "text-white" : "text-gray-900"}` }, currentUser?.name || "Anderson"), /* @__PURE__ */ React.createElement("div", { className: `text-sm transition-colors duration-200 ${isDarkMode ? "text-gray-400" : "text-gray-500"}` }, currentUser?.email || "admin@orion.com")))),
      /* @__PURE__ */ React.createElement("div", { className: "p-2" }, /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          onClick: (e) => handleMenuClick(e, "perfil"),
          className: `w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`
        },
        /* @__PURE__ */ React.createElement(Users, { size: 16, className: "text-blue-600" }),
        /* @__PURE__ */ React.createElement("span", null, "Perfil")
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          onClick: (e) => handleMenuClick(e, "meu-plano"),
          className: "w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        },
        /* @__PURE__ */ React.createElement(BarChart3, { size: 16, className: "text-purple-600" }),
        /* @__PURE__ */ React.createElement("span", null, "Meu plano")
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          onClick: (e) => handleMenuClick(e, "indicacoes"),
          className: "w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        },
        /* @__PURE__ */ React.createElement(Building2, { size: 16, className: "text-green-600" }),
        /* @__PURE__ */ React.createElement("span", null, "Indica\xE7\xF5es")
      ), /* @__PURE__ */ React.createElement("hr", { className: `my-2 transition-colors duration-200 ${isDarkMode ? "border-gray-700" : "border-gray-200"}` }), /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          onClick: handleLogout,
          className: `w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 rounded-lg transition-colors ${isDarkMode ? "hover:bg-red-900/20" : "hover:bg-red-50"}`
        },
        /* @__PURE__ */ React.createElement(X, { size: 16 }),
        /* @__PURE__ */ React.createElement("span", null, "Sair")
      )),
      /* @__PURE__ */ React.createElement("div", { className: `p-4 border-t rounded-b-lg transition-colors duration-200 ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"}` }, /* @__PURE__ */ React.createElement("div", { className: `text-xs space-y-1 transition-colors duration-200 ${isDarkMode ? "text-gray-400" : "text-gray-600"}` }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, "Empresa:"), " orion"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, "ID de suporte:"), " 14964"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, "Equipe respons\xE1vel:"), " Comercial")))
    ));
  };
  const TopMenu = () => {
    return /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-1 top-menu-dropdown" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setIsDarkMode(!isDarkMode),
        className: `flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${isDarkMode ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
        title: isDarkMode ? "Modo Claro" : "Modo Escuro"
      },
      isDarkMode ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", null, "\u2600\uFE0F"), /* @__PURE__ */ React.createElement("span", null, "Claro")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", null, "\u{1F319}"), /* @__PURE__ */ React.createElement("span", null, "Escuro"))
    ), /* @__PURE__ */ React.createElement("div", { className: "h-6 w-px bg-gray-300 mx-2" }), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => toggleTopMenu("novidades"),
        className: "flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
      },
      /* @__PURE__ */ React.createElement(Star, { size: 16 }),
      /* @__PURE__ */ React.createElement("span", null, "Novidades"),
      /* @__PURE__ */ React.createElement(ExternalLink, { size: 12 }),
      /* @__PURE__ */ React.createElement(ChevronDown, { size: 14, className: `transition-transform ${showTopMenuDropdowns.novidades ? "rotate-180" : ""}` })
    ), showTopMenuDropdowns.novidades && /* @__PURE__ */ React.createElement("div", { className: "absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50" }, /* @__PURE__ */ React.createElement("div", { className: "p-4" }, /* @__PURE__ */ React.createElement("h4", { className: "font-medium text-gray-800 mb-2" }, "\xDAltimas Atualiza\xE7\xF5es"), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "p-2 bg-blue-50 rounded text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "font-medium text-blue-800" }, "Dashboard Analytics"), /* @__PURE__ */ React.createElement("div", { className: "text-blue-600" }, "Novos gr\xE1ficos de performance")), /* @__PURE__ */ React.createElement("div", { className: "p-2 bg-green-50 rounded text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "font-medium text-green-800" }, "WhatsApp Integration"), /* @__PURE__ */ React.createElement("div", { className: "text-green-600" }, "Envio autom\xE1tico para fornecedores")))))), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => toggleTopMenu("ajuda"),
        className: "flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
      },
      /* @__PURE__ */ React.createElement(HelpCircle, { size: 16 }),
      /* @__PURE__ */ React.createElement("span", null, "Ajuda"),
      /* @__PURE__ */ React.createElement(ChevronDown, { size: 14, className: `transition-transform ${showTopMenuDropdowns.ajuda ? "rotate-180" : ""}` })
    ), showTopMenuDropdowns.ajuda && /* @__PURE__ */ React.createElement("div", { className: "absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50" }, /* @__PURE__ */ React.createElement("div", { className: "p-2" }, /* @__PURE__ */ React.createElement("button", { className: "w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded" }, "\u{1F4D6} Manual do usu\xE1rio"), /* @__PURE__ */ React.createElement("button", { className: "w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded" }, "\u{1F4AC} Suporte t\xE9cnico"), /* @__PURE__ */ React.createElement("button", { className: "w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded" }, "\u{1F3A5} Tutoriais em v\xEDdeo"), /* @__PURE__ */ React.createElement("button", { className: "w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded" }, "\u2753 FAQ - Perguntas frequentes")))), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => toggleTopMenu("notificacoes"),
        className: "flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors relative"
      },
      /* @__PURE__ */ React.createElement(Bell, { size: 16 }),
      /* @__PURE__ */ React.createElement("span", null, "Notifica\xE7\xF5es"),
      /* @__PURE__ */ React.createElement("span", { className: "absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center" }, "3"),
      /* @__PURE__ */ React.createElement(ChevronDown, { size: 14, className: `transition-transform ${showTopMenuDropdowns.notificacoes ? "rotate-180" : ""}` })
    ), showTopMenuDropdowns.notificacoes && /* @__PURE__ */ React.createElement("div", { className: "absolute right-0 top-full mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50" }, /* @__PURE__ */ React.createElement("div", { className: "p-4" }, /* @__PURE__ */ React.createElement("h4", { className: "font-medium text-gray-800 mb-3" }, "Notifica\xE7\xF5es Recentes"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-3 p-2 bg-red-50 rounded" }, /* @__PURE__ */ React.createElement(Bell, { size: 16, className: "text-red-500 mt-0.5" }), /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-red-800" }, "Estoque Cr\xEDtico"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-red-600" }, "Tomate est\xE1 abaixo do estoque m\xEDnimo"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-500 mt-1" }, "h\xE1 2 horas"))), /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-3 p-2 bg-yellow-50 rounded" }, /* @__PURE__ */ React.createElement(Package, { size: 16, className: "text-yellow-500 mt-0.5" }), /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-yellow-800" }, "Pedido Pendente"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-yellow-600" }, "Pedido #1234 aguardando confirma\xE7\xE3o"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-500 mt-1" }, "h\xE1 5 horas"))), /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-3 p-2 bg-blue-50 rounded" }, /* @__PURE__ */ React.createElement(Users, { size: 16, className: "text-blue-500 mt-0.5" }), /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-blue-800" }, "Novo Usu\xE1rio"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-blue-600" }, "Jo\xE3o Silva foi adicionado ao sistema"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-500 mt-1" }, "ontem")))), /* @__PURE__ */ React.createElement("div", { className: "mt-3 pt-3 border-t border-gray-200" }, /* @__PURE__ */ React.createElement("button", { className: "text-sm text-blue-600 hover:text-blue-800" }, "Ver todas as notifica\xE7\xF5es"))))), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => toggleTopMenu("aprenda"),
        className: "flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
      },
      /* @__PURE__ */ React.createElement(BookOpen, { size: 16 }),
      /* @__PURE__ */ React.createElement("span", null, "Aprenda a usar"),
      /* @__PURE__ */ React.createElement(ChevronDown, { size: 14, className: `transition-transform ${showTopMenuDropdowns.aprenda ? "rotate-180" : ""}` })
    ), showTopMenuDropdowns.aprenda && /* @__PURE__ */ React.createElement("div", { className: "absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50" }, /* @__PURE__ */ React.createElement("div", { className: "p-4" }, /* @__PURE__ */ React.createElement("h4", { className: "font-medium text-gray-800 mb-3" }, "Guias de Uso"), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("button", { className: "w-full text-left p-2 hover:bg-gray-100 rounded text-sm" }, "\u{1F680} Primeiros passos"), /* @__PURE__ */ React.createElement("button", { className: "w-full text-left p-2 hover:bg-gray-100 rounded text-sm" }, "\u{1F4E6} Gerenciar produtos"), /* @__PURE__ */ React.createElement("button", { className: "w-full text-left p-2 hover:bg-gray-100 rounded text-sm" }, "\u{1F4CA} Controle de estoque"), /* @__PURE__ */ React.createElement("button", { className: "w-full text-left p-2 hover:bg-gray-100 rounded text-sm" }, "\u{1F6D2} Gerar pedidos"), /* @__PURE__ */ React.createElement("button", { className: "w-full text-left p-2 hover:bg-gray-100 rounded text-sm" }, "\u{1F4F1} Integra\xE7\xE3o WhatsApp")), /* @__PURE__ */ React.createElement("div", { className: "mt-3 pt-3 border-t border-gray-200" }, /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-600" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, "Progresso:"), " 3 de 5 guias conclu\xEDdos"), /* @__PURE__ */ React.createElement("div", { className: "w-full bg-gray-200 rounded-full h-1.5 mt-1" }, /* @__PURE__ */ React.createElement("div", { className: "bg-blue-600 h-1.5 rounded-full", style: { width: "60%" } })))))), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleImportExcel,
        className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
      },
      /* @__PURE__ */ React.createElement(Upload, { size: 16 }),
      "Importar dados"
    ));
  };
  const ProductModal = ({ product, onSave, onClose }) => {
    const [formData, setFormData] = useState({
      nome: product?.nome || "",
      unidade: product?.unidade || "",
      fornecedor: product?.fornecedor || "",
      preco: product?.preco || "",
      estoqueIdeal: product?.estoqueIdeal || ""
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
    return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg p-6 w-full max-w-md" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold mb-4 text-gray-800" }, product ? "Editar Produto" : "Adicionar Produto"), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit }, /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium mb-1 text-gray-700" }, "Nome do Produto"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: formData.nome,
        onChange: (e) => setFormData({ ...formData, nome: e.target.value }),
        className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        required: true
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium mb-1 text-gray-700" }, "Unidade"), /* @__PURE__ */ React.createElement(
      "select",
      {
        value: formData.unidade,
        onChange: (e) => setFormData({ ...formData, unidade: e.target.value }),
        className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        required: true
      },
      /* @__PURE__ */ React.createElement("option", { value: "" }, "Selecione"),
      /* @__PURE__ */ React.createElement("option", { value: "kg" }, "kg"),
      /* @__PURE__ */ React.createElement("option", { value: "L" }, "L"),
      /* @__PURE__ */ React.createElement("option", { value: "un" }, "un"),
      /* @__PURE__ */ React.createElement("option", { value: "pct" }, "pct")
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium mb-1 text-gray-700" }, "Fornecedor"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: formData.fornecedor,
        onChange: (e) => setFormData({ ...formData, fornecedor: e.target.value }),
        className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        required: true
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium mb-1 text-gray-700" }, "Pre\xE7o Estimado (R$)"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        step: "0.01",
        value: formData.preco,
        onChange: (e) => setFormData({ ...formData, preco: e.target.value }),
        className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        required: true
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium mb-1 text-gray-700" }, "Estoque Ideal"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        value: formData.estoqueIdeal,
        onChange: (e) => setFormData({ ...formData, estoqueIdeal: e.target.value }),
        className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      }
    ))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-end space-x-2 mt-6" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: onClose,
        className: "px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
      },
      "Cancelar"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "submit",
        className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      },
      "Salvar"
    )))));
  };
  const handleSaveProduct = (product) => {
    if (editingProduct) {
      setProdutos((prev) => prev.map((p) => p.id === product.id ? product : p));
    } else {
      setProdutos((prev) => [...prev, product]);
    }
    setEditingProduct(null);
  };
  const handleDeleteProduct = (id) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setProdutos((prev) => prev.filter((p) => p.id !== id));
    }
  };
  const handleImportExcel = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls";
    input.onchange = (e) => {
      alert("Funcionalidade de importa\xE7\xE3o seria implementada aqui com uma biblioteca como xlsx");
    };
    input.click();
  };
  const Perfil = () => {
    const [perfilData, setPerfilData] = useState({
      nome: currentUser?.name || "Anderson",
      email: currentUser?.email || "admin@orion.com",
      telefone: "(11) 99999-9999",
      cargo: currentUser?.role || "Administrador",
      empresa: "orion",
      foto: currentUser?.avatar || "A",
      dataIngresso: "15/01/2024",
      ultimoAcesso: (/* @__PURE__ */ new Date()).toLocaleString("pt-BR")
    });
    const [isEditing, setIsEditing] = useState(false);
    const handleSave = () => {
      setCurrentUser((prev) => ({
        ...prev,
        name: perfilData.nome,
        email: perfilData.email,
        role: perfilData.cargo
      }));
      setIsEditing(false);
      alert("Perfil atualizado com sucesso!");
    };
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Meu Perfil"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Gerencie suas informa\xE7\xF5es pessoais e prefer\xEAncias")), /* @__PURE__ */ React.createElement("div", { className: `rounded-lg shadow-sm border p-6 transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}` }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl" }, perfilData.foto), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-semibold text-gray-800" }, perfilData.nome), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, perfilData.cargo), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500" }, perfilData.empresa))), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => isEditing ? handleSave() : setIsEditing(true),
        className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      },
      /* @__PURE__ */ React.createElement(Edit, { size: 16 }),
      isEditing ? "Salvar" : "Editar Perfil"
    )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "Nome Completo"), isEditing ? /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: perfilData.nome,
        onChange: (e) => setPerfilData({ ...perfilData, nome: e.target.value }),
        className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      }
    ) : /* @__PURE__ */ React.createElement("p", { className: "text-gray-900 py-2" }, perfilData.nome)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "E-mail"), isEditing ? /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "email",
        value: perfilData.email,
        onChange: (e) => setPerfilData({ ...perfilData, email: e.target.value }),
        className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      }
    ) : /* @__PURE__ */ React.createElement("p", { className: "text-gray-900 py-2" }, perfilData.email)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "Telefone"), isEditing ? /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: perfilData.telefone,
        onChange: (e) => setPerfilData({ ...perfilData, telefone: e.target.value }),
        className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      }
    ) : /* @__PURE__ */ React.createElement("p", { className: "text-gray-900 py-2" }, perfilData.telefone)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "Cargo"), isEditing ? /* @__PURE__ */ React.createElement(
      "select",
      {
        value: perfilData.cargo,
        onChange: (e) => setPerfilData({ ...perfilData, cargo: e.target.value }),
        className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      },
      /* @__PURE__ */ React.createElement("option", { value: "Administrador" }, "Administrador"),
      /* @__PURE__ */ React.createElement("option", { value: "Gerente" }, "Gerente"),
      /* @__PURE__ */ React.createElement("option", { value: "Supervisor" }, "Supervisor"),
      /* @__PURE__ */ React.createElement("option", { value: "Usu\xE1rio" }, "Usu\xE1rio")
    ) : /* @__PURE__ */ React.createElement("p", { className: "text-gray-900 py-2" }, perfilData.cargo)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "Empresa"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-900 py-2" }, perfilData.empresa)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "Data de Ingresso"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-900 py-2" }, perfilData.dataIngresso)), /* @__PURE__ */ React.createElement("div", { className: "md:col-span-2" }, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "\xDAltimo Acesso"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-900 py-2" }, perfilData.ultimoAcesso))), isEditing && /* @__PURE__ */ React.createElement("div", { className: "mt-6 flex justify-end gap-2" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setIsEditing(false),
        className: "px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
      },
      "Cancelar"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleSave,
        className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      },
      "Salvar Altera\xE7\xF5es"
    ))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800 mb-4" }, "Seguran\xE7a"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("button", { className: "w-full md:w-auto bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors" }, "Alterar Senha"), /* @__PURE__ */ React.createElement("button", { className: "w-full md:w-auto bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors ml-0 md:ml-2" }, "Desativar Conta"))));
  };
  const MeuPlano = () => {
    const planos = [
      {
        nome: "B\xE1sico",
        preco: "Gr\xE1tis",
        recursos: ["At\xE9 100 produtos", "Relat\xF3rios b\xE1sicos", "Suporte por email"],
        atual: false
      },
      {
        nome: "Plus",
        preco: "R$ 49,90/m\xEAs",
        recursos: ["Produtos ilimitados", "Relat\xF3rios avan\xE7ados", "Suporte priorit\xE1rio", "Backup autom\xE1tico", "Integra\xE7\xE3o WhatsApp"],
        atual: true
      },
      {
        nome: "Enterprise",
        preco: "R$ 149,90/m\xEAs",
        recursos: ["Todos os recursos Plus", "M\xFAltiplas filiais", "API personalizada", "Suporte 24/7", "Gerenciamento de usu\xE1rios", "Relat\xF3rios personalizados"],
        atual: false
      }
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Meu Plano"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Gerencie sua assinatura e acesse recursos premium")), /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-semibold mb-2" }, "Plano Atual: Plus \u{1F451}"), /* @__PURE__ */ React.createElement("p", { className: "text-blue-100" }, "Voc\xEA tem acesso a recursos premium!"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-blue-200 mt-1" }, "Renova\xE7\xE3o em: 23/02/2025")), /* @__PURE__ */ React.createElement("div", { className: "text-right" }, /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold" }, "R$ 49,90"), /* @__PURE__ */ React.createElement("p", { className: "text-blue-200" }, "por m\xEAs"))), /* @__PURE__ */ React.createElement("div", { className: "mt-4 flex gap-2" }, /* @__PURE__ */ React.createElement("button", { className: "bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors" }, "Gerenciar Assinatura"), /* @__PURE__ */ React.createElement("button", { className: "border border-blue-300 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors" }, "Baixar Fatura"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800 mb-4" }, "Comparar Planos"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6" }, planos.map((plano, index) => /* @__PURE__ */ React.createElement("div", { key: index, className: `rounded-lg border-2 p-6 ${plano.atual ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"}` }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-4" }, plano.atual && /* @__PURE__ */ React.createElement("span", { className: "inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium mb-2" }, "Plano Atual"), /* @__PURE__ */ React.createElement("h4", { className: "text-xl font-semibold text-gray-800" }, plano.nome), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-gray-900 mt-2" }, plano.preco)), /* @__PURE__ */ React.createElement("ul", { className: "space-y-2 mb-6" }, plano.recursos.map((recurso, idx) => /* @__PURE__ */ React.createElement("li", { key: idx, className: "flex items-center text-sm text-gray-600" }, /* @__PURE__ */ React.createElement("div", { className: "w-2 h-2 bg-green-500 rounded-full mr-2" }), recurso))), /* @__PURE__ */ React.createElement("button", { className: `w-full py-2 px-4 rounded font-medium transition-colors ${plano.atual ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}` }, plano.atual ? "Plano Atual" : "Escolher Plano"))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800 mb-4" }, "Hist\xF3rico de Faturas"), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Data"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Plano"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Valor"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Status"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "A\xE7\xF5es"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-gray-200" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-sm text-gray-900" }, "23/01/2025"), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-sm text-gray-600" }, "Plus"), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-sm text-gray-900" }, "R$ 49,90"), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3" }, /* @__PURE__ */ React.createElement("span", { className: "px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full" }, "Pago")), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3" }, /* @__PURE__ */ React.createElement("button", { className: "text-blue-600 hover:text-blue-800 text-sm" }, "Baixar PDF"))), /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-sm text-gray-900" }, "23/12/2024"), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-sm text-gray-600" }, "Plus"), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-sm text-gray-900" }, "R$ 49,90"), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3" }, /* @__PURE__ */ React.createElement("span", { className: "px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full" }, "Pago")), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3" }, /* @__PURE__ */ React.createElement("button", { className: "text-blue-600 hover:text-blue-800 text-sm" }, "Baixar PDF"))))))));
  };
  const Indicacoes = () => {
    const [indicacoes, setIndicacoes] = useStoredState("indicacoes", [
      { id: 1, nome: "Jo\xE3o Silva", email: "joao@empresa.com", status: "ativo", dataIndicacao: "15/01/2025", comissao: "R$ 25,00" },
      { id: 2, nome: "Maria Costa", email: "maria@loja.com", status: "pendente", dataIndicacao: "20/01/2025", comissao: "R$ 0,00" }
    ]);
    const [emailIndicacao, setEmailIndicacao] = useState("");
    const [nomeIndicacao, setNomeIndicacao] = useState("");
    const enviarIndicacao = () => {
      if (!emailIndicacao || !nomeIndicacao) {
        alert("Preencha todos os campos!");
        return;
      }
      const novaIndicacao = {
        id: Date.now(),
        nome: nomeIndicacao,
        email: emailIndicacao,
        status: "pendente",
        dataIndicacao: (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR"),
        comissao: "R$ 0,00"
      };
      setIndicacoes((prev) => [...prev, novaIndicacao]);
      setEmailIndicacao("");
      setNomeIndicacao("");
      alert("Indica\xE7\xE3o enviada com sucesso!");
    };
    const totalComissoes = indicacoes.filter((i) => i.status === "ativo").reduce((total, i) => total + parseFloat(i.comissao.replace("R$ ", "").replace(",", ".")), 0);
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Programa de Indica\xE7\xF5es"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Indique amigos e ganhe comiss\xF5es por cada assinatura")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Total Indica\xE7\xF5es"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-gray-900" }, indicacoes.length)), /* @__PURE__ */ React.createElement(Users, { className: "text-blue-600", size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Indica\xE7\xF5es Ativas"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-green-600" }, indicacoes.filter((i) => i.status === "ativo").length)), /* @__PURE__ */ React.createElement(Building2, { className: "text-green-600", size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Pendentes"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-yellow-600" }, indicacoes.filter((i) => i.status === "pendente").length)), /* @__PURE__ */ React.createElement(Calendar, { className: "text-yellow-600", size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Comiss\xF5es Totais"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-purple-600" }, "R$ ", totalComissoes.toFixed(2))), /* @__PURE__ */ React.createElement(DollarSign, { className: "text-purple-600", size: 24 })))), /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-semibold mb-4" }, "Como Funciona o Programa de Indica\xE7\xF5es? \u{1F3AF}"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xl font-bold" }, "1")), /* @__PURE__ */ React.createElement("p", { className: "font-medium" }, "Indique um amigo"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-green-100" }, "Envie um convite por email")), /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xl font-bold" }, "2")), /* @__PURE__ */ React.createElement("p", { className: "font-medium" }, "Ele assina o Orion"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-green-100" }, "Qualquer plano pago")), /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xl font-bold" }, "3")), /* @__PURE__ */ React.createElement("p", { className: "font-medium" }, "Voc\xEA ganha R$ 25"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-green-100" }, "Para cada indica\xE7\xE3o ativa")))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800 mb-4" }, "Fazer Nova Indica\xE7\xE3o"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "Nome do Indicado"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: nomeIndicacao,
        onChange: (e) => setNomeIndicacao(e.target.value),
        className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        placeholder: "Nome completo"
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "E-mail do Indicado"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "email",
        value: emailIndicacao,
        onChange: (e) => setEmailIndicacao(e.target.value),
        className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        placeholder: "email@empresa.com"
      }
    ))), /* @__PURE__ */ React.createElement("div", { className: "mt-4" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: enviarIndicacao,
        className: "bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
      },
      "Enviar Indica\xE7\xE3o"
    ))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800 mb-4" }, "Suas Indica\xE7\xF5es"), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Nome"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Email"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Data"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Status"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Comiss\xE3o"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-gray-200" }, indicacoes.map((indicacao) => /* @__PURE__ */ React.createElement("tr", { key: indicacao.id }, /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-sm font-medium text-gray-900" }, indicacao.nome), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-sm text-gray-600" }, indicacao.email), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-sm text-gray-600" }, indicacao.dataIndicacao), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3" }, /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full font-medium ${indicacao.status === "ativo" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}` }, indicacao.status === "ativo" ? "Ativo" : "Pendente")), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-sm font-medium text-gray-900" }, indicacao.comissao))))))));
  };
  const Dashboard = () => {
    const totalProdutos = produtos.length;
    const estoqueAtual = estoque[selectedDate] || {};
    const produtosCriticos = produtos.filter((p) => {
      const quantidade = estoqueAtual[p.id] || 0;
      return quantidade < p.estoqueIdeal * 0.3;
    }).length;
    const vendasSemanais = [
      { dia: "Seg", vendas: 150, pedidos: 8 },
      { dia: "Ter", vendas: 230, pedidos: 12 },
      { dia: "Qua", vendas: 180, pedidos: 9 },
      { dia: "Qui", vendas: 320, pedidos: 15 },
      { dia: "Sex", vendas: 280, pedidos: 14 },
      { dia: "S\xE1b", vendas: 420, pedidos: 18 },
      { dia: "Dom", vendas: 350, pedidos: 16 }
    ];
    const produtosMaisVendidos = [
      { nome: "Tomate", quantidade: 45, cor: "#ef4444" },
      { nome: "Arroz", quantidade: 38, cor: "#3b82f6" },
      { nome: "Frango", quantidade: 32, cor: "#10b981" },
      { nome: "Cebola", quantidade: 28, cor: "#f59e0b" },
      { nome: "\xD3leo", quantidade: 25, cor: "#8b5cf6" }
    ];
    const fornecedoresTop = [
      { nome: "Hortifruti Silva", pedidos: 12, valor: 2850.5, crescimento: "+15%" },
      { nome: "Distribuidora Gr\xE3os", pedidos: 8, valor: 1920.3, crescimento: "+8%" },
      { nome: "A\xE7ougue Central", pedidos: 6, valor: 1450.75, crescimento: "+22%" }
    ];
    const custoMensal = 8450.5;
    const economiaEstimada = 320.75;
    const mediaCompras = 15;
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800 mb-2" }, "Dashboard"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Vis\xE3o geral do sistema de gest\xE3o de compras")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("select", { className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" }, /* @__PURE__ */ React.createElement("option", null, "\xDAltimos 7 dias"), /* @__PURE__ */ React.createElement("option", null, "\xDAltimos 30 dias"), /* @__PURE__ */ React.createElement("option", null, "\xDAltimos 90 dias")), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg" }, (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR")))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-blue-100 text-sm" }, "Total de Produtos"), /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-bold" }, totalProdutos), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-blue-100 mt-1" }, "+3 este m\xEAs")), /* @__PURE__ */ React.createElement(Package, { className: "text-blue-200", size: 32 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-6 shadow-lg" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-red-100 text-sm" }, "Produtos Cr\xEDticos"), /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-bold" }, produtosCriticos), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-red-100 mt-1" }, "Aten\xE7\xE3o necess\xE1ria")), /* @__PURE__ */ React.createElement(Bell, { className: "text-red-200", size: 32 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-green-100 text-sm" }, "Pedidos M\xEAs"), /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-bold" }, Object.keys(pedidos).length), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-green-100 mt-1" }, "+12% vs m\xEAs anterior")), /* @__PURE__ */ React.createElement(ShoppingCart, { className: "text-green-200", size: 32 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-purple-100 text-sm" }, "Fornecedores"), /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-bold" }, fornecedores.length), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-purple-100 mt-1" }, "Ativos")), /* @__PURE__ */ React.createElement(Building2, { className: "text-purple-200", size: 32 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6 shadow-lg" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-orange-100 text-sm" }, "Custo Mensal"), /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-bold" }, "R$ ", custoMensal.toLocaleString("pt-BR")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-orange-100 mt-1" }, "-5% vs m\xEAs anterior")), /* @__PURE__ */ React.createElement(DollarSign, { className: "text-orange-200", size: 32 })))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800" }, "Tend\xEAncia de Compras"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1 text-sm text-gray-600" }, /* @__PURE__ */ React.createElement("div", { className: "w-3 h-3 bg-blue-500 rounded-full" }), "Valor (R$)"), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1 text-sm text-gray-600" }, /* @__PURE__ */ React.createElement("div", { className: "w-3 h-3 bg-green-500 rounded-full" }), "Pedidos"))), /* @__PURE__ */ React.createElement("div", { className: "h-64 flex items-end justify-between space-x-2" }, vendasSemanais.map((item, index) => /* @__PURE__ */ React.createElement("div", { key: index, className: "flex-1 flex flex-col items-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-8 flex flex-col items-center space-y-1" }, /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "w-6 bg-blue-500 rounded-t",
        style: { height: `${item.vendas / 420 * 200}px` }
      }
    ), /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "w-4 bg-green-500 rounded-t",
        style: { height: `${item.pedidos / 18 * 100}px` }
      }
    )), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-gray-600 mt-2" }, item.dia), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-gray-500" }, "R$ ", item.vendas))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800 mb-4" }, "Produtos Mais Comprados"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, produtosMaisVendidos.map((produto, index) => /* @__PURE__ */ React.createElement("div", { key: index, className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "w-3 h-3 rounded-full",
        style: { backgroundColor: produto.cor }
      }
    ), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-medium text-gray-900" }, produto.nome)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm text-gray-600" }, produto.quantidade), /* @__PURE__ */ React.createElement("div", { className: "w-16 h-2 bg-gray-200 rounded-full" }, /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "h-2 rounded-full",
        style: {
          backgroundColor: produto.cor,
          width: `${produto.quantidade / 45 * 100}%`
        }
      }
    )))))))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ React.createElement("h4", { className: "text-sm font-medium text-gray-600" }, "Economia Estimada"), /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 bg-green-100 rounded-full flex items-center justify-center" }, /* @__PURE__ */ React.createElement(DollarSign, { className: "text-green-600", size: 16 }))), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-gray-900" }, "R$ ", economiaEstimada.toFixed(2)), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-green-600 mt-1" }, "+15% este m\xEAs")), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ React.createElement("h4", { className: "text-sm font-medium text-gray-600" }, "M\xE9dia de Compras"), /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center" }, /* @__PURE__ */ React.createElement(BarChart3, { className: "text-blue-600", size: 16 }))), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-gray-900" }, mediaCompras), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-blue-600 mt-1" }, "por semana")), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ React.createElement("h4", { className: "text-sm font-medium text-gray-600" }, "Efici\xEAncia"), /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center" }, /* @__PURE__ */ React.createElement(Archive, { className: "text-purple-600", size: 16 }))), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-gray-900" }, "94%"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-purple-600 mt-1" }, "do estoque otimizado"))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" }, /* @__PURE__ */ React.createElement("h3", { className: `text-lg font-semibold mb-4 transition-colors duration-200 ${isDarkMode ? "text-white" : "text-gray-800"}` }, "A\xE7\xF5es R\xE1pidas"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" }, /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Clicou em Atualizar Estoque");
          setCurrentSection("estoque");
        },
        className: `flex items-center gap-3 p-4 rounded-lg transition-all duration-200 border cursor-pointer select-none ${isDarkMode ? "bg-gradient-to-r from-blue-900/50 to-blue-800/50 hover:from-blue-800/60 hover:to-blue-700/60 border-blue-700" : "bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200"}`,
        role: "button",
        tabIndex: 0
      },
      /* @__PURE__ */ React.createElement(Package, { className: "text-blue-600", size: 20 }),
      /* @__PURE__ */ React.createElement("span", { className: `font-medium transition-colors duration-200 ${isDarkMode ? "text-blue-200" : "text-blue-900"}` }, "Atualizar Estoque")
    ), /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Clicou em Gerar Pedido");
          setCurrentSection("pedido");
        },
        className: `flex items-center gap-3 p-4 rounded-lg transition-all duration-200 border cursor-pointer select-none ${isDarkMode ? "bg-gradient-to-r from-green-900/50 to-green-800/50 hover:from-green-800/60 hover:to-green-700/60 border-green-700" : "bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200"}`,
        role: "button",
        tabIndex: 0
      },
      /* @__PURE__ */ React.createElement(ShoppingCart, { className: "text-green-600", size: 20 }),
      /* @__PURE__ */ React.createElement("span", { className: `font-medium transition-colors duration-200 ${isDarkMode ? "text-green-200" : "text-green-900"}` }, "Gerar Pedido")
    ), /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Clicou em Adicionar Produto");
          setShowProductModal(true);
          setEditingProduct(null);
        },
        className: `flex items-center gap-3 p-4 rounded-lg transition-all duration-200 border cursor-pointer select-none ${isDarkMode ? "bg-gradient-to-r from-purple-900/50 to-purple-800/50 hover:from-purple-800/60 hover:to-purple-700/60 border-purple-700" : "bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200"}`,
        role: "button",
        tabIndex: 0
      },
      /* @__PURE__ */ React.createElement(PlusCircle, { className: "text-purple-600", size: 20 }),
      /* @__PURE__ */ React.createElement("span", { className: `font-medium transition-colors duration-200 ${isDarkMode ? "text-purple-200" : "text-purple-900"}` }, "Adicionar Produto")
    ), /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Clicou em Gerenciar Fornecedores");
          setCurrentSection("gerenciar-fornecedores");
        },
        className: `flex items-center gap-3 p-4 rounded-lg transition-all duration-200 border cursor-pointer select-none ${isDarkMode ? "bg-gradient-to-r from-orange-900/50 to-orange-800/50 hover:from-orange-800/60 hover:to-orange-700/60 border-orange-700" : "bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border-orange-200"}`,
        role: "button",
        tabIndex: 0
      },
      /* @__PURE__ */ React.createElement(Truck, { className: "text-orange-600", size: 20 }),
      /* @__PURE__ */ React.createElement("span", { className: `font-medium transition-colors duration-200 ${isDarkMode ? "text-orange-200" : "text-orange-900"}` }, "Gerenciar Fornecedores")
    ))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800 mb-4" }, "Top Fornecedores"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, fornecedoresTop.map((fornecedor, index) => /* @__PURE__ */ React.createElement("div", { key: index, className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "font-medium text-gray-900" }, fornecedor.nome), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, fornecedor.pedidos, " pedidos")), /* @__PURE__ */ React.createElement("div", { className: "text-right" }, /* @__PURE__ */ React.createElement("p", { className: "font-semibold text-gray-900" }, "R$ ", fornecedor.valor.toLocaleString("pt-BR")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-green-600" }, fornecedor.crescimento)))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800" }, "Produtos com Estoque Baixo"), /* @__PURE__ */ React.createElement("span", { className: "text-sm text-red-600 bg-red-100 px-2 py-1 rounded-full" }, produtosCriticos, " cr\xEDticos")), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, produtos.slice(0, 5).map((produto) => {
      const quantidade = estoqueAtual[produto.id] || 0;
      const isLow = quantidade < produto.estoqueIdeal * 0.5;
      const isCritical = quantidade < produto.estoqueIdeal * 0.3;
      const porcentagem = quantidade / produto.estoqueIdeal * 100;
      return /* @__PURE__ */ React.createElement("div", { key: produto.id, className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-1" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium text-gray-900" }, produto.nome), /* @__PURE__ */ React.createElement("span", { className: `text-xs px-2 py-1 rounded-full ${isCritical ? "bg-red-100 text-red-800" : isLow ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}` }, isCritical ? "Cr\xEDtico" : isLow ? "Baixo" : "OK")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1 h-2 bg-gray-200 rounded-full" }, /* @__PURE__ */ React.createElement(
        "div",
        {
          className: `h-2 rounded-full ${isCritical ? "bg-red-500" : isLow ? "bg-yellow-500" : "bg-green-500"}`,
          style: { width: `${Math.min(porcentagem, 100)}%` }
        }
      )), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-gray-600" }, quantidade, "/", produto.estoqueIdeal, " ", produto.unidade))));
    })), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setCurrentSection("estoque"),
        className: "w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
      },
      "Ver todos os produtos \u2192"
    ))));
  };
  const ListaProdutos = () => {
    const filteredProducts = produtos.filter(
      (produto) => !filterFornecedor || produto.fornecedor === filterFornecedor
    );
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Lista de Produtos"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Gerencie todos os produtos do restaurante")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, /* @__PURE__ */ React.createElement(
      "select",
      {
        value: filterFornecedor,
        onChange: (e) => setFilterFornecedor(e.target.value),
        className: "px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      },
      /* @__PURE__ */ React.createElement("option", { value: "" }, "Todos os fornecedores"),
      [...new Set(produtos.map((p) => p.fornecedor))].map((fornecedor) => /* @__PURE__ */ React.createElement("option", { key: fornecedor, value: fornecedor }, fornecedor))
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleImportExcel,
        className: "flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      },
      /* @__PURE__ */ React.createElement(Upload, { size: 16 }),
      "Importar Excel"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowProductModal(true),
        className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      },
      /* @__PURE__ */ React.createElement(PlusCircle, { size: 16 }),
      "Adicionar Produto"
    ))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Nome do Produto"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Unidade"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Fornecedor"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Pre\xE7o Estimado"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Estoque Ideal"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "A\xE7\xF5es"))), /* @__PURE__ */ React.createElement("tbody", { className: "bg-white divide-y divide-gray-200" }, filteredProducts.map((produto) => /* @__PURE__ */ React.createElement("tr", { key: produto.id, className: "hover:bg-gray-50 transition-colors" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" }, produto.nome), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600" }, produto.unidade), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600" }, produto.fornecedor), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600" }, "R$ ", produto.preco.toFixed(2)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600" }, produto.estoqueIdeal), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600" }, /* @__PURE__ */ React.createElement("div", { className: "flex space-x-2" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          setEditingProduct(produto);
          setShowProductModal(true);
        },
        className: "text-blue-600 hover:text-blue-800 transition-colors"
      },
      /* @__PURE__ */ React.createElement(Edit, { size: 16 })
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => handleDeleteProduct(produto.id),
        className: "text-red-600 hover:text-red-800 transition-colors"
      },
      /* @__PURE__ */ React.createElement(Trash2, { size: 16 })
    ))))))))));
  };
  const EstoqueAtual = () => {
    const [estoqueAtual, setEstoqueAtual] = useState(estoque[selectedDate] || {});
    const handleSaveEstoque = () => {
      setEstoque((prev) => ({
        ...prev,
        [selectedDate]: estoqueAtual
      }));
      alert("Estoque salvo com sucesso!");
    };
    const handleQuantityChange = (produtoId, quantity) => {
      setEstoqueAtual((prev) => ({
        ...prev,
        [produtoId]: parseInt(quantity) || 0
      }));
    };
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Estoque Atual"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Controle de estoque di\xE1rio")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Calendar, { size: 16, className: "text-gray-500" }), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "date",
        value: selectedDate,
        onChange: (e) => {
          setSelectedDate(e.target.value);
          setEstoqueAtual(estoque[e.target.value] || {});
        },
        className: "px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      }
    )), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleSaveEstoque,
        className: "flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      },
      /* @__PURE__ */ React.createElement(Package, { size: 16 }),
      "Salvar Estoque"
    ))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Produto"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Unidade"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Estoque Ideal"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Quantidade Atual"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Status"))), /* @__PURE__ */ React.createElement("tbody", { className: "bg-white divide-y divide-gray-200" }, produtos.map((produto) => {
      const quantidade = estoqueAtual[produto.id] || 0;
      const isLow = quantidade < produto.estoqueIdeal * 0.3;
      const isMinimum = quantidade < produto.estoqueIdeal * 0.5;
      return /* @__PURE__ */ React.createElement("tr", { key: produto.id, className: "hover:bg-gray-50 transition-colors" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" }, produto.nome), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600" }, produto.unidade), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600" }, produto.estoqueIdeal), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "number",
          value: quantidade,
          onChange: (e) => handleQuantityChange(produto.id, e.target.value),
          className: "w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          min: "0"
        }
      )), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, isLow ? /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800" }, /* @__PURE__ */ React.createElement(Bell, { size: 12, className: "mr-1" }), "Cr\xEDtico") : isMinimum ? /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800" }, "Baixo") : /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800" }, "OK")));
    }))))));
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
      setPedidoAtual((prev) => ({
        ...prev,
        [produtoId]: parseInt(quantidade) || 0
      }));
    };
    const gerarPedido = () => {
      const pedidoComData = {
        data: selectedDate,
        produtos: pedidoAtual,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      setPedidos((prev) => ({
        ...prev,
        [Date.now()]: pedidoComData
      }));
      setCurrentSection("enviar");
    };
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Gera\xE7\xE3o de Pedido"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Compare estoque atual com ideal e gere pedidos")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Calendar, { size: 16, className: "text-gray-500" }), /* @__PURE__ */ React.createElement("span", { className: "text-sm text-gray-600" }, "Data: ", selectedDate))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Produto"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Estoque Atual"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Estoque Ideal"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Sugest\xE3o"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Quantidade a Pedir"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Fornecedor"))), /* @__PURE__ */ React.createElement("tbody", { className: "bg-white divide-y divide-gray-200" }, produtos.map((produto) => {
      const atual = estoqueAtual[produto.id] || 0;
      const necessidade = calcularNecessidade(produto);
      const pedido = pedidoAtual[produto.id] || necessidade;
      return /* @__PURE__ */ React.createElement("tr", { key: produto.id, className: "hover:bg-gray-50 transition-colors" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" }, produto.nome), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600" }, atual, " ", produto.unidade), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600" }, produto.estoqueIdeal, " ", produto.unidade), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600" }, /* @__PURE__ */ React.createElement("span", { className: necessidade > 0 ? "text-orange-600 font-medium" : "text-gray-400" }, necessidade, " ", produto.unidade)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "number",
          value: pedido,
          onChange: (e) => handlePedidoChange(produto.id, e.target.value),
          className: "w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          min: "0"
        }
      )), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600" }, produto.fornecedor));
    }))))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-end" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: gerarPedido,
        className: "flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      },
      /* @__PURE__ */ React.createElement(ShoppingCart, { size: 16 }),
      "Gerar Pedido"
    )));
  };
  const EnviarFornecedor = () => {
    const ultimoPedido = Object.values(pedidos).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    )[0];
    if (!ultimoPedido) {
      return /* @__PURE__ */ React.createElement("div", { className: "text-center py-12" }, /* @__PURE__ */ React.createElement(ShoppingCart, { size: 48, className: "mx-auto text-gray-400 mb-4" }), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500" }, "Nenhum pedido gerado ainda."));
    }
    const pedidosPorFornecedor = {};
    Object.entries(ultimoPedido.produtos).forEach(([produtoId, quantidade]) => {
      if (quantidade > 0) {
        const produto = produtos.find((p) => p.id === parseInt(produtoId));
        if (produto) {
          if (!pedidosPorFornecedor[produto.fornecedor]) {
            pedidosPorFornecedor[produto.fornecedor] = [];
          }
          pedidosPorFornecedor[produto.fornecedor].push({
            nome: produto.nome,
            quantidade,
            unidade: produto.unidade
          });
        }
      }
    });
    const enviarWhatsApp = (fornecedor, itens) => {
      const fornecedorData = fornecedores.find((f) => f.nome === fornecedor);
      const telefone = fornecedorData?.telefone || "";
      const mensagem = `Ol\xE1, ${fornecedor}, segue pedido do Orion:

${itens.map((item) => `- ${item.nome}: ${item.quantidade} ${item.unidade}`).join("\n")}

Para entrega amanh\xE3 cedo.
Obrigado!`;
      const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, "_blank");
    };
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Enviar para Fornecedor"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Pedido de ", ultimoPedido.data))), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, Object.entries(pedidosPorFornecedor).map(([fornecedor, itens]) => /* @__PURE__ */ React.createElement("div", { key: fornecedor, className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-start mb-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-medium text-gray-900" }, fornecedor), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, fornecedores.find((f) => f.nome === fornecedor)?.especialidade)), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => enviarWhatsApp(fornecedor, itens),
        className: "flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      },
      /* @__PURE__ */ React.createElement(Send, { size: 16 }),
      "Enviar WhatsApp"
    )), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, itens.map((item, index) => /* @__PURE__ */ React.createElement("div", { key: index, className: "flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm text-gray-900 font-medium" }, item.nome), /* @__PURE__ */ React.createElement("span", { className: "text-sm text-gray-600" }, item.quantidade, " ", item.unidade))))))));
  };
  const VendasGerenciar = () => {
    const [vendas, setVendas] = useStoredState("vendas", [
      { id: 1, data: "2025-01-23", cliente: "Mesa 01", total: 85.5, status: "finalizada", items: ["Frango grelhado", "Arroz", "Feij\xE3o"] },
      { id: 2, data: "2025-01-23", cliente: "Mesa 05", total: 142.3, status: "finalizada", items: ["Picanha", "Batata frita", "Salada"] },
      { id: 3, data: "2025-01-23", cliente: "Balc\xE3o", total: 32.8, status: "pendente", items: ["Hamb\xFArguer", "Refrigerante"] }
    ]);
    const totalVendas = vendas.reduce((sum, venda) => sum + venda.total, 0);
    const vendasHoje = vendas.filter((v) => v.data === (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Gerenciar Vendas"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Controle todas as vendas do restaurante")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Total Vendas"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-gray-900" }, "R$ ", totalVendas.toFixed(2))), /* @__PURE__ */ React.createElement(DollarSign, { className: "text-green-600", size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Vendas Hoje"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-gray-900" }, vendasHoje.length)), /* @__PURE__ */ React.createElement(ShoppingCart, { className: "text-blue-600", size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Ticket M\xE9dio"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-gray-900" }, "R$ ", (totalVendas / vendas.length).toFixed(2))), /* @__PURE__ */ React.createElement(BarChart3, { className: "text-purple-600", size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Pendentes"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-gray-900" }, vendas.filter((v) => v.status === "pendente").length)), /* @__PURE__ */ React.createElement(Bell, { className: "text-orange-600", size: 24 })))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 border-b border-gray-200" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800" }, "Vendas Recentes")), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Data/Hora"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Cliente"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Items"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Total"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Status"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "A\xE7\xF5es"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-gray-200" }, vendas.map((venda) => /* @__PURE__ */ React.createElement("tr", { key: venda.id, className: "hover:bg-gray-50" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-900" }, new Date(venda.data).toLocaleDateString("pt-BR")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm font-medium text-gray-900" }, venda.cliente), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-600" }, venda.items.join(", ")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm font-semibold text-gray-900" }, "R$ ", venda.total.toFixed(2)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full font-medium ${venda.status === "finalizada" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}` }, venda.status === "finalizada" ? "Finalizada" : "Pendente")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm" }, /* @__PURE__ */ React.createElement("button", { className: "text-blue-600 hover:text-blue-800 mr-2" }, "Ver"), /* @__PURE__ */ React.createElement("button", { className: "text-green-600 hover:text-green-800" }, "Editar")))))))));
  };
  const VendasRelatorios = () => {
    const vendas = [
      { mes: "Jan", valor: 15420.5 },
      { mes: "Fev", valor: 18320.3 },
      { mes: "Mar", valor: 22150.8 },
      { mes: "Abr", valor: 19850.2 },
      { mes: "Mai", valor: 25680.4 }
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Relat\xF3rios de Vendas"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "An\xE1lise detalhada do desempenho de vendas")), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800 mb-4" }, "Vendas por M\xEAs"), /* @__PURE__ */ React.createElement("div", { className: "h-64 flex items-end justify-between space-x-4" }, vendas.map((item, index) => /* @__PURE__ */ React.createElement("div", { key: index, className: "flex-1 flex flex-col items-center" }, /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600",
        style: { height: `${item.valor / 25680.4 * 200}px` }
      }
    ), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-gray-600 mt-2" }, item.mes), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-gray-500" }, "R$ ", item.valor.toFixed(0)))))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800 mb-4" }, "Top Produtos"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, ["Frango Grelhado", "Picanha", "Hamb\xFArguer", "Peixe Assado"].map((produto, index) => /* @__PURE__ */ React.createElement("div", { key: index, className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm text-gray-900" }, produto), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-medium text-gray-600" }, 25 - index * 3, " vendas"))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800 mb-4" }, "Crescimento"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm text-gray-600" }, "Este m\xEAs"), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-medium text-green-600" }, "+15.2%")), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm text-gray-600" }, "\xDAltima semana"), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-medium text-green-600" }, "+8.7%")), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm text-gray-600" }, "Ontem"), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-medium text-blue-600" }, "R$ 1.234,50"))))));
  };
  const FinanceiroFluxoCaixa = () => {
    const [transacoes, setTransacoes] = useStoredState("transacoes", [
      { id: 1, data: "2025-01-23", descricao: "Venda Mesa 01", tipo: "entrada", valor: 85.5, categoria: "Vendas" },
      { id: 2, data: "2025-01-23", descricao: "Compra Ingredientes", tipo: "saida", valor: 320.8, categoria: "Compras" },
      { id: 3, data: "2025-01-22", descricao: "Venda Balc\xE3o", tipo: "entrada", valor: 142.3, categoria: "Vendas" },
      { id: 4, data: "2025-01-22", descricao: "Pagamento Fornecedor", tipo: "saida", valor: 850, categoria: "Fornecedores" }
    ]);
    const totalEntradas = transacoes.filter((t) => t.tipo === "entrada").reduce((sum, t) => sum + t.valor, 0);
    const totalSaidas = transacoes.filter((t) => t.tipo === "saida").reduce((sum, t) => sum + t.valor, 0);
    const saldo = totalEntradas - totalSaidas;
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Fluxo de Caixa"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Controle de entradas e sa\xEDdas financeiras")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-green-100 text-sm" }, "Total Entradas"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold" }, "R$ ", totalEntradas.toFixed(2))), /* @__PURE__ */ React.createElement(DollarSign, { className: "text-green-200", size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-red-100 text-sm" }, "Total Sa\xEDdas"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold" }, "R$ ", totalSaidas.toFixed(2))), /* @__PURE__ */ React.createElement(DollarSign, { className: "text-red-200", size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: `bg-gradient-to-br ${saldo >= 0 ? "from-blue-500 to-blue-600" : "from-orange-500 to-orange-600"} text-white rounded-lg p-6` }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: `${saldo >= 0 ? "text-blue-100" : "text-orange-100"} text-sm` }, "Saldo Atual"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold" }, "R$ ", saldo.toFixed(2))), /* @__PURE__ */ React.createElement(BarChart3, { className: `${saldo >= 0 ? "text-blue-200" : "text-orange-200"}`, size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-purple-100 text-sm" }, "Transa\xE7\xF5es"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold" }, transacoes.length)), /* @__PURE__ */ React.createElement(Package, { className: "text-purple-200", size: 24 })))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 border-b border-gray-200 flex justify-between items-center" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800" }, "Transa\xE7\xF5es Recentes"), /* @__PURE__ */ React.createElement("button", { className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors" }, "Nova Transa\xE7\xE3o")), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Data"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Descri\xE7\xE3o"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Categoria"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Tipo"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Valor"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-gray-200" }, transacoes.map((transacao) => /* @__PURE__ */ React.createElement("tr", { key: transacao.id, className: "hover:bg-gray-50" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-900" }, new Date(transacao.data).toLocaleDateString("pt-BR")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-900" }, transacao.descricao), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-600" }, transacao.categoria), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full font-medium ${transacao.tipo === "entrada" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}` }, transacao.tipo === "entrada" ? "Entrada" : "Sa\xEDda")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm font-semibold text-gray-900" }, "R$ ", transacao.valor.toFixed(2)))))))));
  };
  const FinanceiroContas = () => {
    const [contas, setContas] = useStoredState("contas", [
      { id: 1, descricao: "Energia El\xE9trica", vencimento: "2025-01-28", valor: 450.8, status: "pendente", categoria: "Utilidades" },
      { id: 2, descricao: "\xC1gua", vencimento: "2025-01-25", valor: 180.5, status: "pago", categoria: "Utilidades" },
      { id: 3, descricao: "Aluguel", vencimento: "2025-02-01", valor: 2500, status: "pendente", categoria: "Aluguel" },
      { id: 4, descricao: "Internet", vencimento: "2025-01-30", valor: 120, status: "pago", categoria: "Comunica\xE7\xE3o" }
    ]);
    const contasPendentes = contas.filter((c) => c.status === "pendente");
    const totalPendente = contasPendentes.reduce((sum, c) => sum + c.valor, 0);
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Contas a Pagar"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Gest\xE3o de contas e pagamentos")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Contas Pendentes"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-orange-600" }, contasPendentes.length)), /* @__PURE__ */ React.createElement(Bell, { className: "text-orange-600", size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Total a Pagar"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-red-600" }, "R$ ", totalPendente.toFixed(2))), /* @__PURE__ */ React.createElement(DollarSign, { className: "text-red-600", size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Contas Pagas"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-green-600" }, contas.filter((c) => c.status === "pago").length)), /* @__PURE__ */ React.createElement(Package, { className: "text-green-600", size: 24 })))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 border-b border-gray-200 flex justify-between items-center" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800" }, "Todas as Contas"), /* @__PURE__ */ React.createElement("button", { className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors" }, "Nova Conta")), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Descri\xE7\xE3o"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Categoria"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Vencimento"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Valor"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Status"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "A\xE7\xF5es"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-gray-200" }, contas.map((conta) => /* @__PURE__ */ React.createElement("tr", { key: conta.id, className: "hover:bg-gray-50" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm font-medium text-gray-900" }, conta.descricao), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-600" }, conta.categoria), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-600" }, new Date(conta.vencimento).toLocaleDateString("pt-BR")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm font-semibold text-gray-900" }, "R$ ", conta.valor.toFixed(2)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full font-medium ${conta.status === "pago" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}` }, conta.status === "pago" ? "Pago" : "Pendente")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm" }, conta.status === "pendente" ? /* @__PURE__ */ React.createElement("button", { className: "text-green-600 hover:text-green-800 mr-2" }, "Pagar") : /* @__PURE__ */ React.createElement("span", { className: "text-gray-400" }, "-"), /* @__PURE__ */ React.createElement("button", { className: "text-blue-600 hover:text-blue-800" }, "Editar")))))))));
  };
  const UtilitariosBackup = () => {
    const [backups, setBackups] = useStoredState("backups", [
      { id: 1, data: "2025-01-23 08:00", tipo: "Autom\xE1tico", tamanho: "2.3 MB", status: "sucesso" },
      { id: 2, data: "2025-01-22 08:00", tipo: "Autom\xE1tico", tamanho: "2.1 MB", status: "sucesso" },
      { id: 3, data: "2025-01-21 08:00", tipo: "Manual", tamanho: "2.2 MB", status: "sucesso" }
    ]);
    const fazerBackup = () => {
      const novoBackup = {
        id: Date.now(),
        data: (/* @__PURE__ */ new Date()).toLocaleString("pt-BR"),
        tipo: "Manual",
        tamanho: "2.4 MB",
        status: "sucesso"
      };
      setBackups((prev) => [novoBackup, ...prev]);
      alert("Backup realizado com sucesso!");
    };
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Backup & Restaura\xE7\xE3o"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Gerencie backups dos seus dados")), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800 mb-4" }, "A\xE7\xF5es R\xE1pidas"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: fazerBackup,
        className: "flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
      },
      /* @__PURE__ */ React.createElement(Archive, { className: "text-blue-600", size: 20 }),
      /* @__PURE__ */ React.createElement("span", { className: "text-blue-900 font-medium" }, "Fazer Backup Agora")
    ), /* @__PURE__ */ React.createElement("button", { className: "flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors" }, /* @__PURE__ */ React.createElement(Upload, { className: "text-green-600", size: 20 }), /* @__PURE__ */ React.createElement("span", { className: "text-green-900 font-medium" }, "Restaurar Backup")), /* @__PURE__ */ React.createElement("button", { className: "flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors" }, /* @__PURE__ */ React.createElement(Settings, { className: "text-purple-600", size: 20 }), /* @__PURE__ */ React.createElement("span", { className: "text-purple-900 font-medium" }, "Configurar Autom\xE1tico")))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 border-b border-gray-200" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800" }, "Hist\xF3rico de Backups")), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Data/Hora"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Tipo"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Tamanho"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Status"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "A\xE7\xF5es"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-gray-200" }, backups.map((backup) => /* @__PURE__ */ React.createElement("tr", { key: backup.id, className: "hover:bg-gray-50" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-900" }, backup.data), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-600" }, backup.tipo), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-600" }, backup.tamanho), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ React.createElement("span", { className: "px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-800" }, backup.status === "sucesso" ? "Sucesso" : "Erro")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm" }, /* @__PURE__ */ React.createElement("button", { className: "text-blue-600 hover:text-blue-800 mr-2" }, "Download"), /* @__PURE__ */ React.createElement("button", { className: "text-green-600 hover:text-green-800" }, "Restaurar")))))))));
  };
  const UtilitariosConfiguracoes = () => {
    const [configuracoes, setConfiguracoes] = useStoredState("configuracoes", {
      empresa: {
        nome: "Orion Restaurante",
        cnpj: "12.345.678/0001-90",
        endereco: "Rua das Flores, 123",
        telefone: "(11) 99999-9999",
        email: "contato@orion.com"
      },
      sistema: {
        backup_automatico: true,
        notificacoes_email: true,
        modo_escuro: isDarkMode,
        idioma: "pt-BR"
      }
    });
    const [aba, setAba] = useState("empresa");
    const salvarConfiguracoes = () => {
      alert("Configura\xE7\xF5es salvas com sucesso!");
    };
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Configura\xE7\xF5es"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Personalize o sistema conforme suas necessidades")), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200" }, /* @__PURE__ */ React.createElement("div", { className: "border-b border-gray-200" }, /* @__PURE__ */ React.createElement("nav", { className: "flex space-x-8 px-6" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setAba("empresa"),
        className: `py-4 px-1 border-b-2 font-medium text-sm ${aba === "empresa" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`
      },
      "Empresa"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setAba("sistema"),
        className: `py-4 px-1 border-b-2 font-medium text-sm ${aba === "sistema" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`
      },
      "Sistema"
    ))), /* @__PURE__ */ React.createElement("div", { className: "p-6" }, aba === "empresa" && /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800" }, "Informa\xE7\xF5es da Empresa"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "Nome da Empresa"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: configuracoes.empresa.nome,
        onChange: (e) => setConfiguracoes((prev) => ({
          ...prev,
          empresa: { ...prev.empresa, nome: e.target.value }
        })),
        className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "CNPJ"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: configuracoes.empresa.cnpj,
        onChange: (e) => setConfiguracoes((prev) => ({
          ...prev,
          empresa: { ...prev.empresa, cnpj: e.target.value }
        })),
        className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "Endere\xE7o"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: configuracoes.empresa.endereco,
        onChange: (e) => setConfiguracoes((prev) => ({
          ...prev,
          empresa: { ...prev.empresa, endereco: e.target.value }
        })),
        className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "Telefone"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: configuracoes.empresa.telefone,
        onChange: (e) => setConfiguracoes((prev) => ({
          ...prev,
          empresa: { ...prev.empresa, telefone: e.target.value }
        })),
        className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      }
    )))), aba === "sistema" && /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800" }, "Configura\xE7\xF5es do Sistema"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "font-medium text-gray-900" }, "Backup Autom\xE1tico"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Realizar backup di\xE1rio automaticamente")), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        checked: configuracoes.sistema.backup_automatico,
        onChange: (e) => setConfiguracoes((prev) => ({
          ...prev,
          sistema: { ...prev.sistema, backup_automatico: e.target.checked }
        })),
        className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "font-medium text-gray-900" }, "Notifica\xE7\xF5es por Email"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Receber alertas importantes por email")), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        checked: configuracoes.sistema.notificacoes_email,
        onChange: (e) => setConfiguracoes((prev) => ({
          ...prev,
          sistema: { ...prev.sistema, notificacoes_email: e.target.checked }
        })),
        className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "font-medium text-gray-900" }, "Modo Escuro"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Ativar tema escuro para toda a interface")), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        checked: isDarkMode,
        onChange: (e) => {
          setIsDarkMode(e.target.checked);
          setConfiguracoes((prev) => ({
            ...prev,
            sistema: { ...prev.sistema, modo_escuro: e.target.checked }
          }));
        },
        className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      }
    )))), /* @__PURE__ */ React.createElement("div", { className: "mt-6 flex justify-end" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: salvarConfiguracoes,
        className: "bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
      },
      "Salvar Configura\xE7\xF5es"
    )))));
  };
  const EmpresaFiliais = () => {
    const [filiais, setFiliais] = useStoredState("filiais", [
      { id: 1, nome: "Filial Centro", endereco: "R. das Palmeiras, 123", telefone: "(11) 3333-4444", status: "ativa", gerente: "Carlos Silva" },
      { id: 2, nome: "Filial Shopping", endereco: "Av. Paulista, 456", telefone: "(11) 5555-6666", status: "ativa", gerente: "Ana Costa" },
      { id: 3, nome: "Filial Norte", endereco: "R. das Flores, 789", telefone: "(11) 7777-8888", status: "inativa", gerente: "Jo\xE3o Santos" }
    ]);
    const [showModal, setShowModal] = useState(false);
    const [editingFilial, setEditingFilial] = useState(null);
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Filiais"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Gerencie todas as filiais da empresa")), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowModal(true),
        className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
      },
      /* @__PURE__ */ React.createElement(PlusCircle, { size: 16 }),
      "Nova Filial"
    )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Total de Filiais"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-gray-900" }, filiais.length)), /* @__PURE__ */ React.createElement(Building2, { className: "text-blue-600", size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Filiais Ativas"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-green-600" }, filiais.filter((f) => f.status === "ativa").length)), /* @__PURE__ */ React.createElement(Package, { className: "text-green-600", size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Filiais Inativas"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-red-600" }, filiais.filter((f) => f.status === "inativa").length)), /* @__PURE__ */ React.createElement(Bell, { className: "text-red-600", size: 24 })))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Nome"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Endere\xE7o"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Telefone"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Gerente"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Status"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "A\xE7\xF5es"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-gray-200" }, filiais.map((filial) => /* @__PURE__ */ React.createElement("tr", { key: filial.id, className: "hover:bg-gray-50" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm font-medium text-gray-900" }, filial.nome), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-600" }, filial.endereco), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-600" }, filial.telefone), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-600" }, filial.gerente), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full font-medium ${filial.status === "ativa" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}` }, filial.status === "ativa" ? "Ativa" : "Inativa")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm" }, /* @__PURE__ */ React.createElement("button", { className: "text-blue-600 hover:text-blue-800 mr-2" }, /* @__PURE__ */ React.createElement(Edit, { size: 16 })), /* @__PURE__ */ React.createElement("button", { className: "text-red-600 hover:text-red-800" }, /* @__PURE__ */ React.createElement(Trash2, { size: 16 }))))))))));
  };
  const EmpresaColaboradores = () => {
    const [colaboradores, setColaboradores] = useStoredState("colaboradores", [
      { id: 1, nome: "Carlos Silva", cargo: "Gerente", email: "carlos@orion.com", telefone: "(11) 99999-0001", status: "ativo", salario: 5500 },
      { id: 2, nome: "Ana Costa", cargo: "Supervisora", email: "ana@orion.com", telefone: "(11) 99999-0002", status: "ativo", salario: 4200 },
      { id: 3, nome: "Jo\xE3o Santos", cargo: "Cozinheiro", email: "joao@orion.com", telefone: "(11) 99999-0003", status: "ativo", salario: 2800 },
      { id: 4, nome: "Maria Silva", cargo: "Gar\xE7onete", email: "maria@orion.com", telefone: "(11) 99999-0004", status: "inativo", salario: 2200 }
    ]);
    const totalColaboradores = colaboradores.length;
    const colaboradoresAtivos = colaboradores.filter((c) => c.status === "ativo").length;
    const folhaPagamento = colaboradores.filter((c) => c.status === "ativo").reduce((total, c) => total + c.salario, 0);
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Colaboradores"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Gerencie equipe e recursos humanos")), /* @__PURE__ */ React.createElement("button", { className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2" }, /* @__PURE__ */ React.createElement(PlusCircle, { size: 16 }), "Novo Colaborador")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Total"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-gray-900" }, totalColaboradores)), /* @__PURE__ */ React.createElement(Users, { className: "text-blue-600", size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Ativos"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-green-600" }, colaboradoresAtivos)), /* @__PURE__ */ React.createElement(Package, { className: "text-green-600", size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Inativos"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-red-600" }, totalColaboradores - colaboradoresAtivos)), /* @__PURE__ */ React.createElement(Bell, { className: "text-red-600", size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Folha Pagamento"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-purple-600" }, "R$ ", folhaPagamento.toLocaleString("pt-BR"))), /* @__PURE__ */ React.createElement(DollarSign, { className: "text-purple-600", size: 24 })))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Nome"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Cargo"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Email"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Telefone"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Sal\xE1rio"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Status"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "A\xE7\xF5es"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-gray-200" }, colaboradores.map((colaborador) => /* @__PURE__ */ React.createElement("tr", { key: colaborador.id, className: "hover:bg-gray-50" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm font-medium text-gray-900" }, colaborador.nome), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-600" }, colaborador.cargo), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-600" }, colaborador.email), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-600" }, colaborador.telefone), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm font-semibold text-gray-900" }, "R$ ", colaborador.salario.toLocaleString("pt-BR")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full font-medium ${colaborador.status === "ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}` }, colaborador.status === "ativo" ? "Ativo" : "Inativo")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm" }, /* @__PURE__ */ React.createElement("button", { className: "text-blue-600 hover:text-blue-800 mr-2" }, /* @__PURE__ */ React.createElement(Edit, { size: 16 })), /* @__PURE__ */ React.createElement("button", { className: "text-red-600 hover:text-red-800" }, /* @__PURE__ */ React.createElement(Trash2, { size: 16 }))))))))));
  };
  const EmpresaClientes = () => {
    const [clientes, setClientes] = useStoredState("clientes", [
      { id: 1, nome: "Jo\xE3o da Silva", email: "joao@email.com", telefone: "(11) 99999-1111", categoria: "VIP", ultimaVisita: "2025-01-23", totalGasto: 1250.8 },
      { id: 2, nome: "Maria Santos", email: "maria@email.com", telefone: "(11) 99999-2222", categoria: "Premium", ultimaVisita: "2025-01-22", totalGasto: 890.5 },
      { id: 3, nome: "Carlos Costa", email: "carlos@email.com", telefone: "(11) 99999-3333", categoria: "Regular", ultimaVisita: "2025-01-20", totalGasto: 450.3 },
      { id: 4, nome: "Ana Oliveira", email: "ana@email.com", telefone: "(11) 99999-4444", categoria: "VIP", ultimaVisita: "2025-01-23", totalGasto: 2100 }
    ]);
    const clientesVIP = clientes.filter((c) => c.categoria === "VIP").length;
    const clientesTotais = clientes.length;
    const receitaTotal = clientes.reduce((total, c) => total + c.totalGasto, 0);
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Clientes"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Gerencie relacionamento com clientes")), /* @__PURE__ */ React.createElement("button", { className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2" }, /* @__PURE__ */ React.createElement(PlusCircle, { size: 16 }), "Novo Cliente")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Total Clientes"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-gray-900" }, clientesTotais)), /* @__PURE__ */ React.createElement(Users, { className: "text-blue-600", size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Clientes VIP"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-purple-600" }, clientesVIP)), /* @__PURE__ */ React.createElement(Star, { className: "text-purple-600", size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Receita Total"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-green-600" }, "R$ ", receitaTotal.toLocaleString("pt-BR"))), /* @__PURE__ */ React.createElement(DollarSign, { className: "text-green-600", size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Ticket M\xE9dio"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-orange-600" }, "R$ ", (receitaTotal / clientesTotais).toLocaleString("pt-BR"))), /* @__PURE__ */ React.createElement(BarChart3, { className: "text-orange-600", size: 24 })))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Nome"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Email"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Telefone"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Categoria"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "\xDAltima Visita"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Total Gasto"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "A\xE7\xF5es"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-gray-200" }, clientes.map((cliente) => /* @__PURE__ */ React.createElement("tr", { key: cliente.id, className: "hover:bg-gray-50" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm font-medium text-gray-900" }, cliente.nome), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-600" }, cliente.email), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-600" }, cliente.telefone), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full font-medium ${cliente.categoria === "VIP" ? "bg-purple-100 text-purple-800" : cliente.categoria === "Premium" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}` }, cliente.categoria)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-600" }, new Date(cliente.ultimaVisita).toLocaleDateString("pt-BR")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm font-semibold text-gray-900" }, "R$ ", cliente.totalGasto.toLocaleString("pt-BR")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm" }, /* @__PURE__ */ React.createElement("button", { className: "text-blue-600 hover:text-blue-800 mr-2" }, /* @__PURE__ */ React.createElement(Edit, { size: 16 })), /* @__PURE__ */ React.createElement("button", { className: "text-green-600 hover:text-green-800" }, /* @__PURE__ */ React.createElement(Send, { size: 16 }))))))))));
  };
  const FornecedoresGerenciar = () => {
    const [fornecedoresList, setFornecedoresList] = useStoredState("fornecedoresList", [
      { id: 1, nome: "Hortifruti Silva", contato: "Sr. Silva", telefone: "(11) 3333-1111", email: "silva@hortifruti.com", categoria: "Frutas e Verduras", status: "ativo", rating: 4.8 },
      { id: 2, nome: "Distribuidora Gr\xE3os", contato: "Ana Costa", telefone: "(11) 4444-2222", email: "ana@graos.com", categoria: "Gr\xE3os e Cereais", status: "ativo", rating: 4.5 },
      { id: 3, nome: "A\xE7ougue Central", contato: "Jo\xE3o Carnes", telefone: "(11) 5555-3333", email: "joao@acougue.com", categoria: "Carnes", status: "ativo", rating: 4.7 },
      { id: 4, nome: "Latic\xEDnios Norte", contato: "Maria Leite", telefone: "(11) 6666-4444", email: "maria@laticinios.com", categoria: "Latic\xEDnios", status: "inativo", rating: 3.9 }
    ]);
    const fornecedoresAtivos = fornecedoresList.filter((f) => f.status === "ativo").length;
    const ratingMedio = fornecedoresList.reduce((sum, f) => sum + f.rating, 0) / fornecedoresList.length;
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Gerenciar Fornecedores"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Controle completo de fornecedores e parcerias")), /* @__PURE__ */ React.createElement("button", { className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2" }, /* @__PURE__ */ React.createElement(PlusCircle, { size: 16 }), "Novo Fornecedor")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Total"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-gray-900" }, fornecedoresList.length)), /* @__PURE__ */ React.createElement(Truck, { className: "text-blue-600", size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Ativos"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-green-600" }, fornecedoresAtivos)), /* @__PURE__ */ React.createElement(Package, { className: "text-green-600", size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Rating M\xE9dio"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-yellow-600" }, ratingMedio.toFixed(1))), /* @__PURE__ */ React.createElement(Star, { className: "text-yellow-600", size: 24 }))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Categorias"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-purple-600" }, [...new Set(fornecedoresList.map((f) => f.categoria))].length)), /* @__PURE__ */ React.createElement(Archive, { className: "text-purple-600", size: 24 })))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Fornecedor"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Contato"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Telefone"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Categoria"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Rating"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Status"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "A\xE7\xF5es"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-gray-200" }, fornecedoresList.map((fornecedor) => /* @__PURE__ */ React.createElement("tr", { key: fornecedor.id, className: "hover:bg-gray-50" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm font-medium text-gray-900" }, fornecedor.nome), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-600" }, fornecedor.contato), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-600" }, fornecedor.telefone), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm text-gray-600" }, fornecedor.categoria), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Star, { className: "text-yellow-400 mr-1", size: 14, fill: "currentColor" }), /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, fornecedor.rating))), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full font-medium ${fornecedor.status === "ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}` }, fornecedor.status === "ativo" ? "Ativo" : "Inativo")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-sm" }, /* @__PURE__ */ React.createElement("button", { className: "text-blue-600 hover:text-blue-800 mr-2" }, /* @__PURE__ */ React.createElement(Edit, { size: 16 })), /* @__PURE__ */ React.createElement("button", { className: "text-green-600 hover:text-green-800 mr-2" }, /* @__PURE__ */ React.createElement(Send, { size: 16 })), /* @__PURE__ */ React.createElement("button", { className: "text-red-600 hover:text-red-800" }, /* @__PURE__ */ React.createElement(Trash2, { size: 16 }))))))))));
  };
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      component: Dashboard
    },
    {
      id: "empresa",
      label: "Empresa",
      icon: Building2,
      hasSubmenu: true,
      submenu: [
        { id: "filiais", label: "Filiais", component: EmpresaFiliais },
        { id: "colaboradores", label: "Colaboradores", component: EmpresaColaboradores },
        { id: "clientes", label: "Clientes", component: EmpresaClientes },
        { id: "fornecedores-empresa", label: "Fornecedores", component: () => /* @__PURE__ */ React.createElement("div", { className: "p-6" }, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Fornecedores da Empresa"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 mt-2" }, "Funcionalidade em desenvolvimento...")) },
        { id: "produtos", label: "Produtos", component: ListaProdutos }
      ]
    },
    {
      id: "fornecedores",
      label: "Fornecedores",
      icon: Truck,
      hasSubmenu: true,
      submenu: [
        { id: "gerenciar-fornecedores", label: "Gerenciar", component: FornecedoresGerenciar },
        { id: "tipos-fornecedores", label: "Tipos", component: () => /* @__PURE__ */ React.createElement("div", { className: "p-6" }, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Tipos de Fornecedores"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 mt-2" }, "Funcionalidade em desenvolvimento...")) },
        { id: "contratos-fornecedores", label: "Contratos", component: () => /* @__PURE__ */ React.createElement("div", { className: "p-6" }, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Contratos"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 mt-2" }, "Funcionalidade em desenvolvimento...")) }
      ]
    },
    {
      id: "estoque",
      label: "Estoque",
      icon: Archive,
      hasSubmenu: true,
      submenu: [
        { id: "estoque", label: "Estoque Atual", component: EstoqueAtual },
        { id: "pedido", label: "Pedidos", component: Pedido },
        { id: "enviar", label: "Enviar Fornecedor", component: EnviarFornecedor }
      ]
    },
    {
      id: "vendas",
      label: "Vendas",
      icon: DollarSign,
      hasSubmenu: true,
      submenu: [
        { id: "vendas-gerenciar", label: "Gerenciar Vendas", component: VendasGerenciar },
        { id: "vendas-relatorios", label: "Relat\xF3rios", component: VendasRelatorios },
        { id: "vendas-metas", label: "Metas", component: () => /* @__PURE__ */ React.createElement("div", { className: "p-6" }, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Metas de Vendas"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 mt-2" }, "Funcionalidade em desenvolvimento...")) }
      ]
    },
    {
      id: "financeiro",
      label: "Financeiro",
      icon: BarChart3,
      hasSubmenu: true,
      submenu: [
        { id: "financeiro-fluxo", label: "Fluxo de Caixa", component: FinanceiroFluxoCaixa },
        { id: "financeiro-contas", label: "Contas a Pagar", component: FinanceiroContas },
        { id: "financeiro-relatorios", label: "Relat\xF3rios", component: () => /* @__PURE__ */ React.createElement("div", { className: "p-6" }, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Relat\xF3rios Financeiros"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 mt-2" }, "Funcionalidade em desenvolvimento...")) }
      ]
    },
    {
      id: "utilitarios",
      label: "Utilit\xE1rios",
      icon: Settings,
      hasSubmenu: true,
      submenu: [
        { id: "utilitarios-backup", label: "Backup", component: UtilitariosBackup },
        { id: "utilitarios-config", label: "Configura\xE7\xF5es", component: UtilitariosConfiguracoes },
        { id: "utilitarios-logs", label: "Logs do Sistema", component: () => /* @__PURE__ */ React.createElement("div", { className: "p-6" }, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Logs do Sistema"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 mt-2" }, "Funcionalidade em desenvolvimento...")) }
      ]
    }
  ];
  const renderContent = () => {
    if (currentSection === "perfil") return /* @__PURE__ */ React.createElement(Perfil, null);
    if (currentSection === "meu-plano") return /* @__PURE__ */ React.createElement(MeuPlano, null);
    if (currentSection === "indicacoes") return /* @__PURE__ */ React.createElement(Indicacoes, null);
    const mainItem = menuItems.find((item) => item.id === currentSection);
    if (mainItem && mainItem.component) {
      return /* @__PURE__ */ React.createElement(mainItem.component, null);
    }
    for (const item of menuItems) {
      if (item.submenu) {
        const subItem = item.submenu.find((sub) => sub.id === currentSection);
        if (subItem && subItem.component) {
          return /* @__PURE__ */ React.createElement(subItem.component, null);
        }
      }
    }
    return /* @__PURE__ */ React.createElement(Dashboard, null);
  };
  if (!isLoggedIn) {
    return /* @__PURE__ */ React.createElement(LoginScreen, null);
  }
  return /* @__PURE__ */ React.createElement("div", { className: `min-h-screen flex transition-colors duration-200 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}` }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `${sidebarHovered ? "w-64" : "w-16"} transition-all duration-300 flex flex-col ${isDarkMode ? "bg-gray-800 text-white" : "bg-slate-800 text-white"}`,
      onMouseEnter: () => setSidebarHovered(true),
      onMouseLeave: () => setSidebarHovered(false)
    },
    /* @__PURE__ */ React.createElement("div", { className: `p-4 border-b ${isDarkMode ? "border-gray-700" : "border-slate-700"}` }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center" }, sidebarHovered ? /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center relative" }, /* @__PURE__ */ React.createElement("div", { className: "w-3 h-3 bg-white rounded-full" }), /* @__PURE__ */ React.createElement("div", { className: "absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-blue-200 rounded-full" }), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-0.5 left-0.5 w-1 h-1 bg-blue-300 rounded-full" })), /* @__PURE__ */ React.createElement("h1", { className: "text-lg font-bold truncate" }, "Orion")) : /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center relative" }, /* @__PURE__ */ React.createElement("div", { className: "w-3 h-3 bg-white rounded-full" }), /* @__PURE__ */ React.createElement("div", { className: "absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-blue-200 rounded-full" }), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-0.5 left-0.5 w-1 h-1 bg-blue-300 rounded-full" })))),
    /* @__PURE__ */ React.createElement("nav", { className: "flex-1 p-4 space-y-2 overflow-y-auto" }, menuItems.map((item) => {
      const Icon = item.icon;
      const isExpanded = expandedMenus[item.id];
      const hasActiveSubmenu = item.submenu?.some((sub) => sub.id === currentSection);
      const isActive = item.id === currentSection || hasActiveSubmenu;
      return /* @__PURE__ */ React.createElement("div", { key: item.id }, /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => {
            if (item.hasSubmenu) {
              toggleMenu(item.id);
            } else {
              setCurrentSection(item.id);
            }
          },
          className: `w-full flex items-center justify-between p-3 rounded transition-colors ${isActive ? "bg-blue-600 text-white" : isDarkMode ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-300 hover:bg-slate-700 hover:text-white"}`
        },
        /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Icon, { size: 20, className: "flex-shrink-0" }), sidebarHovered && /* @__PURE__ */ React.createElement("span", { className: "ml-3 truncate" }, item.label)),
        sidebarHovered && item.hasSubmenu && /* @__PURE__ */ React.createElement(
          ChevronDown,
          {
            size: 16,
            className: `transition-transform ${isExpanded ? "rotate-180" : ""}`
          }
        )
      ), sidebarHovered && item.hasSubmenu && isExpanded && /* @__PURE__ */ React.createElement("div", { className: "ml-4 mt-2 space-y-1" }, item.submenu.map((subItem) => /* @__PURE__ */ React.createElement(
        "button",
        {
          key: subItem.id,
          onClick: () => setCurrentSection(subItem.id),
          className: `w-full text-left p-2 pl-8 rounded text-sm transition-colors ${currentSection === subItem.id ? "bg-blue-600 text-white" : isDarkMode ? "text-gray-400 hover:bg-gray-700 hover:text-white" : "text-gray-400 hover:bg-slate-700 hover:text-white"}`
        },
        subItem.label
      ))));
    })),
    sidebarHovered && /* @__PURE__ */ React.createElement("div", { className: `p-4 border-t ${isDarkMode ? "border-gray-700" : "border-slate-700"}` }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium" }, currentUser?.avatar || "A"), /* @__PURE__ */ React.createElement("div", { className: "ml-3" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium" }, currentUser?.name || "Anderson"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-400" }, currentUser?.role || "Administrador"))))
  ), /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex flex-col overflow-hidden" }, /* @__PURE__ */ React.createElement("header", { className: `shadow-sm border-b px-6 py-4 transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}` }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center relative" }, /* @__PURE__ */ React.createElement("div", { className: "w-2.5 h-2.5 bg-white rounded-full" }), /* @__PURE__ */ React.createElement("div", { className: "absolute top-0.5 right-0.5 w-1 h-1 bg-blue-200 rounded-full" }), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-0.5 left-0.5 w-0.5 h-0.5 bg-blue-300 rounded-full" })), /* @__PURE__ */ React.createElement("h2", { className: `text-lg font-semibold transition-colors duration-200 ${isDarkMode ? "text-white" : "text-gray-800"}` }, "Orion Gestor de Compras"))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-4" }, /* @__PURE__ */ React.createElement(TopMenu, null), /* @__PURE__ */ React.createElement("div", { className: `text-sm transition-colors duration-200 ${isDarkMode ? "text-gray-300" : "text-gray-600"}` }, (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR")), /* @__PURE__ */ React.createElement(UserDropdown, null)))), /* @__PURE__ */ React.createElement("main", { className: "flex-1 overflow-y-auto p-6" }, /* @__PURE__ */ React.createElement("div", { className: `mb-6 rounded-lg shadow-sm border p-6 transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}` }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg" }, currentUser?.avatar || "A"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: `text-lg font-semibold transition-colors duration-200 ${isDarkMode ? "text-white" : "text-gray-800"}` }, "Bem vindo (a), ", currentUser?.name || "Anderson", "!"), /* @__PURE__ */ React.createElement("p", { className: `text-sm transition-colors duration-200 ${isDarkMode ? "text-gray-300" : "text-gray-600"}` }, "Este \xE9 o seu painel de controle"))), /* @__PURE__ */ React.createElement("div", { className: `rounded-lg p-4 min-w-72 transition-colors duration-200 ${isDarkMode ? "bg-gradient-to-r from-blue-800 to-blue-900 text-white" : "bg-gradient-to-r from-slate-800 to-slate-900 text-white"}` }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs bg-slate-700 px-2 py-1 rounded" }, "Plus"), /* @__PURE__ */ React.createElement("div", { className: "text-yellow-400" }, "\u{1F451}")), /* @__PURE__ */ React.createElement("h4", { className: "font-semibold mb-1" }, "Plano Plus"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-300 mb-3" }, "Acesse recursos exclusivos e suporte premium"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { className: "bg-white text-slate-800 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100 transition-colors" }, "Assinar agora"), /* @__PURE__ */ React.createElement("button", { className: "border border-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-slate-700 transition-colors flex items-center gap-1" }, "Saiba mais \u2192")))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Users, { size: 16, className: "text-gray-500" }), /* @__PURE__ */ React.createElement("span", { className: `text-sm font-medium transition-colors duration-200 ${isDarkMode ? "text-gray-300" : "text-gray-700"}` }, "Primeiros passos")), /* @__PURE__ */ React.createElement("div", { className: "flex-1 max-w-md" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-1" }, /* @__PURE__ */ React.createElement("span", { className: `text-sm transition-colors duration-200 ${isDarkMode ? "text-gray-400" : "text-gray-600"}` }, "Progresso"), /* @__PURE__ */ React.createElement("span", { className: `text-sm font-medium transition-colors duration-200 ${isDarkMode ? "text-white" : "text-gray-800"}` }, "82%")), /* @__PURE__ */ React.createElement("div", { className: `w-full rounded-full h-2 transition-colors duration-200 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}` }, /* @__PURE__ */ React.createElement("div", { className: "bg-blue-600 h-2 rounded-full", style: { width: "82%" } }))))), renderContent())), showProductModal && /* @__PURE__ */ React.createElement(
    ProductModal,
    {
      product: editingProduct,
      onSave: handleSaveProduct,
      onClose: () => {
        setShowProductModal(false);
        setEditingProduct(null);
      }
    }
  ));
};
var stdin_default = OrionApp;
export {
  stdin_default as default
};
