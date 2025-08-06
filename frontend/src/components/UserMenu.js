import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const UserMenu = ({ closeMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (closeMenu) closeMenu();
  };

  const handleNavigate = (path) => {
    // navigate(path); // Descomente quando as rotas existirem
    if (closeMenu) closeMenu();
  };

  return (
    <div className="py-2">
      <div className="px-4 py-2 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
      </div>
      <button
        onClick={() => handleNavigate('/profile')}
        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <UserIcon className="mr-3 h-4 w-4" />
        Meu Perfil
      </button>
      <button
        onClick={() => handleNavigate('/settings')}
        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <Cog6ToothIcon className="mr-3 h-4 w-4" />
        Configurações
      </button>
      <div className="border-t border-gray-100 my-1"></div>
      <button
        onClick={handleLogout}
        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
      >
        <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
        Sair
      </button>
    </div>
  );
};

export default UserMenu;
