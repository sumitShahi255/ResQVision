import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCreateReport } from '../hooks/useReports';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { motion } from 'framer-motion';
import { FiMapPin } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';

const ReportForm = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { mutate: createReport, isPending } = useCreateReport();
  const navigate = useNavigate();
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleGetLocation = () => {
    setGettingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('lat', position.coords.latitude);
          setValue('lng', position.coords.longitude);
          setGettingLocation(false);
          toast.success('Location acquired');
        },
        (error) => {
          setGettingLocation(false);
          toast.error('Failed to get location. Please enter manually.');
        }
      );
    } else {
      setGettingLocation(false);
      toast.error('Geolocation not supported');
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('disasterType', data.disasterType);
    formData.append('description', data.description);
    
    formData.append('location', JSON.stringify({
      type: 'Point',
      coordinates: [parseFloat(data.lng), parseFloat(data.lat)]
    }));

    if (data.image && data.image.length > 0) {
      formData.append('file', data.image[0]);
    }
    
    createReport(formData, {
      onSuccess: () => navigate('/map')
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-gray-800 p-8 rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Report a Disaster</h1>
        <p className="text-gray-400 mb-8">Provide accurate details to help rescue teams respond faster.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Disaster Type</label>
              <select 
                className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-textLight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                {...register('disasterType', { required: 'Type is required' })}
              >
                <option value="">Select Type</option>
                <option value="Flood">Flood</option>
                <option value="Earthquake">Earthquake</option>
                <option value="Cyclone">Cyclone</option>
                <option value="Fire">Fire</option>
                <option value="Landslide">Landslide</option>
              </select>
              {errors.disasterType && <p className="text-danger text-xs mt-1">{errors.disasterType.message}</p>}
            </div>

            <div className="flex flex-col justify-end">
              <Button type="button" variant="outline" onClick={handleGetLocation} disabled={gettingLocation}>
                <FiMapPin /> {gettingLocation ? 'Locating...' : 'Use Current Location'}
              </Button>
            </div>

            <Input 
              label="Latitude" 
              type="number" 
              step="any"
              placeholder="e.g. 19.0760"
              error={errors.lat?.message}
              {...register('lat', { 
                required: 'Latitude is required',
                min: { value: -90, message: 'Invalid latitude' },
                max: { value: 90, message: 'Invalid latitude' }
              })}
            />

            <Input 
              label="Longitude" 
              type="number" 
              step="any"
              placeholder="e.g. 72.8777"
              error={errors.lng?.message}
              {...register('lng', { 
                required: 'Longitude is required',
                min: { value: -180, message: 'Invalid longitude' },
                max: { value: 180, message: 'Invalid longitude' }
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Upload Disaster Image</label>
            <input 
              type="file" 
              accept="image/*"
              className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-textLight file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 transition-all"
              {...register('image', { required: 'An image is required for AI verification' })}
            />
            {errors.image && <p className="text-danger text-xs mt-1">{errors.image.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea 
              rows="4"
              className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-textLight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Describe the situation, severity, and any immediate help needed..."
              {...register('description', { 
                required: 'Description is required',
                minLength: { value: 10, message: 'Please provide more details (min 10 chars)' }
              })}
            ></textarea>
            {errors.description && <p className="text-danger text-xs mt-1">{errors.description.message}</p>}
          </div>

          <Button type="submit" className="w-full text-lg py-3" isLoading={isPending}>
            Submit Report
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ReportForm;
