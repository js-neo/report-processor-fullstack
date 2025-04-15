// packages/client/src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthInitializer } from '@/components/AuthInitializer';
import { ThemeProvider } from '@/components/ThemeProvider';
import React from "react";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Табель работ',
    description: 'Приложение для управления табелями сотрудников',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru" suppressHydrationWarning>
        <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthInitializer />
            {children}
            <Toaster
                position="top-center"
                containerClassName="toast-center"
                toastOptions={{
                    className: '!bg-background !text-foreground !border !border-border',
                    duration: 4000,
                    success: {
                        iconTheme: {
                            primary: '#4ade80',
                            secondary: '#166534',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#f87171',
                            secondary: '#7f1d1d',
                        },
                    },
                }}
            />
        </ThemeProvider>
        </body>
        </html>
    );
}