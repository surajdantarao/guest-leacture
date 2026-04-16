import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Calendar, MapPin, Send, ArrowLeft } from 'lucide-react';
import Card from '../Card';
import Button from '../Button';
import api from '../../utils/api';

const Vrequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    purpose: '',
    date: new Date().toISOString().split('T')[0],
    department: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Logic for submitting visit request
      await api.post('/visitors/request', {
        purpose: formData.purpose,
        visit_date: formData.date,
        department: formData.department,
      });
      navigate('/visitor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container-max max-w-2xl mx-auto space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-bold text-sm group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="space-y-2">
          <div className="inline-flex items-center px-3 py-1 bg-primary/10 rounded-full text-primary font-bold text-[10px] uppercase tracking-wider border border-primary/10">
            Digital Entry Pass
          </div>
          <h1 className="text-3xl font-black text-dark tracking-tight">Request Visiting Pass</h1>
          <p className="text-secondary">Fill in the details below to request a campus entry permit.</p>
        </div>

        {error && (
          <div className="p-4 bg-danger/5 border border-danger/20 text-danger rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <Card className="shadow-float border-none bg-white/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="purpose" className="text-sm font-bold text-dark ml-1 flex items-center gap-2">
                <ClipboardList size={16} className="text-primary" />
                Purpose of Visit
              </label>
              <input
                type="text"
                id="purpose"
                placeholder="e.g. Guest Lecture, Meeting, Document Verification"
                required
                className="input-field"
                value={formData.purpose}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-bold text-dark ml-1 flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  Date of Visit
                </label>
                <input
                  type="date"
                  id="date"
                  required
                  className="input-field"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="department" className="text-sm font-bold text-dark ml-1 flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  Department / Host
                </label>
                <select
                  id="department"
                  required
                  className="input-field appearance-none"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  <option>Computer Engineering</option>
                  <option>Mechanical Engineering</option>
                  <option>Electrical Engineering</option>
                  <option>Information Technology</option>
                  <option>Civil Engineering</option>
                  <option>Administration</option>
                  <option>Registrar Office</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full py-4 text-base font-black uppercase tracking-widest shadow-glow"
              >
                Submit Request <Send size={18} className="ml-3" />
              </Button>
            </div>
          </form>
        </Card>

        <p className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          Approval notification will be sent via WhatsApp
        </p>
      </div>
    </div>
  );
};

export default Vrequest;
