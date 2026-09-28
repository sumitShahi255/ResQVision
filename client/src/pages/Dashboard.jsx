import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';
import { FiAlertCircle, FiShield, FiUsers, FiBox, FiTrendingUp } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import Loader from '../components/common/Loader';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import EmergencyContacts from '../components/dashboard/EmergencyContacts';

const Dashboard = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useDashboard();

  if (isLoading) return <Loader fullScreen />;
  if (error) return <div className="p-6 text-danger">Failed to load dashboard data.</div>;

  const { reports = [], resources = [], teams = [] } = data;

  // Compute live stats
  const activeDisasters = reports.filter(r => r.status !== 'Resolved').length;
  const availableResources = resources.length;
  const activeTeams = teams.length;
  // Mock volunteers for now until user roles are fetched
  const volunteers = 120;

  const stats = [
    { label: 'Active Disasters', value: activeDisasters, icon: FiAlertCircle, color: 'text-danger', bg: 'bg-danger/20' },
    { label: 'Available Resources', value: availableResources, icon: FiBox, color: 'text-success', bg: 'bg-success/20' },
    { label: 'Rescue Teams', value: activeTeams, icon: FiShield, color: 'text-primary', bg: 'bg-primary/20' },
    { label: 'Volunteers', value: volunteers, icon: FiUsers, color: 'text-warning', bg: 'bg-warning/20' },
  ];

  // Aggregate charts
  const disasterTypes = reports.reduce((acc, report) => {
    acc[report.disasterType] = (acc[report.disasterType] || 0) + 1;
    return acc;
  }, {});

  const chartColors = {
    'Flood': '#2563EB',
    'Fire': '#EF4444',
    'Earthquake': '#F59E0B',
    'Landslide': '#8B5CF6',
    'Cyclone': '#10B981'
  };

  const chartData = Object.keys(disasterTypes).map(key => ({
    name: key,
    count: disasterTypes[key],
    color: chartColors[key] || '#94A3B8'
  }));

  const resourceData = resources.reduce((acc, resource) => {
    acc[resource.type] = (acc[resource.type] || 0) + 1;
    return acc;
  }, {});

  const resourceChart = Object.keys(resourceData).map(key => ({
    name: key,
    value: resourceData[key]
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto w-full overflow-y-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user?.name}</h1>
          <p className="text-gray-400">Here is the overview of the current emergency status.</p>
        </div>
        <div className="hidden lg:block w-64">
          <WeatherWidget />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card border border-gray-800 p-6 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            </div>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`text-2xl ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-gray-800 p-6 rounded-2xl h-[400px]">
          <h3 className="text-xl font-bold text-white mb-6">Disasters by Type</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8'}} />
                <YAxis stroke="#64748b" tick={{fill: '#94a3b8'}} allowDecimals={false} />
                <Tooltip 
                  cursor={{fill: '#334155'}}
                  contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff' }} 
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">No data available</div>
          )}
        </div>
        
        <div className="bg-card border border-gray-800 p-6 rounded-2xl h-[400px]">
          <h3 className="text-xl font-bold text-white mb-6">Resources Distribution</h3>
          {resourceChart.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={resourceChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                  {resourceChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex items-center justify-center h-full text-gray-500">No data available</div>
          )}
        </div>
        
        <div className="bg-card border border-gray-800 p-6 rounded-2xl flex flex-col h-[400px]">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 shrink-0">
            <FiTrendingUp className="text-primary"/> Recent Activity
          </h3>
          <div className="space-y-4 overflow-y-auto pr-2 flex-1">
            {reports.length > 0 ? reports.slice(0, 10).map((report, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-background rounded-xl border border-gray-800">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${report.status === 'Resolved' ? 'bg-success/20' : 'bg-danger/20'}`}>
                  <FiAlertCircle className={report.status === 'Resolved' ? 'text-success' : 'text-danger'} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white truncate">New {report.disasterType}</h4>
                  <p className="text-sm text-gray-400 truncate">{report.status}</p>
                </div>
                <div className="text-xs text-gray-500 shrink-0">
                  {new Date(report.createdAt).toLocaleDateString()}
                </div>
              </div>
            )) : (
              <div className="text-gray-500 text-center mt-10">No recent activity</div>
            )}
          </div>
        </div>

        {/* Emergency Contacts Panel */}
        <div className="lg:col-span-3">
          <EmergencyContacts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
