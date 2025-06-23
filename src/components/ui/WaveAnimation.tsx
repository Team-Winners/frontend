import React from 'react';

type WaveAnimationProps = {
  isActive: boolean;
  color?: string;
};

const WaveAnimation: React.FC<WaveAnimationProps> = ({ 
  isActive, 
  color = 'blue' 
}) => {
  if (!isActive) return null;

  return (
    <div className="flex justify-center items-center gap-1 h-6">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`w-1 bg-${color}-600 rounded-full animate-wave`}
          style={{
            height: '100%',
            animationDelay: `${i * 0.1}s`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default WaveAnimation;
