import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UnixType | Professional Typing Performance Platform",
  description: "Enterprise-grade typing performance measurement and analytics platform designed for professionals who demand precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-unix-bg text-unix-text antialiased">
        {children}
      </body>
    </html>
  );
}
