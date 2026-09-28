import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/Map';
import ReportForm from './pages/ReportForm';
import MyReports from './pages/MyReports';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 flex flex-col">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/map" element={<MapPage />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/report" element={<ReportForm />} />
                  <Route path="/my-reports" element={<MyReports />} />
                  <Route path="/admin" element={<AdminPanel />} />
                </Route>
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#1E293B',
            color: '#fff',
            border: '1px solid #334155'
          }
        }}/>
      </AuthProvider>
    </Router>
  );
}

export default App;
