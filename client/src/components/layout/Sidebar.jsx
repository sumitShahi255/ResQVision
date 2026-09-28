import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiHome, FiMap, FiFileText, FiBox, FiUsers, FiSettings, FiBarChart2, FiShield } from 'react-icons/fi';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || user.role !== 'Admin') return null; // Show only for Admin right now

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    { name: 'Reports', path: '/dashboard/reports', icon: FiFileText },
    { name: 'Resources', path: '/dashboard/resources', icon: FiBox },
    { name: 'Teams', path: '/dashboard/teams', icon: FiUsers },
    { name: 'Analytics', path: '/dashboard/analytics', icon: FiBarChart2 },
    { name: 'Settings', path: '/dashboard/settings', icon: FiSettings },
  ];

  return (
    <aside className="w-64 bg-card border-r border-gray-800 h-[calc(100vh-64px)] sticky top-16 hidden md:block">
      <div className="py-6 px-4">
        <h3 className="text-xs uppercase text-gray-500 font-bold mb-4 px-2">Admin Tools</h3>
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="text-lg" />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
          {user.role === 'Admin' && (
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/admin' ? 'bg-red-900/20 text-red-500' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <FiShield className="text-lg" />
              <span className="font-medium">Admin Panel</span>
            </Link>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
