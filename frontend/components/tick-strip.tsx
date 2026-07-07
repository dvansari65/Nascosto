import type { CSSProperties } from "react";

type TickStripProps = {
  align?: "left" | "right" | "top" | "bottom";
  orientation?: "vertical" | "horizontal";
  cells?: number;
  cellSize?: number;
  crossSize?: number;
};

const positionClass = {
  left: "inset-y-0 left-0",
  right: "inset-y-0 right-0",
  top: "inset-x-0 top-0",
  bottom: "inset-x-0 bottom-0",
};

export function TickStrip({
  align = "left",
  orientation = align === "top" || align === "bottom" ? "horizontal" : "vertical",
  cells = 150,
  cellSize = 8,
  crossSize = 48,
}: TickStripProps) {
  const isVertical = orientation === "vertical";
  const style = {
    "--cell-size": `${cellSize}px`,
    "--strip-cross-size": `${crossSize}px`,
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${positionClass[align]} hidden overflow-hidden border-neutral-300 lg:grid ${
        isVertical
          ? "w-[var(--strip-cross-size)] grid-cols-1 border-x"
          : "h-[var(--strip-cross-size)] grid-flow-col grid-rows-1 border-y"
      }`}
      style={style}
    >
      {Array.from({ length: cells }).map((_, index) => (
        <span
          key={index}
          className={`block ${
            isVertical
              ? "h-[var(--cell-size)] border-b border-neutral-300"
              : "w-[var(--cell-size)] border-r border-neutral-300"
          }`}
        />
      ))}
    </div>
  );
}
