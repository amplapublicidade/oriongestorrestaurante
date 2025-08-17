import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../config/axios';
import toast from 'react-hot-toast';

// Função para buscar produtos da API
const fetchProducts = async () => {
  const { data } = await api.get('/products');
  return data.data.products;
};

// Hook personalizado para gerir produtos
export const useProducts = () => {
  const queryClient = useQueryClient();

  // Busca os dados da API usando React Query
  const { data: products, isLoading, isError } = useQuery('products', fetchProducts);

  // Mutação para adicionar um novo produto
  const addProductMutation = useMutation(
    (newProduct) => api.post('/products', newProduct),
    {
      onSuccess: () => {
        // Invalida o cache para forçar uma nova busca
        queryClient.invalidateQueries('products');
        toast.success('Produto adicionado com sucesso!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao adicionar produto.');
      },
    }
  );

  // Mutação para atualizar um produto
  const updateProductMutation = useMutation(
    ({ id, productData }) => api.put(`/products/${id}`, productData),
    {
      onSuccess: (response) => {
        const updatedProduct = response.data.data.product;
        queryClient.setQueryData('products', (oldData) => {
          if (!oldData) return [];
          return oldData.map(product => 
            product.id === updatedProduct.id 
              ? updatedProduct 
              : product
          );
        });
        toast.success('Produto atualizado com sucesso!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao atualizar produto.');
      },
    }
  );

  // Mutação para deletar um produto
  const deleteProductMutation = useMutation(
    (id) => api.delete(`/products/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        toast.success('Produto removido com sucesso!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao remover produto.');
      },
    }
  );

  // Mutação para atualizar estoque
  const updateStockMutation = useMutation(
    ({ id, stockData }) => api.patch(`/products/${id}/stock`, stockData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        toast.success('Estoque atualizado com sucesso!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao atualizar estoque.');
      },
    }
  );

  return {
    products,
    isLoading,
    isError,
    addProduct: addProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    updateStock: updateStockMutation.mutate,
    isAdding: addProductMutation.isLoading,
    isUpdating: updateProductMutation.isLoading,
    isDeleting: deleteProductMutation.isLoading,
    isUpdatingStock: updateStockMutation.isLoading,
  };
};