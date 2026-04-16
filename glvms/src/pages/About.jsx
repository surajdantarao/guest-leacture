import React from 'react';
import { Target, Eye, Mail, MapPin, Phone, GraduationCap, Users, Award } from 'lucide-react';
import Card from '../components/Card';

const About = () => {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container-max max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center px-4 py-2 bg-primary/5 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest border border-primary/10">
            About GLVMS
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-dark tracking-tight leading-tight">
            Our Institution's <br/>
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Legacy & Vision</span>
          </h1>
          <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed">
            Excellence in Education and Innovation. We are committed to fostering a culture of 
            learning and security for our global campus community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card hover className="space-y-6 border-none shadow-soft hover:shadow-card group">
            <div className="h-14 w-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
              <Target size={28} />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-black text-dark tracking-tight">Our Mission</h2>
              <p className="text-secondary leading-relaxed font-medium">
                To provide a transformative educational experience that empowers students to become 
                leaders in their fields. We are committed to fostering a culture of innovation, 
                critical thinking, and social responsibility.
              </p>
            </div>
          </Card>

          <Card hover className="space-y-6 border-none shadow-soft hover:shadow-card group">
            <div className="h-14 w-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-sm">
              <Eye size={28} />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-black text-dark tracking-tight">Our Vision</h2>
              <p className="text-secondary leading-relaxed font-medium">
                To be a world-class institution recognized for academic excellence, 
                groundbreaking research, and our contribution to the betterment of society 
                through knowledge and technology.
              </p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-gray-100">
           <AboutStat icon={GraduationCap} number="25,000+" label="Students" />
           <AboutStat icon={Users} number="1,200+" label="Faculty" />
           <AboutStat icon={Award} number="150+" label="Awards" />
           <AboutStat icon={MapPin} number="4" label="Campuses" />
        </div>

        <Card className="p-0 overflow-hidden border-none shadow-float relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <MapPin size={120} />
          </div>
          <div className="p-10 md:p-16 space-y-12 relative z-10">
            <h2 className="text-3xl font-black text-dark text-center tracking-tight">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <ContactItem 
                icon={MapPin} 
                title="Address" 
                detail="123 College Avenue, Knowledge City, State 456789" 
              />
              <ContactItem 
                icon={Mail} 
                title="Email" 
                detail="info@college.edu" 
              />
              <ContactItem 
                icon={Phone} 
                title="Phone" 
                detail="+1 (555) 123-4567" 
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const AboutStat = ({ icon: Icon, number, label }) => (
  <div className="text-center space-y-2">
    <div className="inline-flex items-center justify-center p-3 bg-gray-50 rounded-xl text-primary mb-2">
      <Icon size={20} />
    </div>
    <div className="text-2xl font-black text-dark tracking-tight">{number}</div>
    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</div>
  </div>
);

const ContactItem = ({ icon: Icon, title, detail }) => (
  <div className="space-y-4">
    <div className="h-12 w-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center mx-auto shadow-sm">
      <Icon size={20} />
    </div>
    <div>
      <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-[0.2em] mb-2">{title}</h3>
      <p className="text-dark font-bold text-sm leading-relaxed">{detail}</p>
    </div>
  </div>
);

export default About;
