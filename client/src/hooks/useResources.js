import { useQuery } from '@tanstack/react-query';
import * as resourceService from '../services/resourceService';

export const useResources = (filters = {}) => {
  return useQuery({
    queryKey: ['resources', filters],
    queryFn: () => resourceService.getResources(filters),
    refetchInterval: 60000
  });
};

export const useNearbyResources = (lat, lng, radius = 5) => {
  return useQuery({
    queryKey: ['resources', 'nearby', { lat, lng, radius }],
    queryFn: () => resourceService.getNearbyResources({ lat, lng, radius }),
    enabled: !!lat && !!lng // Only run if lat and lng are available
  });
};
