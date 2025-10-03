import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Mahasiswa } from '@/types/mahasiswa';
import { type Ruangan } from '@/types/ruangan';
import { Head } from '@inertiajs/react';
import HakAksesForm from './Form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Manajemen Hak Akses',
        href: '/hak-akses',
    },
    {
        title: 'Tambah Hak Akses',
        href: '/hak-akses/create',
    },
];

interface Props {
    ruangans: Ruangan[];
    mahasiswas: Mahasiswa[];
    currentYear: number;
}

export default function HakAksesCreate({
    ruangans,
    mahasiswas,
    currentYear,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Hak Akses" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Tambah Hak Akses Baru
                        </h1>
                        <p className="text-muted-foreground">
                            Buat jadwal akses ruangan untuk mahasiswa
                        </p>
                    </div>
                </div>

                <HakAksesForm
                    ruangans={ruangans}
                    mahasiswas={mahasiswas}
                    currentYear={currentYear}
                />
            </div>
        </AppLayout>
    );
}
