// packages/client/src/components/UI/Modal.tsx
'use client';

import { Dialog } from '@headlessui/react';
import React from "react";

export const Modal = ({
                          isOpen,
                          onClose,
                          title,
                          children,
                      }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) => {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6">
                    <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {title}
                    </Dialog.Title>
                    <div className="mt-4">{children}</div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};