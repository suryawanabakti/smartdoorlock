import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type HakAkses } from '@/types/hak-akses';
import { type Mahasiswa } from '@/types/mahasiswa';
import { type Ruangan } from '@/types/ruangan';
import { Head } from '@inertiajs/react';
import HakAksesForm from './Form';

interface Props {
    hakAkses: HakAkses;
    ruangans: Ruangan[];
    temanKelas: Mahasiswa[];
    mahasiswa: Mahasiswa;
    selectedMahasiswaIds: number[];
}

export default function HakAksesMahasiswaEdit({
    hakAkses,
    ruangans,
    temanKelas,
    mahasiswa,
    selectedMahasiswaIds,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard Mahasiswa',
            href: '/mahasiswa/dashboard',
        },
        {
            title: 'Hak Akses Saya',
            href: '/mahasiswa/hak-akses',
        },
        {
            title: 'Edit Hak Akses',
            href: `/mahasiswa/hak-akses/${hakAkses.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Hak Akses - Mahasiswa" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Edit Permohonan Hak Akses
                        </h1>
                        <p className="text-muted-foreground">
                            Perbarui informasi permohonan akses ruangan
                        </p>
                    </div>
                </div>

                <HakAksesForm
                    hakAkses={hakAkses}
                    ruangans={ruangans}
                    temanKelas={temanKelas}
                    mahasiswa={mahasiswa}
                    selectedMahasiswaIds={selectedMahasiswaIds}
                />
            </div>
        </AppLayout>
    );
}
