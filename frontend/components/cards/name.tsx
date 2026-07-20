"use client";

import { useRef } from "react";
import gsap from "gsap";

interface TitleOfCardProps {
  name: string | undefined;
}

export const TitleOfCard = ({ name }: TitleOfCardProps) => {
  const textRef = useRef<HTMLParagraphElement>(null);

  const handleEnter = () => {
    if (!textRef.current) return;
    gsap
      .timeline()
      .to(textRef.current, {
        scale: 1.4,
        rotateY: 180,
        duration: 0.5,
        ease: "power2.out",
      })
      .to(textRef.current, {
        scale: 1,
        rotateY: 360,
        duration: 0.5,
        ease: "power2.in",
      })
      .set(textRef.current, { rotateY: 0 });
  };

  return (
    <div className="min-w-0 pb-1 relative" style={{ perspective: 600 }}>
      {name && (
        <p
          ref={textRef}
          onMouseEnter={handleEnter}
          className="truncate text-[20px] font-bold tracking-tight text-slate-800"
          style={{
            transformStyle: "preserve-3d",
            backfaceVisibility: "visible",
          }}
        >
          {name.toString()}
        </p>
      )}
    </div>
  );
};
