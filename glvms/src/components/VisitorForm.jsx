import React, { useState } from 'react';
import Button from './Button';
import { User, Mail, Phone, Users, MapPin, Calendar, Clock, FileText, Upload } from 'lucide-react';

const VisitorForm = ({ onSubmit, initialData, isLoading }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    department: initialData?.department || '',
    personToMeet: initialData?.personToMeet || initialData?.person_to_meet || '',
    purpose: initialData?.purpose || '',
    date: initialData?.visitDate || initialData?.date || new Date().toISOString().split('T')[0],
    visitTime: initialData?.visit_time || initialData?.visitTime || '10:00',
    visitorCategory: initialData?.visitor_category || initialData?.visitorCategory || 'Guest',
    studentName: initialData?.student_name || initialData?.studentName || '',
    studentRoll: initialData?.student_roll || initialData?.studentRoll || '',
    idProofFile: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Section 1: Personal Details */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
           <h4 className="text-sm font-black uppercase tracking-[0.2em] text-dark">Identity & Contact</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormGroup label="Full Name" icon={<User size={18} />}>
            <input 
              className="input-field" 
              name="name" 
              placeholder="e.g. Johnathan Smith"
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </FormGroup>
          
          <FormGroup label="Email Address" icon={<Mail size={18} />}>
            <input 
              className="input-field" 
              name="email" 
              type="email" 
              placeholder="john@example.edu"
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </FormGroup>

          <FormGroup label="Phone (WhatsApp)" icon={<Phone size={18} />}>
            <input 
              className="input-field" 
              name="phone" 
              placeholder="+91 87677 53086"
              value={formData.phone} 
              onChange={handleChange} 
              required 
            />
          </FormGroup>

          <FormGroup label="Category" icon={<Users size={18} />}>
            <select
              className="input-field appearance-none"
              name="visitorCategory"
              value={formData.visitorCategory}
              onChange={handleChange}
              required
            >
              <option value="Guest">General Guest</option>
              <option value="Parent">Parent of Student</option>
              <option value="Vendor">Vendor / Service Provider</option>
              <option value="Official">Official / Inspector</option>
            </select>
          </FormGroup>
        </div>

        {formData.visitorCategory === 'Parent' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-primary/5 rounded-[2rem] border border-primary/10 animate-in fade-in zoom-in-95 duration-500">
            <FormGroup label="Student's Full Name">
              <input 
                className="input-field bg-white" 
                name="studentName" 
                placeholder="Name of your child"
                value={formData.studentName} 
                onChange={handleChange} 
                required 
              />
            </FormGroup>
            <FormGroup label="Student Roll No. / ID">
              <input 
                className="input-field bg-white" 
                name="studentRoll" 
                placeholder="Roll No."
                value={formData.studentRoll} 
                onChange={handleChange} 
                required 
              />
            </FormGroup>
          </div>
        )}
      </div>

      {/* Section 2: Visit Intent */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
           <h4 className="text-sm font-black uppercase tracking-[0.2em] text-dark">Visit Purpose</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormGroup label="Department" icon={<MapPin size={18} />}>
            <select
              className="input-field appearance-none w-full"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Department</option>
              <option value="Computer">Computer</option>
              <option value="IT">IT</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
            </select>
          </FormGroup>

          <FormGroup label="Contact Person" icon={<User size={18} />}>
            <select
              className="input-field appearance-none w-full"
              name="personToMeet"
              value={formData.personToMeet}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Contact Person</option>
              <option value="Nitekesh Sir">Nitekesh Sir</option>
              <option value="Shubhangi Mam">Shubhangi Mam</option>
              <option value="Rajesh Sir">Rajesh Sir</option>
              <option value="Student">Student</option>
            </select>
          </FormGroup>

          <div className="md:col-span-2">
            <FormGroup label="Purpose of Visit" icon={<FileText size={18} />}>
              <textarea 
                className="input-field min-h-[120px] resize-none py-4" 
                name="purpose" 
                placeholder="Please provide a brief reason for your visit..."
                value={formData.purpose} 
                onChange={handleChange} 
                required 
              />
            </FormGroup>
          </div>

          <FormGroup label="Visit Date" icon={<Calendar size={18} />}>
            <input 
              className="input-field" 
              name="date" 
              type="date" 
              value={formData.date} 
              onChange={handleChange} 
              required 
            />
          </FormGroup>

          <FormGroup label="Preferred Time" icon={<Clock size={18} />}>
            <input 
              className="input-field" 
              name="visitTime" 
              type="time" 
              value={formData.visitTime} 
              onChange={handleChange} 
              required 
            />
          </FormGroup>
        </div>
      </div>

      {/* Section 3: Verification */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
           <h4 className="text-sm font-black uppercase tracking-[0.2em] text-dark">Security Verification</h4>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 group-hover:border-primary/30 transition-all"></div>
          <div className="relative z-10 p-8 flex flex-col items-center text-center space-y-4">
             <div className="h-16 w-16 rounded-2xl bg-white shadow-soft flex items-center justify-center text-primary">
                <Upload size={28} />
             </div>
             <div>
                <p className="text-sm font-black text-dark tracking-tight">ID Proof Upload</p>
                <p className="text-xs text-gray-400 mt-1">Aadhaar, PAN, or Passport (JPG/PNG, Max 5MB)</p>
             </div>
             <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                name="idProofFile"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.size > 5 * 1024 * 1024) {
                    alert('File size should not exceed 5MB');
                    e.target.value = '';
                  } else {
                    setFormData({ ...formData, idProofFile: file });
                  }
                }}
                required={!initialData}
             />
             {formData.idProofFile && (
               <div className="bg-success/10 text-success px-4 py-2 rounded-xl text-xs font-bold border border-success/20 animate-in zoom-in-95">
                  Selected: {formData.idProofFile.name}
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="pt-6">
        <Button 
          type="submit" 
          size="lg" 
          className="w-full h-20 text-lg font-black uppercase tracking-[0.2em] shadow-glow rounded-[2rem]"
          isLoading={isLoading}
        >
          Finalize Registration
        </Button>
        <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6">
          By submitting, you agree to comply with campus safety protocols.
        </p>
      </div>
    </form>
  );
};

const FormGroup = ({ label, icon, children }) => (
  <div className="space-y-2 flex flex-col">
    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors duration-300">
          {icon}
        </div>
      )}
      <div className={icon ? 'pl-0' : ''}>
         {React.cloneElement(children, { className: `${children.props.className} ${icon ? 'pl-12' : ''} h-14` })}
      </div>
    </div>
  </div>
);

export default VisitorForm;
