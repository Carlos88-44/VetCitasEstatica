// Tarjeta base reutilizable
export function Card({ className = '', children, hover = false, padded = true, ...props }) {
  return (
    <div
      className={`bg-surface border border-line rounded-2xl shadow-card
        ${hover ? 'transition-shadow duration-200 hover:shadow-card-hover' : ''}
        ${padded ? 'p-5 sm:p-6' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
      <div>
        <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
        {subtitle && <p className="text-[13px] text-ink-soft mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default Card;
