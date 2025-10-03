// pages/Calendar/Index.tsx

import Calendar from '@/components/Calendar';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { CalendarProps } from '@/types/hak-akses';
import { Head } from '@inertiajs/react';
import React from 'react';

interface Props {
    calendar: CalendarProps;
}
const breadCrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Calendar',
        href: '/calendar',
    },
];
const CalendarIndex: React.FC<Props> = ({ calendar }) => {
    return (
        <AppLayout breadcrumbs={breadCrumbs}>
            <Head title="Calendar Hak Akses" />

            <div className="container mx-auto max-w-7xl space-y-6 p-4">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Kalender Hak Akses
                    </h1>
                    <p className="text-muted-foreground">
                        Lihat jadwal hak akses ruangan berdasarkan tanggal.
                        Semua tanggal bulan {calendar.monthName} ditampilkan.
                    </p>
                </div>

                {/* Calendar Component */}
                <Calendar {...calendar} />

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span className="text-foreground">Disetujui</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-amber-500" />
                        <span className="text-foreground">
                            Menunggu Persetujuan
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500" />
                        <span className="text-foreground">Hari Ini</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-gray-300" />
                        <span className="text-foreground">Bulan Lain</span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default CalendarIndex;
