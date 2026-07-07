type CardArtProps = {
  className?: string;
  title: string;
};

// Card-1 (Morokh): SVG is 706×1060 — we want top 310px → object-top
export function MorokhCardArt({ className, title }: CardArtProps) {
  return (
    <img
      src="/card-1.svg"
      alt={title}
      className={`block h-full w-full object-cover object-top ${className ?? ""}`}
    />
  );
}

// Card-2 (Drone): SVG is 743×1041 — we want center region → object-[15%_8%]
export function DroneCardArt({ className, title }: CardArtProps) {
  return (
    <img
      src="/card-2.svg"
      alt={title}
      className={`block h-full w-full object-cover object-[15%_8%] ${className ?? ""}`}
    />
  );
}

// Card-3 (Arcane): SVG is 458×642 — we want top-left region → object-[6%_3%]
export function ArcaneCardArt({ className, title }: CardArtProps) {
  return (
    <img
      src="/card-3.svg"
      alt={title}
      className={`block h-full w-full object-cover object-[6%_3%] ${className ?? ""}`}
    />
  );
}
