import React from 'react';

export default function Input({ className = '', ...props }) {
  return (
    <input
      className={[
        'h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40',
        'outline-none transition duration-300 focus:border-blacklocust-gold/70 focus:bg-white/7',
        className,
      ].join(' ')}
      {...props}
    />
  );
}

