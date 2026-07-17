// Boton reutilizable con variantes, tamanos y estado de carga
import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTES = {
  primary: 'bg-brand text-white hover:bg-brand-dark active:bg-brand-dark shadow-sm shadow-brand/20 focus-visible:ring-brand/40',
  secondary: 'bg-white text-ink border border-line hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-slate-300',
  ghost: 'bg-transparent text-ink-soft hover:bg-slate-100 hover:text-ink focus-visible:ring-slate-300',
  danger: 'bg-white text-danger border border-red-200 hover:bg-danger-bg focus-visible:ring-danger/30',
  success: 'bg-success text-white hover:bg-emerald-700 focus-visible:ring-success/40'
};

const TAMANOS = {
  sm: 'h-8 px-3 text-[13px] gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-[15px] gap-2'
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', icon: Icon, loading, className = '', children, disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg font-semibold whitespace-nowrap
        transition-all duration-150 ease-out select-none
        focus-visible:outline-none focus-visible:ring-4
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-none
        active:scale-[0.98]
        ${VARIANTES[variant]} ${TAMANOS[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon ? <Icon size={16} strokeWidth={2.25} /> : null}
      {children}
    </button>
  );
});

export default Button;
