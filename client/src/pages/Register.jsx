import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { motion } from 'framer-motion';

const Register = () => {
  const { register: registerForm, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { register } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const success = await register(data);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-background to-card z-0"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-card/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-800 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">Join the disaster response network</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input 
            label="Full Name" 
            placeholder="John Doe"
            error={errors.name?.message}
            {...registerForm('name', { required: 'Name is required' })}
          />
          
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="john@example.com"
            error={errors.email?.message}
            {...registerForm('email', { 
              required: 'Email is required',
              pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' }
            })}
          />
          
          <div className="w-full mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
            <select 
              className="w-full bg-card border border-gray-700 rounded-lg px-4 py-2 text-textLight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              {...registerForm('role')}
            >
              <option value="Citizen">Citizen</option>
              <option value="Volunteer">Volunteer</option>
              <option value="RescueTeam">Rescue Team</option>
            </select>
          </div>

          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••"
            error={errors.password?.message}
            {...registerForm('password', { 
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters' }
            })}
          />
          
          <Button type="submit" className="w-full mt-6" isLoading={isSubmitting}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
