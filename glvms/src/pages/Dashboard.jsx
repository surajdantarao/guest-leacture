import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import {
  Users,
  User,
  BookOpen,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Edit,
  CheckSquare,
  Clock,
  MapPin,
  ShieldCheck,
  Phone,
  Calendar,
  MessageSquare,
  X,
  Wallet,
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import LectureForm from '../components/LectureForm';
import VisitorForm from '../components/VisitorForm';
import api from '../utils/api';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('visitors');
  const [visitors, setVisitors] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [stats, setStats] = useState(null);
  const [lectureItems, setLectureItems] = useState({});
  const [isAddingLecture, setIsAddingLecture] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const [isAddingVisitor, setIsAddingVisitor] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState(null);
  const [viewingVisitor, setViewingVisitor] = useState(null);
  const [viewingFeedback, setViewingFeedback] = useState(null); 
  const [managingExpenses, setManagingExpenses] = useState(null); 
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' });
  const [toast, setToast] = useState(null);
  const [, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      if (activeTab === 'visitors') {
        const response = await api.get('/visitors');
        setVisitors(response.data);
      } else if (activeTab === 'lectures') {
        const response = await api.get('/lectures');
        setLectures(response.data);
      } else if (activeTab === 'items') {
        const lecturesRes = await api.get('/lectures');
        setLectures(lecturesRes.data);
        
        const itemsMap = {};
        for (const lecture of lecturesRes.data) {
          const itemsRes = await api.get(`/checklist/${lecture.id}`);
          itemsMap[lecture.id] = itemsRes.data;
        }
        setLectureItems(itemsMap);
      } else if (activeTab === 'stats') {
        try {
          const [visitorStatsRes, lecturesRes] = await Promise.all([
            api.get('/visitors/stats'),
            api.get('/lectures')
          ]);

          const lectureData = lecturesRes.data || [];
          const checklistByLecture = await Promise.all(
            lectureData.map(async (lecture) => {
              try {
                const checklistRes = await api.get(`/checklist/${lecture.id}`);
                return checklistRes.data || [];
              } catch {
                return [];
              }
            })
          );
          const flatChecklist = checklistByLecture.flat();

          const lectureSummary = {
            total: lectureData.length,
            scheduled: lectureData.filter((l) => (l.status || 'scheduled') === 'scheduled').length,
            completed: lectureData.filter((l) => l.status === 'completed').length,
            cancelled: lectureData.filter((l) => l.status === 'cancelled').length
          };

          const checklistSummary = {
            total: flatChecklist.length,
            ready: flatChecklist.filter((i) => i.status === 'ready').length,
            pending: flatChecklist.filter((i) => i.status !== 'ready').length,
            lecturesLinked: checklistByLecture.filter((items) => items.length > 0).length
          };

          setStats({
            ...visitorStatsRes.data,
            lectureSummary,
            checklistSummary
          });
        } catch {
          const visitorsRes = await api.get('/visitors');
          const lecturesRes = await api.get('/lectures');
          const visitorsData = visitorsRes.data || [];
          const lectureData = lecturesRes.data || [];

          const fallbackSummary = visitorsData.reduce((acc, visitor) => {
            acc.total += 1;
            if (visitor.status === 'approved') acc.approved += 1;
            else if (visitor.status === 'pending') acc.pending += 1;
            else if (visitor.status === 'rejected') acc.rejected += 1;
            return acc;
          }, { total: 0, approved: 0, pending: 0, rejected: 0 });

          const categoriesMap = visitorsData.reduce((acc, visitor) => {
            const key = visitor.visitor_category || visitor.visitorCategory || 'Unknown';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {});
          const categories = Object.entries(categoriesMap).map(([visitor_category, count]) => ({
            visitor_category,
            count
          }));

          const departmentsMap = visitorsData.reduce((acc, visitor) => {
            const key = visitor.department || 'Unknown';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {});
          const departments = Object.entries(departmentsMap).map(([department, count]) => ({
            department,
            count
          }));

          const timelineMap = visitorsData.reduce((acc, visitor) => {
            const dateKey = visitor.visit_date || visitor.visitDate;
            if (!dateKey) return acc;
            const normalizedDate = new Date(dateKey).toISOString().split('T')[0];
            acc[normalizedDate] = (acc[normalizedDate] || 0) + 1;
            return acc;
          }, {});
          const timeline = Object.entries(timelineMap)
            .map(([visit_date, count]) => ({ visit_date, count }))
            .sort((a, b) => new Date(a.visit_date) - new Date(b.visit_date))
            .slice(-7);

          const checklistByLecture = await Promise.all(
            lectureData.map(async (lecture) => {
              try {
                const checklistRes = await api.get(`/checklist/${lecture.id}`);
                return checklistRes.data || [];
              } catch {
                return [];
              }
            })
          );
          const flatChecklist = checklistByLecture.flat();

          const lectureSummary = {
            total: lectureData.length,
            scheduled: lectureData.filter((l) => (l.status || 'scheduled') === 'scheduled').length,
            completed: lectureData.filter((l) => l.status === 'completed').length,
            cancelled: lectureData.filter((l) => l.status === 'cancelled').length
          };

          const checklistSummary = {
            total: flatChecklist.length,
            ready: flatChecklist.filter((i) => i.status === 'ready').length,
            pending: flatChecklist.filter((i) => i.status !== 'ready').length,
            lecturesLinked: checklistByLecture.filter((items) => items.length > 0).length
          };

          setStats({
            summary: fallbackSummary,
            categories,
            departments,
            timeline,
            lectureSummary,
            checklistSummary
          });
        }
      }
    } catch (err) {
      showToast('Error fetching data: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // --- Visitor Management ---
  const handleSaveVisitor = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('whatsapp_number', data.phone);
      formData.append('visitor_category', data.visitorCategory);
      formData.append('student_name', data.studentName || '');
      formData.append('student_roll', data.studentRoll || '');
      formData.append('department', data.department);
      formData.append('purpose', data.purpose);
      formData.append('person_to_meet', data.personToMeet);
      formData.append('visit_date', data.date);
      formData.append('visit_time', data.visitTime);
      
      if (data.idProofFile) {
        formData.append('idProofFile', data.idProofFile);
      }

      if (editingVisitor) {
        await api.put(`/visitors/${editingVisitor.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('Visitor updated successfully');
      } else {
        await api.post('/visitors/request', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('Visitor registered successfully');
      }
      
      setIsAddingVisitor(false);
      setEditingVisitor(null);
      fetchData();
    } catch (err) {
      showToast('Error saving visitor: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleVisitorStatus = async (id, status) => {
    try {
      let response;
      if (status === 'approved') {
        response = await api.put(`/visitors/${id}/approve`);
      } else if (status === 'rejected') {
        const reason = window.prompt('Enter rejection reason:');
        if (!reason || !reason.trim()) {
          showToast('Rejection reason is required');
          return;
        }
        response = await api.put(`/visitors/${id}/reject`, { rejection_reason: reason.trim() });
      }

      const whatsapp = response?.data?.whatsapp;
      if ((status === 'approved' || status === 'rejected') && whatsapp) {
        if (whatsapp.sent) {
          showToast(`Visitor ${status} and WhatsApp notification sent`);
        } else if (whatsapp.waLink) {
          window.open(whatsapp.waLink, '_blank');
          showToast(`Visitor ${status}. Opened WhatsApp fallback`);
        } else {
          showToast(`Visitor ${status}. WhatsApp message could not be sent`);
        }
      } else {
        showToast(`Visitor ${status} successfully`);
      }
      fetchData();
    } catch (err) {
      showToast('Error updating status: ' + (err.response?.data?.message || err.message));
    }
  };
  // --- Guest Lecture Management ---
  const handleSaveLecture = async (data) => {
    try {
      const payload = {
        speaker_name: data.speakerName,
        topic: data.topic,
        department: data.department,
        venue: data.venue,
        dateTime: data.dateTime,
        description: data.description,
        image_url: data.imageUrl,
        assignee_name: data.assigneeName,
        assignee_phone: data.assigneePhone,
        admin_phone: data.adminPhone
      };

      if (editingLecture) {
        await api.put(`/lectures/${editingLecture.id}`, payload);
      } else {
        await api.post('/lectures', payload);
      }
      setIsAddingLecture(false);
      setEditingLecture(null);
      showToast('Lecture saved successfully');
      fetchData();
    } catch (err) {
      showToast('Error saving lecture: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteLecture = async (id) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      try {
        await api.delete(`/lectures/${id}`);
        showToast('Lecture deleted');
        fetchData();
      } catch (err) {
        showToast('Error deleting lecture: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // --- Expense Management ---
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!managingExpenses) return;
    try {
      await api.post('/expenses', {
        lecture_id: managingExpenses.id,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount)
      });
      setNewExpense({ description: '', amount: '' });
      showToast('Expense added');
      const response = await api.get('/lectures');
      const updated = response.data.find(l => l.id === managingExpenses.id);
      setManagingExpenses(updated);
      setLectures(response.data);
    } catch (err) {
      showToast('Error adding expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      showToast('Expense deleted');
      const response = await api.get('/lectures');
      const updated = response.data.find(l => l.id === managingExpenses.id);
      setManagingExpenses(updated);
      setLectures(response.data);
    } catch (err) {
      showToast('Error deleting expense');
    }
  };

  // --- Items Management ---
  const toggleItemStatus = async (lectureId, itemId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'pending' ? 'ready' : 'pending';
      await api.put(`/checklist/${itemId}/status`, { status: newStatus });
      fetchData();
    } catch (err) {
      showToast('Error updating item');
    }
  };

  const addItem = async (lectureId, itemName) => {
    if (!itemName.trim()) return;
    try {
      await api.post('/checklist', {
        lecture_id: lectureId,
        item_name: itemName
      });
      fetchData();
    } catch (err) {
      showToast('Error adding item');
    }
  };

  const notifyAssignee = (lecture) => {
    const items = lectureItems[lecture.id] || [];
    const itemList = items.map(i => `- ${i.item_name}`).join('%0A');
    const link = `${window.location.origin}/assignee/checklist/${lecture.id}`;
    const message = `Hi ${lecture.assigneeName || 'Staff'}, you are responsible for the requirements of lecture: *${lecture.topic}*.%0A%0ARequirements:%0A${itemList}%0A%0APlease update the status here: ${link}`;
    const phone = (lecture.assigneePhone || '').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone || '8767753086'}?text=${message}`, '_blank');
  };

  const visitorSummary = {
    total: visitors.length,
    approved: visitors.filter((v) => v.status === 'approved').length,
    pending: visitors.filter((v) => v.status === 'pending').length,
    activeInside: visitors.filter((v) => v.checkIn && !v.checkOut).length
  };

  const lectureSummary = {
    total: lectures.length,
    scheduled: lectures.filter((l) => (l.status || 'scheduled') === 'scheduled').length,
    completed: lectures.filter((l) => l.status === 'completed').length,
    cancelled: lectures.filter((l) => l.status === 'cancelled').length
  };

  const checklistItems = Object.values(lectureItems).flat();
  const checklistSummary = {
    total: checklistItems.length,
    ready: checklistItems.filter((item) => item.status === 'ready').length,
    pending: checklistItems.filter((item) => item.status !== 'ready').length,
    lecturesLinked: Object.keys(lectureItems).length
  };

  const getTopImpactCards = () => {
    if (activeTab === 'lectures') {
      return [
        { title: 'Total Lectures', value: lectureSummary.total, subtitle: 'All sessions in system', icon: <BookOpen size={18} />, tone: 'primary' },
        { title: 'Scheduled', value: lectureSummary.scheduled, subtitle: 'Upcoming sessions', icon: <Calendar size={18} />, tone: 'warning' },
        { title: 'Completed', value: lectureSummary.completed, subtitle: 'Successfully finished', icon: <CheckCircle size={18} />, tone: 'success' },
        { title: 'Cancelled', value: lectureSummary.cancelled, subtitle: 'Not conducted', icon: <XCircle size={18} />, tone: 'dark' }
      ];
    }

    if (activeTab === 'items') {
      return [
        { title: 'Checklist Items', value: checklistSummary.total, subtitle: 'All requirement points', icon: <ClipboardList size={18} />, tone: 'primary' },
        { title: 'Ready', value: checklistSummary.ready, subtitle: 'Prepared by assignees', icon: <CheckSquare size={18} />, tone: 'success' },
        { title: 'Pending', value: checklistSummary.pending, subtitle: 'Still to prepare', icon: <Clock size={18} />, tone: 'warning' },
        { title: 'Lectures Linked', value: checklistSummary.lecturesLinked, subtitle: 'Sessions with checklist', icon: <BookOpen size={18} />, tone: 'dark' }
      ];
    }

    if (activeTab === 'stats' && stats) {
      return [
        { title: 'Visitor Requests', value: stats.summary?.total || 0, subtitle: 'Total visitor flow', icon: <Users size={18} />, tone: 'primary' },
        { title: 'Lecture Records', value: stats.lectureSummary?.total || 0, subtitle: 'All lecture events', icon: <BookOpen size={18} />, tone: 'success' },
        { title: 'Checklist Coverage', value: stats.checklistSummary?.lecturesLinked || 0, subtitle: 'Lectures with items', icon: <ClipboardList size={18} />, tone: 'warning' },
        { title: 'Open Tasks', value: stats.checklistSummary?.pending || 0, subtitle: 'Pending checklist items', icon: <Activity size={18} />, tone: 'dark' }
      ];
    }

    return [
      { title: 'Total Requests', value: visitorSummary.total, subtitle: 'All visitor requests', icon: <Users size={18} />, tone: 'primary' },
      { title: 'Approved', value: visitorSummary.approved, subtitle: 'Cleared for campus', icon: <CheckCircle size={18} />, tone: 'success' },
      { title: 'Pending Review', value: visitorSummary.pending, subtitle: 'Awaiting admin action', icon: <Clock size={18} />, tone: 'warning' },
      { title: 'Inside Campus', value: visitorSummary.activeInside, subtitle: 'Checked-in not exited', icon: <Activity size={18} />, tone: 'dark' }
    ];
  };

  const topImpactCards = getTopImpactCards();

  return (
    <div className="min-h-screen bg-background pt-28 md:pt-32 pb-16 md:pb-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 -left-24 w-[28rem] h-[28rem] bg-primary/10 rounded-full blur-[110px] animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-[24rem] h-[24rem] bg-accent/10 rounded-full blur-[110px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="container-max relative z-10 space-y-8 md:space-y-10">
        {/* Toast */}
        {toast && (
          <div className="fixed top-20 right-4 sm:right-8 z-[100] bg-dark text-white px-6 py-4 rounded-2xl shadow-float animate-in slide-in-from-right-8 font-black uppercase text-[10px] tracking-widest border border-white/10 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
            {toast}
          </div>
        )}

        {/* Header & Navigation */}
        <div className="surface-card p-5 md:p-8 lg:p-10 animate-slide-up relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-primary/5 pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-56 h-56 bg-primary/10 blur-3xl rounded-full -mt-20 -mr-20"></div>

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-gray-100 w-fit shadow-soft">
              <LayoutDashboard size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Administrative Hub</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-dark tracking-tighter leading-none">
                Dashboard <span className="text-primary italic">Command</span>
              </h1>
              <p className="text-base md:text-lg text-secondary font-medium max-w-2xl leading-relaxed">
                A single place to control visitor approvals, lecture operations, and real-time campus flow.
              </p>
            </div>

            <div className="flex bg-gray-100/70 backdrop-blur-md p-1.5 rounded-2xl w-full xl:w-auto overflow-x-auto shadow-inner border border-gray-200/60">
              <TabButton
                active={activeTab === 'visitors'}
                onClick={() => setActiveTab('visitors')}
                icon={<Users size={16} />}
                label="Visitors"
              />
              <TabButton
                active={activeTab === 'lectures'}
                onClick={() => setActiveTab('lectures')}
                icon={<BookOpen size={16} />}
                label="Lectures"
              />
              <TabButton
                active={activeTab === 'items'}
                onClick={() => setActiveTab('items')}
                icon={<ClipboardList size={16} />}
                label="Checklist"
              />
              <TabButton
                active={activeTab === 'stats'}
                onClick={() => setActiveTab('stats')}
                icon={<BarChart3 size={16} />}
                label="Analytics"
              />
            </div>
          </div>

          <div className="relative z-10 mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {topImpactCards.map((card) => (
              <ImpactCard
                key={card.title}
                title={card.title}
                value={card.value}
                subtitle={card.subtitle}
                icon={card.icon}
                tone={card.tone}
              />
            ))}
          </div>
        </div>

        {/* Tab Content: Analytics */}
        {activeTab === 'stats' && stats && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatSummaryCard title="Total Protocol" value={stats.summary.total} icon={<Activity />} color="primary" />
              <StatSummaryCard title="Authorized" value={stats.summary.approved} icon={<CheckCircle />} color="success" />
              <StatSummaryCard title="Pending Review" value={stats.summary.pending} icon={<Clock />} color="warning" />
              <StatSummaryCard title="Declined" value={stats.summary.rejected} icon={<XCircle />} color="danger" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Pie/Donut Chart */}
              <Card className="p-10 bg-white border-none shadow-float rounded-[3rem]">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-2xl font-black text-dark tracking-tight">Category Distribution</h3>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Visitor Classification</p>
                  </div>
                  <PieChartIcon className="text-primary" size={24} />
                </div>
                <div className="h-[400px] w-full overflow-x-auto">
                  <div className="h-full min-w-[520px] flex items-center justify-center">
                    <PieChart width={520} height={360}>
                      <Pie
                        data={stats.categories}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={8}
                        dataKey="count"
                        nameKey="visitor_category"
                      >
                        {stats.categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: '900', fontSize: '12px' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }} />
                    </PieChart>
                  </div>
                </div>
              </Card>

              {/* Bar Chart */}
              <Card className="p-10 bg-white border-none shadow-float rounded-[3rem]">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-2xl font-black text-dark tracking-tight">Departmental Flow</h3>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Institutional Integration</p>
                  </div>
                  <BarChart3 className="text-primary" size={24} />
                </div>
                <div className="h-[400px] w-full overflow-x-auto">
                  <div className="h-full min-w-[520px]">
                    <BarChart
                      width={Math.max(520, (stats.departments?.length || 0) * 90)}
                      height={360}
                      data={stats.departments}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{ fontWeight: 900, fontSize: 10, fill: '#9ca3af' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontWeight: 900, fontSize: 10, fill: '#9ca3af' }} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="count" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={40} />
                    </BarChart>
                  </div>
                </div>
              </Card>

              {/* Line/Area Chart */}
              <Card className="lg:col-span-2 p-10 bg-white border-none shadow-float rounded-[3rem]">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-2xl font-black text-dark tracking-tight">Temporal Analytics</h3>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">7-Day Access Momentum</p>
                  </div>
                  <TrendingUp className="text-primary" size={24} />
                </div>
                <div className="h-[400px] w-full overflow-x-auto">
                  <div className="h-full min-w-[640px]">
                    <AreaChart
                      width={Math.max(640, (stats.timeline?.length || 0) * 90)}
                      height={360}
                      data={stats.timeline}
                    >
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="visit_date" axisLine={false} tickLine={false} tick={{ fontWeight: 900, fontSize: 10, fill: '#9ca3af' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontWeight: 900, fontSize: 10, fill: '#9ca3af' }} />
                      <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                    </AreaChart>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Tab Content: Visitors */}
        {activeTab === 'visitors' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-1">
                 <h3 className="text-3xl font-black text-dark tracking-tight leading-none">Access Requests</h3>
                 <p className="text-secondary font-medium text-sm">Security clearance management for upcoming visits.</p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => {
                    setEditingVisitor(null);
                    setIsAddingVisitor(true);
                  }}
                  className="flex items-center gap-4 px-10 h-16 rounded-2xl shadow-glow font-black uppercase tracking-widest text-xs"
                >
                  <Plus size={20} /> Register Visitor
                </Button>
                <div className="hidden sm:flex flex-col items-end">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Stream</p>
                   <p className="text-2xl font-black text-primary">{visitors.length}</p>
                </div>
              </div>
            </div>

            {isAddingVisitor || editingVisitor ? (
              <Card className="border-none shadow-float rounded-[3rem] overflow-hidden p-0 animate-in zoom-in-95 duration-500">
                <div className="bg-dark p-10 md:p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full -mr-32 -mt-32"></div>
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <h3 className="text-3xl font-black text-white tracking-tight">
                        {editingVisitor ? 'Modify Credentials' : 'New Protocol'}
                      </h3>
                      <p className="text-gray-400 font-medium mt-2">Enter the visitor's information for institutional access.</p>
                    </div>
                    <Button variant="outline" onClick={() => {
                      setIsAddingVisitor(false);
                      setEditingVisitor(null);
                    }} className="border-white/10 text-white hover:bg-white/10 font-black uppercase text-[10px] tracking-widest px-6 h-12 rounded-xl">
                      Discard
                    </Button>
                  </div>
                </div>
                <div className="p-8 md:p-12 bg-white">
                  <VisitorForm
                    onSubmit={handleSaveVisitor}
                    initialData={editingVisitor}
                  />
                </div>
              </Card>
            ) : (
              <Card noPadding className="overflow-hidden border-none shadow-float bg-white rounded-[3rem]">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100/50">
                        <th className="px-10 py-8 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Individual</th>
                        <th className="px-10 py-8 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Intent & Schedule</th>
                        <th className="px-10 py-8 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Verification</th>
                        <th className="px-10 py-8 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Authorization</th>
                        <th className="px-10 py-8 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] text-right">Controls</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50/50">
                      {visitors.length > 0 ? [...visitors].reverse().map((visitor) => (
                        <tr key={visitor.id} className="group hover:bg-primary/[0.01] transition-colors cursor-pointer" onClick={() => setViewingVisitor(visitor)}>
                          <td className="px-10 py-10">
                            <div className="flex items-center gap-5">
                              <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-primary font-black text-xl shadow-inner border border-gray-100 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                {(visitor.name || visitor.User?.name || 'V').charAt(0)}
                              </div>
                              <div>
                                <div className="font-black text-dark text-base tracking-tight">{visitor.name || visitor.User?.name}</div>
                                <div className="text-[10px] font-black text-primary uppercase tracking-widest mt-1 opacity-60">
                                  {visitor.visitor_category || 'Guest'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-10">
                            <div className="space-y-3">
                              <div className="text-dark font-bold text-sm tracking-tight leading-snug max-w-xs">
                                {visitor.purpose}
                              </div>
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black bg-gray-50 text-secondary uppercase tracking-widest border border-gray-100">
                                  {visitor.department}
                                </span>
                                <span className="text-[9px] font-black text-primary flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                                  <Calendar size={12} /> {visitor.visit_date}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-10">
                            {visitor.idProof ? (
                              <a
                                href={visitor.idProof.startsWith('http') ? visitor.idProof : `${api.defaults.baseURL.replace('/api', '')}${visitor.idProof}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-5 py-3 bg-primary/5 hover:bg-primary/10 text-primary rounded-xl border border-primary/10 transition-all group/id"
                              >
                                <ShieldCheck size={16} className="group-hover/id:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Verify ID</span>
                              </a>
                            ) : (
                              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No Document</span>
                            )}
                          </td>
                          <td className="px-10 py-10">
                            <StatusBadge status={visitor.status} />
                          </td>
                          <td className="px-10 py-10 text-right">
                            <div className="flex justify-end gap-3 items-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingVisitor(visitor);
                                }}
                                className="h-10 w-10 bg-gray-50 flex items-center justify-center text-secondary rounded-xl hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/10"
                                title="Modify Request"
                              >
                                <Edit size={18} />
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewingVisitor(visitor);
                                }}
                                className="h-10 px-4 bg-gray-50 text-secondary rounded-xl hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/10 font-black uppercase text-[10px] tracking-widest"
                                title="View Full Details"
                              >
                                View
                              </button>

                              {visitor.status === 'pending' ? (
                                <div className="flex gap-2 animate-in slide-in-from-right-4">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleVisitorStatus(visitor.id, 'approved');
                                    }}
                                    className="h-10 px-4 bg-success text-white hover:bg-emerald-600 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm font-black uppercase text-[10px] tracking-widest"
                                    title="Authorize"
                                  >
                                    <CheckCircle size={14} />
                                    Approve
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleVisitorStatus(visitor.id, 'rejected');
                                    }}
                                    className="h-10 px-4 bg-danger text-white hover:bg-rose-700 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm font-black uppercase text-[10px] tracking-widest"
                                    title="Decline"
                                  >
                                    <XCircle size={14} />
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 px-2">
                                  No Pending Action
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="5" className="px-10 py-40 text-center">
                            <div className="flex flex-col items-center gap-8">
                              <div className="h-32 w-32 bg-gray-50 rounded-[4rem] flex items-center justify-center text-gray-200 shadow-inner">
                                <Users size={64} />
                              </div>
                              <div>
                                <p className="text-dark font-black text-2xl tracking-tight">Stream is empty</p>
                                <p className="text-secondary mt-2 font-medium opacity-60">No institutional access requests currently active.</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Tab Content: Guest Lectures */}
        {activeTab === 'lectures' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-1">
                 <h3 className="text-3xl font-black text-dark tracking-tight leading-none">Academic Schedule</h3>
                 <p className="text-secondary font-medium text-sm">Managing industry-led learning sessions.</p>
              </div>
              <Button
                onClick={() => {
                  setEditingLecture(null);
                  setIsAddingLecture(true);
                }}
                className="flex items-center gap-4 px-10 h-16 rounded-2xl shadow-glow font-black uppercase tracking-widest text-xs"
              >
                <Plus size={20} /> Schedule Session
              </Button>
            </div>

            {isAddingLecture || editingLecture ? (
              <Card className="border-none shadow-float rounded-[3rem] overflow-hidden p-0 animate-in zoom-in-95 duration-500">
                <div className="bg-dark p-10 md:p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[80px] rounded-full -mr-32 -mt-32"></div>
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <h3 className="text-3xl font-black text-white tracking-tight">
                        {editingLecture ? 'Update Event' : 'New Learning Session'}
                      </h3>
                      <p className="text-gray-400 font-medium mt-2">Configure institutional guest lecture parameters.</p>
                    </div>
                    <Button variant="outline" onClick={() => {
                      setIsAddingLecture(false);
                      setEditingLecture(null);
                    }} className="border-white/10 text-white hover:bg-white/10 font-black uppercase text-[10px] tracking-widest px-6 h-12 rounded-xl">
                      Discard
                    </Button>
                  </div>
                </div>
                <div className="p-8 md:p-12 bg-white">
                  <LectureForm
                    onSubmit={handleSaveLecture}
                    initialData={editingLecture}
                  />
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-8">
                {lectures.length > 0 ? lectures.map((lecture) => (
                  <Card key={lecture.id} hover noPadding className="relative group overflow-hidden border-none shadow-float bg-white rounded-[3rem] flex flex-col lg:flex-row min-h-[340px]">
                    {/* Cover */}
                    <div className="w-full lg:w-[400px] bg-gray-50 relative shrink-0 overflow-hidden">
                      {lecture.image_url ? (
                        <img src={lecture.image_url} alt={lecture.topic} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 text-primary/20">
                          <BookOpen size={80} />
                        </div>
                      )}
                      <div className="absolute top-8 left-8">
                        <span className="px-5 py-2 bg-white/95 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest rounded-xl shadow-float border border-primary/10">
                          {lecture.department}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-10 lg:p-12 flex flex-col space-y-8">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3">
                          <h3 className="text-3xl font-black text-dark tracking-tight leading-tight group-hover:text-primary transition-colors">{lecture.topic}</h3>
                          <div className="flex items-center gap-4 text-secondary font-bold text-base">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/5 shadow-inner">
                               <User size={16} />
                            </div>
                            {lecture.speakerName}
                          </div>
                        </div>
                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                          lecture.status === 'completed' ? 'bg-success/5 text-success border-success/20' :
                          lecture.status === 'cancelled' ? 'bg-danger/5 text-danger border-danger/20' :
                          'bg-primary/5 text-primary border-primary/20'
                        }`}>
                          {lecture.status || 'scheduled'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 bg-gray-50/50 rounded-[2rem] border border-gray-100/50 shadow-inner">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Temporal Protocol</p>
                          <div className="flex flex-col">
                             <p className="text-dark font-black text-sm flex items-center gap-3">
                               <Calendar size={14} className="text-primary" /> 
                               {new Date(lecture.dateTime).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                             </p>
                             <p className="text-primary font-bold text-xs pl-6 mt-1">
                               {new Date(lecture.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Venue Protocol</p>
                          <p className="text-dark font-black text-sm flex items-center gap-3">
                            <MapPin size={14} className="text-primary" /> {lecture.venue}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Direct Assignee</p>
                          <p className="text-dark font-black text-sm flex items-center gap-3">
                            <ShieldCheck size={14} className="text-primary" /> {lecture.assigneeName || 'Pending'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 pt-4 mt-auto">
                        <button
                          onClick={() => setEditingLecture(lecture)}
                          className="h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-glow flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
                        >
                          <Edit size={16} /> Update Details
                        </button>

                        <button
                          onClick={() => setManagingExpenses(lecture)}
                          className="h-14 px-8 rounded-2xl bg-white text-success border-2 border-success/20 font-black uppercase text-[10px] tracking-widest flex items-center gap-3 transition-all hover:bg-success hover:text-white hover:border-success"
                        >
                          <Wallet size={16} /> Financials
                        </button>

                        <button
                          onClick={() => handleDeleteLecture(lecture.id)}
                          className="h-14 w-14 rounded-2xl bg-white text-gray-300 border-2 border-gray-100 flex items-center justify-center transition-all hover:text-danger hover:border-danger/20 hover:bg-danger/5"
                        >
                          <Trash2 size={20} />
                        </button>
                        
                        {lecture.feedbacks && lecture.feedbacks.length > 0 && (
                          <button
                            onClick={() => setViewingFeedback(lecture)}
                            className="h-14 px-8 rounded-2xl bg-gray-50 text-secondary border border-gray-100 font-black uppercase text-[10px] tracking-widest flex items-center gap-3 transition-all hover:bg-white hover:shadow-soft"
                          >
                            <MessageSquare size={16} /> Feedback ({lecture.feedbacks.length})
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                )) : (
                  <div className="py-40 bg-white border-2 border-dashed border-gray-100 rounded-[4rem] text-center space-y-10 shadow-inner">
                    <div className="h-32 w-32 bg-gray-50 rounded-[3rem] flex items-center justify-center mx-auto text-gray-200 shadow-inner animate-pulse">
                      <BookOpen size={64} />
                    </div>
                    <div className="space-y-4">
                      <p className="text-dark font-black text-3xl tracking-tight leading-none">Schedule is empty</p>
                      <p className="text-secondary font-medium text-lg max-w-md mx-auto opacity-60">Initiate your first academic guest lecture to begin departmental synchronization.</p>
                    </div>
                    <Button variant="primary" size="lg" onClick={() => setIsAddingLecture(true)} className="px-12 h-16 rounded-2xl shadow-glow">
                      Schedule Protocol
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Items Management */}
        {activeTab === 'items' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-1">
                 <h3 className="text-3xl font-black text-dark tracking-tight leading-none">Logistics Stream</h3>
                 <p className="text-secondary font-medium text-sm">Real-time requirement tracking for upcoming sessions.</p>
              </div>
              <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-soft">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Threads</span>
                 <span className="text-2xl font-black text-primary leading-none">{Object.keys(lectureItems).length}</span>
              </div>
            </div>

            {lectures.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {lectures.map((lecture) => (
                  <Card key={lecture.id} className="flex flex-col h-full bg-white border-none shadow-float p-0 overflow-hidden rounded-[3rem] group">
                    <div className="p-10 pb-8 bg-gray-50/50 border-b border-gray-100 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                      <h3 className="font-black text-dark text-xl leading-tight mb-4 line-clamp-1 group-hover:text-primary transition-colors">{lecture.topic}</h3>
                      <div className="flex items-center justify-between relative z-10">
                        <p className="text-[10px] font-black text-secondary uppercase tracking-widest flex items-center gap-3">
                          <User size={14} className="text-primary" /> {lecture.speakerName}
                        </p>
                        <button 
                          className="h-10 w-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-primary shadow-soft hover:bg-primary hover:text-white transition-all duration-500"
                          onClick={() => notifyAssignee(lecture)}
                          title="WhatsApp Notify"
                        >
                          <MessageSquare size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="p-10 flex-1 flex flex-col space-y-10">
                      <div className="bg-primary/[0.02] p-6 rounded-[2rem] border border-primary/5 shadow-inner">
                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-3 opacity-60">Operations Commander</p>
                        <p className="text-dark font-black text-base tracking-tight">{lecture.assigneeName || 'Personnel Not Assigned'}</p>
                        {lecture.assigneePhone && (
                          <p className="text-[10px] font-bold text-secondary mt-2 flex items-center gap-3 opacity-60">
                            <Phone size={12} /> {lecture.assigneePhone}
                          </p>
                        )}
                      </div>

                      <div className="flex-1 space-y-6">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Requirement Pipeline</p>
                        <div className="space-y-4 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar">
                          {(lectureItems[lecture.id] || []).length > 0 ? (lectureItems[lecture.id] || []).map((item, idx) => (
                            <div
                              key={item.id}
                              className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer group/item shadow-sm ${item.status === 'ready'
                                  ? 'bg-success/5 border-success/10 text-success'
                                  : 'bg-white border-gray-50 text-secondary hover:border-primary/20'
                                }`}
                              onClick={() => toggleItemStatus(lecture.id, item.id, item.status)}
                            >
                              <div className="flex items-center gap-5">
                                <div className={`
                                  h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-700
                                  ${item.status === 'ready' ? 'bg-success text-white rotate-[360deg] shadow-lg shadow-success/20' : 'bg-gray-50 text-transparent border border-gray-100'}
                                `}>
                                  <CheckSquare size={18} />
                                </div>
                                <span className={`text-sm font-black tracking-tight ${item.status === 'ready' ? 'line-through opacity-40' : 'text-dark'}`}>
                                  {item.item_name}
                                </span>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); /* removeItem(item.id); */ }}
                                className="h-8 w-8 bg-gray-50 text-gray-300 rounded-lg flex items-center justify-center hover:bg-danger/10 hover:text-danger opacity-0 group-hover/item:opacity-100 transition-all border border-transparent hover:border-danger/10"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          )) : (
                            <div className="py-16 text-center border-2 border-dashed border-gray-50 rounded-[2rem] bg-gray-50/30 shadow-inner">
                              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Zero Requirements</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-auto pt-8 border-t border-gray-50">
                        <AddItemInput onAdd={(name) => addItem(lecture.id, name)} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-40 bg-white border-2 border-dashed border-gray-100 rounded-[4rem] text-center text-secondary shadow-inner">
                No active learning threads to synchronize.
              </div>
            )}
          </div>
        )}
      </div>

      {viewingVisitor && (
        <div className="fixed inset-0 bg-dark/60 z-[110] flex items-center justify-center p-6 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="bg-white rounded-[3rem] w-full max-w-3xl shadow-float relative max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border-none">
            <div className="p-10 border-b border-gray-100 flex justify-between items-start bg-gray-50/30">
              <div>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3 block">Visitor Request Details</span>
                <h3 className="text-3xl font-black text-dark tracking-tight leading-none">{viewingVisitor.name || viewingVisitor.User?.name}</h3>
                <p className="text-secondary font-bold mt-3">{viewingVisitor.email}</p>
              </div>
              <button
                onClick={() => setViewingVisitor(null)}
                className="p-4 text-secondary hover:text-dark hover:bg-gray-100 rounded-[1.5rem] transition-all"
              >
                <X size={28} />
              </button>
            </div>

            <div className="p-10 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem label="Phone" value={viewingVisitor.phone || viewingVisitor.User?.phone} />
              <DetailItem label="WhatsApp" value={viewingVisitor.whatsapp_number || viewingVisitor.whatsappNumber || viewingVisitor.phone} />
              <DetailItem label="Category" value={viewingVisitor.visitor_category || viewingVisitor.visitorCategory || 'Guest'} />
              <DetailItem label="Department" value={viewingVisitor.department} />
              <DetailItem label="Person To Meet" value={viewingVisitor.personToMeet || viewingVisitor.person_to_meet} />
              <DetailItem label="Visit Date" value={viewingVisitor.visitDate || viewingVisitor.visit_date} />
              <DetailItem label="Visit Time" value={viewingVisitor.visitTime || viewingVisitor.visit_time} />
              <DetailItem label="Status" value={viewingVisitor.status} />
              <DetailItem label="Student Name" value={viewingVisitor.studentName || viewingVisitor.student_name || '-'} />
              <DetailItem label="Student Roll" value={viewingVisitor.studentRoll || viewingVisitor.student_roll || '-'} />
              <DetailItem label="Purpose" value={viewingVisitor.purpose} full />
              <DetailItem label="Rejection Reason" value={viewingVisitor.rejectionReason || viewingVisitor.rejection_reason || '-'} full />
              <DetailItem label="Entry Time" value={viewingVisitor.checkIn || '--:--'} />
              <DetailItem label="Exit Time" value={viewingVisitor.checkOut || '--:--'} />
              <DetailItem label="Requested At" value={viewingVisitor.created_at || viewingVisitor.createdAt || '-'} />

              <div className="md:col-span-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">ID Proof</p>
                {viewingVisitor.idProof ? (
                  <a
                    href={viewingVisitor.idProof.startsWith('http') ? viewingVisitor.idProof : `${api.defaults.baseURL.replace('/api', '')}${viewingVisitor.idProof}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-5 py-3 bg-primary/5 hover:bg-primary/10 text-primary rounded-xl border border-primary/10 transition-all font-black uppercase text-[10px] tracking-widest"
                  >
                    <ShieldCheck size={16} />
                    View Uploaded ID
                  </a>
                ) : (
                  <p className="text-sm font-bold text-gray-400">No ID proof uploaded</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Modals remain similarly styled but with Dashboard's new aesthetic */}
      {viewingFeedback && (
        <div className="fixed inset-0 bg-dark/60 z-[110] flex items-center justify-center p-6 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="bg-white rounded-[3rem] w-full max-w-3xl shadow-float relative max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border-none">
            <div className="p-12 pb-8 border-b border-gray-50 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3 block">Institutional Feedback</span>
                <h3 className="text-4xl font-black text-dark tracking-tight leading-none">{viewingFeedback.topic}</h3>
                <p className="text-secondary font-bold mt-4 flex items-center gap-3">
                  <User size={18} className="text-primary" /> {viewingFeedback.speakerName}
                </p>
              </div>
              <button
                onClick={() => setViewingFeedback(null)}
                className="p-4 text-secondary hover:text-dark hover:bg-gray-100 rounded-[1.5rem] transition-all"
              >
                <X size={28} />
              </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar flex-1 p-12 pt-8 space-y-8">
              {viewingFeedback.feedbacks?.length > 0 ? (
                viewingFeedback.feedbacks.map((fb, idx) => (
                  <div key={idx} className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 shadow-inner group hover:bg-white hover:shadow-soft transition-all duration-500">
                    <p className="text-dark font-medium text-lg leading-relaxed italic">"{fb.text}"</p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-xs font-black text-primary uppercase tracking-widest">— {fb.userName || 'Verified Participant'}</span>
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                        {new Date(fb.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-24 text-secondary bg-gray-50/30 rounded-[3rem] border-2 border-dashed border-gray-100">
                  <MessageSquare size={80} className="mx-auto mb-8 text-gray-200" />
                  <p className="font-black text-xl tracking-tight">Protocol empty. No testimonials received.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Expense Modal Styling Fix */}
      {managingExpenses && (
        <div className="fixed inset-0 bg-dark/60 z-[110] flex items-center justify-center p-6 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="bg-white rounded-[3rem] w-full max-w-3xl shadow-float relative max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border-none">
            <div className="p-12 pb-8 border-b border-gray-100 flex justify-between items-start bg-gray-50/30">
              <div>
                <span className="text-[10px] font-black text-success uppercase tracking-[0.3em] mb-3 block">Financial Logistics</span>
                <h3 className="text-4xl font-black text-dark tracking-tight leading-none">{managingExpenses.topic}</h3>
                <p className="text-secondary font-bold mt-4">Budget Control & Resource Settlement</p>
              </div>
              <button
                onClick={() => setManagingExpenses(null)}
                className="p-4 text-secondary hover:text-dark hover:bg-gray-100 rounded-[1.5rem] transition-all"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-12 pt-10 custom-scrollbar space-y-12">
              {/* Add Expense Form */}
              <div className="space-y-6">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Register Transaction</p>
                <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-7">
                    <input 
                      required
                      type="text"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 h-16 text-sm font-black outline-none focus:border-success/30 focus:bg-white transition-all shadow-inner"
                      value={newExpense.description}
                      onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                      placeholder="Institutional expense description..."
                    />
                  </div>
                  <div className="md:col-span-3">
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-400 text-base">₹</span>
                      <input 
                        required
                        type="number"
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-10 pr-6 h-16 text-sm font-black outline-none focus:border-success/30 focus:bg-white transition-all shadow-inner"
                        value={newExpense.amount}
                        onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="w-full h-16 bg-success text-white rounded-2xl shadow-lg shadow-success/20 flex items-center justify-center hover:bg-emerald-600 transition-all active:scale-95 group">
                      <Plus size={32} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Expense List */}
              <div className="space-y-6">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Institutional Breakdown</p>
                <div className="space-y-4">
                  {managingExpenses.expenses && managingExpenses.expenses.length > 0 ? (
                    managingExpenses.expenses.map((exp) => (
                      <div key={exp.id} className="flex items-center justify-between p-6 bg-white border-2 border-gray-50 rounded-[2rem] shadow-sm group hover:border-success/20 transition-all duration-500">
                        <div className="flex items-center gap-6">
                          <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-success/10 group-hover:text-success transition-all duration-500 border border-gray-100">
                            <Wallet size={20} />
                          </div>
                          <div>
                            <p className="text-base font-black text-dark tracking-tight uppercase">{exp.description}</p>
                            <p className="text-[10px] font-bold text-gray-300 mt-1 uppercase tracking-widest">
                              {new Date(exp.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <span className="font-mono font-black text-2xl text-dark tracking-tighter">₹{parseFloat(exp.amount).toLocaleString()}</span>
                          <button 
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="h-10 w-10 bg-gray-50 text-gray-200 rounded-xl flex items-center justify-center hover:text-danger hover:bg-danger/10 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center bg-gray-50/30 rounded-[3rem] border-2 border-dashed border-gray-100 shadow-inner">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Zero Financial Protocol</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-12 bg-gray-50 border-t border-gray-100 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-success/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] relative z-10">Total Aggregate Cost</span>
              <div className="flex items-baseline gap-3 relative z-10">
                <span className="text-xl font-black text-success tracking-tighter">₹</span>
                <span className="text-6xl font-black text-dark tracking-tighter">
                  {(managingExpenses.expenses || []).reduce((sum, e) => sum + parseFloat(e.amount), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

const StatSummaryCard = ({ title, value, icon, color }) => {
  const colorStyles = {
    primary: 'text-primary bg-primary/5 border-primary/10',
    success: 'text-success bg-success/5 border-success/10',
    warning: 'text-warning bg-warning/5 border-warning/10',
    danger: 'text-danger bg-danger/5 border-danger/10',
  };
  
  return (
    <Card className="p-8 bg-white border-none shadow-float rounded-[2.5rem] flex flex-col gap-6 group hover:scale-[1.02] transition-transform duration-500">
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${colorStyles[color]} border shadow-inner group-hover:rotate-12 transition-transform duration-700`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</p>
        <p className="text-4xl font-black text-dark tracking-tighter mt-1">{value}</p>
      </div>
    </Card>
  );
};

const ImpactCard = ({ title, value, subtitle, icon, tone = 'primary' }) => {
  const tones = {
    primary: 'from-primary/15 to-primary/5 border-primary/20 text-primary',
    success: 'from-success/15 to-success/5 border-success/20 text-success',
    warning: 'from-warning/15 to-warning/5 border-warning/20 text-warning',
    dark: 'from-slate-700/10 to-slate-500/5 border-slate-300 text-dark'
  };

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-4 md:p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float ${tones[tone] || tones.primary}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] opacity-70">{title}</p>
          <p className="text-3xl font-black text-dark tracking-tight mt-1">{value}</p>
          <p className="text-xs font-semibold text-secondary mt-1">{subtitle}</p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-white/80 border border-white/70 flex items-center justify-center shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl font-black uppercase text-[10px] tracking-[0.14em] transition-all duration-300 whitespace-nowrap
      ${active
        ? 'bg-white text-primary shadow-soft ring-1 ring-primary/10'
        : 'text-secondary hover:text-dark hover:bg-white/70 opacity-70'
      }
    `}
  >
    <span className={active ? 'text-primary' : 'text-gray-400'}>{icon}</span>
    <span>{label}</span>
  </button>
);

const StatusBadge = ({ status }) => {
  const normalizedStatus = status ? status.toLowerCase() : '';
  const styles = {
    'pending': 'bg-warning/5 text-warning border-warning/20',
    'approved': 'bg-success/5 text-success border-success/20 shadow-success/10',
    'rejected': 'bg-danger/5 text-danger border-danger/20'
  };
  return (
    <span className={`
      px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm
      ${styles[normalizedStatus] || 'bg-gray-50 text-gray-400 border-gray-100'}
    `}>
      {status}
    </span>
  );
};

const DetailItem = ({ label, value, full = false }) => (
  <div className={full ? 'md:col-span-2' : ''}>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
    <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
      <p className="text-sm font-black text-dark break-words">{value || '-'}</p>
    </div>
  </div>
);

const AddItemInput = ({ onAdd }) => {
  const [val, setVal] = useState('');
  const handleAdd = () => {
    if (val.trim()) {
      onAdd(val);
      setVal('');
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="relative group">
         <input
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Add institutional requirement..."
            className="w-full bg-gray-50 border-2 border-gray-100 focus:border-primary/20 focus:bg-white rounded-2xl px-6 h-14 text-sm font-bold outline-none transition-all placeholder:text-gray-300 shadow-inner"
         />
         <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-30">
            <ShieldCheck size={14} />
            <span className="text-[8px] font-black uppercase tracking-widest">Protocol</span>
         </div>
      </div>
      <Button
        onClick={handleAdd}
        className="w-full h-14 text-[10px] font-black uppercase tracking-widest rounded-2xl"
      >
        <Plus size={18} className="mr-3" /> Execute Addition
      </Button>
    </div>
  );
};

export default Dashboard;

