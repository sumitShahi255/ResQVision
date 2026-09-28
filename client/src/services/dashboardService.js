import api from './api';

export const getDashboardStats = async () => {
  // Since we don't have a dedicated dashboard backend endpoint yet, 
  // we'll fetch reports, resources, and teams, then aggregate them.
  // In a production app, the backend should have a /api/dashboard endpoint.
  
  const [reportsRes, resourcesRes, teamsRes] = await Promise.all([
    api.get('/reports'),
    api.get('/resources'),
    api.get('/teams', { validateStatus: () => true }) // validateStatus to avoid crash if unauthorized
  ]);

  const reports = reportsRes.data?.data?.reports || [];
  const resources = resourcesRes.data?.data?.resources || [];
  const teams = teamsRes.data?.data || [];

  return {
    reports,
    resources,
    teams
  };
};
