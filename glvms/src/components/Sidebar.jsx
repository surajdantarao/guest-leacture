import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, ClipboardCheck, FileBarChart, DollarSign, MessageSquare } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, isAdmin = true }) => {
  const adminLinks = [
    { to: '/admin-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/expenses', icon: DollarSign, label: 'Expenses' },
    { to: '/admin-reports', icon: FileBarChart, label: 'Reports' },
    { to: '/admin-feedback', icon: MessageSquare, label: 'Feedback' },
  ];

  const visitorLinks = [
    { to: '/visitor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/visitor/lectures', icon: BookOpen, label: 'Lectures' },
    { to: '/visitor/request', icon: Users, label: 'Request Visit' },
  ];

  const links = isAdmin ? adminLinks : visitorLinks;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-dark/50 z-40 lg:hidden transition-smooth"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:sticky top-[80px] left-0 z-50
        w-64 bg-white border-r border-gray-100 h-[calc(100vh-80px)]
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex flex-col h-full">
          <div className="space-y-2 flex-grow">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Main Menu
            </p>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-4 rounded-xl transition-smooth font-bold text-sm ${
                    isActive ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                  }`
                }
              >
                <link.icon size={20} />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>
          
          <div className="pt-6 border-t border-gray-100">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Support</p>
              <p className="text-xs text-gray-500 font-medium">Need help? Contact college administration.</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
