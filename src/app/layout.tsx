import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'CuRemedy | Medical Bill Audit Command Center', description: 'Audit medical bills against fee schedule references and explore transparent hardship settlement options.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
