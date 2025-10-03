import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Ruangan } from '@/types/ruangan';
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
        title: 'Tambah Scanner',
        href: '/scaner-status/create',
    },
];

interface Props {
    ruangans: Ruangan[];
    typeOptions: { value: string; label: string }[];
}

export default function ScanerStatusCreate({ ruangans, typeOptions }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Scanner Baru" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Tambah Scanner Baru
                        </h1>
                        <p className="text-muted-foreground">
                            Isi form berikut untuk menambahkan scanner baru
                        </p>
                    </div>
                </div>

                <ScanerStatusForm
                    ruangans={ruangans}
                    typeOptions={typeOptions}
                />
            </div>
        </AppLayout>
    );
}
