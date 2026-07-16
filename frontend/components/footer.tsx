import Link from "next/link";
import { TickStrip } from "./tick-strip";
import Logo from "./logo";
import { Button } from "./button";

const FOOTER_LINKS = {
  Marketplace: [
    { label: "Browse cards", href: "#marketplace" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Security", href: "#security" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Resources: [
    { label: "Docs", href: "#" },
    { label: "FAQ", href: "#faq" },
    { label: "Support", href: "#" },
  ],
};

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"
      />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        d="M23.954 4.569a9.8 9.8 0 0 1-2.825.775 4.932 4.932 0 0 0 2.163-2.723 9.864 9.864 0 0 1-3.127 1.184 4.916 4.916 0 0 0-8.384 4.482A13.944 13.944 0 0 1 1.64 3.161a4.916 4.916 0 0 0 1.523 6.555 4.897 4.897 0 0 1-2.228-.616v.061a4.917 4.917 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.92 4.92 0 0 0 4.604 3.417A9.867 9.867 0 0 1 0 19.54a13.905 13.905 0 0 0 7.557 2.213c9.054 0 14.001-7.496 14.001-13.986 0-.213-.005-.426-.014-.637a10.012 10.012 0 0 0 2.46-2.548l-.05-.013z"
      />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "Nascosto on Twitter", href: "https://x.com/danisshhh_h", Icon: TwitterIcon },
  { label: "Nascosto on LinkedIn", href: "https://www.linkedin.com/in/danish-ansari-347a06299/", Icon: LinkedInIcon },
];

export function Footer() {
  return (
    <footer className="relative border-t border-dashed border-neutral-300 bg-pink-100 px-6 py-16 lg:px-20">
      <TickStrip className="sample-color-4 text-gray-300" align="left" cells={400} cellSize={6} width={120} />
      <TickStrip className="sample-color-4 text-gray-300"  align="right" cells={400} cellSize={6} width={120} />

      <div className="mx-auto max-w-260">
        <div className="flex flex-col gap-10 border-b border-neutral-200 pb-12 lg:flex-row lg:items-start lg:justify-between">
         <Logo/>

          <div className="w-full max-w-sm">
            <form className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Work email"
                className="w-full rounded-[5px] border border-neutral-300 bg-white px-4 py-2.5 text-sm text-black placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
              />
             <div className="ml-2">
             <Button className="py-[9px] ">Subscribe</Button>
             </div>
            </form>
            <p className="mt-3 text-xs text-neutral-500">
              Stay updated with the latest from Nascosto.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 py-12 sm:grid-cols-3">
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="font-display text-sm font-semibold text-black">{heading}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-800 hover:text-black"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col-reverse items-center gap-6 border-t border-neutral-200 pt-8 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ href, Icon, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:border-neutral-400 hover:bg-neutral-50 hover:text-black"
              >
                <Icon className="size-4" />
              </Link>
            ))}
            <span className="ml-2 text-sm text-neutral-500">
              © 2026 Segreto. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-neutral-500 underline underline-offset-4 hover:text-black">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-neutral-500 underline underline-offset-4 hover:text-black">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
