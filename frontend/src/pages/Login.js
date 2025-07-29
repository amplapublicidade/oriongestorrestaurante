import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login, register, isAuthenticated } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    remember: false
  });

  // Se já estiver logado, redirecionar para dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isRegisterMode) {
        result = await register(formData.name, formData.email, formData.password);
      } else {
        result = await login(formData.email, formData.password);
      }

      if (!result.success) {
        console.error('Erro:', result.message);
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setFormData({
      name: '',
      email: '',
      password: '',
      remember: false
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <span className="text-white text-2xl font-bold">📦</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Orion</h1>
          <p className="text-blue-200">Gestor de Restaurante</p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isRegisterMode ? 'Criar Conta' : 'Bem-vindo de volta'}
            </h2>
            <p className="text-gray-600">
              {isRegisterMode 
                ? 'Preencha os dados para criar sua conta' 
                : 'Entre com suas credenciais para acessar o sistema'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome (apenas no modo registro) */}
            {isRegisterMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-primary"
                  placeholder="Seu nome completo"
                  required={isRegisterMode}
                />
              </div>
            )}

            {/* E-mail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-primary"
                placeholder="seu@email.com"
                required
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input-primary"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {/* Lembrar de mim (apenas no modo login) */}
            {!isRegisterMode && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleInputChange}
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

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isRegisterMode ? 'Criando conta...' : 'Entrando...'}
                </div>
              ) : (
                isRegisterMode ? 'Criar Conta' : 'Entrar'
              )}
            </button>
          </form>

          {/* Divisor */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">ou</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Alternar modo */}
          <div className="text-center">
            <p className="text-gray-600">
              {isRegisterMode ? 'Já tem uma conta?' : 'Não tem uma conta?'}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                {isRegisterMode ? 'Fazer login' : 'Criar conta'}
              </button>
            </p>
          </div>

          {/* Credenciais demo */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2 font-medium">
              Credenciais de demonstração:
            </p>
            <p className="text-xs text-gray-500">E-mail: admin@orion.com</p>
            <p className="text-xs text-gray-500">Senha: 123456</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-200 text-sm">
            © 2025 Orion Gestor de Restaurante. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 