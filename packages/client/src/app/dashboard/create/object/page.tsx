/*
'use client';

import { CreateObjectForm } from '../components/CreateObjectForm';
import { useAuthState } from '@/stores/appStore';
import { useRouter } from 'next/navigation';

export default function CreateObjectPage() {
    const { user } = useAuthState();
    const router = useRouter();

    if (user?.role !== 'admin') {
        router.push('/dashboard');
        return null;
    }

    return (
        <div className="space-y-6">
            <CreateObjectForm
                onSuccess={() => router.push('/dashboard/objects')}
            />
        </div>
    );
}*/
