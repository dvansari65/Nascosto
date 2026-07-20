import type { Metadata } from "next";
import { Rajdhani, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { WalletProvider } from "@/provider/WalletContext";
import { AppProvider } from "@/provider/app-provider";
import { Toaster } from "sonner";
const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Segreto — Confidential trading cards on Avalanche",
  description:
    "Segreto is the privacy-first marketplace for digital trading cards. List openly, negotiate through encrypted offers, and settle on-chain without exposing your position.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${rajdhani.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper ">
        <AppProvider>
          <Navbar />
          <main className="flex-1 pt-18">{children}</main>
          <Toaster richColors position="top-right" />
        </AppProvider>
      </body>
    </html>
  );
}
