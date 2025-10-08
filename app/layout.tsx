import './globals.css';
import {Inter} from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({subsets: ['latin']});

export const metadata = {
 title: 'MosaicMind - Next Generation Personality Assessment',
 description:
  'Discover your unique personality mosaic through our advanced assessment system',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
 return (
  <html lang="en">
   <body className={inter.className}>
    <Header />
      {children}
    <Footer/>
   </body>
  </html>
 );
}
