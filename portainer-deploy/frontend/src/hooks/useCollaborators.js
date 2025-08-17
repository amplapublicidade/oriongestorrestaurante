import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../config/axios';
import toast from 'react-hot-toast';

const fetchCollaborators = async () => {
  const { data } = await api.get('/collaborators');
  return data.data.users; // A API retorna um objeto com a chave 'users'
};

export const useCollaborators = () => {
  const queryClient = useQueryClient();

  const { data: collaborators, isLoading, isError } = useQuery('collaborators', fetchCollaborators);

  const addCollaboratorMutation = useMutation(
    (newCollaborator) => api.post('/collaborators', newCollaborator),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('collaborators');
        toast.success('Colaborador adicionado com sucesso!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao adicionar colaborador.');
      },
    }
  );

  const updateCollaboratorMutation = useMutation(
    ({ id, collaboratorData }) => api.put(`/collaborators/${id}`, collaboratorData),
    {
      onSuccess: (response) => {
        const updatedCollaborator = response.data.data.user;
        queryClient.setQueryData('collaborators', (oldData) => {
          if (!oldData) return [];
          return oldData.map(collaborator => 
            collaborator.id === updatedCollaborator.id 
              ? { ...collaborator, ...updatedCollaborator } 
              : collaborator
          );
        });
        toast.success('Colaborador atualizado com sucesso!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao atualizar colaborador.');
      },
    }
  );

  const deleteCollaboratorMutation = useMutation(
    (id) => api.delete(`/collaborators/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('collaborators');
        toast.success('Colaborador removido com sucesso!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao remover colaborador.');
      },
    }
  );

  return {
    collaborators,
    isLoading,
    isError,
    addCollaborator: addCollaboratorMutation.mutate,
    updateCollaborator: updateCollaboratorMutation.mutate,
    deleteCollaborator: deleteCollaboratorMutation.mutate,
    isAdding: addCollaboratorMutation.isLoading,
    isUpdating: updateCollaboratorMutation.isLoading,
    isDeleting: deleteCollaboratorMutation.isLoading,
  };
}; 
