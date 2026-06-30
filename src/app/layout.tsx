import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { UserProvider } from "@/lib/user-context";
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
  title: "BTimely — Know how long things actually take",
  description:
    "AI-powered time estimates that learn your habits. Upload assignments, describe tasks, and get personalized duration predictions.",
  keywords: ["time management", "task estimation", "student planner", "productivity"],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  themeColor: "#1a3a5c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col gradient-bg">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
