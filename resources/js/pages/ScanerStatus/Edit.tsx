import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Ruangan } from '@/types/ruangan';
import { type ScanerStatus } from '@/types/scaner-status';
import { Head } from '@inertiajs/react';
import ScanerStatusForm from './Form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Manajemen Scanner',
        href: '/scaner-status',
    },
    {
        title: 'Edit Scanner',
        href: '#',
    },
];

interface Props {
    scanerStatus: ScanerStatus;
    ruangans: Ruangan[];
    typeOptions: { value: string; label: string }[];
}

export default function ScanerStatusEdit({
    scanerStatus,
    ruangans,
    typeOptions,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Scanner - ${scanerStatus.kode}`} />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Edit Scanner
                        </h1>
                        <p className="text-muted-foreground">
                            Perbarui data scanner {scanerStatus.kode}
                        </p>
                    </div>
                </div>

                <ScanerStatusForm
                    scanerStatus={scanerStatus}
                    ruangans={ruangans}
                    typeOptions={typeOptions}
                />
            </div>
        </AppLayout>
    );
}
