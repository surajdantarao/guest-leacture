import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, BookOpen, ArrowRight, ShieldCheck, Clock, Users } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const Landing = () => {
  return (
    <div 
      className="flex flex-col min-h-screen selection:bg-primary/30 relative text-dark bg-background"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-40 px-6 flex-1 flex flex-col justify-center">
        <div className="container-max relative z-10 text-center space-y-12">
          <div className="inline-flex items-center px-6 py-3 bg-white shadow-soft rounded-full text-primary font-bold text-xs uppercase tracking-[0.2em] mb-4 border border-primary/10 animate-slide-up">
            <span className="flex h-2.5 w-2.5 relative mr-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            Next-Gen Campus Entry Protocol
          </div>
          
          <h1 className="max-w-6xl mx-auto text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[1.05] animate-slide-up animate-stagger-1 text-dark">
            Redefining <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-accent drop-shadow-sm">Visitor Access</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-secondary max-w-4xl mx-auto leading-relaxed font-medium animate-slide-up animate-stagger-2">
            A sophisticated digital gateway engineered for modern academic institutions. 
            Security meets simplicity in one unified ecosystem.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8 animate-slide-up animate-stagger-3">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full text-lg h-16 md:h-20 px-10 md:px-12 shadow-glow rounded-[2rem] font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
                <UserPlus className="mr-3 h-6 w-6" />
                Initiate Visit
              </Button>
            </Link>
            <Link to="/guest-lectures" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full text-lg h-16 md:h-20 px-10 md:px-12 rounded-[2rem] font-bold uppercase tracking-widest border-2 border-gray-200 text-secondary hover:border-primary hover:text-primary transition-all hover:scale-105 active:scale-95 shadow-soft">
                <BookOpen className="mr-3 h-6 w-6" />
                Open Calendar
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="bg-white/50 backdrop-blur-md border-y border-gray-100 py-16 relative overflow-hidden">
        <div className="container-max grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
          <StatItem number="15k+" label="Authorized Entries" />
          <StatItem number="250+" label="Global Speakers" />
          <StatItem number="48" label="Departments Sync" />
          <StatItem number="99.9%" label="Uptime Reliability" />
        </div>
      </section>

      {/* Institutional Quality Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="container-max">
          <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-20">
            <div className="lg:w-1/2 space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-dark tracking-tight leading-tight">
                  Engineered for <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent italic">Institutional Excellence</span>
                </h2>
                <p className="text-xl text-secondary leading-relaxed font-medium">
                  GLVMS isn't just a management tool; it's a commitment to campus safety and intellectual growth.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <QualityFeature 
                  icon={<ShieldCheck className="h-6 w-6" />}
                  title="Multi-Tiered Verification"
                  description="From QR code passes to biometric-ready integration, we ensure every visitor is accounted for."
                />
                <QualityFeature 
                  icon={<Clock className="h-6 w-6" />}
                  title="Zero-Latency Notifications"
                  description="Real-time alerts keep visitors and hosts synchronized without traditional delays."
                />
                <QualityFeature 
                  icon={<Users className="h-6 w-6" />}
                  title="Logistics Orchestration"
                  description="Automated checklists and expense tracking for department-led educational sessions."
                />
              </div>
            </div>
            
            <div className="lg:w-1/2 relative flex justify-center">
              <div className="absolute inset-0 bg-primary/10 rounded-[3rem] rotate-3 blur-3xl animate-pulse"></div>
              <Card noPadding className="w-full max-w-sm relative overflow-hidden rounded-[3rem] border border-gray-100 shadow-float group bg-white">
                <div className="aspect-[4/5] flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 relative">
                   <ShieldCheck className="w-32 h-32 md:w-40 md:h-40 text-primary/20 animate-pulse relative z-10" />
                   <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 space-y-4 bg-gradient-to-t from-white to-transparent">
                      <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-primary">Security Verified</p>
                      <h3 className="text-2xl md:text-3xl font-black leading-tight text-dark">Advanced Protocol Architecture</h3>
                   </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional CTA */}
      <section className="py-24 px-6 relative">
        <div className="container-max bg-gradient-to-br from-primary to-indigo-700 shadow-glow rounded-[3rem] md:rounded-[4rem] p-10 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] md:-mr-40 md:-mt-40 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] md:-ml-40 md:-mb-40 pointer-events-none"></div>
          
          <div className="relative z-10 space-y-8 md:space-y-10">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight max-w-4xl mx-auto">
              Ready to modernize your campus gateway?
            </h2>
            <p className="text-lg md:text-xl text-primary-light max-w-2xl mx-auto font-medium leading-relaxed">
              Join the elite institutions using digital-first protocols for guest and visitor management.
            </p>
            <div className="pt-6">
              <Link to="/register">
                <Button size="lg" variant="white" className="h-16 md:h-20 px-10 md:px-16 text-base md:text-lg font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl rounded-[2rem] !border-none">
                  Start Registration <ArrowRight className="ml-3 h-5 w-5 md:h-6 md:w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const QualityFeature = ({ icon, title, description }) => (
  <div className="flex gap-5 md:gap-6 items-start group">
    <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm backdrop-blur-md">
      {icon}
    </div>
    <div className="space-y-1 md:space-y-1.5">
      <h3 className="text-lg md:text-xl font-bold text-dark tracking-tight">{title}</h3>
      <p className="text-secondary font-medium text-sm md:text-base leading-relaxed">{description}</p>
    </div>
  </div>
);

const StatItem = ({ number, label }) => (
  <div className="space-y-2 md:space-y-3 group group-hover:scale-105 transition-all">
    <div className="text-4xl md:text-6xl lg:text-7xl font-black text-primary tracking-tighter group-hover:scale-110 transition-transform duration-500">{number}</div>
    <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{label}</div>
  </div>
);

export default Landing;
