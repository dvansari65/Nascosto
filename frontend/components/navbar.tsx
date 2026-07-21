"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut, Copy, Check } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "./button";
import { useWallet } from "@/provider/WalletContext";
import { useIsContractOwner } from "@/hooks/useIsContractOwner";
import { useEthersSigner } from "@/hooks/useEtherSigner";

const LANDING_LINKS = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Security", href: "/#security" },
  { label: "Docs", href: "#" },
];

const APP_LINKS = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Offers", href: "/offer" },
];

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function WalletButton({ onNavigate }: { onNavigate?: () => void }) {
  const { address, connectWallet, disconnectWallet } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);
  const [connectError, setConnectError] = useState("");
  const [copied, setCopied] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleConnect = async () => {
    try {
      setConnectError("");
      connectWallet();
      onNavigate?.();
    } catch (e) {
      setConnectError(
        "Wallet connection failed. Is Core or MetaMask installed?",
      );
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setMenuOpen(false);
    onNavigate?.();
  };

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
    } catch (e) {
      console.error("Failed to copy address", e);
    }
  };

  if (!address) {
    return (
      <div className="flex flex-col items-end gap-1">
        <Button
          onClick={handleConnect}
          className="w-full justify-center border border-dashed text-xl font-medium"
          shadowColor="#a99b89"
        >
          Connect Wallet
        </Button>
        {connectError && <p className="text-xs text-red-500">{connectError}</p>}
      </div>
    );
  }

  return (
    <div className="relative w-full" ref={menuRef}>
      <Button
        onClick={() => setMenuOpen((v) => !v)}
        className="w-full justify-center gap-2 border border-dashed text-xl font-medium"
        shadowColor="#a99b89"
      >
        {truncateAddress(address)}
      </Button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-full min-w-48 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg lg:w-48">
          <button
            onClick={handleCopy}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-100 hover:text-black"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copied!" : "Copy Address"}
          </button>
          <button
            onClick={handleDisconnect}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-100 hover:text-black"
          >
            <LogOut size={15} />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { address } = useWallet();
  const signer = useEthersSigner();
  const { isOwner } = useIsContractOwner(address, signer);

  const isLandingPage = pathname === "/";
  const baseLinks = isLandingPage ? LANDING_LINKS : APP_LINKS;

  const navLinks = isOwner
    ? [
        ...baseLinks,
        { label: "My Cards", href: "/my-cards" },
        { label: "Dashboard", href: "/dashboard" },
      ]
    : baseLinks;

  return (
    <header className="fixed inset-x-0 top-0 z-50   border-b border-neutral-200 bg-white backdrop-blur-md">
      <nav className="mx-auto flex h-18 max-w-350 items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center">
          <Logo width={140} color="#000" />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`rounded-full px-4 py-2 text-[18px] font-medium transition-colors hover:bg-pink-200 hover:text-black ${
                  isActive ? "bg-pink-200 text-black" : "text-neutral-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <WalletButton />
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
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-base transition-colors hover:bg-neutral-100 hover:text-black ${
                    isActive ? "bg-pink-200 text-black" : "text-neutral-600"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-4 px-3">
              <WalletButton onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
