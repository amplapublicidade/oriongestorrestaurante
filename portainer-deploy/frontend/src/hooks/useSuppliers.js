import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../config/axios';
import toast from 'react-hot-toast';

// Função para buscar fornecedores da API
const fetchSuppliers = async () => {
  const { data } = await api.get('/suppliers');
  return data.data.suppliers;
};

// Hook personalizado para gerir fornecedores
export const useSuppliers = () => {
  const queryClient = useQueryClient();

  // Busca os dados da API usando React Query
  const { data: suppliers, isLoading, isError } = useQuery('suppliers', fetchSuppliers);

  // Mutação para adicionar um novo fornecedor
  const addSupplierMutation = useMutation(
    (newSupplier) => api.post('/suppliers', newSupplier),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('suppliers');
        toast.success('Fornecedor adicionado com sucesso!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao adicionar fornecedor.');
      },
    }
  );

  // Mutação para atualizar um fornecedor
  const updateSupplierMutation = useMutation(
    ({ id, supplierData }) => api.put(`/suppliers/${id}`, supplierData),
    {
      onSuccess: (response) => {
        const updatedSupplier = response.data.data.supplier;
        queryClient.setQueryData('suppliers', (oldData) => {
          if (!oldData) return [];
          return oldData.map(supplier => 
            supplier.id === updatedSupplier.id 
              ? updatedSupplier 
              : supplier
          );
        });
        toast.success('Fornecedor atualizado com sucesso!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao atualizar fornecedor.');
      },
    }
  );

  // Mutação para deletar um fornecedor
  const deleteSupplierMutation = useMutation(
    (id) => api.delete(`/suppliers/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('suppliers');
        toast.success('Fornecedor removido com sucesso!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao remover fornecedor.');
      },
    }
  );

  return {
    suppliers,
    isLoading,
    isError,
    addSupplier: addSupplierMutation.mutate,
    updateSupplier: updateSupplierMutation.mutate,
    deleteSupplier: deleteSupplierMutation.mutate,
    isAdding: addSupplierMutation.isLoading,
    isUpdating: updateSupplierMutation.isLoading,
    isDeleting: deleteSupplierMutation.isLoading,
  };
};