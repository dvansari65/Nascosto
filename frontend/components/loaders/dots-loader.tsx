type LoaderProps = {
  className?: string;
  label?: string;
};

export function DotsLoader({ className = "", label }: LoaderProps) {
  return (
    <div
      className={`flex items-center gap-3 ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className={`loader ${className}`} />
      {label && <span className={`text-sm text-current/70 `}>{label}</span>}
      <span className="sr-only">{label ?? "Loading"}</span>
    </div>
  );
}
