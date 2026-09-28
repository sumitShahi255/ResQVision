import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as reportService from '../services/reportService';
import toast from 'react-hot-toast';

export const useReports = (filters = {}) => {
  return useQuery({
    queryKey: ['reports', filters],
    queryFn: () => reportService.getReports(filters),
    refetchInterval: 60000 // Refresh every minute
  });
};

export const useMyReports = () => {
  return useQuery({
    queryKey: ['my-reports'],
    queryFn: reportService.getMyReports,
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reportService.createReport,
    onMutate: async (newReport) => {
      // Cancel any outgoing refetches to avoid overwrite
      await queryClient.cancelQueries({ queryKey: ['reports'] });

      // Snapshot the previous value
      const previousReports = queryClient.getQueryData(['reports', {}]);

      // Optimistically update to the new value
      queryClient.setQueryData(['reports', {}], (old) => {
        const fallback = old ? [...old] : [];
        return [{ ...newReport, _id: Date.now().toString(), status: 'Pending', createdAt: new Date().toISOString() }, ...fallback];
      });

      // Return a context object with the snapshotted value
      return { previousReports };
    },
    onError: (err, newReport, context) => {
      // Rollback
      queryClient.setQueryData(['reports', {}], context.previousReports);
      toast.error(err.response?.data?.message || 'Failed to submit report');
    },
    onSettled: () => {
      // Refetch
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onSuccess: () => {
      toast.success('Report submitted successfully!');
    }
  });
};
