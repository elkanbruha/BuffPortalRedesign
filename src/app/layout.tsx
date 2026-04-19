import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { NotificationDrawer } from "@/components/NotificationDrawer";
import { ModalHost } from "@/components/ModalHost";
import { ToastContainer } from "@/components/Toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CU Buffs Advising",
  description:
    "CU Boulder's student advising portal — schedule appointments, track degree progress, and stay connected with your advisor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <AppProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <NotificationDrawer />
          <ModalHost />
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
