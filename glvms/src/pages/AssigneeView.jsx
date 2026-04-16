import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { CheckSquare, Square, MessageSquare, Clock, MapPin, BookOpen } from 'lucide-react';
import api from '../utils/api';

const AssigneeView = () => {
  const { lectureId } = useParams();
  const [lecture, setLecture] = useState(null);
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const lectureRes = await api.get('/lectures');
      const foundLecture = lectureRes.data.find(l => String(l.id) === String(lectureId));
      
      if (foundLecture) {
        setLecture(foundLecture);
        const checklistRes = await api.get(`/checklist/${lectureId}`);
        setItems(checklistRes.data);
      }
    } catch (err) {
      console.error('Error fetching assignee data:', err);
    } finally {
      setLoading(false);
    }
  }, [lectureId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleItem = async (itemId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'pending' ? 'ready' : 'pending';
      await api.put(`/checklist/${itemId}/status`, { status: newStatus });
      
      const updated = items.map(item =>
        String(item.id) === String(itemId) ? { ...item, status: newStatus } : item
      );
      setItems(updated);

      if (newStatus === 'ready') {
        const item = updated.find(i => String(i.id) === String(itemId));
        showToast(`Confirmed: ${item.item_name} is ready`);
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const notifyAdmin = () => {
    const message = `Hi Admin, I have completed the arrangement for lecture: *${lecture.topic}*.%0A%0AEverything is set for the session.`;
    window.open(`https://wa.me/${lecture.adminPhone}?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <p className="text-secondary animate-pulse">Loading checklist...</p>
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="text-center py-12">
          <BookOpen size={48} className="mx-auto text-gray-200 mb-4" />
          <h2 className="text-2xl font-bold text-dark">Lecture Not Found</h2>
          <p className="text-secondary mt-2">The checklist you're looking for might have been removed.</p>
        </Card>
      </div>
    );
  }

  const allCompleted = items.length > 0 && items.every(i => i.status === 'ready');

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6">
      <div className="container-max max-w-2xl mx-auto">
        {toast && (
          <div className="fixed top-24 right-4 z-[100] bg-dark text-white px-6 py-4 rounded-xl shadow-float animate-in slide-in-from-right-8 font-medium">
            {toast}
          </div>
        )}

        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary uppercase tracking-wider">
              Requirement Checklist
            </span>
            <h1 className="text-3xl font-bold text-dark">{lecture.topic}</h1>
            <p className="text-secondary">Assigned to: <span className="font-bold text-dark">{lecture.assigneeName}</span></p>
          </div>

          <Card className="grid grid-cols-2 gap-4 py-6 bg-gray-50/50 border-none">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date & Time</p>
              <div className="flex items-center gap-2 text-dark font-semibold text-sm">
                <Clock size={14} className="text-primary" />
                {new Date(lecture.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Venue</p>
              <div className="flex items-center gap-2 text-dark font-semibold text-sm">
                <MapPin size={14} className="text-primary" />
                {lecture.venue}
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <h3 className="font-bold text-dark flex items-center gap-2">
              <CheckSquare size={20} className="text-primary" />
              Items to Arrange
            </h3>
            
            <div className="space-y-3">
              {items.length > 0 ? items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    item.status === 'ready' 
                      ? 'bg-success/5 border-success/20 text-success-700' 
                      : 'bg-white border-gray-100 hover:border-primary/20 shadow-sm'
                  }`}
                  onClick={() => toggleItem(item.id, item.status)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-6 w-6 rounded-lg flex items-center justify-center transition-colors ${
                      item.status === 'ready' ? 'bg-success text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {item.status === 'ready' ? <CheckSquare size={16} /> : <Square size={16} />}
                    </div>
                    <div>
                      <p className={`font-bold ${item.status === 'ready' ? 'line-through opacity-75' : 'text-dark'}`}>
                        {item.item_name}
                      </p>
                    </div>
                  </div>
                  {item.status === 'ready' && <span className="text-[10px] font-black uppercase tracking-widest bg-success/10 px-2 py-1 rounded">Arranged</span>}
                </div>
              )) : (
                <div className="py-12 text-center text-secondary bg-white rounded-3xl border-2 border-dashed border-gray-100">
                  No specific items listed yet.
                </div>
              )}
            </div>
          </div>

          {allCompleted && (
            <div className="animate-in fade-in zoom-in duration-500">
              <Button 
                onClick={notifyAdmin}
                className="w-full py-4 bg-primary text-white font-bold text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
              >
                <MessageSquare size={22} />
                Confirm & Notify Admin
              </Button>
              <p className="text-center text-xs text-secondary mt-4">
                This will send a WhatsApp confirmation message to the administrator.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssigneeView;
