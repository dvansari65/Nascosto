"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function CopyableField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const truncated = value.length > 16 ? `${value.slice(0, 8)}...${value.slice(-6)}` : value;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-color-2 text-[15px] shrink-0">{label}</span>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 rounded-md bg-neutral-100 px-2 py-1 font-mono text-black active:scale-95 transition"
      >
        {truncated}
        {copied ? <Check size={12} /> : <Copy size={12} className="opacity-50" />}
      </button>
    </div>
  );
}