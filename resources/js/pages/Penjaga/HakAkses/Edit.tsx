import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type HakAkses } from '@/types/hak-akses';
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
        title: 'Edit Hak Akses',
        href: '#',
    },
];

interface Props {
    hakAkses: HakAkses;
    ruanganDijaga: Ruangan[];
    mahasiswas: Mahasiswa[];
    selectedMahasiswaIds: number[];
}

export default function HakAksesEdit({
    hakAkses,
    ruanganDijaga,
    mahasiswas,
    selectedMahasiswaIds,
}: Props) {
    console.log(ruanganDijaga);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`Edit Hak Akses - ${hakAkses.ruangan?.nama_ruangan}`}
            />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Edit Hak Akses
                        </h1>
                        <p className="text-muted-foreground">
                            Perbarui jadwal akses untuk{' '}
                            {hakAkses.ruangan?.nama_ruangan}
                        </p>
                    </div>
                </div>

                <HakAksesForm
                    hakAkses={hakAkses}
                    ruanganDijaga={ruanganDijaga}
                    mahasiswas={mahasiswas}
                    selectedMahasiswaIds={selectedMahasiswaIds}
                />
            </div>
        </AppLayout>
    );
}
