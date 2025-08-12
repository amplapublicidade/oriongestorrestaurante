import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CubeIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import api from '../config/axios';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    supplier: '',
    unit: '',
    stock: 0,
    minStock: 0,
    price: 0,
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  // Validação em tempo real
  useEffect(() => {
    if (touched.name || touched.supplier || touched.unit) {
      validateForm();
    }
  }, [formData, touched]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome do produto é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (!formData.supplier) {
      newErrors.supplier = 'Fornecedor é obrigatório';
    }
    
    if (!formData.unit.trim()) {
      newErrors.unit = 'Unidade é obrigatória';
    }
    
    if (formData.stock < 0) {
      newErrors.stock = 'Estoque não pode ser negativo';
    }
    
    if (formData.minStock < 0) {
      newErrors.minStock = 'Estoque mínimo não pode ser negativo';
    }
    
    if (formData.price < 0) {
      newErrors.price = 'Preço não pode ser negativo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, suppliersRes] = await Promise.all([
        api.get('/products'),
        api.get('/suppliers')
      ]);
      
      if (productsRes.data.success) {
        setProducts(productsRes.data.data.products || []);
      }
      
      if (suppliersRes.data.success) {
        setSuppliers(suppliersRes.data.data.suppliers || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar produtos e fornecedores');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      supplier: '',
      unit: '',
      stock: 0,
      minStock: 0,
      price: 0,
      description: ''
    });
    setEditingProduct(null);
    setErrors({});
    setTouched({});
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const openNewModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      supplier: product.supplierId,
      unit: product.unit,
      stock: product.stock || 0,
      minStock: product.minStock || 0,
      price: product.price || 0,
      description: product.description || ''
    });
    setTouched({ name: true, supplier: true, unit: true });
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, preencha todos os campos obrigatórios corretamente');
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        supplierId: formData.supplier,
        unit: formData.unit.trim(),
        stock: parseFloat(formData.stock),
        minStock: parseFloat(formData.minStock),
        price: parseFloat(formData.price),
        description: formData.description.trim()
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await api.post('/products', payload);
        toast.success('Produto criado com sucesso!');
      }
      
      closeModal();
      loadData();
    } catch (error) {
      console.error('Erro ao salvar produto:', error.response?.data || error.message);
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join('\n');
        toast.error(errorMessages);
      } else {
        const msg = error.response?.data?.message || 'Erro ao salvar produto. Verifique os dados e tente novamente.';
        toast.error(msg);
      }
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await api.delete(`/products/${productId}`);
        toast.success('Produto excluído com sucesso!');
        loadData();
      } catch (error) {
        console.error('Erro ao excluir produto:', error.response?.data || error.message);
        const msg = error.response?.data?.message || 'Erro ao excluir produto.';
        toast.error(msg);
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Por favor, selecione um arquivo Excel (.xlsx ou .xls)');
      return;
    }

    setUploadFile(file);
  };

  const processExcelUpload = async () => {
    if (!uploadFile) {
      toast.error('Por favor, selecione um arquivo para upload');
      return;
    }

    console.log('🚀 Iniciando processamento do Excel...');
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          console.log('📖 Arquivo lido, processando dados...');
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Pular o cabeçalho (primeira linha)
          const rows = jsonData.slice(1);
          console.log(`📊 Total de linhas encontradas: ${rows.length}`);
          
          setUploadProgress(20);
          
          // Processar dados em lotes
          const batchSize = 10;
          let processed = 0;
          let errors = 0;
          
          for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);
            console.log(`🔄 Processando lote ${Math.floor(i/batchSize) + 1}/${Math.ceil(rows.length/batchSize)}`);
            
            for (const row of batch) {
              if (row.length >= 6) {
                // Corrigindo mapeamento das colunas baseado nos logs
                // Coluna 0: FORNECEDOR, Coluna 2: PRODUTO, Coluna 4: UNIDADE, Coluna 5: ESTOQUE
                const fornecedor = row[0];  // Primeira coluna
                const produto = row[2];     // Terceira coluna (índice 2)
                const unidade = row[4];     // Quinta coluna (índice 4) - CORRIGIDO
                const estoque = row[5];     // Sexta coluna (índice 5) - CORRIGIDO
                
                console.log(`📝 Processando linha: ${fornecedor} | ${produto} | ${unidade} | ${estoque}`);
                console.log(`🔍 Array completo da linha:`, row);
                console.log(`🔍 Comprimento da linha: ${row.length}`);
                console.log(`🔍 Índices: 0=${row[0]}, 2=${row[2]}, 4=${row[4]}, 5=${row[5]}`);
                
                if (fornecedor && produto && unidade) {
                  try {
                    console.log(`🏭 Criando/verificando fornecedor: ${fornecedor}`);
                    // Criar ou encontrar fornecedor
                    let supplierId = await findOrCreateSupplier(fornecedor.trim());
                    console.log(`✅ Fornecedor processado, ID: ${supplierId}`);
                    
                    console.log(`📦 Criando produto: ${produto}`);
                    // Criar produto
                    await createProduct({
                      name: produto.trim(),
                      supplierId,
                      unit: unidade.trim(),
                      stock: parseFloat(estoque) || 0,
                      minStock: 0,
                      price: 0,
                      description: `Importado via Excel - ${fornecedor.trim()}`
                    });
                    console.log(`✅ Produto criado: ${produto}`);
                    
                    processed++;
                  } catch (error) {
                    console.error(`❌ Erro ao processar linha ${i + 1}:`, error);
                    errors++;
                  }
                } else {
                  console.log(`⚠️ Linha ignorada - dados insuficientes:`, row);
                  console.log(`🔍 Verificação: fornecedor=${!!fornecedor}, produto=${!!produto}, unidade=${!!unidade}`);
                }
              }
            }
            
            setUploadProgress(20 + ((i + batchSize) / rows.length) * 60);
            await new Promise(resolve => setTimeout(resolve, 100)); // Pequena pausa para não sobrecarregar
          }
          
          console.log(`🎉 Processamento concluído! Processados: ${processed}, Erros: ${errors}`);
          setUploadProgress(100);
          toast.success(`Upload concluído! ${processed} produtos processados com sucesso.`);
          
          // Recarregar dados
          await loadData();
          setShowUploadModal(false);
          setUploadFile(null);
          
        } catch (error) {
          console.error('❌ Erro ao processar arquivo Excel:', error);
          toast.error('Erro ao processar arquivo Excel. Verifique o formato.');
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }
      };
      
      reader.readAsArrayBuffer(uploadFile);
      
    } catch (error) {
      console.error('❌ Erro no upload:', error);
      toast.error('Erro durante o upload do arquivo');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const findOrCreateSupplier = async (supplierName) => {
    try {
      console.log(`🔍 Procurando fornecedor existente: ${supplierName}`);
      // Tentar encontrar fornecedor existente
      const existingSupplier = suppliers.find(s => 
        s.name.toLowerCase() === supplierName.toLowerCase()
      );
      
      if (existingSupplier) {
        console.log(`✅ Fornecedor encontrado: ${existingSupplier.name} (ID: ${existingSupplier.id})`);
        return existingSupplier.id;
      }
      
      console.log(`🆕 Criando novo fornecedor: ${supplierName}`);
      // Criar novo fornecedor
      const response = await api.post('/suppliers', {
        name: supplierName,
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        code: `SUP_${Date.now()}`
      });
      
      console.log(`📡 Resposta da API suppliers:`, response.data);
      
      if (response.data.success) {
        const newSupplier = response.data.data.supplier;
        console.log(`✅ Fornecedor criado com sucesso:`, newSupplier);
        setSuppliers(prev => [...prev, newSupplier]);
        return newSupplier.id;
      }
      
      throw new Error('Falha ao criar fornecedor');
      
    } catch (error) {
      console.error(`❌ Erro ao criar fornecedor ${supplierName}:`, error);
      throw error;
    }
  };

  const createProduct = async (productData) => {
    try {
      console.log(`📦 Enviando produto para API:`, productData);
      const response = await api.post('/products', productData);
      console.log(`📡 Resposta da API products:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao criar produto:`, error);
      throw error;
    }
  };

  const downloadTemplate = () => {
    const template = [
      ['FORNECEDOR', '', 'PRODUTO', '', 'UNIDADE', 'ESTOQUE'],
      ['SH HORTALIÇAS', '', 'ALFACE AMERICANA', '', 'UNIDADE', '0'],
      ['HORTSUL', '', 'BERINGELA', '', 'KG', '0'],
      ['COMPORTO', '', 'GARFO/FACA DESCART', '', 'UNIDADE', '0']
    ];

    const ws = XLSX.utils.aoa_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    
    XLSX.writeFile(wb, 'template_produtos.xlsx');
  };

  const filteredProducts = products.filter(product => {
    const productName = product.name?.toLowerCase() || '';
    const supplierName = suppliers.find(s => s.id === product.supplierId)?.name?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    
    return productName.includes(search) || supplierName.includes(search);
  });

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Fornecedor não encontrado';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Produtos</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <ArrowUpTrayIcon className="w-5 h-5" />
            Importar Excel
          </button>
          <button
            onClick={downloadTemplate}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Template
          </button>
          <button
            onClick={openNewModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Novo Produto
          </button>
        </div>
      </div>

      {/* Busca */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome do produto ou fornecedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Carregando produtos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum produto encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Tente ajustar os termos de busca.' : 'Comece criando o primeiro produto ou importando via Excel.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fornecedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Est. Mín.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        {product.description && (
                          <div className="text-sm text-gray-500">{product.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getSupplierName(product.supplierId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.stock || 0}
                        {product.stock <= (product.minStock || 0) && (
                          <span className="ml-2 text-red-500 text-xs">⚠️ Baixo</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.minStock || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        R$ {(product.price || 0).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Produto */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Produto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nome do produto"
                  />
                  {errors.name && touched.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fornecedor <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.supplier}
                    onChange={(e) => handleFieldChange('supplier', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, supplier: true }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.supplier ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione um fornecedor</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                  {errors.supplier && touched.supplier && (
                    <p className="text-red-500 text-sm mt-1">{errors.supplier}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidade <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => handleFieldChange('unit', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, unit: true }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.unit ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="KG, UNIDADE, BD, etc."
                  />
                  {errors.unit && touched.unit && (
                    <p className="text-red-500 text-sm mt-1">{errors.unit}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estoque Atual
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.stock}
                    onChange={(e) => handleFieldChange('stock', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, stock: true }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.stock ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.stock && touched.stock && (
                    <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estoque Mínimo
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minStock}
                    onChange={(e) => handleFieldChange('minStock', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, minStock: true }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.minStock ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.minStock && touched.minStock && (
                    <p className="text-red-500 text-sm mt-1">{errors.minStock}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Unitário
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleFieldChange('price', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, price: true }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && touched.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descrição opcional do produto"
                />
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
                  {editingProduct ? 'Atualizar' : 'Criar'} Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Upload */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Importar Produtos via Excel</h2>
              <button 
                onClick={() => setShowUploadModal(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecione o arquivo Excel
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  O arquivo deve conter as colunas: FORNECEDOR, PRODUTO, UNIDADE, ESTOQUE
                </p>
              </div>
              
              {uploadFile && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-800">
                    Arquivo selecionado: <strong>{uploadFile.name}</strong>
                  </p>
                </div>
              )}
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Processando... {Math.round(uploadProgress)}%
                  </p>
                </div>
              )}
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={processExcelUpload}
                  disabled={!uploadFile || isUploading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Processando...' : 'Importar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products; 