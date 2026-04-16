import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, BookOpen, ArrowRight, ShieldCheck, Clock, Users } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-40 px-6">
        {/* Animated Background Elements */}
        <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-multiply filter blur-[120px] opacity-50 animate-blob"></div>
        <div className="absolute top-0 -right-20 w-[500px] h-[500px] bg-accent/10 rounded-full mix-blend-multiply filter blur-[120px] opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-success/5 rounded-full mix-blend-multiply filter blur-[120px] opacity-50 animate-blob animation-delay-4000"></div>

        <div className="container-max relative z-10 text-center space-y-12">
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-md rounded-full text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-4 border border-primary/10 shadow-float animate-slide-up">
            <span className="flex h-2.5 w-2.5 relative mr-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            Next-Gen Campus Entry Protocol
          </div>
          
          <h1 className="max-w-6xl mx-auto text-6xl md:text-9xl font-playfair font-black text-dark tracking-tighter leading-[0.95] animate-slide-up animate-stagger-1">
            Redefining <br/>
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-600 to-accent drop-shadow-sm">Visitor Access</span>
          </h1>
          
          <p className="text-xl md:text-3xl text-secondary max-w-4xl mx-auto leading-relaxed font-medium animate-slide-up animate-stagger-2 opacity-80">
            A sophisticated digital gateway engineered for modern academic institutions. 
            Security meet simplicity in one unified ecosystem.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 pt-8 animate-slide-up animate-stagger-3">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full text-lg h-20 px-12 shadow-glow rounded-[2rem] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
                <UserPlus className="mr-4 h-6 w-6" />
                Initiate Visit
              </Button>
            </Link>
            <Link to="/guest-lectures" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full text-lg h-20 px-12 rounded-[2rem] font-black uppercase tracking-widest border-2 border-gray-200 hover:border-primary transition-all hover:scale-105 active:scale-95">
                <BookOpen className="mr-4 h-6 w-6" />
                Open Calendar
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="bg-white/50 backdrop-blur-sm border-y border-gray-100 py-20 relative overflow-hidden">
        <div className="container-max grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
          <StatItem number="15k+" label="Authorized Entries" />
          <StatItem number="250+" label="Global Speakers" />
          <StatItem number="48" label="Departments Sync" />
          <StatItem number="99.9%" label="Uptime Reliability" />
        </div>
      </section>

      {/* Institutional Quality Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container-max">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-black text-dark tracking-tight leading-tight">
                  Engineered for <br/><span className="text-primary italic">Institutional Excellence</span>
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
                  description="Real-time WhatsApp alerts keep visitors and hosts synchronized without traditional delays."
                />
                <QualityFeature 
                  icon={<Users className="h-6 w-6" />}
                  title="Logistics Orchestration"
                  description="Automated checklists and expense tracking for department-led educational sessions."
                />
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-primary/20 rounded-[3rem] rotate-3 blur-3xl animate-pulse"></div>
              <Card noPadding className="relative overflow-hidden rounded-[3rem] border-none shadow-float group">
                <div className="aspect-[4/5] bg-gray-100 flex items-center justify-center bg-gradient-to-br from-dark to-primary/80">
                   <ShieldCheck className="w-40 h-40 text-white/20 animate-pulse" />
                   <div className="absolute bottom-12 left-12 right-12 text-white space-y-4">
                      <p className="text-sm font-black uppercase tracking-[0.3em] opacity-60">Security Verified</p>
                      <h3 className="text-3xl font-black leading-tight text-white">Advanced Protocol Architecture</h3>
                   </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional CTA */}
      <section className="py-24 px-6">
        <div className="container-max bg-dark rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-glow">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -mr-80 -mt-80"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] -ml-80 -mb-80"></div>
          
          <div className="relative z-10 space-y-10">
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-tight max-w-4xl mx-auto">
              Ready to modernize your campus gateway?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Join the elite institutions using digital-first protocols for guest and visitor management.
            </p>
            <div className="pt-6">
              <Link to="/register">
                <Button variant="white" size="lg" className="h-20 px-16 text-lg font-black uppercase tracking-widest text-primary hover:scale-105 transition-transform rounded-[2rem]">
                  Start Registration <ArrowRight className="ml-4 h-6 w-6" />
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
  <div className="flex gap-6 items-start group">
    <div className="h-12 w-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
      {icon}
    </div>
    <div className="space-y-1.5">
      <h3 className="text-lg font-black text-dark tracking-tight">{title}</h3>
      <p className="text-secondary font-medium text-sm leading-relaxed opacity-80">{description}</p>
    </div>
  </div>
);

const StatItem = ({ number, label }) => (
  <div className="space-y-3 animate-slide-up group">
    <div className="text-5xl md:text-7xl font-black text-primary font-playfair tracking-tighter group-hover:scale-110 transition-transform duration-500">{number}</div>
    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{label}</div>
  </div>
);

export default Landing;
