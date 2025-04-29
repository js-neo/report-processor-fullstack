'use client';

import { CreateWorkerForm } from '../components/CreateWorkerForm';
import { useAuthState } from '@/stores/appStore';
import { useRouter } from 'next/navigation';

export default function CreateWorkerPage() {
    const { user } = useAuthState();
    const router = useRouter();

    if (user?.role !== 'admin') {
        router.push('/dashboard');
        return null;
    }

    return (
        <div className="space-y-6">
            <CreateWorkerForm
                onSuccess={() => router.push('/dashboard/workers')}
            />
        </div>
    );
}