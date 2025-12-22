import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/lib/providers/ReactQueryProvider";
import { Toaster } from "sonner"
import AuthProvider from "@/lib/providers/AuthProvider";

// Primary font - Inter
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Brand headlines font - Plus Jakarta Sans
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BoRide - Safe Campus Transportation",
    template: "%s | BoRide"
  },
  description: "Connect with verified riders for safe and convenient campus transportation. Join the BoRide community for affordable rides and flexible earning opportunities.",
  keywords: ["campus transportation", "student rides", "ride sharing", "campus rides", "student transportation", "rider platform", "BoRide"],
  authors: [{ name: "BoRide" }],
  creator: "BoRide",
  publisher: "BoRide",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://boride.com",
    siteName: "BoRide",
    title: "BoRide - Safe Campus Transportation",
    description: "Connect with verified riders for safe and convenient campus transportation.",
    images: [
      {
        url: "/img/boridelogo.png",
        width: 1200,
        height: 630,
        alt: "BoRide Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BoRide - Safe Campus Transportation",
    description: "Connect with verified riders for safe and convenient campus transportation.",
    images: ["/img/boridelogo.png"],
    creator: "@boride",
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
    icon: "/img/boridelogo.png",
    apple: "/img/boridelogo.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} font-sans antialiased`}
        style={{
          fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
        }}
      >
        <Toaster position="top-right" richColors/>
        <AuthProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
