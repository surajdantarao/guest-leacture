import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import VisitorForm from '../components/VisitorForm';
import { CheckCircle, ChevronLeft, ShieldCheck, Mail, Clock } from 'lucide-react';
import Button from '../components/Button';
import api from '../utils/api';

const AddVisitor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lecturePrefill = location.state?.lecturePrefill || null;
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddVisitor = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('whatsapp_number', data.phone);
      formData.append('visitor_category', data.visitorCategory);
      if (data.studentName) formData.append('student_name', data.studentName);
      if (data.studentRoll) formData.append('student_roll', data.studentRoll);
      formData.append('department', data.department);
      formData.append('purpose', data.purpose);
      formData.append('person_to_meet', data.personToMeet);
      formData.append('visit_date', data.date);
      formData.append('visit_time', data.visitTime);
      if (data.idProofFile) {
        formData.append('idProofFile', data.idProofFile);
      }

      await api.post('/visitors/request', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-success/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="container-max relative z-10">
          <Card className="max-w-2xl mx-auto text-center p-12 md:p-20 rounded-[3rem] shadow-float animate-slide-up">
            <div className="w-24 h-24 bg-success/10 text-success rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-sm border border-success/10">
              <CheckCircle size={56} className="animate-in zoom-in-50 duration-500" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-dark tracking-tight mb-6">Request Received!</h2>
            
            <p className="text-xl text-secondary font-medium leading-relaxed mb-10 max-w-lg mx-auto">
              Your registration is complete. Your entry status is currently 
              <span className="text-primary font-black mx-1">Pending</span>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4 text-left">
                <div className="mt-1 bg-primary/10 p-2 rounded-lg text-primary">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Notification</p>
                  <p className="text-sm font-bold text-dark">Check your email for status updates.</p>
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4 text-left">
                <div className="mt-1 bg-primary/10 p-2 rounded-lg text-primary">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Entry Pass</p>
                  <p className="text-sm font-bold text-dark">Carry ID proof for gate verification.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button size="lg" onClick={() => navigate('/')} className="px-10 h-16 rounded-2xl font-black uppercase tracking-widest">
                Return to Home
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-40 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-40 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="container-max relative z-10">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-slide-up">
            <div className="space-y-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-primary font-black uppercase text-[10px] tracking-[0.3em] hover:opacity-70 transition-all mb-4"
              >
                <ChevronLeft size={14} />
                <span>Return to Gateway</span>
              </button>
              <h1 className="text-5xl md:text-7xl font-black text-dark tracking-tighter leading-none">
                Visitor <br/><span className="text-primary italic">Protocol</span>
              </h1>
              <p className="text-xl text-secondary font-medium max-w-md">
                Formalize your visit to the university through our digital entry system.
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md px-6 py-4 rounded-3xl border border-gray-100 shadow-soft">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/5">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Security Clearance</p>
                <p className="text-sm font-bold text-dark">ISO 27001 Protocol</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-6 bg-danger/5 border border-danger/10 text-danger rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="h-3 w-3 rounded-full bg-danger animate-pulse"></div>
              <p className="font-bold text-sm tracking-tight leading-relaxed">{error}</p>
            </div>
          )}

          <Card className="rounded-[3rem] border-none shadow-float overflow-hidden p-0 animate-slide-up animate-stagger-1">
            <div className="bg-dark p-10 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full -mr-32 -mt-32"></div>
              <div className="relative z-10">
                 <h3 className="text-2xl font-black text-white tracking-tight mb-2">Registration Form</h3>
                 <p className="text-gray-400 font-medium">Please provide accurate institutional or personal details.</p>
              </div>
            </div>
            <div className="p-8 md:p-12 bg-white">
              <VisitorForm onSubmit={handleAddVisitor} isLoading={isLoading} initialData={lecturePrefill} />
            </div>
          </Card>
          
          <div className="flex justify-center py-6">
            <div className="flex items-center gap-8">
               <div className="flex flex-col items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mb-2"></div>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Instant WhatsApp</span>
               </div>
               <div className="flex flex-col items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mb-2"></div>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Digital Entry Pass</span>
               </div>
               <div className="flex flex-col items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mb-2"></div>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Encrypted Data</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVisitor;
