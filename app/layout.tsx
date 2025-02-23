import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import GoogleAdsense from "@/components/GoogleAdsense";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GoVisitWinery.com",
  description: "Discover and explore the finest wineries near you",
  icons: {
    icon: '/favicon.ico',
  },
  verification: {
    google: 'YOUR_ADSENSE_VERIFICATION_CODE', // Add your verification code here
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <GoogleAdsense />
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-purple-800 to-purple-600 py-2 md:py-3 px-3 md:px-4">
          <div className="mx-auto max-w-7xl flex justify-between items-center">
            <Link href="/" className="text-white font-bold text-lg md:text-xl tracking-tight hover:text-purple-200">
              GoVisitWinery
            </Link>
            <div className="flex gap-3 md:gap-4 text-sm md:text-base">
              <Link href="/login" className="text-white hover:text-purple-200">
                Sign In
              </Link>
              <Link href="/register" className="text-white hover:text-purple-200">
                Register
              </Link>
              <Link href="/admin" className="text-white hover:text-purple-200">
                Admin
              </Link>
            </div>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
