import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { FestivalProvider } from "@/contexts/FestivalContext";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/sonner";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FestPerfect - Your Festival Companion",
  description:
    "Plan your festival schedule, create lock screen wallpapers, and share with friends",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FestPerfect",
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  width: "device-width",
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className='bg-linear-to-br from-gray-900 via-slate-900 to-black'>
        <ServiceWorkerRegister />
        <FestivalProvider>
          <Navigation />
          <main className='min-h-screen'>{children}</main>
          <Toaster richColors position='top-center' />
        </FestivalProvider>
      </body>
    </html>
  );
}
