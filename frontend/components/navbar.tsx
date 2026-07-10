"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { ButtonLink } from "./link";

const NAV_LINKS = [
  { label: "Marketplace", href: "#marketplace" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Security", href: "#security" },
  { label: "Docs", href: "#" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50   border-b border-neutral-200 bg-white backdrop-blur-md">
      <nav className="mx-auto flex h-18 max-w-350 items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center">
          <Logo width={140} color="#000" />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-black"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink
            href="#login"
            className="w-full justify-center border border-dashed text-xl "
            shadowColor="#a99b89"
          >
            Login
          </ButtonLink>
          <ButtonLink
            href="#launch"
            className="w-full justify-center border border-dashed text-xl "
            shadowColor="#a99b89"
          >
            Launch
          </ButtonLink>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex size-9 items-center justify-center rounded-full text-black lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-neutral-200 bg-white px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base text-neutral-600 hover:bg-neutral-100 hover:text-black"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}