import React, { useState } from 'react';
import { useUsers, useUpdateUser } from '../hooks/useAdmin';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import { FiShield, FiUserX, FiCheckCircle } from 'react-icons/fi';
import { Navigate } from 'react-router-dom';

const AdminPanel = () => {
  const { user } = useAuth();
  const { data, isLoading } = useUsers();
  const { mutate: updateUser } = useUpdateUser();
  const [filter, setFilter] = useState('');

  if (user?.role !== 'Admin') {
    return <Navigate to="/dashboard" />;
  }

  if (isLoading) return <Loader fullScreen />;

  const users = data?.data || [];
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(filter.toLowerCase()) || 
    u.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto w-full overflow-y-auto h-[calc(100vh-64px)]">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FiShield className="text-primary" /> Admin Control Panel
          </h1>
          <p className="text-gray-400">Manage users, roles, and system access.</p>
        </div>
        <div className="w-64">
          <input 
            type="text" 
            placeholder="Search users..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-textLight focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-card border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={u.role}
                      onChange={(e) => updateUser({ id: u._id, data: { role: e.target.value } })}
                      className="bg-background border border-gray-700 rounded px-2 py-1 text-xs focus:outline-none"
                    >
                      <option value="Citizen">Citizen</option>
                      <option value="Volunteer">Volunteer</option>
                      <option value="RescueTeam">RescueTeam</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {u.isActive ? (
                      <span className="flex items-center gap-1 text-success bg-success/10 px-2 py-1 rounded w-fit text-xs font-bold">
                        <FiCheckCircle /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-danger bg-danger/10 px-2 py-1 rounded w-fit text-xs font-bold">
                        <FiUserX /> Blocked
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => updateUser({ id: u._id, data: { isActive: !u.isActive } })}
                      className={`text-xs px-3 py-1.5 rounded font-bold transition-colors ${u.isActive ? 'bg-danger/20 text-danger hover:bg-danger hover:text-white' : 'bg-success/20 text-success hover:bg-success hover:text-white'}`}
                    >
                      {u.isActive ? 'Block User' : 'Unblock User'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No users found matching "{filter}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
