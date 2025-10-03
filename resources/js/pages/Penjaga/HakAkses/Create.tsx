import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Mahasiswa } from '@/types/mahasiswa';
import { type Ruangan } from '@/types/ruangan';
import { Head } from '@inertiajs/react';
import HakAksesForm from './Form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Penjaga',
        href: '/penjaga/dashboard',
    },
    {
        title: 'Hak Akses',
        href: '/penjaga/hak-akses',
    },
    {
        title: 'Buat Hak Akses',
        href: '/penjaga/hak-akses/create',
    },
];

interface Props {
    ruanganDijaga: Ruangan[];
    mahasiswas: Mahasiswa[];
}

export default function HakAksesPenjagaCreate({
    ruanganDijaga,
    mahasiswas,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Hak Akses - Penjaga" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Buat Hak Akses Baru
                        </h1>
                        <p className="text-muted-foreground">
                            Buat jadwal akses untuk ruangan yang Anda jaga
                        </p>
                    </div>
                </div>

                <HakAksesForm
                    ruanganDijaga={ruanganDijaga}
                    mahasiswas={mahasiswas}
                />
            </div>
        </AppLayout>
    );
}
