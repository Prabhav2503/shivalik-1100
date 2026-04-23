// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from './components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'Shivalik Hostel',
  description: 'Premium Living at IIT Delhi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gradient-premium min-h-screen text-gray-100 antialiased`}>
        <Navbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}