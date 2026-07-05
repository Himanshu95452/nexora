import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nexora.example"),
  title: { default: "Nexora — Verified Home Professionals in Nagpur", template: "%s | Nexora" },
  description: "Nexora connects you with identity-verified, background-checked home service professionals in Nagpur. Transparent pricing, fast booking, real accountability.",
  keywords: ["Nexora", "home services Nagpur", "verified plumber", "verified electrician", "AC repair Nagpur", "home services app"],
  openGraph: {
    title: "Nexora — Verified Home Professionals",
    description: "India's trusted platform for verified home service professionals. Now live in Nagpur.",
    type: "website",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: "Nexora — Verified Home Professionals" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`:root{--font-display:'Space Grotesk';--font-body:'Inter';}`}</style>
      </head>
      <body className="font-body">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
