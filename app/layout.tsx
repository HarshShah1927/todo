import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';

const ReduxProvider = dynamic(() => import('@/components/providers/ReduxProvider'), {
  ssr: false,
});

const ThemeProvider = dynamic(() => import('@/components/providers/ThemeProvider').then(mod => ({ default: mod.ThemeProvider })), {
  ssr: false,
});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TaskFlow - Modern Todo List App',
  description: 'A powerful task management application built with Next.js and Redux Toolkit',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}