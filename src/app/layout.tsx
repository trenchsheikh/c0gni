import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Cogni Labs - AI-Powered Solutions for Modern Business",
    template: "%s | Cogni Labs"
  },
  description: "Transform your business with cutting-edge AI solutions. Cogni Labs delivers custom AI applications, machine learning models, and intelligent automation to drive growth and innovation.",
  keywords: [
    "AI solutions",
    "artificial intelligence",
    "machine learning",
    "business automation",
    "custom AI development",
    "Cogni Labs",
    "AI consulting",
    "intelligent systems",
    "data analytics",
    "AI implementation"
  ],
  authors: [{ name: "Cogni Labs" }],
  creator: "Cogni Labs",
  publisher: "Cogni Labs",
  metadataBase: new URL('https://cognilabs.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cognilabs.com',
    title: 'Cogni Labs - AI-Powered Solutions for Modern Business',
    description: 'Transform your business with cutting-edge AI solutions. Custom AI applications, machine learning models, and intelligent automation.',
    siteName: 'Cogni Labs',
    images: [
      {
        url: '/cogni-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cogni Labs - AI Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cogni Labs - AI-Powered Solutions for Modern Business',
    description: 'Transform your business with cutting-edge AI solutions. Custom AI applications, machine learning models, and intelligent automation.',
    images: ['/cogni-og-image.jpg'],
    creator: '@cognilabs',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/c0gni-c-white.svg',
    shortcut: '/c0gni-c-white.svg',
    apple: '/c0gni-c-white.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
