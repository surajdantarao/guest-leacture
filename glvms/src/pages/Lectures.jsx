import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { MapPin, User, Clock, CalendarDays, BookOpen, ArrowRight, ThumbsUp, MessageSquare, X, Trash2, ShieldCheck, Search, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../utils/api';
import { getUser } from '../utils/localStorage';

const Lectures = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [currentLectureId, setCurrentLectureId] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [guestName, setGuestName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedLectureId, setExpandedLectureId] = useState(null);
  
  const user = getUser();
  const isAdmin = user && user.role === 'admin';

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const response = await api.get('/lectures');
      setLectures(response.data);
    } catch (err) {
      console.error('Error fetching lectures:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, []);

  const filteredLectures = lectures.filter(l => 
    l.topic.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (l.speakerName || l.speaker_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLectureDateTime = (lecture) => {
    const directDate = lecture.dateTime ? new Date(lecture.dateTime) : null;
    if (directDate && !Number.isNaN(directDate.getTime())) return directDate;

    if (lecture.lecture_date) {
      const composed = new Date(`${lecture.lecture_date}T${lecture.lecture_time || '00:00:00'}`);
      if (!Number.isNaN(composed.getTime())) return composed;
    }
    return null;
  };

  const formatLectureDate = (lecture) => {
    const dt = getLectureDateTime(lecture);
    return dt
      ? dt.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
      : 'Date TBA';
  };

  const formatLectureTime = (lecture) => {
    const dt = getLectureDateTime(lecture);
    return dt
      ? dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'Time TBA';
  };

  const canInteractWithLecture = (lecture) => {
    const dt = getLectureDateTime(lecture);
    // Allow voting even before lecture starts
    return true; 
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      try {
        await api.delete(`/lectures/${id}`);
        fetchLectures();
      } catch (err) {
        alert('Failed to delete lecture.');
      }
    }
  };

  const handleVote = async (id) => {
    try {
      await api.post('/feedback', {
        lecture_id: id,
        rating: 5,
        comment: 'Liked the session',
        guest_name: 'Anonymous Student'
      });
      fetchLectures();
    } catch (err) {
      console.error('Voting error:', err);
      alert('Failed to submit vote. Please try again.');
    }
  };

  const handleOpenFeedback = (id) => {
    setCurrentLectureId(id);
    setFeedbackModalOpen(true);
  };

  const handleCloseFeedback = () => {
    setFeedbackModalOpen(false);
    setCurrentLectureId(null);
    setFeedbackText('');
    setGuestName('');
  };

  const toggleExpand = (id) => {
    setExpandedLectureId(expandedLectureId === id ? null : id);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    try {
      await api.post('/feedback', {
        lecture_id: currentLectureId,
        rating: 4,
        comment: feedbackText,
        guest_name: guestName.trim() || 'Anonymous Student'
      });
      handleCloseFeedback();
      fetchLectures();
    } catch (err) {
      console.error('Feedback error:', err);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 relative overflow-hidden">
      {/* Hero Section with University Background */}
      <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
          style={{ 
            backgroundImage: `url('/assets/University.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-dark/60 backdrop-blur-[2px]"></div>
        
        <div className="container-max relative z-10 text-center space-y-8 px-6">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 shadow-xl animate-fade-in">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Knowledge Series 2026</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none animate-slide-up">
            Guest <span className="text-primary italic">Lectures</span>
          </h1>
          
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed animate-slide-up delay-100">
            Bridging academia and industry through curated learning experiences with global thought leaders.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4 animate-slide-up delay-200">
            <div className="relative w-full max-w-md group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors" size={20} />
               <input 
                  type="text" 
                  placeholder="Search topic or speaker..."
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/30 pl-16 h-16 rounded-2xl outline-none focus:border-primary/50 transition-all shadow-2xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
          </div>
        </div>
      </div>

      <div className="container-max relative z-10 -mt-12 px-6 space-y-12">
        {/* Admin Action Bar */}
        {isAdmin && (
          <div className="flex justify-end animate-slide-up delay-300">
            <Link to="/add-lecture">
              <Button variant="primary" size="lg" className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest shadow-glow flex items-center gap-3">
                <Plus size={20} /> Schedule Session
              </Button>
            </Link>
          </div>
        )}

        {/* Lectures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-[500px] bg-gray-50 rounded-[3rem] animate-pulse border-2 border-dashed border-gray-100"></div>
            ))
          ) : filteredLectures.length > 0 ? filteredLectures.map((lecture, idx) => (
            <div key={lecture.id} className="flex flex-col space-y-4">
              <Card hover noPadding className={`flex flex-col group overflow-hidden border-none shadow-soft hover:shadow-float relative bg-white rounded-[3rem] animate-slide-up h-full`} style={{ animationDelay: `${idx * 0.1}s` }}>
                {isAdmin && (
                  <div className="absolute top-6 right-6 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => handleDelete(lecture.id)}
                      className="h-12 w-12 bg-white/90 backdrop-blur-md text-danger rounded-2xl shadow-float flex items-center justify-center hover:bg-danger hover:text-white transition-all duration-300 border border-gray-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                )}

                {/* Cover Image */}
                <div className="h-64 overflow-hidden relative">
                  {lecture.imageUrl || lecture.image_url ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/10 to-transparent z-10 opacity-60"></div>
                      <img
                        src={lecture.imageUrl || lecture.image_url}
                        alt={lecture.topic}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center relative">
                      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                      <BookOpen className="w-24 h-24 text-primary/20 group-hover:scale-110 transition-transform duration-1000" />
                    </div>
                  )}
                  <div className="absolute bottom-8 left-8 z-20">
                    <span className="px-5 py-2 bg-white/95 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-float border border-primary/10">
                      {lecture.department}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg border shadow-sm ${
                        lecture.status === 'completed' ? 'bg-success/5 text-success border-success/20' :
                        lecture.status === 'cancelled' ? 'bg-danger/5 text-danger border-danger/20' :
                        'bg-primary/5 text-primary border-primary/20'
                      }`}>
                        {lecture.status || 'scheduled'}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-gray-200"></span>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                         <Clock size={12} /> {formatLectureTime(lecture)}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-dark tracking-tight leading-tight group-hover:text-primary transition-colors min-h-[3.5rem] line-clamp-2">
                      {lecture.topic}
                    </h3>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-gray-50 bg-gray-50/50 px-4 py-3">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Date</p>
                        <p className="text-dark text-xs font-black mt-1">{formatLectureDate(lecture)}</p>
                      </div>
                      <div className="rounded-2xl border border-gray-50 bg-gray-50/50 px-4 py-3">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Time</p>
                        <p className="text-dark text-xs font-black mt-1">{formatLectureTime(lecture)}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                           <User size={16} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Speaker</p>
                          <p className="text-sm font-bold text-dark">{lecture.speakerName || lecture.speaker_name || 'Speaker TBA'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                           <MapPin size={16} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Venue</p>
                          <p className="text-sm font-bold text-dark">{lecture.venue || 'Venue TBA'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 mt-auto">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVote(lecture.id)}
                          className="h-12 px-5 rounded-2xl border border-gray-200 text-secondary hover:border-primary hover:text-primary bg-white hover:bg-primary/5 transition-all flex items-center gap-3 active:scale-95"
                          title="Upvote Session"
                        >
                          <ThumbsUp size={18} />
                          <span className="font-black text-sm">{lecture.votes || 0}</span>
                        </button>
                        <button
                          onClick={() => handleOpenFeedback(lecture.id)}
                          className="h-12 px-5 rounded-2xl border border-gray-200 text-secondary hover:border-primary hover:text-primary bg-white hover:bg-primary/5 transition-all flex items-center gap-2"
                          title="Submit Feedback"
                        >
                          <MessageSquare size={18} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => toggleExpand(lecture.id)}
                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${expandedLectureId === lecture.id ? 'text-primary' : 'text-gray-400 hover:text-dark'}`}
                      >
                         {expandedLectureId === lecture.id ? 'Hide Feedback' : 'View Feedback'}
                         {expandedLectureId === lecture.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                    
                    <Link
                      to="/register"
                      state={{
                        lecturePrefill: {
                          department: lecture.department || '',
                          personToMeet: lecture.speakerName || lecture.speaker_name || '',
                          purpose: `Attend session: ${lecture.topic}`,
                          date: lecture.lecture_date || (lecture.dateTime ? new Date(lecture.dateTime).toISOString().split('T')[0] : ''),
                          visitTime: lecture.lecture_time || (lecture.dateTime ? new Date(lecture.dateTime).toTimeString().slice(0, 5) : '10:00'),
                          visitorCategory: 'Guest'
                        }
                      }}
                      className="w-full block"
                    >
                      <Button variant="primary" className="w-full h-14 text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-glow transition-all">
                        Attend Session <ArrowRight size={14} className="ml-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              {/* Expandable Feedback Section */}
              {expandedLectureId === lecture.id && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                   <div className="bg-gray-50/50 rounded-[2.5rem] border border-gray-100 p-8 space-y-6">
                      <div className="flex items-center justify-between">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-dark flex items-center gap-2">
                           <MessageSquare size={14} className="text-primary" /> Student Testimonials
                         </h4>
                         <span className="text-[10px] font-bold text-gray-400">{lecture.feedbacks?.length || 0} reviews</span>
                      </div>
                      
                      {lecture.feedbacks && lecture.feedbacks.length > 0 ? (
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                           {lecture.feedbacks.map((f, fIdx) => (
                             <div key={fIdx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                                <div className="flex justify-between items-center">
                                   <span className="text-[11px] font-black text-dark">{f.userName}</span>
                                   <span className="text-[9px] font-bold text-gray-400">{new Date(f.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-xs font-medium text-secondary italic leading-relaxed">"{f.text}"</p>
                             </div>
                           ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center bg-white/50 rounded-2xl border border-dashed border-gray-200">
                           <p className="text-[10px] font-bold text-gray-400 italic">No written feedback yet.</p>
                        </div>
                      )}
                   </div>
                </div>
              )}
            </div>
          )) : (
            <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border-2 border-dashed border-gray-100 shadow-inner">
              <div className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center mx-auto text-gray-200 mb-8">
                <BookOpen size={64} />
              </div>
              <h3 className="text-3xl font-black text-dark tracking-tight">No learning sessions found</h3>
              <p className="text-xl text-secondary mt-4 max-w-md mx-auto opacity-70">We couldn't find any lectures matching your criteria. Try adjusting your search.</p>
              <div className="mt-12">
                 <Button variant="outline" onClick={() => setSearchTerm('')} className="px-10 h-14 rounded-2xl font-black uppercase tracking-widest">Clear Search</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 bg-dark/60 z-[100] flex items-center justify-center p-6 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="p-10 w-full max-w-lg shadow-float relative rounded-[3rem] border-none animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-10">
              <div className="space-y-1">
                 <h3 className="text-3xl font-black text-dark tracking-tight leading-none">Feedback</h3>
                 <p className="text-secondary font-medium text-sm">Help us improve the learning experience.</p>
              </div>
              <button onClick={handleCloseFeedback} className="p-3 text-secondary hover:text-dark hover:bg-gray-100 rounded-2xl transition-all">
                <X size={28} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitFeedback} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">Student Name (Optional)</p>
                  <input 
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 h-14 text-sm font-bold outline-none focus:border-primary/30 focus:bg-white transition-all"
                  />
                </div>

                <div className="relative">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">Your Experience</p>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us what you liked or how we can improve..."
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] p-8 h-40 resize-none focus:outline-none focus:border-primary/30 focus:bg-white transition-all text-dark font-medium leading-relaxed"
                    required
                  />
                  <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-30">
                     <ShieldCheck size={16} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Public Entry</span>
                  </div>
                </div>
              </div>
              
              <Button type="submit" variant="primary" className="w-full h-16 text-sm font-black uppercase tracking-widest shadow-glow rounded-2xl" isLoading={loading}>
                Submit Testimonial
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Lectures;
