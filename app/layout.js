import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI Video Generator | Text to Video',
  description: 'Generate stunning AI videos from text descriptions',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950`}>
        {children}
        <footer className="text-center py-8 text-gray-500 text-sm">
          <p>AI Video Generator • Powered by Next.js & Vercel</p>
          <p className="mt-2">Note: Video generation may take 1-5 minutes</p>
        </footer>
      </body>
    </html>
  );
}
