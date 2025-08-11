import React, { useEffect, useState } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import api from '../config/axios';
import toast from 'react-hot-toast';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    code: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    loadBranches();
  }, []);

  // Validação em tempo real
  useEffect(() => {
    if (touched.name || touched.email || touched.phone || touched.address || touched.city || touched.state || touched.zip || touched.code) {
      validateForm();
    }
  }, [formData, touched]);

  const validateForm = () => {
    const newErrors = {};
    
    // Campos obrigatórios
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (formData.phone.trim().length < 8) {
      newErrors.phone = 'Telefone deve ter pelo menos 8 caracteres';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'Estado é obrigatório';
    }
    
    if (!formData.zip.trim()) {
      newErrors.zip = 'CEP é obrigatório';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Código é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const loadBranches = async () => {
    try {
      setLoading(true);
      const response = await api.get('/branches');
      if (response.data?.success) {
        setBranches(response.data.data.branches || []);
      } else if (Array.isArray(response.data)) {
        setBranches(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar filiais:', error);
      toast.error('Erro ao carregar filiais');
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name || '',
      email: branch.email || '',
      phone: branch.phone || '',
      address: branch.address || '',
      city: branch.city || '',
      state: branch.state || '',
      zip: branch.zip || '',
      code: branch.code || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', address: '', city: '', state: '', zip: '', code: '' });
    setEditingBranch(null);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, preencha todos os campos obrigatórios corretamente');
      return;
    }
    
    try {
      if (editingBranch) {
        const response = await api.put(`/branches/${editingBranch.id}`, formData);
        if (response.data?.success) toast.success('Filial atualizada com sucesso!');
      } else {
        const response = await api.post('/branches', formData);
        if (response.data?.success) toast.success('Filial criada com sucesso!');
      }
      closeModal();
      loadBranches();
    } catch (error) {
      // Log detalhado do erro para depuração no console do navegador
      console.error('Erro ao salvar filial:', error.response?.data || error.message);

      // Tenta extrair mensagens de erro de validação do backend (padrão do express-validator)
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join('\n');
        toast.error(errorMessages);
      } else {
        const msg = error.response?.data?.message || 'Erro ao salvar filial. Verifique os dados e tente novamente.';
        toast.error(msg);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta filial?')) return;
    try {
      await api.delete(`/branches/${id}`);
      toast.success('Filial excluída com sucesso!');
      loadBranches();
    } catch (error) {
      console.error('Erro ao excluir filial:', error.response?.data || error.message);
      const msg = error.response?.data?.message || 'Erro ao excluir filial.';
      toast.error(msg);
    }
  };

  const filtered = branches.filter((b) =>
    [b.name, b.email, b.phone, b.address, b.city, b.state, b.code]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Filiais</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Nova Filial
        </button>
      </div>

      {/* Busca */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, cidade, código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Carregando filiais...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma filial encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">Adicione sua primeira filial.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filial</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localização</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{b.name}</div>
                      <div className="text-sm text-gray-500">Código: {b.code || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400" /> {b.email || '-'}
                      </div>
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <PhoneIcon className="h-4 w-4 text-gray-400" /> {b.phone || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4 text-gray-400" />
                        <span>{[b.address, b.city, b.state, b.zip].filter(Boolean).join(', ') || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => openEdit(b)} className="text-blue-600 hover:text-blue-900" title="Editar">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:text-red-900" title="Excluir">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Nova Filial</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nome da filial"
                  />
                  {errors.name && touched.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="email@exemplo.com"
                  />
                  {errors.email && touched.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="(11) 99999-9999"
                  />
                  {errors.phone && touched.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleFieldChange('code', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, code: true }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.code ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Código da filial"
                  />
                  {errors.code && touched.code && (
                    <p className="text-red-500 text-sm mt-1">{errors.code}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, address: true }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Rua, número, complemento"
                  />
                  {errors.address && touched.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, city: true }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nome da cidade"
                  />
                  {errors.city && touched.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleFieldChange('state', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, state: true }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="UF"
                  />
                  {errors.state && touched.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.zip}
                    onChange={(e) => handleFieldChange('zip', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, zip: true }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.zip ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="00000-000"
                  />
                  {errors.zip && touched.zip && (
                    <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={Object.keys(errors).length > 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Salvar Filial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branches;
