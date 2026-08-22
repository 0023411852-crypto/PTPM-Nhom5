import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Since Geist is available on Google Fonts, we can try to import it, but standard Next.js templates often use Geist via next/font/google if version is >= 14. 
// However, to be safe and avoid build errors if Geist is not exported by this version, we will fall back to using 'inter' for Geist variables so the UI still renders correctly.
export const metadata: Metadata = {
  title: "CloudNova - Hạ tầng Cloud mạnh mẽ",
  description: "Triển khai VPS, Hosting, Domain và các giải pháp Cloud.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}
        style={{
          "--font-geist-sans": "'Geist', sans-serif",
          "--font-geist-mono": "'Geist', monospace",
        } as React.CSSProperties}
      >
        {children}
      </body>
    </html>
  );
}
