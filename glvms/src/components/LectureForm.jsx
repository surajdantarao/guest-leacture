import React, { useState, useEffect } from 'react';
import Button from './Button';

const LectureForm = ({ onSubmit, initialData, isLoading = false }) => {
  const [formData, setFormData] = useState({
    speakerName: '',
    topic: '',
    department: '',
    dateTime: '',
    venue: '',
    description: '',
    imageUrl: '',
    assigneeName: '',
    assigneePhone: '',
    adminPhone: '',
    status: 'scheduled'
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      speaker_name: formData.speakerName,
      image_url: formData.imageUrl,
      assignee_name: formData.assigneeName,
      assignee_phone: formData.assigneePhone,
      admin_phone: formData.adminPhone
    };
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-dark ml-1">Speaker Name</label>
          <input 
            className="input-field" 
            name="speakerName" 
            value={formData.speakerName} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-dark ml-1">Topic</label>
          <input 
            className="input-field" 
            name="topic" 
            value={formData.topic} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-dark ml-1">Department</label>
          <input 
            className="input-field" 
            name="department" 
            value={formData.department} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-dark ml-1">Date & Time</label>
          <input 
            className="input-field" 
            name="dateTime" 
            type="datetime-local" 
            value={formData.dateTime} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-dark ml-1">Venue</label>
          <input 
            className="input-field" 
            name="venue" 
            value={formData.venue} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-dark ml-1">Status</label>
          <select 
            className="input-field" 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-dark ml-1">Assignee Name</label>
          <input 
            className="input-field" 
            name="assigneeName" 
            value={formData.assigneeName} 
            onChange={handleChange} 
            placeholder="Person responsible for checklist"
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-dark ml-1">Assignee WhatsApp No.</label>
          <input 
            className="input-field" 
            name="assigneePhone" 
            value={formData.assigneePhone} 
            onChange={handleChange} 
            placeholder="e.g. 919876543210"
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-dark ml-1">Admin WhatsApp No.</label>
          <input 
            className="input-field" 
            name="adminPhone" 
            value={formData.adminPhone} 
            onChange={handleChange} 
            placeholder="e.g. 918767753086"
            required 
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-dark ml-1">Description</label>
        <textarea
          className="input-field min-h-[120px] resize-none"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full md:w-auto px-8 py-3 font-bold">
        Save Lecture Details
      </Button>
    </form>
  );
};

export default LectureForm;
