import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { GlobalNav } from "@/components/common/global-nav";
import { Toaster } from "@/components/ui/sonner";

import { Providers } from "@/components/common/providers";

export const metadata: Metadata = {
  title: "Anmok Mailer",
  description: "AI Cold Email Generator for YouTubers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <GlobalNav />
          <main className="min-h-[calc(100vh-56px)]">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

