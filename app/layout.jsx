import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Resume Matcher Pro - AI-Powered Resume Analysis',
  description: 'Analyze your resume against job descriptions with AI-powered matching and get actionable improvement suggestions',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
