import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { MapPin, User, Clock, CalendarDays, BookOpen, ArrowRight, ThumbsUp, MessageSquare, X, Trash2, ShieldCheck, Search } from 'lucide-react';
import api from '../utils/api';
import { getUser } from '../utils/localStorage';

const Lectures = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [currentLectureId, setCurrentLectureId] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
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
    l.speakerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.department.toLowerCase().includes(searchTerm.toLowerCase())
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
    return dt ? dt <= new Date() : false;
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
        comment: 'Liked the session'
      });
      fetchLectures();
    } catch (err) {
      alert('Please login to vote.');
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
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    try {
      await api.post('/feedback', {
        lecture_id: currentLectureId,
        rating: 4,
        comment: feedbackText
      });
      handleCloseFeedback();
      fetchLectures();
    } catch (err) {
      alert('Please login to submit feedback.');
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-40 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-40 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="container-max relative z-10 space-y-20">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center space-y-10 animate-slide-up">
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-md rounded-full text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-4 border border-primary/10 shadow-float">
            <span className="flex h-2.5 w-2.5 relative mr-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            Academic Excellence Series
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-dark tracking-tighter leading-none">
            Guest <span className="text-primary italic">Lectures</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto leading-relaxed font-medium opacity-80">
            Bridging academia and industry through curated learning experiences. 
            Connect with global thought leaders and industry experts.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6">
            <div className="relative w-full max-w-md group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
               <input 
                  type="text" 
                  placeholder="Search by topic, speaker or dept..."
                  className="input-field pl-16 h-16 rounded-2xl shadow-soft"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            {isAdmin && (
              <Link to="/add-lecture" className="w-full md:w-auto">
                <Button variant="primary" size="lg" className="w-full h-16 px-10 rounded-2xl font-black uppercase tracking-widest shadow-glow">
                  + Add Lecture
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Lectures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-[600px] bg-gray-50 rounded-[3rem] animate-pulse border-2 border-dashed border-gray-100"></div>
            ))
          ) : filteredLectures.length > 0 ? filteredLectures.map((lecture, idx) => (
            <Card key={lecture.id} hover noPadding className={`flex flex-col group overflow-hidden border-none shadow-soft hover:shadow-float relative bg-white rounded-[3rem] animate-slide-up`} style={{ animationDelay: `${idx * 0.1}s` }}>
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
              <div className="h-72 overflow-hidden relative">
                {lecture.imageUrl ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/10 to-transparent z-10 opacity-60"></div>
                    <img
                      src={lecture.imageUrl}
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
              <div className="p-10 lg:p-12 flex-1 flex flex-col space-y-8">
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
                       <Clock size={12} /> {new Date(lecture.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-dark tracking-tight leading-tight group-hover:text-primary transition-colors min-h-[4rem] line-clamp-2">
                    {lecture.topic}
                  </h3>
                </div>

                <div className="space-y-5 flex-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary/80">Date</p>
                      <p className="text-dark text-xs font-black mt-1">{formatLectureDate(lecture)}</p>
                    </div>
                    <div className="rounded-2xl border border-accent/20 bg-accent/5 px-4 py-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-accent">Time</p>
                      <p className="text-dark text-xs font-black mt-1">{formatLectureTime(lecture)}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <User size={16} className="text-primary mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">Speaker</p>
                        <p className="text-sm font-black text-dark">{lecture.speakerName || 'Speaker TBA'}</p>
                      </div>
                    </div>
                    <div className="h-px bg-gray-200" />
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-primary mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">Venue</p>
                        <p className="text-sm font-black text-dark">{lecture.venue || 'Venue TBA'}</p>
                      </div>
                    </div>
                    {lecture.description && (
                      <>
                        <div className="h-px bg-gray-200" />
                        <p className="text-xs text-secondary leading-relaxed line-clamp-2">{lecture.description}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100 mt-auto">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVote(lecture.id)}
                        disabled={!canInteractWithLecture(lecture)}
                        className={`h-11 px-5 rounded-xl border flex items-center gap-3 transition-all ${!canInteractWithLecture(lecture)
                            ? 'text-gray-300 border-gray-100 bg-gray-50/50 cursor-not-allowed'
                            : 'text-secondary border-gray-200 hover:border-primary hover:text-primary bg-white hover:bg-primary/5 hover:scale-105'
                          }`}
                        title="Upvote Session"
                      >
                        <ThumbsUp size={16} />
                        <span className="font-black text-xs">{lecture.votes || 0}</span>
                      </button>
                      <button
                        onClick={() => handleOpenFeedback(lecture.id)}
                        disabled={!canInteractWithLecture(lecture)}
                        className={`h-11 px-5 rounded-xl border flex items-center gap-3 transition-all ${!canInteractWithLecture(lecture)
                            ? 'text-gray-300 border-gray-100 bg-gray-50/50 cursor-not-allowed'
                            : 'text-secondary border-gray-200 hover:border-primary hover:text-primary bg-white hover:bg-primary/5 hover:scale-105'
                          }`}
                        title="Submit Feedback"
                      >
                        <MessageSquare size={16} />
                      </button>
                    </div>
                    
                    <span className="text-xs font-black text-dark tracking-tighter inline-flex items-center gap-2">
                       <CalendarDays size={14} className="text-primary" />
                       {formatLectureDate(lecture)}
                    </span>
                  </div>
                  
                  <Link
                    to="/register"
                    state={{
                      lecturePrefill: {
                        department: lecture.department || '',
                        personToMeet: lecture.speakerName || '',
                        purpose: `Attend session: ${lecture.topic}`,
                        date: lecture.lecture_date || (lecture.dateTime ? new Date(lecture.dateTime).toISOString().split('T')[0] : ''),
                        visitTime: lecture.lecture_time || (lecture.dateTime ? new Date(lecture.dateTime).toTimeString().slice(0, 5) : '10:00'),
                        visitorCategory: 'Guest'
                      }
                    }}
                    className="w-full block group/btn"
                  >
                    <Button variant="primary" className="w-full h-14 text-xs font-black uppercase tracking-[0.2em] rounded-2xl group-hover/btn:shadow-glow transition-all">
                      Attend Session <ArrowRight size={14} className="ml-3 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
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
            
            <form onSubmit={handleSubmitFeedback} className="space-y-8">
              <div className="relative">
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us what you liked or how we can improve..."
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] p-8 h-48 resize-none focus:outline-none focus:border-primary/30 focus:bg-white transition-all text-dark font-medium leading-relaxed"
                  required
                />
                <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-30">
                   <ShieldCheck size={16} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Verified Entry</span>
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
