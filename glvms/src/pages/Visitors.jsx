import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { Plus, Check, X, Phone, Mail, User } from 'lucide-react';
import api from '../utils/api';

const Visitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVisitors = async () => {
    try {
      const response = await api.get('/visitors');
      setVisitors(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching visitors:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const updateStatus = async (id, status) => {
    if (!id) return;
    try {
      let response;
      if (status === 'Approved') {
        response = await api.put(`/visitors/${id}/approve`);
      } else if (status === 'Rejected') {
        const rejectionReason = window.prompt('Enter rejection reason:');
        if (!rejectionReason || !rejectionReason.trim()) {
          alert('Rejection reason is required.');
          return;
        }
        response = await api.put(`/visitors/${id}/reject`, {
          rejection_reason: rejectionReason.trim()
        });
      }

      const whatsapp = response?.data?.whatsapp;
      if (whatsapp && !whatsapp.sent && whatsapp.waLink) {
        window.open(whatsapp.waLink, '_blank');
      }
      fetchVisitors(); // refresh list after update
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please make sure you are logged in as admin/security.');
    }
  };

  return (
    <div className="container-max py-24 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-dark">Visitor Requests</h2>
        <Link to="/admin/add-visitor">
          <Button className="flex items-center space-x-2">
            <Plus size={20} />
            <span>Add Visitor</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visitors.length > 0 ? visitors.map((visitor) => (
          <Card key={visitor.id} className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-primary">
                  <User size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-dark">{visitor.name}</h4>
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    visitor.status === 'approved' ? 'text-green-600' :
                    visitor.status === 'rejected' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {visitor.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-grow space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-500">
                <Mail size={16} className="mr-2" />
                <span>{visitor.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Phone size={16} className="mr-2" />
                <span>{visitor.phone}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Meeting Person</p>
                <p className="text-dark font-semibold">{visitor.personToMeet}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Purpose</p>
                <p className="text-gray-600 line-clamp-2">{visitor.purpose}</p>
              </div>
              {visitor.idProof && (
                <div className="pt-2">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">ID Proof</p>
                  <a 
                    href={visitor.idProof.startsWith('http') ? visitor.idProof : `${api.defaults.baseURL.replace('/api', '')}${visitor.idProof}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline font-semibold flex items-center gap-1 text-sm bg-primary/10 w-fit px-3 py-1 rounded-lg"
                  >
                    View Document
                  </a>
                </div>
              )}
            </div>

            {visitor.status === 'pending' && (
              <div className="flex space-x-3 mt-auto pt-4 border-t border-gray-50">
                <Button 
                  onClick={() => updateStatus(visitor.id, 'Approved')}
                  className="flex-1 !bg-green-500 hover:!bg-green-600 flex items-center justify-center space-x-2"
                >
                  <Check size={18} />
                  <span>Approve</span>
                </Button>
                <Button 
                  onClick={() => updateStatus(visitor.id, 'Rejected')}
                  variant="danger"
                  className="flex-1 flex items-center justify-center space-x-2"
                >
                  <X size={18} />
                  <span>Reject</span>
                </Button>
              </div>
            )}
          </Card>
        )) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-400 text-xl">No visitor requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Visitors;
