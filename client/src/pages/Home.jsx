import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import { FiMap, FiShield, FiBell } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-background/90 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent z-0"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight"
          >
            AI-Powered Disaster <br className="hidden md:block"/> Resource Mapper
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            Real-time disaster reporting, AI-verified severity analysis, and optimized resource allocation for faster emergency response.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/map">
              <Button variant="danger" className="w-full sm:w-auto text-lg px-8 py-3">
                Report Disaster
              </Button>
            </Link>
            <Link to="/map">
              <Button variant="primary" className="w-full sm:w-auto text-lg px-8 py-3">
                View Live Map
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-card border-y border-gray-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-2xl border border-gray-800 text-center">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMap className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Live Geolocation</h3>
              <p className="text-gray-400">Track active disasters and available resources on a real-time interactive map.</p>
            </div>
            
            <div className="bg-background p-6 rounded-2xl border border-gray-800 text-center">
              <div className="bg-danger/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="text-danger text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Verification</h3>
              <p className="text-gray-400">Automated image analysis to verify reports and predict severity immediately.</p>
            </div>
            
            <div className="bg-background p-6 rounded-2xl border border-gray-800 text-center">
              <div className="bg-success/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBell className="text-success text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Alerts</h3>
              <p className="text-gray-400">Real-time notifications for rescue teams and affected citizens nearby.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
