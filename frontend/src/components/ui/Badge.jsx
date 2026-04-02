import React from 'react';

const styles = {
  sale: 'bg-blacklocust-gold text-black',
  trending: 'bg-white text-black',
  neutral: 'border border-white/20 text-white/85',
};

export default function Badge({ tone = 'neutral', className = '', children }) {
  const s = styles[tone] || styles.neutral;
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.16em]',
        s,
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}

