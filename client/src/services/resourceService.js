import api from './api';

export const getResources = async (filters = {}) => {
  const { data } = await api.get('/resources', { params: filters });
  return data.data;
};

export const getNearbyResources = async ({ lat, lng, radius }) => {
  const { data } = await api.get('/resources/nearby', { params: { lat, lng, radius } });
  return data.data;
};

export const createResource = async (resourceData) => {
  const { data } = await api.post('/resources', resourceData);
  return data;
};
