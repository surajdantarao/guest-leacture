import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import AdminLogin from './pages/Login';
import AdminDashboard from './pages/Dashboard';
import AddVisitor from './pages/AddVisitor';
import Lectures from './pages/Lectures';
import About from './pages/About';
import CheckIn from './pages/CheckIn';
import Reports from './pages/Reports';
import Expenses from './pages/Expenses';
import AssigneeView from './pages/AssigneeView';
import AddLecture from './pages/AddLecture';
import VisitorDashboard from './pages/VisitorDashboard';
import QrScanner from './pages/QrScanner';
import LectureFeedback from './pages/LectureFeedback';

import Signup from './pages/Signup';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col font-inter text-secondary">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<AddVisitor />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/guest-lectures" element={<Lectures />} />
            <Route path="/about" element={<About />} />
            <Route path="/assignee/checklist/:lectureId" element={<AssigneeView />} />
            
            {/* Login Route */}
            <Route path="/login" element={
              user ? (
                user.role === 'admin' ? <Navigate to="/admin-dashboard" /> : 
                (user.role === 'security' || user.role === 'visitor_security') ? <Navigate to="/security-dashboard" /> :
                <Navigate to="/visitor-dashboard" />
              ) : (
                <AdminLogin onLogin={handleLogin} />
              )
            } />
            
            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={
              user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />
            } />
            <Route path="/add-lecture" element={
              user?.role === 'admin' ? <AddLecture /> : <Navigate to="/login" />
            } />
            <Route path="/admin-reports" element={
              (user?.role === 'admin' || user?.role === 'security' || user?.role === 'visitor_security') ? <Reports /> : <Navigate to="/login" />
            } />
            <Route path="/admin/expenses" element={
              user?.role === 'admin' ? <Expenses /> : <Navigate to="/login" />
            } />
            <Route path="/admin-feedback" element={
              user?.role === 'admin' ? <LectureFeedback /> : <Navigate to="/login" />
            } />

            {/* Security Routes */}
            <Route path="/security-dashboard" element={
              (user?.role === 'security' || user?.role === 'visitor_security') ? <CheckIn /> : <Navigate to="/login" />
            } />
            <Route path="/security/scan" element={
              (user?.role === 'security' || user?.role === 'visitor_security') ? <QrScanner /> : <Navigate to="/login" />
            } />

            {/* Visitor Routes */}
            <Route path="/visitor-dashboard" element={
              user?.role === 'visitor' ? <VisitorDashboard /> : <Navigate to="/login" />
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
