import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, UserPlus, ShieldCheck } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import api from '../utils/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    whatsapp_number: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/auth/register', {
        ...formData,
        role: 'visitor'
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50/50 p-4 pt-28 pb-12 relative overflow-x-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-card mb-6">
            <UserPlus className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-dark tracking-tight mb-2">Create Account</h2>
          <p className="text-secondary font-medium">Register to request campus visits and track sessions</p>
        </div>

        <Card className="shadow-float backdrop-blur-sm bg-white/90">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-danger/5 border border-danger/10 text-danger rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-dark ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="John Doe"
                  className="input-field pl-12"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-dark ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="john@example.com"
                  className="input-field pl-12"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-dark ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="text" 
                    name="phone"
                    required
                    placeholder="+91"
                    className="input-field pl-12"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-dark ml-1">WhatsApp (Optional)</label>
                <input 
                  type="text" 
                  name="whatsapp_number"
                  placeholder="Same as phone?"
                  className="input-field"
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-dark ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="password" 
                  name="password"
                  required
                  placeholder="••••••••"
                  className="input-field pl-12"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full py-4 text-base font-black uppercase tracking-widest shadow-glow"
                isLoading={isLoading}
              >
                Sign Up <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-secondary font-medium">Already have an account? </span>
            <Link to="/login" className="text-primary font-black hover:underline tracking-tight">
              Sign In
            </Link>
          </div>
        </Card>

        <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Registration Portal</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
