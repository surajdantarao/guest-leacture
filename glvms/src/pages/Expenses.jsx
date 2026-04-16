import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { Plus, Trash2, PieChart, ReceiptText, Wallet, Calendar, Tag, ChevronRight } from 'lucide-react';
import api from '../utils/api';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    lectureId: '',
    description: '',
    amount: '',
    category: 'General'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expRes, lecRes] = await Promise.all([
        api.get('/expenses'),
        api.get('/lectures')
      ]);
      setExpenses(expRes.data);
      setLectures(lecRes.data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', {
        lecture_id: formData.lectureId === 'general' ? null : formData.lectureId,
        description: formData.description,
        amount: parseFloat(formData.amount)
      });
      setFormData({ lectureId: '', description: '', amount: '', category: 'General' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert('Failed to save expense');
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container-max space-y-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-8 border-b border-gray-100">
          <div className="space-y-2">
            <div className="inline-flex items-center px-3 py-1 bg-success/10 rounded-full text-success font-bold text-[10px] uppercase tracking-widest border border-success/10">
              Financial Control
            </div>
            <h1 className="text-4xl font-black text-dark tracking-tight">Expense Ledger</h1>
            <p className="text-secondary text-lg">Comprehensive tracking of event logistics and campus expenditures.</p>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)} 
            className="flex items-center gap-3 px-8 shadow-lg shadow-primary/20 h-[52px] font-black uppercase text-xs tracking-widest"
          >
            <Plus size={20} />
            Add Manual Entry
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="relative overflow-hidden group border-none shadow-card bg-dark text-white p-8">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Wallet size={80} />
             </div>
             <div className="relative z-10 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Aggregated Spend</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-success">₹</span>
                  <h2 className="text-5xl font-black tracking-tighter">{totalExpenses.toLocaleString()}</h2>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                   <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                   Real-time budget tracking
                </div>
             </div>
          </Card>
          
          <MetricCard 
            icon={PieChart} 
            label="Active Allocations" 
            value={lectures.length} 
            color="text-primary"
            bg="bg-primary/5"
          />

          <MetricCard 
            icon={ReceiptText} 
            label="Transaction Volume" 
            value={expenses.length} 
            color="text-accent"
            bg="bg-accent/5"
          />
        </div>

        {/* Form Modal / Section */}
        {showForm && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <Card className="border-2 border-primary/20 shadow-float relative overflow-hidden bg-white">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
                 <h3 className="text-xl font-black text-dark tracking-tight">New Financial Entry</h3>
                 <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-dark transition-colors">
                    <Trash2 size={20} />
                 </button>
              </div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Context</label>
                  <select 
                    required
                    className="input-field appearance-none"
                    value={formData.lectureId}
                    onChange={e => setFormData({...formData, lectureId: e.target.value})}
                  >
                    <option value="">Select Reference</option>
                    <option value="general">Campus General</option>
                    {lectures.map(l => (
                      <option key={l.id} value={l.id}>{l.topic}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g. Catering, Logistics"
                    className="input-field"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-300 text-sm">₹</span>
                    <input 
                      required
                      type="number"
                      placeholder="0.00"
                      className="input-field pl-8 font-mono font-black"
                      value={formData.amount}
                      onChange={e => setFormData({...formData, amount: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 font-black uppercase text-[10px] tracking-widest py-4">Save Entry</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Detailed Ledger */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-black text-dark tracking-tight">Recent Transactions</h3>
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg">Audit Trail</span>
            </div>
            <Card noPadding className="overflow-hidden border-none shadow-card bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      <th className="px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Transaction</th>
                      <th className="px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Description</th>
                      <th className="px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] text-right">Amount</th>
                      <th className="px-8 py-5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {expenses.length > 0 ? [...expenses].reverse().map((exp) => {
                      const lecture = lectures.find(l => String(l.id) === String(exp.lecture_id));
                      return (
                        <tr key={exp.id} className="group hover:bg-primary/[0.01] transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="text-dark font-black text-sm uppercase tracking-tight truncate max-w-[200px]">
                                {lecture ? lecture.topic : 'Campus General'}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                 <Calendar size={10} className="text-gray-300" />
                                 <span className="text-[10px] font-bold text-gray-400">
                                   {new Date(exp.created_at || exp.createdAt).toLocaleDateString()}
                                 </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300 group-hover:text-primary transition-colors">
                                  <Tag size={14} />
                               </div>
                               <span className="text-secondary text-sm font-medium">{exp.description}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <div className="flex flex-col items-end">
                                <div className="flex items-baseline gap-1">
                                  <span className="text-[10px] font-black text-primary">₹</span>
                                  <span className="font-mono font-black text-dark text-base">{parseFloat(exp.amount).toLocaleString()}</span>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button className="p-2 text-gray-100 hover:text-danger hover:bg-danger/5 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan="4" className="px-8 py-32 text-center">
                           <div className="flex flex-col items-center gap-4 grayscale opacity-20">
                              <ReceiptText size={64} />
                              <p className="font-black text-[10px] uppercase tracking-[0.3em]">No records found</p>
                           </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Allocation Breakdown */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-black text-dark tracking-tight">Allocations</h3>
            </div>
            <div className="space-y-4">
              {lectures.map(lecture => {
                const lectureTotal = expenses
                  .filter(e => String(e.lecture_id) === String(lecture.id))
                  .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
                
                return (
                  <Card key={lecture.id} className="p-6 hover:border-primary/20 transition-all group border-none shadow-soft bg-white">
                    <div className="flex justify-between items-start mb-4">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{lecture.department}</p>
                          <h4 className="font-black text-dark text-sm leading-tight group-hover:text-primary transition-colors">{lecture.topic}</h4>
                       </div>
                       <ChevronRight size={16} className="text-gray-200 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="flex items-end justify-between pt-4 border-t border-gray-50">
                       <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Budget Utilized
                       </div>
                       <div className="flex items-baseline gap-1">
                          <span className="text-[10px] font-black text-primary">₹</span>
                          <span className="font-black text-dark text-lg">{lectureTotal.toLocaleString()}</span>
                       </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon: Icon, label, value, color, bg }) => (
  <Card className="flex items-center gap-6 border-none shadow-card bg-white p-8 group">
    <div className={`h-16 w-16 ${bg} ${color} rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
      <Icon size={32} />
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <h3 className="text-4xl font-black text-dark tracking-tighter">{value}</h3>
    </div>
  </Card>
);

export default Expenses;
