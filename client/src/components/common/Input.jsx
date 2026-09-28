import React from 'react';

const Input = React.forwardRef(({ label, type = "text", placeholder, error, ...props }, ref) => {
  return (
    <div className="w-full mb-4">
      {label && <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`w-full bg-card border ${error ? 'border-danger' : 'border-gray-700'} rounded-lg px-4 py-2 text-textLight placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
        {...props}
      />
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
