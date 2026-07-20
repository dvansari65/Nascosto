import type { CSSProperties } from "react";

type LoaderProps = {
  className?: string;
  label?: string;
  /** Diameter of the loader. Default: 50 */
  size?: number | string;
  /** Thickness of the ring in px. Default: 8 */
  thickness?: number;
  /** Loader color. Default: #ffa516 */
  color?: string;
};

export function RingLoader({
  className = "",
  label,
  size = 50,
  thickness = 8,
  color = "#ffa516",
}: LoaderProps) {
  const style = {
    "--loader-size": typeof size === "number" ? `${size}px` : size,
    "--loader-thickness": `${thickness}px`,
    "--loader-color": color,
  } as CSSProperties;

  return (
    <div className="flex items-center gap-3" role="status" aria-live="polite">
      <span className={`ring-loader ${className}`} style={style} />
      {label && <span className="text-sm text-current/70">{label}</span>}
      <span className="sr-only">{label ?? "Loading"}</span>
    </div>
  );
}