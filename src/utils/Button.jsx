import React from 'react';

const Button = ({ children, onClick, className = '', type = 'button', disabled = false, ...rest }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-full font-semibold shadow-lg transition duration-300
        bg-indigo-700 text-indigo-700 hover:text-white hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed
        ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
