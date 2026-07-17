import { forwardRef, useId } from 'react';

const Textarea = forwardRef(function Textarea({ label, error, hint, className = '', ...props }, ref) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-[13px] font-medium text-ink-soft">{label}</label>}
      <textarea
        id={id}
        ref={ref}
        className={`w-full rounded-lg border bg-white text-sm text-ink placeholder:text-ink-faint px-3 py-2.5
          transition-colors duration-150 outline-none resize-none
          ${error
            ? 'border-danger focus:border-danger focus:ring-4 focus:ring-danger/10'
            : 'border-line focus:border-brand focus:ring-4 focus:ring-brand/10'}
          ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-danger font-medium">{error}</span> : hint ? <span className="text-xs text-ink-faint">{hint}</span> : null}
    </div>
  );
});

export default Textarea;
