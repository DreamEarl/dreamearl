import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const glacialIndifference = localFont({
  src: [
    {
      path: "../public/fonts/glacial-indifference/GlacialIndifference-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/glacial-indifference/GlacialIndifference-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/glacial-indifference/GlacialIndifference-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-glacial",
});

export const metadata: Metadata = {
  title: "DREAMEARL - Luxury Pearl Accessories",
  description: "Discover exquisite pearl handbags and accessories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${glacialIndifference.variable} antialiased`}
        suppressHydrationWarning
      >
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
