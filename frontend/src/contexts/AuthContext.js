import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/axios';
import toast from 'react-hot-toast';
import { DEMO_MODE, DEMO_USER, DEMO_TOKEN, simulateApiDelay, simulateRandomError } from '../config/demoMode';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.warn('useAuth deve ser usado dentro de AuthProvider');
    return {
      user: null,
      loading: false,
      login: () => Promise.resolve({ success: false }),
      register: () => Promise.resolve({ success: false }),
      logout: () => {},
      isAuthenticated: false,
      updateProfile: () => Promise.resolve({ success: false }),
      changePassword: () => Promise.resolve({ success: false })
    };
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Verificar se usuário está logado ao carregar app
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (!storedToken) {
        setLoading(false);
        return;
      }

      // Modo demo - simular verificação
      if (DEMO_MODE && storedToken === DEMO_TOKEN) {
        await simulateApiDelay(300);
        setUser(DEMO_USER);
        setToken(DEMO_TOKEN);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.data.user);
          setToken(storedToken);
        } else {
          localStorage.removeItem('token');
          setToken(null);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    // Modo demo - simular login
    if (DEMO_MODE) {
      await simulateApiDelay(800);
      
      if (simulateRandomError()) {
        toast.error('Erro de conexão. Tente novamente.');
        return { success: false, message: 'Erro de conexão' };
      }
      
      // Aceitar qualquer email/senha em demo
      setUser(DEMO_USER);
      setToken(DEMO_TOKEN);
      localStorage.setItem('token', DEMO_TOKEN);
      
      toast.success('Login realizado com sucesso! (Modo Demo)');
      return { success: true };
    }

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        const { user: userData, token: userToken } = response.data.data;
        
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
        
        toast.success('Login realizado com sucesso!');
        return { success: true };
      } else {
        toast.error(response.data.message || 'Erro ao fazer login');
        return { success: false, message: response.data.message };
      }
      
    } catch (error) {
      console.error('Erro no login:', error);
      const message = error.response?.data?.message || 'Erro ao fazer login';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    // Modo demo - simular registro
    if (DEMO_MODE) {
      await simulateApiDelay(1000);
      
      if (simulateRandomError()) {
        toast.error('Erro de conexão. Tente novamente.');
        return { success: false, message: 'Erro de conexão' };
      }
      
      // Simular criação de usuário
      const newUser = { ...DEMO_USER, name, email };
      setUser(newUser);
      setToken(DEMO_TOKEN);
      localStorage.setItem('token', DEMO_TOKEN);
      
      toast.success('Conta criada com sucesso! (Modo Demo)');
      return { success: true };
    }

    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password
      });

      if (response.data.success) {
        const { user: userData, token: userToken } = response.data.data;
        
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
        
        toast.success('Conta criada com sucesso!');
        return { success: true };
      } else {
        toast.error(response.data.message || 'Erro ao criar conta');
        return { success: false, message: response.data.message };
      }
      
    } catch (error) {
      console.error('Erro no registro:', error);
      const message = error.response?.data?.message || 'Erro ao criar conta';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    toast.success('Logout realizado com sucesso!');
  };

  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      if (response.data.success) {
        setUser(response.data.data.user);
        toast.success('Perfil atualizado com sucesso!');
        return { success: true };
      } else {
        toast.error(response.data.message || 'Erro ao atualizar perfil');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      const message = error.response?.data?.message || 'Erro ao atualizar perfil';
      toast.error(message);
      return { success: false, message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      if (response.data.success) {
        toast.success('Senha alterada com sucesso!');
        return { success: true };
      } else {
        toast.error(response.data.message || 'Erro ao alterar senha');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      const message = error.response?.data?.message || 'Erro ao alterar senha';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Se ainda está carregando, mostrar loading
  if (loading) {
    return (
      <AuthContext.Provider value={{
        user: null,
        token: null,
        loading: true,
        login: () => Promise.resolve({ success: false }),
        register: () => Promise.resolve({ success: false }),
        logout: () => {},
        updateProfile: () => Promise.resolve({ success: false }),
        changePassword: () => Promise.resolve({ success: false }),
        isAuthenticated: false
      }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando...</p>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 