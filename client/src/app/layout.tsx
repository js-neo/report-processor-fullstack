"use client";

import { ReactNode } from 'react';
import './globals.css';

export default function RootLayout({
                                       children,
                                   }: {
    children: ReactNode
}) {
    return (
        <html lang="ru">
        <body className="min-h-screen bg-gray-50">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
        </main>
        </body>
        </html>
    );
}