import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UnixType Challenge | Powered by Unixdev",
  description: "Interactive typing game for developers at tech events. Type code terms, build streaks, unlock combos, and compete on the leaderboard! Powered by Unixdev.",
  icons: {
    icon: '/favicon.svg',
    apple: '/logo.svg',
  },
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
