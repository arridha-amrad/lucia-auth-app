import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { initOauth2Google } from "@/utils/oauth2Google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lucia Auth App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  initOauth2Google();
  return (
    <html lang="en">
      <body className={`${inter.className} mx-auto max-w-md`}>{children}</body>
    </html>
  );
}
