type CardArtProps = {
  className?: string;
  title: string;
};

// Card-1: SVG is 706×1060 — top 310px is the focal region → object-top
export function Card1Art({ className, title }: CardArtProps) {
  return (
    <img
      src="/card-1.svg"
      alt={title}
      className={`block h-full w-full object-cover object-top ${className ?? ""}`}
    />
  );
}

// Card-2: SVG is 743×1041 — focal region near top-left → object-[15%_8%]
export function Card2Art({ className, title }: CardArtProps) {
  return (
    <img
      src="/card-2.svg"
      alt={title}
      className={`block h-full w-full object-cover object-[15%_8%] ${className ?? ""}`}
    />
  );
}

// Card-3: SVG is 458×642 — focal region top-left → object-[6%_3%]
export function Card3Art({ className, title }: CardArtProps) {
  return (
    <img
      src="/card-3.svg"
      alt={title}
      className={`block h-full w-full object-cover object-[6%_3%] ${className ?? ""}`}
    />
  );
}

// Card-4: dimensions/focal point not verified yet — defaulting to object-center.
// Check card-4.svg's actual viewBox and where the art sits, same as cards 1–3,
// then swap object-center for the correct object-top / object-[x%_y%] value.
export function Card4Art({ className, title }: CardArtProps) {
  return (
    <img
      src="/card-4.svg"
      alt={title}
      className={`block h-full w-full object-cover object-center ${className ?? ""}`}
    />
  );
}

// Card-5: same caveat as Card-4 — verify against the actual SVG before shipping.
export function Card5Art({ className, title }: CardArtProps) {
  return (
    <img
      src="/card-5.svg"
      alt={title}
      className={`block h-full w-full object-cover object-center ${className ?? ""}`}
    />
  );
}
export function Card6Art({ className, title }: CardArtProps) {
  return (
    <img
      src="/card-6.svg"
      alt={title}
      className={`block h-full w-full object-cover object-center ${className ?? ""}`}
    />
  );
}