// Select estilizado con icono personalizado
import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select({ label, error, hint, className = '', children, ...props }, ref) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-[13px] font-medium text-ink-soft">{label}</label>}
      <div className="relative">
        <select
          id={id}
          ref={ref}
          className={`w-full h-10 appearance-none rounded-lg border bg-white text-sm text-ink pl-3 pr-9
            transition-colors duration-150 outline-none cursor-pointer
            ${error
              ? 'border-danger focus:border-danger focus:ring-4 focus:ring-danger/10'
              : 'border-line focus:border-brand focus:ring-4 focus:ring-brand/10'}
            ${className}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint" />
      </div>
      {error ? <span className="text-xs text-danger font-medium">{error}</span> : hint ? <span className="text-xs text-ink-faint">{hint}</span> : null}
    </div>
  );
});

export default Select;
