
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Geo Inspector - Global API Performance & Geolocation Tool',
  description: 'Test API responses and latency from multiple global locations. Analyze geo-clues, verify geo-targeting, and optimize CDN performance with Geo Inspector.',
  keywords: ['Geo Inspector', 'API testing', 'geolocation testing', 'latency testing', 'API performance', 'CDN optimization', 'geo-targeting', 'network analysis', 'proxy testing', 'global API check', 'API tool'],
  openGraph: {
    title: 'Geo Inspector - API Geolocation & Latency Testing Tool',
    description: 'Test API responses and latency from various global locations. Uncover geo-specific behaviors and optimize performance.',
    type: 'website',
    // url: 'YOUR_APP_URL_HERE', // TODO: Replace with actual URL when deployed
    // images: [{ url: 'YOUR_APP_OG_IMAGE_URL_HERE' }], // TODO: Replace with actual OG image URL
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Geo Inspector - API Geolocation & Latency Testing Tool',
    description: 'Test API responses and latency from various global locations. Uncover geo-specific behaviors and optimize performance.',
    // site: '@YOUR_TWITTER_HANDLE', // TODO: If you have one
    // images: ['YOUR_APP_TWITTER_IMAGE_URL_HERE'], // TODO: Replace with actual Twitter image URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
