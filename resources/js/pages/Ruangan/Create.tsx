import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Ruangan } from '@/types/ruangan';
import { Head } from '@inertiajs/react';
import RuanganForm from './Form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Manajemen Ruangan',
        href: '/ruangans',
    },
    {
        title: 'Tambah Ruangan',
        href: '/ruangans/create',
    },
];

interface Props {
    parentRuangans: Ruangan[];
    types: string[];
    mahasiswas: any[];
}

export default function RuanganCreate({
    parentRuangans,
    types,
    mahasiswas,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Ruangan" />

            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Tambah Ruangan Baru
                    </h1>
                    <p className="text-muted-foreground">
                        Isi form berikut untuk menambahkan ruangan baru
                    </p>
                </div>

                <RuanganForm
                    parentRuangans={parentRuangans}
                    types={types}
                    mahasiswas={mahasiswas}
                />
            </div>
        </AppLayout>
    );
}
