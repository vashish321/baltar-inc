import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutClient from "./components/layoutClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Baltar Inc",
    template: "%s | Baltar Inc",
  },
  description:
    "A Canadian multi-division company operating across technology, hospitality, fashion, and consultancy.",
  metadataBase: new URL("https://baltar.ca"),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Ensures mobile responsiveness */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div style={{ overflowX: 'hidden', width: '100%' }}>
          <LayoutClient>{children}</LayoutClient>
        </div>
      </body>
    </html>
  );
}
