import React from 'react';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold tracking-[0.14em] transition duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blacklocust-gold/60 disabled:opacity-50 disabled:cursor-not-allowed';

const variants = {
  primary: 'bg-blacklocust-gold text-black hover:brightness-110',
  secondary: 'bg-white text-black hover:bg-white/90',
  outline:
    'border border-white/20 bg-transparent text-white hover:border-blacklocust-gold hover:text-blacklocust-gold',
};

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  className = '',
  ...props
}) {
  const v = variants[variant] || variants.primary;
  return <Comp className={`${base} ${v} ${className}`} {...props} />;
}

