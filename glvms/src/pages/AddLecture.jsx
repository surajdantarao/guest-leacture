import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import LectureForm from '../components/LectureForm';
import api from '../utils/api';
import { ChevronLeft } from 'lucide-react';

const AddLecture = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddLecture = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      await api.post('/lectures', data);
      navigate('/guest-lectures');
    } catch (err) {
      console.error('Error adding lecture:', err);
      setError(err.response?.data?.message || 'Failed to create lecture. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-40 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-40 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="container-max relative z-10">
        <div className="max-w-2xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 animate-slide-up">
            <button
              onClick={() => navigate('/guest-lectures')}
              className="flex items-center space-x-2 text-primary font-black uppercase text-[10px] tracking-[0.3em] hover:opacity-70 transition-all mb-4 mx-auto"
            >
              <ChevronLeft size={14} />
              <span>Return to Schedule</span>
            </button>
            <h1 className="text-5xl md:text-6xl font-black text-dark tracking-tighter leading-none">
              Schedule <span className="text-primary italic">Lecture</span>
            </h1>
            <p className="text-secondary font-medium">
              Configure institutional guest lecture parameters.
            </p>
          </div>

          {error && (
            <div className="p-6 bg-danger/5 border border-danger/10 text-danger rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="h-3 w-3 rounded-full bg-danger animate-pulse"></div>
              <p className="font-bold text-sm tracking-tight leading-relaxed">{error}</p>
            </div>
          )}

          <Card className="rounded-[3rem] border-none shadow-float overflow-hidden p-0 animate-slide-up animate-stagger-1">
            <div className="bg-dark p-10 md:p-12 relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[80px] rounded-full -mr-32 -mt-32"></div>
              <div className="relative z-10">
                 <h3 className="text-2xl font-black text-white tracking-tight mb-2 uppercase">Session Protocol</h3>
                 <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Academic Synchronization</p>
              </div>
            </div>
            <div className="p-8 md:p-12 bg-white">
              <LectureForm onSubmit={handleAddLecture} isLoading={isLoading} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddLecture;
