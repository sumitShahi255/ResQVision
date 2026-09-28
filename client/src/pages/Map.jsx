import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import { FiFilter, FiSearch, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useReports } from '../hooks/useReports';
import { useResources } from '../hooks/useResources';
import Loader from '../components/common/Loader';
import RoutingMachine from '../components/map/RoutingMachine';
import L from 'leaflet';
import toast from 'react-hot-toast';

// Helper component to update map view when position changes
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
};

// Define custom icons
const createIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const icons = {
  Flood: createIcon('blue'),
  Fire: createIcon('red'),
  Earthquake: createIcon('violet'),
  Landslide: createIcon('brown'),
  Cyclone: createIcon('green'),
  DefaultDisaster: createIcon('orange'),
  Hospital: createIcon('green'),
  Shelter: createIcon('gold'),
  DefaultResource: createIcon('grey')
};

const Map = () => {
  const [position, setPosition] = useState([19.0760, 72.8777]); // Default Mumbai
  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    disasterType: ''
  });
  const [routePoints, setRoutePoints] = useState({ start: null, end: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (!searchQuery.trim()) return;
      setIsSearching(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data && data.length > 0) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          toast.success('Location found!');
        } else {
          toast.error('Location not found');
        }
      } catch (err) {
        toast.error('Search failed');
      } finally {
        setIsSearching(false);
      }
    }
  };
  
  const { data: reportsRes, isLoading: loadingReports } = useReports(filters);
  const reports = reportsRes?.reports || [];
  const { data: resourcesRes, isLoading: loadingResources } = useResources();
  const resources = resourcesRes?.resources || [];

  if (loadingReports || loadingResources) return <Loader fullScreen />;

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] w-full relative">
      
      {/* Sidebar for Map Filters */}
      <div className="w-full md:w-80 bg-card border-r border-gray-800 p-4 overflow-y-auto z-10 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Map Filters</h2>
          <div className="flex gap-2">
            {(routePoints.start || routePoints.end) && (
               <button onClick={() => setRoutePoints({start: null, end: null})} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white">Clear Route</button>
            )}
            <Link to="/report" className="bg-danger hover:bg-red-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors">
              <FiPlus /> Report
            </Link>
          </div>
        </div>
        
        <div className="relative mb-6">
          <FiSearch 
            className="absolute left-3 top-3 text-gray-400 cursor-pointer hover:text-white" 
            onClick={handleSearch}
          />
          <input 
            type="text" 
            placeholder={isSearching ? "Searching..." : "Search location..."}
            className="w-full bg-background border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-textLight focus:outline-none focus:border-primary disabled:opacity-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            disabled={isSearching}
          />
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-300 mb-2 flex items-center gap-2">
              <FiFilter /> Disaster Type
            </h3>
            <select 
              value={filters.disasterType} 
              onChange={(e) => setFilters({...filters, disasterType: e.target.value})}
              className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 text-textLight text-sm focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="Flood">Flood</option>
              <option value="Fire">Fire</option>
              <option value="Earthquake">Earthquake</option>
              <option value="Cyclone">Cyclone</option>
            </select>
          </div>

          <div>
            <h3 className="font-semibold text-gray-300 mb-2 mt-4 flex items-center gap-2">
              <FiFilter /> Severity
            </h3>
            <select 
              value={filters.severity} 
              onChange={(e) => setFilters({...filters, severity: e.target.value})}
              className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 text-textLight text-sm focus:outline-none"
            >
              <option value="">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <h3 className="font-semibold text-gray-300 mb-2 mt-4 flex items-center gap-2">
              <FiFilter /> Status
            </h3>
            <select 
              value={filters.status} 
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 text-textLight text-sm focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="Pending AI Review">Pending AI Review</option>
              <option value="Verified">Verified</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 h-full z-0 relative">
        <MapContainer center={position} zoom={11} className="w-full h-full" zoomControl={true}>
          <MapUpdater center={position} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">Carto</a>'
          />
          
          {/* Render Disasters */}
          {reports.map((report) => (
            <Marker 
              key={report._id} 
              position={[report.location.coordinates[1], report.location.coordinates[0]]}
              icon={icons[report.disasterType] || icons.DefaultDisaster}
            >
              <Popup className="bg-card text-white">
                <div className="text-gray-800 min-w-[200px]">
                  <h3 className="font-bold text-lg text-danger mb-1">{report.disasterType}</h3>
                  <div className="text-sm mb-2">
                    <span className="font-semibold">Severity:</span> <span className="uppercase text-xs bg-gray-200 px-1 rounded">{report.severity}</span>
                  </div>
                  <p className="text-sm mb-2">{report.description}</p>
                  <div className="text-xs text-gray-500 mb-3">
                    Reported on: {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                  <button 
                    onClick={() => setRoutePoints(prev => ({...prev, end: [report.location.coordinates[1], report.location.coordinates[0]]}))}
                    className="w-full bg-danger hover:bg-red-600 text-white text-xs font-bold py-1 px-2 rounded"
                  >
                    Set as Destination
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Render Resources */}
          {resources.map((resource) => (
            <Marker 
              key={resource._id} 
              position={[resource.location.coordinates[1], resource.location.coordinates[0]]}
              icon={icons[resource.type] || icons.DefaultResource}
            >
              <Popup className="bg-card text-white">
                <div className="text-gray-800 min-w-[200px]">
                  <h3 className="font-bold text-lg text-success mb-1">{resource.name}</h3>
                  <div className="text-sm mb-2">
                    <span className="font-semibold">Type:</span> {resource.type}
                  </div>
                  <p className="text-sm mb-3">Capacity: {resource.capacity}</p>
                  <button 
                    onClick={() => setRoutePoints(prev => ({...prev, start: [resource.location.coordinates[1], resource.location.coordinates[0]]}))}
                    className="w-full bg-success hover:bg-green-600 text-white text-xs font-bold py-1 px-2 rounded"
                  >
                    Set as Start Point
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Render Route if both start and end points exist */}
          {routePoints.start && routePoints.end && (
            <RoutingMachine start={routePoints.start} end={routePoints.end} />
          )}

        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
