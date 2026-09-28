import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../providers/SocketProvider';
import { FiAlertTriangle, FiBell } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, markAllAsRead } = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications ? notifications.filter(n => !n.read).length : 0;

  return (
    <nav className="bg-card border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <FiAlertTriangle className="text-danger text-2xl" />
              <span className="text-xl font-bold tracking-tight text-white">AI Disaster Mapper</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link to="/map" className="text-gray-300 hover:text-white transition-colors">Map</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                
                {/* Notification Bell */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-300 hover:text-white transition-colors focus:outline-none"
                  >
                    <FiBell className="text-xl" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-danger rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-card border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
                      <div className="p-3 border-b border-gray-700 flex justify-between items-center bg-gray-800">
                        <span className="font-semibold text-white text-sm">Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="text-xs text-primary hover:text-blue-400">
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications?.length > 0 ? (
                          notifications.map((notif) => (
                            <div key={notif.id} className={`p-3 border-b border-gray-800 text-sm ${notif.read ? 'opacity-60' : 'bg-gray-800/50'}`}>
                              <span className="font-semibold text-white block">New {notif.data.disasterType} Report</span>
                              <span className="text-gray-400 text-xs truncate block">{notif.data.description}</span>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-700">
                  <span className="text-sm text-gray-400">Hi, {user.name} ({user.role})</span>
                  <button onClick={logout} className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded text-white transition-colors">Logout</button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-700">
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
