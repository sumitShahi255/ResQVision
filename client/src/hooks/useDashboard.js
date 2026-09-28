import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../services/dashboardService';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardStats,
    refetchInterval: 60000 // Refresh every minute
  });
};
