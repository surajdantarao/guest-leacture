import React from 'react';
import Card from './Card';

const StatsCard = ({ title, value, icon: Icon, colorClass }) => {
  return (
    <Card className="flex items-center space-x-6 hover-scale">
      <div className={`p-4 rounded-2xl ${colorClass}`}>
        <Icon size={32} className="text-white" />
      </div>
      <div>
        <p className="text-gray-500 font-medium">{title}</p>
        <h3 className="text-dark">{value}</h3>
      </div>
    </Card>
  );
};

export default StatsCard;
