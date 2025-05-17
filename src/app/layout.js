import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "./components/navigation";
import { FileProvider } from "./contexts/FileContext";
import { Storage } from "./components/storage";

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
        <FileProvider>
          <header className="flex items-center justify-center p-4 bg-gray-800 text-white">
            <Navigation />
          </header>
          <div className="flex flex-row">
            <aside>
              <Storage />
            </aside>
            <main className="flex-grow">
              {children}
            </main>
          </div>
          <footer className="flex items-center justify-center p-4 bg-gray-800 text-white sm:items-start gap-[32px] font-[family-name:var(--font-geist-sans)] w-full">
            <p>By dvh, 2025</p>
          </footer>
        </FileProvider>
      </body>
    </html>
  );
}
