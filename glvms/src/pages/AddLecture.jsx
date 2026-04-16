import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import LectureForm from '../components/LectureForm';
import api from '../utils/api';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import Button from '../components/Button';

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
    <div className="container-max pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/guest-lectures')} 
          className="flex items-center space-x-2 border-none px-0 hover:bg-transparent hover:text-primary transition-colors font-bold text-secondary"
        >
          <ChevronLeft size={20} />
          <span>Back to Lectures</span>
        </Button>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-dark">Schedule New Lecture</h1>
            <p className="text-secondary text-sm">Fill in the details to create a new learning session.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in fade-in">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <Card className="shadow-soft p-8">
            <LectureForm onSubmit={handleAddLecture} isLoading={isLoading} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddLecture;
