import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "./components/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "InsightHireAI",
  description: "Helping you find the right candidate",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="flex items-center justify-center p-4 bg-gray-800 text-white">
          <Navigation />
        </header>
        {children}
        <footer className="flex items-center justify-center p-4 bg-gray-800 text-white sm:items-start gap-[32px] font-[family-name:var(--font-geist-sans)] w-full">
          <p>By dvh, 2025</p>
        </footer>
      </body>
    </html>
  );
}
