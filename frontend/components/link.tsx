"use client";

import {
  forwardRef,
  ReactNode,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
  MouseEvent,
} from "react";
import { gsap } from "gsap";
import Link from "next/link";

export interface ButtonLinkProps {
  href: string;
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
  width?: string | number;
  height?: string | number;
  shadowColor?: string;
  shadowOverlapColor?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  disabled?: boolean;
}

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      href,
      children = "Button",
      className = "",
      containerClassName = "",
      width,
      height,
      shadowColor = "#f0b8ca",
      shadowOverlapColor = shadowColor,
      onClick,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const linkRef = useRef<HTMLAnchorElement>(null);
    const shadowRef = useRef<HTMLSpanElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useImperativeHandle(ref, () => linkRef.current as HTMLAnchorElement);

    const sizeStyle = {
      width: width ?? undefined,
      height: height ?? undefined,
    };

    useLayoutEffect(() => {
      gsap.set(linkRef.current, { x: -4, y: -4 });
    }, []);

    const activate = () => {
      if (disabled) return;

      tlRef.current?.kill();
      tlRef.current = gsap
        .timeline()
        .to(linkRef.current, {
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
          ">"
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
          linkRef.current,
          {
            x: -4,
            y: -4,
            duration: 0.2,
            ease: "power2.out",
          },
          "<"
        );
    };

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    return (
      <span
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
        <Link
          ref={linkRef}
          href={href}
          onClick={handleClick}
          onFocus={activate}
          onBlur={deactivate}
          style={sizeStyle}
          className={`relative rounded-[4px] border border-dashed border-[rgb(215,214,179)] bg-[#f9f3ea] px-3 py-1 text-sm ${
            disabled ? "cursor-not-allowed opacity-50" : ""
          } ${className}`}
          {...props}
        >
          {children}
        </Link>
      </span>
    );
  }
);

ButtonLink.displayName = "ButtonLink";