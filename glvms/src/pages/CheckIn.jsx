import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { LogIn, LogOut, Search, User, ShieldCheck, Clock, MapPin, Phone, RefreshCw, AlertCircle, CheckCircle, Camera } from 'lucide-react';
import api from '../utils/api';

const CheckIn = () => {
  const [visitors, setVisitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const response = await api.get('/visitors');
      setVisitors(response.data);
    } catch (err) {
      console.error('Error fetching visitors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = async (id, action) => {
    if (!id) return;

    try {
      if (action === 'checkIn') {
        await api.post('/security/checkin', { visitor_id: id });
        showToast('Gateway Access Authorized');
      } else {
        await api.post('/security/checkout', { visitor_id: id });
        showToast('Institutional Exit Logged');
      }
      fetchVisitors();
    } catch (err) {
      alert(err.response?.data?.message || `Failed to execute ${action}`);
    }
  };

  const approvedVisitors = visitors.filter(v => 
    v.status === 'approved' && 
    ((v.User?.name || v.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
     (v.User?.phone || v.phone || '').includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-40 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-40 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="container-max relative z-10 space-y-12">
        {/* Toast */}
        {toast && (
          <div className="fixed top-24 right-8 z-[100] bg-dark text-white px-8 py-5 rounded-[2rem] shadow-float animate-in slide-in-from-right-8 font-black uppercase text-[10px] tracking-widest border border-white/10 flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
            {toast}
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 pb-12 border-b border-gray-100 animate-slide-up">
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-gray-100 w-fit shadow-soft">
              <ShieldCheck size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Security Command</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-dark tracking-tighter leading-none">
              Gate <span className="text-primary italic">Control</span>
            </h1>
            <p className="text-xl text-secondary font-medium max-w-xl opacity-80 leading-relaxed">
              Managing authorized institutional entry and synchronized exit protocols.
            </p>
            <Link to="/security/scan" className="inline-flex items-center gap-4 px-8 h-14 bg-dark text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-float hover:scale-105 transition-transform active:scale-95 group">
               <Camera size={18} className="group-hover:rotate-12 transition-transform" />
               Scan Digital Pass
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto">
            <div className="relative group w-full sm:w-88">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
               <input 
                  type="text" 
                  placeholder="Verify by name or phone..."
                  className="input-field pl-16 h-16 rounded-2xl shadow-soft"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <button 
              onClick={fetchVisitors}
              className="h-16 w-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-primary shadow-soft hover:bg-primary hover:text-white transition-all duration-500 group"
            >
              <RefreshCw size={24} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'} />
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up animate-stagger-1">
           <GateStat label="Authorized" value={visitors.filter(v => v.status === 'approved').length} color="text-primary" />
           <GateStat label="Currently Inside" value={visitors.filter(v => v.checkIn && !v.checkOut).length} color="text-success" />
           <GateStat label="Today's Exits" value={visitors.filter(v => v.checkOut).length} color="text-secondary" />
           <GateStat label="Pending" value={visitors.filter(v => v.status === 'pending').length} color="text-warning" />
        </div>

        {/* Visitors Stream */}
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center justify-between">
             <h3 className="text-2xl font-black text-dark tracking-tight leading-none">Security Stream</h3>
             <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-success animate-ping"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Live Gateway Log</span>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {loading && visitors.length === 0 ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-gray-50 rounded-[2rem] animate-pulse border-2 border-dashed border-gray-100"></div>
              ))
            ) : approvedVisitors.length > 0 ? [...approvedVisitors].reverse().map((visitor, idx) => (
              <Card key={visitor.id} hover noPadding className="overflow-hidden border-none shadow-float bg-white rounded-[2.5rem] group animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="flex flex-col lg:flex-row min-h-[140px]">
                  {/* Modern Status Indicator */}
                  <div className={`w-full lg:w-3 ${
                    visitor.checkIn && !visitor.checkOut ? 'bg-success' : 
                    visitor.checkOut ? 'bg-gray-200' : 'bg-primary shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                  }`} />
                  
                  <div className="flex-1 p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    {/* Identity Info */}
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-[1.5rem] bg-gray-50 flex items-center justify-center text-primary border border-gray-100 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500 relative shrink-0">
                        <User size={28} />
                        <div className="absolute -top-3 -right-3 h-8 w-8 rounded-xl bg-white shadow-soft flex items-center justify-center border border-gray-50 group-hover:scale-110 transition-transform">
                           <ShieldCheck size={14} className="text-primary" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                           <h3 className="text-xl font-black text-dark tracking-tight leading-none uppercase">{visitor.User?.name || visitor.name}</h3>
                           <span className="px-3 py-1 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest rounded-lg border border-primary/10">{visitor.visitorCategory || 'Guest'}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                          <span className="text-[11px] text-secondary font-bold flex items-center gap-2 opacity-70">
                            <Phone size={14} className="text-primary" /> {visitor.User?.phone || visitor.phone}
                          </span>
                          <span className="text-[11px] text-secondary font-bold flex items-center gap-2 opacity-70">
                            <MapPin size={14} className="text-primary" /> {visitor.department}
                          </span>
                          {visitor.idProof && (
                            <a 
                              href={visitor.idProof.startsWith('http') ? visitor.idProof : `${api.defaults.baseURL.replace('/api', '')}${visitor.idProof}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary hover:text-indigo-700 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 underline decoration-2 underline-offset-4"
                            >
                              Verify Credentials
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Operational Area */}
                    <div className="flex flex-wrap items-center gap-10 lg:gap-16">
                      {/* Timeline Area */}
                      <div className="flex gap-12">
                        <GateTimeBox label="Institutional Entry" time={visitor.checkIn} active={!!visitor.checkIn} />
                        <GateTimeBox label="Institutional Exit" time={visitor.checkOut} active={!!visitor.checkOut} />
                      </div>

                      {/* Action Area */}
                      <div className="shrink-0">
                        {!visitor.checkIn ? (
                          <Button 
                            onClick={() => handleAction(visitor.id, 'checkIn')}
                            className="h-14 px-10 bg-success text-white hover:bg-emerald-600 shadow-lg shadow-success/20 rounded-2xl font-black uppercase text-xs tracking-widest group/btn"
                          >
                            <LogIn size={20} className="mr-3 group-hover:translate-x-1 transition-transform" />
                            Authorize Entry
                          </Button>
                        ) : !visitor.checkOut ? (
                          <Button 
                            onClick={() => handleAction(visitor.id, 'checkOut')}
                            className="h-14 px-10 bg-warning text-white hover:bg-orange-600 shadow-lg shadow-warning/20 rounded-2xl font-black uppercase text-xs tracking-widest group/btn"
                          >
                            <LogOut size={20} className="mr-3 group-hover:translate-x-1 transition-transform" />
                            Log Exit
                          </Button>
                        ) : (
                          <div className="h-14 px-10 bg-gray-50 border-2 border-gray-100 text-gray-300 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3">
                            <CheckCircle size={18} />
                            Session Completed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )) : (
              <div className="py-40 text-center bg-white rounded-[4rem] border-2 border-dashed border-gray-100 shadow-inner space-y-8">
                <div className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center mx-auto text-gray-200 shadow-inner">
                  <AlertCircle size={64} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-dark tracking-tight leading-none">Command Stream Empty</h3>
                  <p className="text-xl text-secondary font-medium max-w-sm mx-auto opacity-60">No approved visitors are currently awaiting institutional clearance.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Operational Footer */}
        <div className="pt-12 text-center border-t border-gray-100">
           <div className="inline-flex items-center gap-10 text-gray-400">
              <div className="flex items-center gap-3">
                 <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest">Biometric Ready</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest">Instant Logging</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest">ISO 27001 Protocol</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const GateStat = ({ label, value, color }) => (
  <Card className="p-8 border-none shadow-soft bg-white/50 backdrop-blur-md rounded-[2rem] flex flex-col items-center justify-center text-center space-y-2 group hover:scale-105 transition-transform duration-500">
     <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{label}</p>
     <p className={`text-4xl font-black ${color} tracking-tighter group-hover:scale-110 transition-transform duration-500`}>{value}</p>
  </Card>
);

const GateTimeBox = ({ label, time, active }) => (
  <div className="flex flex-col items-center gap-3 min-w-[100px]">
    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 opacity-60">{label}</span>
    <div className={`
      flex items-center gap-3 px-5 py-3 rounded-2xl border-2 font-mono font-black text-sm transition-all duration-500
      ${active ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-110' : 'bg-gray-50 border-gray-100 text-gray-300'}
    `}>
      <Clock size={16} className={active ? 'animate-pulse' : ''} />
      {time || '--:--'}
    </div>
  </div>
);

export default CheckIn;
