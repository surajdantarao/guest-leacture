import React from 'react';
import { Target, Eye, GraduationCap, Briefcase, Globe, Zap, Cpu, Rocket, ShieldCheck, Mail, MapPin, Phone, CheckCircle2, Users } from 'lucide-react';
import Card from '../components/Card';

const About = () => {
  return (
    <div className="min-h-screen bg-background pb-20 relative overflow-hidden">
      {/* Header Section */}
      <div className="relative pt-32 pb-16 flex items-center justify-center overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute top-40 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container-max relative z-10 text-center space-y-8 px-6">
          <div className="inline-flex items-center gap-3 bg-white/50 backdrop-blur-md px-6 py-2.5 rounded-full border border-gray-100 shadow-soft animate-fade-in">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Innovation • Excellence • Employability</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black text-dark tracking-tighter leading-tight animate-slide-up">
            Ratan Tata Maharashtra <br />
            <span className="text-primary italic">State Skills University</span>
          </h1>
          
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed animate-slide-up delay-100 opacity-80">
            Empowering Maharashtra's youth with future-ready skills, bridging the gap between industry requirements and academic excellence.
          </p>
        </div>
      </div>

      <div className="container-max max-w-6xl mx-auto px-6 space-y-24">
        {/* Intro Section */}
        <Card className="p-8 md:p-12 border-none shadow-float bg-white/80 backdrop-blur-xl">
           <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                 <h2 className="text-3xl font-black text-dark tracking-tight">Bridging the Skills Gap</h2>
                 <p className="text-secondary leading-relaxed text-lg">
                    RT-MSSU is a premier state skills university in Maharashtra, dedicated to creating an industry-oriented educational ecosystem. We focus on practical, hands-on learning that directly translates to career success in today's dynamic job market.
                 </p>
                 <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-primary font-bold">
                       <ShieldCheck size={20} />
                       <span>State Recognized</span>
                    </div>
                    <div className="flex items-center gap-2 text-accent font-bold">
                       <Zap size={20} />
                       <span>Industry-First</span>
                    </div>
                 </div>
              </div>
              <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 text-center md:text-left">
                 <p className="text-primary font-black text-4xl mb-2">Learn by Doing</p>
                 <p className="text-secondary font-medium italic">"Empowering Skills, Building Futures"</p>
              </div>
           </div>
        </Card>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <SectionCard 
            icon={Target} 
            title="Our Mission" 
            color="primary"
            items={[
              "Provide industry-relevant skill-based education",
              "Collaborate with industries and global institutions",
              "Promote entrepreneurship and job creation"
            ]}
          />
          <SectionCard 
            icon={Eye} 
            title="Our Vision" 
            color="accent"
            description="To empower youth with future-ready skills and innovation, making them global leaders in their respective domains."
          />
        </div>

        {/* Key Objectives */}
        <div className="space-y-12">
           <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-dark tracking-tight">Key Objectives</h2>
              <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard icon={Globe} title="Real-world Alignment" desc="Skill development precisely aligned with modern job requirements." />
              <FeatureCard icon={Zap} title="Practical Learning" desc="Focus on hands-on experience over traditional theoretical models." />
              <FeatureCard icon={Briefcase} title="Apprenticeships" desc="Strong industry partnerships for real-world workplace exposure." />
              <FeatureCard icon={Cpu} title="Emerging Tech" desc="Training in AI, Data Science, and other cutting-edge technologies." />
           </div>
        </div>

        {/* Unique Selling Points */}
        <div className="bg-dark rounded-[3rem] p-10 md:p-20 text-white overflow-hidden relative">
           <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -mr-48 -mt-48"></div>
           <div className="relative z-10 grid md:grid-cols-2 gap-16">
              <div className="space-y-8">
                 <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">What Makes <br /><span className="text-primary">RT-MSSU Unique?</span></h2>
                 <p className="text-white/60 text-lg">Our approach redefines higher education by putting skills at the forefront of the curriculum.</p>
                 <div className="space-y-4">
                    <UniqueItem icon={CheckCircle2} text="Skill-first education model" />
                    <UniqueItem icon={Rocket} text="Startup and innovation ecosystem" />
                    <UniqueItem icon={Zap} text="Flexible learning pathways" />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-4">
                    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 mt-8">
                       <h4 className="font-black text-primary text-xl mb-1">100%</h4>
                       <p className="text-xs text-white/50 uppercase tracking-widest">Industry Integrated</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                       <h4 className="font-black text-accent text-xl mb-1">Project</h4>
                       <p className="text-xs text-white/50 uppercase tracking-widest">Based Learning</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                       <h4 className="font-black text-success text-xl mb-1">Global</h4>
                       <p className="text-xs text-white/50 uppercase tracking-widest">Partnerships</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                       <h4 className="font-black text-warning text-xl mb-1">Flex</h4>
                       <p className="text-xs text-white/50 uppercase tracking-widest">Learning Paths</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Programs & Opportunities */}
        <div className="grid md:grid-cols-2 gap-12">
           <div className="space-y-8">
              <h3 className="text-3xl font-black text-dark tracking-tight flex items-center gap-3">
                 <GraduationCap className="text-primary" /> Programs Offered
              </h3>
              <ul className="space-y-4">
                 <ProgramItem title="Undergraduate Skill Programs" />
                 <ProgramItem title="Diploma and Certification Courses" />
                 <ProgramItem title="Industry-sponsored Programs" />
                 <ProgramItem title="Short-term Skill Development" />
              </ul>
           </div>
           <div className="space-y-8">
              <h3 className="text-3xl font-black text-dark tracking-tight flex items-center gap-3">
                 <Briefcase className="text-accent" /> Student Opportunities
              </h3>
              <div className="grid grid-cols-1 gap-4">
                 <OpportunityCard title="Placement Assistance" desc="Direct connections with top industry recruiters." />
                 <OpportunityCard title="Startup Support" desc="Incubation and mentoring for student entrepreneurs." />
                 <OpportunityCard title="Hackathons" desc="Regular skill competitions and innovation challenges." />
              </div>
           </div>
        </div>

        {/* Industry Collaboration */}
        <Card className="p-10 md:p-12 border-none shadow-soft bg-gradient-to-br from-white to-primary/5">
           <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="h-20 w-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center flex-shrink-0">
                 <Users size={40} />
              </div>
              <div className="space-y-4 text-center md:text-left">
                 <h2 className="text-3xl font-black text-dark tracking-tight">Industry Collaboration</h2>
                 <p className="text-secondary leading-relaxed text-lg max-w-3xl">
                    We partner with leading companies to ensure our students receive internships, hands-on training, and direct placement opportunities. Our curriculum is co-created with industry experts to reflect real-world requirements.
                 </p>
              </div>
           </div>
        </Card>

        {/* Contact Information */}
        <Card className="p-0 overflow-hidden border-none shadow-float relative bg-white">
          <div className="p-10 md:p-16 space-y-12 relative z-10 text-center">
            <div className="space-y-4">
               <h2 className="text-4xl font-black text-dark tracking-tight">Connect with RT-MSSU</h2>
               <p className="text-secondary max-w-xl mx-auto">Have questions about our programs or industry partnerships? Reach out to us.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <ContactItem 
                icon={MapPin} 
                title="Location" 
                detail="Mumbai & Across Maharashtra, India" 
              />
              <ContactItem 
                icon={Mail} 
                title="Email" 
                detail="admissions@rt-mssu.edu.in" 
              />
              <ContactItem 
                icon={Phone} 
                title="Helpline" 
                detail="+91 22 1234 5678" 
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Helper Components
const SectionCard = ({ icon: Icon, title, items, description, color }) => (
  <Card hover className="space-y-6 border-none shadow-soft hover:shadow-card group p-8">
    <div className={`h-16 w-16 ${color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-sm`}>
      <Icon size={32} />
    </div>
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-dark tracking-tight">{title}</h2>
      {description && <p className="text-secondary leading-relaxed font-medium">{description}</p>}
      {items && (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-secondary font-medium text-sm md:text-base">
              <CheckCircle2 size={18} className={`mt-0.5 flex-shrink-0 ${color === 'primary' ? 'text-primary' : 'text-accent'}`} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  </Card>
);

const FeatureCard = ({ icon: Icon, title, desc }) => (
   <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-soft hover:shadow-card transition-all duration-300 space-y-4 group">
      <div className="h-12 w-12 bg-gray-50 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
         <Icon size={24} />
      </div>
      <h4 className="font-bold text-dark text-lg">{title}</h4>
      <p className="text-secondary text-sm leading-relaxed">{desc}</p>
   </div>
);

const UniqueItem = ({ icon: Icon, text }) => (
   <div className="flex items-center gap-4 group">
      <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
         <Icon size={20} />
      </div>
      <span className="text-white font-medium">{text}</span>
   </div>
);

const ProgramItem = ({ title }) => (
   <li className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-primary/30 hover:shadow-md transition-all cursor-default flex items-center justify-between group">
      <span className="font-bold text-dark group-hover:text-primary transition-colors">{title}</span>
      <Rocket size={18} className="text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
   </li>
);

const OpportunityCard = ({ title, desc }) => (
   <div className="p-5 bg-accent/5 rounded-2xl border border-accent/10 space-y-1">
      <h5 className="font-black text-dark text-sm uppercase tracking-wide">{title}</h5>
      <p className="text-secondary text-sm">{desc}</p>
   </div>
);

const ContactItem = ({ icon: Icon, title, detail }) => (
  <div className="space-y-4 group">
    <div className="h-14 w-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
      <Icon size={24} />
    </div>
    <div>
      <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-[0.2em] mb-2">{title}</h3>
      <p className="text-dark font-bold text-sm leading-relaxed">{detail}</p>
    </div>
  </div>
);

export default About;
