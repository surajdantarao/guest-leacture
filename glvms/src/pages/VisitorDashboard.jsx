import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, UserPlus, Phone, MessageSquare, CheckCircle, ShieldCheck, LayoutDashboard, Bell, Search, Filter, Camera, X } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import api from '../utils/api';

const VisitorDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingPass, setViewingPass] = useState(null);
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const apiRoot = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        setLoading(true);
        const response = await api.get('/visitors/my-requests');
        setRequests(response.data);
      } catch (err) {
        console.error('Error fetching visitor requests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyRequests();
  }, []);

  const stats = [
    { title: 'Total Visits', value: requests.length, icon: Calendar, color: 'from-primary/20 to-primary/5', textColor: 'text-primary' },
    { title: 'Pending Approval', value: requests.filter(r => r.status === 'pending').length, icon: Clock, color: 'from-warning/20 to-warning/5', textColor: 'text-warning' },
    { title: 'Approved Passes', value: requests.filter(r => r.status === 'approved').length, icon: CheckCircle, color: 'from-success/20 to-success/5', textColor: 'text-success' },
  ];

  const handleViewPass = async (req) => {
    setPassError('');
    setPassLoading(true);

    try {
      const existingQr = req.qr_code || '';
      if (typeof existingQr === 'string' && existingQr.startsWith('data:image')) {
        setViewingPass({ ...req, qr_image: existingQr });
        return;
      }

      if (req.Pass?.id) {
        const qrImageUrl = `${apiRoot}/api/pass/${req.Pass.id}/qr-image`;
        const passResponse = await api.get(`/pass/${req.Pass.id}`);
        setViewingPass({
          ...req,
          qr_image: passResponse.data?.qr_image || qrImageUrl,
          pass_code: passResponse.data?.qr_code || '',
          pass_status: passResponse.data?.status || '',
          expires_at: passResponse.data?.expires_at || null
        });
        return;
      }

      throw new Error('Pass image not found for this visitor.');
    } catch (err) {
      setPassError(err.response?.data?.message || err.message || 'Unable to load QR pass image.');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-40 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-40 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="container-max relative z-10 space-y-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-gray-100 animate-slide-up">
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-gray-100 w-fit shadow-soft">
              <LayoutDashboard size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Visitor Console</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-dark tracking-tighter leading-none">
              Welcome, <span className="text-primary italic">{user.name.split(' ')[0]}</span>
            </h1>
            <p className="text-xl text-secondary font-medium max-w-md opacity-80 leading-relaxed">
              Monitor your institutional visit requests and digital clearance status.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-16 px-10 rounded-2xl font-black uppercase tracking-widest shadow-glow flex items-center justify-center gap-4">
                <UserPlus size={20} />
                <span>Initiate Visit</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 animate-slide-up animate-stagger-1">
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden group border-none shadow-float p-10 rounded-[3rem] bg-white hover:scale-105 transition-all duration-500">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} blur-3xl opacity-50 -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`}></div>
              <div className="relative z-10 space-y-6">
                <div className={`h-16 w-16 rounded-2xl bg-white shadow-soft flex items-center justify-center ${stat.textColor} border border-gray-50 group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{stat.title}</p>
                  <h3 className="text-5xl font-black text-dark tracking-tighter leading-none">{stat.value}</h3>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="space-y-10 animate-slide-up animate-stagger-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
               <h3 className="text-3xl font-black text-dark tracking-tight leading-none">Activity Stream</h3>
               <p className="text-secondary font-medium text-sm">Real-time status of your institutional requests.</p>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                  <input 
                    type="text" 
                    placeholder="Filter by dept..." 
                    className="h-12 w-64 bg-white/50 border border-gray-100 rounded-xl pl-10 pr-4 text-xs font-bold outline-none focus:border-primary/30 transition-all shadow-soft"
                  />
               </div>
               <button className="h-12 w-12 bg-white/50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-soft">
                  <Filter size={18} />
               </button>
            </div>
          </div>
          
          <Card noPadding className="overflow-hidden border-none shadow-float bg-white rounded-[3rem]">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100/50">
                    <th className="px-10 py-8 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Departmental Intention</th>
                    <th className="px-10 py-8 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Institutional Host</th>
                    <th className="px-10 py-8 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Scheduling</th>
                    <th className="px-10 py-8 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Clearance</th>
                    <th className="px-10 py-8 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] text-right">Gateway Log</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/50">
                  {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan="5" className="px-10 py-10">
                           <div className="h-4 bg-gray-50 rounded-full w-full"></div>
                        </td>
                      </tr>
                    ))
                  ) : requests.length > 0 ? [...requests].reverse().map((req) => (
                    <tr key={req.id} className="hover:bg-primary/[0.01] transition-colors group">
                      <td className="px-10 py-10">
                        <div className="space-y-2">
                          <p className="text-sm font-black text-dark uppercase tracking-tight group-hover:text-primary transition-colors">{req.department}</p>
                          <p className="text-[10px] text-secondary font-bold flex items-center gap-2 opacity-60">
                            <MessageSquare size={12} className="text-primary/50" /> {req.purpose}
                          </p>
                        </div>
                      </td>
                      <td className="px-10 py-10">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary border border-gray-100 font-black text-xs shadow-inner">
                            {req.personToMeet.charAt(0)}
                          </div>
                          <div className="space-y-0.5">
                             <p className="text-sm font-black text-dark">{req.personToMeet}</p>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Host Representative</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-10">
                        <div className="space-y-1.5">
                          <p className="text-xs font-black text-dark flex items-center gap-2">
                             <Calendar size={12} className="text-primary" /> {req.visitDate}
                          </p>
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded w-fit border border-primary/10">
                             {req.visitTime || '10:00 AM'}
                          </p>
                        </div>
                      </td>
                      <td className="px-10 py-10">
                        <div className="flex items-center gap-4">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                            req.status === 'approved' ? 'bg-success/5 text-success border-success/20' :
                            req.status === 'rejected' ? 'bg-danger/5 text-danger border-danger/20' :
                            'bg-warning/5 text-warning border-warning/20'
                          }`}>
                            {req.status}
                          </span>
                          {req.status === 'approved' && (req.qr_code || req.Pass?.id) && (
                            <button 
                              onClick={() => handleViewPass(req)}
                              className="h-10 px-4 bg-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
                            >
                              <Camera size={14} /> View Pass
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-10 py-10 text-right">
                        <div className="inline-flex flex-col items-end gap-1 font-mono text-[10px] font-black bg-gray-50/50 px-6 py-3 rounded-2xl border border-gray-100 shadow-inner group-hover:bg-white transition-all">
                          <div className="flex items-center gap-2">
                             <span className="text-gray-300 uppercase tracking-widest mr-2">IN</span>
                             <span className={req.checkIn ? 'text-success' : 'text-gray-200'}>{req.checkIn || '--:--'}</span>
                          </div>
                          <div className="h-px w-full bg-gray-100 my-1"></div>
                          <div className="flex items-center gap-2">
                             <span className="text-gray-300 uppercase tracking-widest mr-2">OUT</span>
                             <span className={req.checkOut ? 'text-primary' : 'text-gray-200'}>{req.checkOut || '--:--'}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-10 py-40 text-center">
                        <div className="flex flex-col items-center gap-8">
                          <div className="h-32 w-32 bg-gray-50 rounded-[4rem] flex items-center justify-center text-gray-200 shadow-inner">
                            <ShieldCheck size={64} />
                          </div>
                          <div>
                            <p className="text-dark font-black text-2xl tracking-tight">No institutional history</p>
                            <p className="text-secondary mt-2 font-medium max-w-sm opacity-60">Begin your journey by requesting a formal visit through our digital clearance portal.</p>
                          </div>
                          <Button variant="outline" size="lg" onClick={() => navigate('/register')} className="px-12 h-16 rounded-[2rem] font-black uppercase tracking-widest">
                             Initiate Registration
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        {/* Support Section */}
        <div className="pt-12 text-center">
           <div className="inline-flex items-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                 <ShieldCheck size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encryption</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-gray-200"></div>
              <div className="flex items-center gap-2">
                 <Bell size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Real-time Notifications</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-gray-200"></div>
              <div className="flex items-center gap-2">
                 <Phone size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">24/7 Gate Support</span>
              </div>
           </div>
        </div>
      </div>

      {/* QR Pass Modal */}
      {viewingPass && (
        <div className="fixed inset-0 bg-dark/60 z-[110] flex items-center justify-center p-6 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="bg-white rounded-[3rem] w-full max-w-md shadow-float relative overflow-hidden animate-in zoom-in-95 duration-300 border-none">
            <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <div>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1 block">Digital Clearance</span>
                <h3 className="text-2xl font-black text-dark tracking-tight">Institutional Pass</h3>
              </div>
              <button
                onClick={() => setViewingPass(null)}
                className="p-3 text-secondary hover:text-dark hover:bg-gray-100 rounded-xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-10 text-center space-y-8">
              {passLoading ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-black text-secondary uppercase tracking-widest">Loading Pass...</p>
                </div>
              ) : passError ? (
                <div className="py-8 text-center">
                  <p className="text-sm font-black text-danger uppercase tracking-widest">{passError}</p>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-[2.5rem] shadow-inner border-2 border-dashed border-gray-100 inline-block">
                  <img src={viewingPass.qr_image || viewingPass.qr_code} alt="QR Pass" className="w-64 h-64 mx-auto" />
                </div>
              )}
              
              <div className="space-y-4">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Authorized Individual</p>
                    <p className="text-xl font-black text-dark uppercase">{user.name}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="bg-gray-50 p-4 rounded-2xl text-left">
                       <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Scheduled Date</p>
                       <p className="text-xs font-black text-dark">{viewingPass.visitDate}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl text-left">
                       <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Target Dept</p>
                       <p className="text-xs font-black text-dark">{viewingPass.department}</p>
                    </div>
                 </div>
              </div>
              
              <div className="pt-4">
                 <p className="text-[9px] font-black text-secondary/60 uppercase tracking-[0.2em] leading-relaxed">
                    Please present this digital pass at the security gateway for biometric verification.
                 </p>
              </div>
            </div>
            
            <div className="p-8 bg-primary/5 border-t border-primary/10 flex justify-center">
               <div className="flex items-center gap-3 text-primary">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Verified Digital Pass</span>
               </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VisitorDashboard;
