import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hobson Concierge",
  description: "Hobson surfaces the leads you should act on today, in plain language, with one-tap call and text.",
  manifest: "/manifest.json",
  icons: {
    icon: "/hobson-icon.svg",
    apple: "/hobson-icon.svg",
  },
  appleWebApp: {
    capable: true,
    title: "Hobson",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0B1D33",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
