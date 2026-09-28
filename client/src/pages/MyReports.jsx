import React from 'react';
import { useMyReports } from '../hooks/useReports';
import Loader from '../components/common/Loader';
import { FiCheckCircle, FiClock, FiAlertTriangle, FiTarget } from 'react-icons/fi';

const statusIcons = {
  'Pending AI Review': <FiClock className="text-warning" />,
  'Verified': <FiCheckCircle className="text-primary" />,
  'Team Assigned': <FiTarget className="text-primary" />,
  'In Progress': <FiTarget className="text-primary" />,
  'Resolved': <FiCheckCircle className="text-success" />,
  'Fake': <FiAlertTriangle className="text-danger" />,
};

const MyReports = () => {
  const { data, isLoading, error } = useMyReports();

  if (isLoading) return <Loader fullScreen />;
  if (error) return <div className="p-6 text-danger">Failed to load reports</div>;

  const reports = data?.reports || [];

  return (
    <div className="p-6 max-w-7xl mx-auto w-full overflow-y-auto">
      <h1 className="text-3xl font-bold text-white mb-2">My Reports</h1>
      <p className="text-gray-400 mb-8">History of all disasters you have reported.</p>
      
      {reports.length === 0 ? (
        <div className="bg-card border border-gray-800 p-8 rounded-2xl text-center">
          <p className="text-gray-500">You haven't reported any disasters yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <div key={report._id} className="bg-card border border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-32 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                <img src={report.image} alt="Report" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">{report.disasterType}</h3>
                  <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                    {statusIcons[report.status]}
                    <span className="text-sm font-medium text-gray-300">{report.status}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{report.description}</p>
                <div className="flex gap-4 text-xs">
                  <div className="bg-danger/20 text-danger px-2 py-1 rounded font-medium">
                    Severity: {report.severity}
                  </div>
                  <div className="text-gray-500 flex items-center">
                    Reported on: {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;
