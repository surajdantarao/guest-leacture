import React from 'react';

const Card = ({ children, className = '', noPadding = false, hover = false }) => {
  return (
    <div
      className={`bg-white rounded-3xl border border-gray-100 shadow-soft ${
        hover ? 'hover:shadow-float hover:-translate-y-0.5 transition-all duration-300' : ''
      } ${noPadding ? '' : 'p-5 md:p-8'} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
