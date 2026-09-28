import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminService from '../services/adminService';
import toast from 'react-hot-toast';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: adminService.getUsers,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => adminService.updateUser(id, data),
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  });
};
