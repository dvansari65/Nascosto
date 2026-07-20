import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * OfferPriceModal
 *
 * Simple modal that reveals a decrypted offer price.
 *
 * Props:
 * - isOpen: boolean — controls mount/visibility
 * - price: string | number — the value to display (e.g. decrypted offer price)
 * - onClose: () => void — called on backdrop click, Escape, or the close button
 */

interface OfferPriceModalProps {
  isOpen: boolean;
  price: string;
  onClose: () => void;
}
export default function OfferPriceModal({
  isOpen,
  price,
  onClose,
}: OfferPriceModalProps) {
  const backdropRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const backdrop = backdropRef.current;
    const card = cardRef.current;
    if (!backdrop || !card) return;

    // Entrance
    const tl = gsap.timeline();
    tl.set(backdrop, { display: "flex" })
      .fromTo(
        backdrop,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power2.out" },
      )
      .fromTo(
        card,
        { opacity: 0, y: 16, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(1.6)" },
        "-=0.15",
      );

    // Escape to close
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
      tl.kill();
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    const backdrop = backdropRef.current;
    const card = cardRef.current;
    if (!backdrop || !card) {
      onClose();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(backdrop, { display: "none" });
        onClose();
      },
    });
    tl.to(card, {
      opacity: 0,
      y: 10,
      scale: 0.96,
      duration: 0.2,
      ease: "power1.in",
    }).to(backdrop, { opacity: 0, duration: 0.2, ease: "power1.in" }, "-=0.15");
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      onClick={handleClose}
      style={{ opacity: 0 }}
      className="fixed inset-0 z-50 hidden items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-[90%] max-w-sm rounded-2xl border border-white/10 bg-neutral-900 p-8 text-center shadow-2xl"
      >
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-neutral-500 transition-colors hover:text-neutral-200"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M1 1L17 17M17 1L1 17"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <p className="text-xs uppercase tracking-widest text-neutral-500">
          Offer price
        </p>
        <p className="mt-3 text-4xl font-semibold text-neutral-50">
          {price ? price : "No decrypted price!"}
        </p>
      </div>
    </div>
  );
}
