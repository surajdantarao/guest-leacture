import React, { useState } from 'react';
import Button from './Button';
import { User, Mail, Phone, Users, MapPin, Calendar, Clock, FileText, Upload, ChevronDown, CheckCircle2, ShieldCheck, GraduationCap } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* Section 1: Identity & Contact */}
      <section className="relative">
        <div className="flex items-center gap-4 mb-8">
           <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <User size={20} />
           </div>
           <div>
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-dark">Identity & Contact</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verification details</p>
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
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
            <div className="relative">
              <select
                className="input-field appearance-none cursor-pointer pr-10"
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
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>
          </FormGroup>
        </div>

        {formData.visitorCategory === 'Parent' && (
          <div className="mt-10 p-8 bg-gray-50/50 rounded-3xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="md:col-span-2 flex items-center gap-3 mb-2">
               <GraduationCap size={18} className="text-primary" />
               <h5 className="text-[11px] font-black uppercase tracking-widest text-dark">Academic Reference</h5>
            </div>
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
      </section>

      {/* Section 2: Visit Intent */}
      <section className="relative pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 mb-8">
           <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <FileText size={20} />
           </div>
           <div>
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-dark">Visit Purpose</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Logistical coordination</p>
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          <FormGroup label="Department" icon={<MapPin size={18} />}>
            <div className="relative">
              <select
                className="input-field appearance-none cursor-pointer pr-10"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Department</option>
                <option value="Computer">Computer Engineering</option>
                <option value="IT">Information Technology</option>
                <option value="Mechanical">Mechanical Engineering</option>
                <option value="Civil">Civil Engineering</option>
                <option value="Electrical">Electrical Engineering</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>
          </FormGroup>

          <FormGroup label="Contact Person" icon={<User size={18} />}>
            <div className="relative">
              <select
                className="input-field appearance-none cursor-pointer pr-10"
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
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>
          </FormGroup>

          <div className="md:col-span-2">
            <FormGroup label="Purpose of Visit" icon={<FileText size={18} />}>
              <textarea 
                className="input-field min-h-[140px] resize-none py-5 leading-relaxed" 
                name="purpose" 
                placeholder="Please describe the context of your visit in detail..."
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
      </section>

      {/* Section 3: Verification */}
      <section className="relative pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 mb-8">
           <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck size={20} />
           </div>
           <div>
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-dark">Security Verification</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Identity authentication</p>
           </div>
        </div>
        
        <div className="relative group overflow-hidden rounded-[2.5rem]">
          <div className="absolute inset-0 bg-gray-50 border-2 border-dashed border-gray-200 group-hover:border-primary/40 group-hover:bg-primary/[0.02] transition-all duration-500"></div>
          <div className="relative z-10 p-10 flex flex-col items-center text-center space-y-5">
             <div className={`h-20 w-20 rounded-3xl flex items-center justify-center transition-all duration-500 ${formData.idProofFile ? 'bg-success/10 text-success scale-110' : 'bg-white shadow-soft text-primary group-hover:scale-110'}`}>
                {formData.idProofFile ? <CheckCircle2 size={36} /> : <Upload size={32} />}
             </div>
             
             <div>
                <p className="text-sm font-black text-dark tracking-tight">
                  {formData.idProofFile ? 'Document Ready' : 'Upload ID Proof'}
                </p>
                <p className="text-[11px] text-gray-400 mt-1 font-bold uppercase tracking-wider">Aadhaar, PAN, or Passport (Max 5MB)</p>
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
               <div className="px-5 py-2.5 bg-white shadow-soft rounded-2xl border border-success/20 flex items-center gap-3 animate-in zoom-in-95">
                  <span className="text-xs font-black text-success uppercase tracking-widest leading-none">
                    {formData.idProofFile.name.substring(0, 20)}...
                  </span>
               </div>
             )}
          </div>
        </div>
      </section>

      <div className="pt-8 flex flex-col items-center space-y-8">
        <Button 
          type="submit" 
          size="lg" 
          className="w-full h-20 text-lg font-black uppercase tracking-[0.2em] shadow-glow rounded-[2rem] relative group overflow-hidden"
          isLoading={isLoading}
        >
          <span className="relative z-10">Finalize Registration</span>
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        </Button>
        
        <div className="flex items-center gap-3 opacity-50">
           <div className="h-px w-8 bg-gray-300"></div>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Institutional Policy 2026</p>
           <div className="h-px w-8 bg-gray-300"></div>
        </div>
      </div>
    </form>
  );
};

const FormGroup = ({ label, icon, children }) => (
  <div className="space-y-3 flex flex-col group/item">
    <div className="flex items-center justify-between px-1">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-focus-within/item:text-primary transition-colors duration-300">
        {label}
      </label>
    </div>
    <div className="relative">
      {icon && (
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/item:text-primary transition-all duration-300 group-hover/item:text-gray-400">
          {icon}
        </div>
      )}
      <div>
         {React.cloneElement(children, { 
           className: `${children.props.className} ${icon ? 'pl-14' : 'px-6'} h-16 bg-gray-50/30 border-gray-100 hover:border-gray-200 focus:bg-white` 
         })}
      </div>
    </div>
  </div>
);

export default VisitorForm;
