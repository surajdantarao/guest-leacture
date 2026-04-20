import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { MessageSquare, ThumbsUp, User, Calendar, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../utils/api';

const LectureFeedback = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await api.get('/lectures?includeDeleted=true');
      setLectures(response.data);
    } catch (err) {
      console.error('Error fetching lecture feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container-max space-y-8">
        <div className="pb-8 border-b border-gray-100">
          <div className="inline-flex items-center px-3 py-1 bg-primary/10 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest border border-primary/10 mb-4">
            Audience Insights
          </div>
          <h1 className="text-4xl font-black text-dark tracking-tight">Lecture Feedback</h1>
          <p className="text-secondary text-lg">Detailed student testimonials and voting metrics for guest sessions.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="py-20 text-center animate-pulse">
              <MessageSquare size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="font-black text-[10px] uppercase tracking-widest text-gray-400">Loading feedback records...</p>
            </div>
          ) : lectures.length > 0 ? (
            lectures.map((lecture) => (
              <Card key={lecture.id} noPadding className="overflow-hidden border-none shadow-card bg-white rounded-3xl">
                <div 
                  className={`p-8 cursor-pointer transition-colors ${expandedId === lecture.id ? 'bg-primary/5' : 'hover:bg-gray-50'}`}
                  onClick={() => toggleExpand(lecture.id)}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/10 rounded">
                          {lecture.department}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                          <Calendar size={12} /> {lecture.lecture_date}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-dark tracking-tight">{lecture.topic}</h3>
                      <p className="text-sm font-bold text-secondary flex items-center gap-2">
                        <User size={14} className="text-gray-400" /> {lecture.speaker_name || lecture.speakerName}
                      </p>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-primary mb-1">
                          <ThumbsUp size={20} />
                          <span className="text-2xl font-black">{lecture.votes || 0}</span>
                        </div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Votes</p>
                      </div>
                      <div className="h-12 w-px bg-gray-100 hidden md:block"></div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-dark mb-1">
                          <MessageSquare size={20} />
                          <span className="text-2xl font-black">{lecture.feedbacks?.length || 0}</span>
                        </div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Comments</p>
                      </div>
                      {expandedId === lecture.id ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-gray-300" />}
                    </div>
                  </div>
                </div>

                {expandedId === lecture.id && (
                  <div className="border-t border-gray-100 bg-white">
                    <div className="p-8">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                        Student Testimonials <div className="h-px flex-1 bg-gray-100"></div>
                      </h4>
                      
                      {lecture.feedbacks && lecture.feedbacks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {lecture.feedbacks.map((f, idx) => (
                            <div key={idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 hover:border-primary/20 transition-colors">
                              <div className="flex justify-between items-start">
                                <span className="text-xs font-black text-dark">{f.userName}</span>
                                <span className="text-[9px] font-bold text-gray-400">{new Date(f.date).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm font-medium text-secondary italic leading-relaxed">
                                "{f.text}"
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                          <MessageSquare size={32} className="mx-auto text-gray-200 mb-3" />
                          <p className="text-xs font-bold text-gray-400">No written feedback submitted for this lecture yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <div className="py-40 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
              <BookOpen size={64} className="mx-auto text-gray-100 mb-6" />
              <h3 className="text-2xl font-black text-dark tracking-tight">No feedback records found</h3>
              <p className="text-secondary font-medium mt-2">Active lectures will appear here once feedback starts coming in.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LectureFeedback;
