// packages/client/src/components/AuthInitializer.tsx

'use client';

import { useEffect } from 'react';
import { useAuthActions } from '@/stores/appStore';

export const AuthInitializer = () => {
    const {initialize} = useAuthActions();

    useEffect(() => {
        initialize();
    }, [initialize]);

    return null;
};