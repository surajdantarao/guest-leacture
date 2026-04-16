import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User as UserIcon, AlertCircle, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import api from '../utils/api';

const AdminLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      const user = response.data;
      onLogin(user);
      
      // Professional navigation based on role
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'security' || user.role === 'visitor_security') {
        navigate('/security-dashboard');
      } else if (user.role === 'visitor') {
        navigate('/visitor-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-[440px] relative z-10 animate-slide-up">
        <div className="text-center mb-10">
          
          <h2 className="text-4xl font-black text-dark mb-3 tracking-tight">Staff Portal</h2>
          <p className="text-secondary font-medium">Secure access to GLVMS management</p>
        </div>

        <Card className="shadow-float backdrop-blur-md bg-white/80 border-white/40 p-8 md:p-10 rounded-[2.5rem]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-danger/5 border border-danger/10 rounded-2xl flex items-center gap-3 text-danger animate-fade-in">
                <AlertCircle size={20} />
                <span className="text-sm font-bold">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="name@institution.edu"
                  className="input-field pl-12 h-14"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="password" 
                  name="password"
                  required
                  placeholder="••••••••"
                  className="input-field pl-12 h-14"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full py-4 text-base font-black uppercase tracking-widest shadow-glow h-14"
                isLoading={isLoading}
              >
                Authorize Session <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
            </div>
          </form>
        </Card>
        
        <div className="mt-10 text-center space-y-4">
          <div className="flex justify-center gap-6">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-success" /> Encrypted
            </span>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-success" /> Multi-Role
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
