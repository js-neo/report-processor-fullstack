// packages/client/src/app/dashboard/page.tsx (редирект)

import { redirect } from 'next/navigation';

export default function DashboardPage() {
    redirect('/dashboard/profile');
}
