import React from 'react';

// Reusable site-wide stats component
// Props:
// - onDark: boolean -> optimizes colors for dark/overlay backgrounds
// - compact: boolean -> smaller padding/font for tight areas
// - className: string -> extra classnames
const SiteStats = ({ onDark = false, compact = false, className = '' }) => {
  const items = [
    { value: '200+', label: 'Happy Customers', icon: '😊' },
    { value: '360+', label: 'Natural Remedies', icon: '🌿' },
    { value: '5+', label: 'Years Experience', icon: '⏳' },
    { value: '300+', label: 'Health Consultations', icon: '🩺' },
  ];

  const textPrimary = onDark ? 'text-white' : 'text-emerald-700';
  const textSecondary = onDark ? 'text-white/90' : 'text-gray-600';
  const cardBg = onDark ? 'bg-white/10 backdrop-blur' : 'bg-white shadow';
  const valueSize = compact ? 'text-2xl' : 'text-3xl';
  const labelSize = compact ? 'text-xs' : 'text-sm';
  const pad = compact ? 'p-4' : 'p-6';

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 ${className}`}>
      {items.map((item) => (
        <div key={item.label} className={`rounded-xl ${cardBg} ${pad}`}>
          <div className={`flex items-center gap-3 ${textPrimary}`}>
            <span className="text-xl" aria-hidden>{item.icon}</span>
            <span className={`font-extrabold ${valueSize}`}>{item.value}</span>
          </div>
          <div className={`${textSecondary} ${labelSize} mt-1`}>{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default SiteStats;
