import React from 'react';

type LoadingProps = {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  color?: string;
};

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false,
  color = 'blue' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };

  const spinner = (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 border-${color}-600 ${sizeClasses[size]}`}></div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex flex-col items-center justify-center">
        {spinner}
        {text && <p className="mt-4 text-gray-600 font-medium">{text}</p>}
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center">
      {spinner}
      {text && <p className="mt-2 text-gray-600 text-sm">{text}</p>}
    </div>
  );
};

export default Loading;
