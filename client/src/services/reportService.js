import api from './api';

export const getReports = async (filters = {}) => {
  const { data } = await api.get('/reports', { params: filters });
  return data.data; // Assuming response format { success, data }
};

export const getMyReports = async () => {
  const { data } = await api.get('/reports/my-reports');
  return data.data;
};

export const getReportById = async (id) => {
  const { data } = await api.get(`/reports/${id}`);
  return data.data;
};

export const createReport = async (reportData) => {
  const isFormData = reportData instanceof FormData;
  const config = isFormData ? { headers: { 'Content-Type': undefined } } : {};
  const { data } = await api.post('/reports', reportData, config);
  return data;
};

export const updateReportStatus = async ({ id, status }) => {
  const { data } = await api.patch(`/reports/${id}/status`, { status });
  return data;
};
