import type { CSSProperties } from "react";

type TickStripProps = {
  align?: "left" | "right" | "top" | "bottom";
  orientation?: "vertical" | "horizontal";
  cells?: number;
  cellSize?: number;
  width?: number;
  height?: number;
  crossSize?: number;
  className?: string;
};

function getPositionClass(
  align: NonNullable<TickStripProps["align"]>,
  isVertical: boolean,
  hasWidth: boolean,
  hasHeight: boolean,
) {
  if (align === "left") return `${hasHeight ? "top-0" : "inset-y-0"} left-0`;
  if (align === "right") return `${hasHeight ? "top-0" : "inset-y-0"} right-0`;
  if (align === "top") return `top-0 ${hasWidth ? "left-0" : "inset-x-0"}`;
  if (align === "bottom")
    return `bottom-0 ${hasWidth ? "left-0" : "inset-x-0"}`;

  return isVertical ? "inset-y-0 left-0" : "inset-x-0 top-0";
}

export function TickStrip({
  align,
  orientation,
  cells = 150,
  cellSize = 8,
  width,
  height,
  crossSize = 48,
  className = "border-neutral-300",
}: TickStripProps) {
  const resolvedOrientation =
    orientation ??
    (align === "top" || align === "bottom" ? "horizontal" : "vertical");
  const resolvedAlign =
    align ?? (resolvedOrientation === "horizontal" ? "top" : "left");
  const isVertical = resolvedOrientation === "vertical";
  const stripWidth = width ?? (isVertical ? crossSize : undefined);
  const stripHeight = height ?? (isVertical ? undefined : crossSize);
  const style = {
    "--cell-size": `${cellSize}px`,
    "--strip-width": stripWidth == null ? undefined : `${stripWidth}px`,
    "--strip-height": stripHeight == null ? undefined : `${stripHeight}px`,
  } as CSSProperties;
  const position = getPositionClass(
    resolvedAlign,
    isVertical,
    width != null,
    height != null,
  );

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${position} hidden overflow-hidden lg:grid ${className} ${
        isVertical
          ? "h-[var(--strip-height,100%)] w-[var(--strip-width)] grid-cols-1 border-x"
          : "h-[var(--strip-height)] w-[var(--strip-width,100%)] grid-flow-col grid-rows-1 border-y"
      }`}
      style={style}
    >
      {Array.from({ length: cells }).map((_, index) => (
        <span
          key={index}
          className={`block ${className} ${
            isVertical
              ? "h-[var(--cell-size)] border-b"
              : "w-[var(--cell-size)] border-r"
          }`}
        />
      ))}
    </div>
  );
}
