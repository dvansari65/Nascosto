"use client";

import {
  ButtonHTMLAttributes,
  forwardRef,
  ReactNode,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
} from "react";
import { gsap } from "gsap";

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className"
> {
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
  width?: string | number;
  height?: string | number;
  shadowColor?: string;
  shadowOverlapColor?: string;
  onClick?: () => void;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children = "Button",
      className = "",
      containerClassName = "",
      width,
      height,
      shadowColor = "#f0b8ca",
      shadowOverlapColor = shadowColor,
      onClick,
      disabled = false,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const shadowRef = useRef<HTMLSpanElement>(null);
    // Single source of truth for whatever's currently animating this button.
    // Killing this before every new action is what prevents two tweens
    // (e.g. a fast enter->leave->enter) from fighting over x/y and leaving
    // the button stranded mid-transition.
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement);

    const sizeStyle = {
      width: width ?? undefined,
      height: height ?? undefined,
    };

    // Let GSAP own the transform from the very start instead of parsing it
    // back out of a hardcoded inline style string - removes any ambiguity
    // about what GSAP thinks the "current" x/y is on the first tween.
    useLayoutEffect(() => {
      gsap.set(buttonRef.current, { x: -4, y: -4 });
    }, []);

    const activate = () => {
      if (disabled) return;

      tlRef.current?.kill();
      tlRef.current = gsap
        .timeline()
        .to(buttonRef.current, {
          x: 0,
          y: 0,
          duration: 0.2,
          ease: "power2.out",
        })
        .to(
          shadowRef.current,
          {
            backgroundColor: shadowOverlapColor,
            duration: 0.15,
            ease: "power2.out",
          },
          ">", // only starts once the slide above has actually finished
        );
    };

    const deactivate = () => {
      if (disabled) return;

      tlRef.current?.kill();
      tlRef.current = gsap
        .timeline()
        .to(shadowRef.current, {
          backgroundColor: shadowColor,
          duration: 0.1,
          ease: "power2.out",
        })
        .to(
          buttonRef.current,
          {
            x: -4,
            y: -4,
            duration: 0.2,
            ease: "power2.out",
          },
          "<", // runs at the same time as the shadow reset, not after
        );
    };

    return (
      <div
        onMouseEnter={activate}
        onMouseLeave={deactivate}
        className={`relative inline-flex ${containerClassName}`}
      >
        <span
          ref={shadowRef}
          aria-hidden="true"
          style={{ backgroundColor: shadowColor }}
          className="absolute inset-0 rounded-[4px]"
        />
        <button
          ref={buttonRef}
          type={type}
          disabled={disabled}
          onClick={onClick}
          onFocus={activate}
          onBlur={deactivate}
          style={sizeStyle}
          className={`relative rounded-sm border border-dashed border-[rgb(215,214,179)] bg-[#f9f3ea] px-3 py-2 text-sm ${
            disabled ? "cursor-not-allowed opacity-50" : ""
          } ${className}`}
          {...props}
        >
          {children}
        </button>
      </div>
    );
  },
);

Button.displayName = "Button";
