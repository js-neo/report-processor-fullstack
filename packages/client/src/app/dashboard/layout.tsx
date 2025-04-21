// packages/client/src/app/dashboard/layout.tsx

import { DashboardLayout as MainDashboardLayout } from '@/layouts/DashboardLayout/DashboardLayout';
import React from "react";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    return <MainDashboardLayout>{children}</MainDashboardLayout>;
}