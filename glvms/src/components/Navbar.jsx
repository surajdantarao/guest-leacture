import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ChevronRight, ShieldCheck, ClipboardList, LayoutDashboard } from 'lucide-react';
import Button from './Button';

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'Request Visit', path: '/register' },
    { name: 'Lectures', path: '/guest-lectures' },
    { name: 'About', path: '/about' }
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
    { name: 'Reports', path: '/admin-reports', icon: ClipboardList }
  ];

  const visitorLinks = [{ name: 'My Visits', path: '/visitor-dashboard', icon: LayoutDashboard }];
  const securityLinks = [{ name: 'Gate Entry', path: '/security-dashboard', icon: ShieldCheck }];

  const getLinks = () => {
    if (!user) return publicLinks;
    if (user.role === 'admin') return adminLinks;
    if (user.role === 'visitor') return visitorLinks;
    if (user.role === 'security' || user.role === 'visitor_security') return securityLinks;
    return publicLinks;
  };

  const links = getLinks();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  const navClass = scrolled
    ? 'bg-white/90 border-b border-gray-200/80 shadow-soft backdrop-blur-xl py-3'
    : 'bg-transparent py-4';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClass}`}>
      <div className="container-max flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="h-10 w-10 rounded-2xl bg-white shadow-soft border border-gray-200 flex items-center justify-center overflow-hidden">
            <img src="/assets/clg-logo.png" alt="GLVMS" className="h-8 w-auto object-contain" />
          </div>
          <div className="leading-none">
            <p className="text-lg font-black text-dark tracking-tight">GLVMS</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Campus Gateway</p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  active ? 'bg-primary text-white' : 'text-secondary hover:text-dark hover:bg-white'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  {link.icon ? <link.icon size={15} /> : null}
                  {link.name}
                </span>
              </Link>
            );
          })}

          <div className="w-px h-6 bg-gray-200 mx-3" />

          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right leading-tight">
                <p className="text-xs font-bold text-dark max-w-[120px] truncate">{user.name}</p>
                <p className="text-[10px] text-primary font-black uppercase tracking-wider">{user.role}</p>
              </div>
              <button
                onClick={handleLogoutClick}
                className="h-10 w-10 rounded-xl border border-gray-200 text-gray-500 hover:text-danger hover:border-danger/30 hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <LogOut size={16} className="mx-auto" />
              </button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="font-semibold">
                Staff Login
              </Button>
            </Link>
          )}
        </div>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="lg:hidden h-10 w-10 rounded-xl border border-gray-200 bg-white text-dark"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} className="mx-auto" /> : <Menu size={20} className="mx-auto" />}
        </button>
      </div>

      <div
        className={`lg:hidden fixed top-[64px] left-0 right-0 bottom-0 bg-white transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto custom-scrollbar px-4 py-6 space-y-2">
          {links.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
                  active
                    ? 'bg-primary/10 border-primary/20 text-primary'
                    : 'bg-white border-gray-200 text-secondary hover:text-dark hover:border-gray-300'
                }`}
              >
                <span className="inline-flex items-center gap-3 font-semibold">
                  {link.icon ? <link.icon size={18} /> : null}
                  {link.name}
                </span>
                <ChevronRight size={18} className="opacity-50" />
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-gray-200">
            {user ? (
              <Button variant="danger" onClick={handleLogoutClick} className="w-full justify-center">
                Logout
              </Button>
            ) : (
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full justify-center">
                  Staff Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
