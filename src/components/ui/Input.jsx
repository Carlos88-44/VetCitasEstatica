// Input con etiqueta flotante y validacion visual
import { forwardRef, useId } from 'react';

const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, className = '', containerClassName = '', ...props },
  ref
) {
  const id = useId();
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-ink-soft">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />}
        <input
          id={id}
          ref={ref}
          className={`w-full h-10 rounded-lg border bg-white text-sm text-ink placeholder:text-ink-faint
            transition-colors duration-150 outline-none
            ${Icon ? 'pl-9 pr-3' : 'px-3'}
            ${error
              ? 'border-danger focus:border-danger focus:ring-4 focus:ring-danger/10'
              : 'border-line focus:border-brand focus:ring-4 focus:ring-brand/10'}
            ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <span className="text-xs text-danger font-medium">{error}</span>
      ) : hint ? (
        <span className="text-xs text-ink-faint">{hint}</span>
      ) : null}
    </div>
  );
});

export default Input;
