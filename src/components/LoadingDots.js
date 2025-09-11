import React from 'react';

const sizeMap = {
  small: 'text-xs',
  medium: 'text-sm',
  large: 'text-base'
};

const dotSizeMap = {
  small: 'h-1.5 w-1.5',
  medium: 'h-2 w-2',
  large: 'h-2.5 w-2.5'
};

const LoadingDots = ({ size = 'medium', color = '#10b981', text = 'Loading...' }) => {
  const textSize = sizeMap[size] || sizeMap.medium;
  const dotSize = dotSizeMap[size] || dotSizeMap.medium;
  return (
    <div className={`inline-flex items-center gap-2 rounded-md border border-emerald-100 bg-white px-3 py-2 shadow-sm`}>
      <div className={`font-medium text-gray-700 ${textSize}`}>{text}</div>
      <div className="flex items-center gap-1">
        <div className={`${dotSize} animate-bounce rounded-full`} style={{ backgroundColor: color, animationDelay: '0ms' }}></div>
        <div className={`${dotSize} animate-bounce rounded-full`} style={{ backgroundColor: color, animationDelay: '150ms' }}></div>
        <div className={`${dotSize} animate-bounce rounded-full`} style={{ backgroundColor: color, animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default LoadingDots;
