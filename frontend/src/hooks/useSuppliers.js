import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

// Função para buscar fornecedores da API
const fetchSuppliers = async () => {
  const { data } = await axios.get('/api/suppliers');
  return data.data.suppliers;
};

// Hook personalizado para gerir fornecedores
export const useSuppliers = () => {
  const queryClient = useQueryClient();

  // Busca os dados da API usando React Query
  const { data: suppliers, isLoading, isError } = useQuery('suppliers', fetchSuppliers);

  // Mutação para adicionar um novo fornecedor
  const addSupplierMutation = useMutation(
    (newSupplier) => axios.post('/api/suppliers', newSupplier),
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
    ({ id, supplierData }) => axios.put(`/api/suppliers/${id}`, supplierData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('suppliers');
        toast.success('Fornecedor atualizado com sucesso!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao atualizar fornecedor.');
      },
    }
  );

  // Mutação para deletar um fornecedor
  const deleteSupplierMutation = useMutation(
    (id) => axios.delete(`/api/suppliers/${id}`),
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