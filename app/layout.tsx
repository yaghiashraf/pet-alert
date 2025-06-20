import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PetAlert - Reunite Lost Pets with Their Families",
  description: "Fast, local pet recovery network. Report lost pets and get instant neighborhood alerts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white min-h-screen`}
      >
        <nav className="bg-gray-800/90 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="text-2xl group-hover:scale-110 transition-transform">🐾</div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  PetAlert
                </span>
              </Link>
              
              <div className="flex items-center space-x-2">
                <Link
                  href="/nearby"
                  className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  View Lost Pets
                </Link>
                <Link
                  href="/report-lost"
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Report Lost
                </Link>
                <Link
                  href="/report-found"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Found Pet
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}
