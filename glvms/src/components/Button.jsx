import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover shadow-glow',
    secondary: 'bg-secondary text-white hover:bg-secondary-hover shadow-soft',
    outline: 'bg-white border border-gray-300 text-dark hover:border-primary hover:text-primary hover:bg-primary/5',
    ghost: 'bg-transparent text-secondary hover:text-dark hover:bg-gray-100',
    danger: 'bg-danger text-white hover:bg-red-600 shadow-soft',
    success: 'bg-success text-white hover:bg-emerald-600 shadow-soft',
    white: 'bg-white text-dark border border-gray-200 hover:bg-gray-50 shadow-soft'
  };

  const sizes = {
    sm: 'h-9 text-xs px-4 rounded-xl',
    md: 'h-11 text-sm px-5 rounded-xl',
    lg: 'h-12 text-sm md:text-base px-7 rounded-2xl',
    icon: 'h-10 w-10 rounded-xl'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${isLoading ? 'cursor-wait' : ''} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
