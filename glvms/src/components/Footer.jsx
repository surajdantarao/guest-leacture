import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', path: '/' },
        { name: 'Request Visit', path: '/register' },
        { name: 'Guest Lectures', path: '/guest-lectures' },
        { name: 'About Us', path: '/about' }
      ]
    },
    {
      title: 'Portals',
      links: [
        { name: 'Staff Login', path: '/login' },
        { name: 'Admin Console', path: '/admin-dashboard' },
        { name: 'Security Gate', path: '/security-dashboard' },
        { name: 'Visitor Dashboard', path: '/visitor-dashboard' }
      ]
    }
  ];

  return (
    <footer className="bg-dark text-white pt-14 md:pt-20 pb-10 overflow-hidden relative mt-10">
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/15 blur-[100px] rounded-full -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/15 blur-[100px] rounded-full translate-y-1/2" />

      <div className="container-max relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-11 w-11 bg-white/10 rounded-2xl border border-white/15 flex items-center justify-center">
                <img src="/assets/clg-logo.png" alt="GLVMS" className="h-7 w-auto object-contain" />
              </div>
              <div className="leading-none">
                <p className="text-2xl font-black tracking-tight">GLVMS</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Visitor System</p>
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Smart visitor and lecture operations platform for institutions, built for secure entry, quick approvals,
              and professional coordination.
            </p>
            <div className="flex items-center gap-3">
              <SocialLink icon={<Linkedin size={18} />} />
              <SocialLink icon={<Twitter size={18} />} />
              <SocialLink icon={<Instagram size={18} />} />
              <SocialLink icon={<Facebook size={18} />} />
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title} className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Contact</h4>
            <ContactItem icon={<MapPin size={17} />} title="Location" desc="University Campus, Mumbai, MH 400001" />
            <ContactItem icon={<Phone size={17} />} title="Support" desc="+91 87677 53086" />
            <ContactItem icon={<Mail size={17} />} title="Email" desc="support@glvms.edu" />
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-5 text-xs text-gray-400">
            <button type="button" className="hover:text-white transition-colors">Privacy Policy</button>
            <button type="button" className="hover:text-white transition-colors">Terms</button>
            <button type="button" className="hover:text-white transition-colors">Help</button>
          </div>
          <p className="text-gray-400 text-xs">© {currentYear} GLVMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ icon }) => (
  <button
    type="button"
    className="h-9 w-9 rounded-xl bg-white/10 text-gray-300 hover:bg-primary hover:text-white transition-colors border border-white/10"
    aria-label="social"
  >
    <span className="flex items-center justify-center">{icon}</span>
  </button>
);

const ContactItem = ({ icon, title, desc }) => (
  <div className="flex items-start gap-3">
    <div className="h-9 w-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">{icon}</div>
    <div>
      <p className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">{title}</p>
      <p className="text-sm text-gray-200">{desc}</p>
    </div>
  </div>
);

export default Footer;
