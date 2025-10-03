import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Ruangan } from '@/types/ruangan';
import { type User } from '@/types/user';
import { Head } from '@inertiajs/react';
import MahasiswaForm from './Form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Manajemen Mahasiswa/Dosen',
        href: '/mahasiswas',
    },
    {
        title: 'Tambah Data',
        href: '/mahasiswas/create',
    },
];

interface Props {
    ruangans: Ruangan[];
    users: User[];
    ketOptions: { value: string; label: string }[];
    tahunOptions: number[];
}

export default function MahasiswaCreate({
    ruangans,
    users,
    ketOptions,
    tahunOptions,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Mahasiswa/Dosen" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Tambah Data Baru
                        </h1>
                        <p className="text-muted-foreground">
                            Isi form berikut untuk menambahkan data mahasiswa
                            atau dosen
                        </p>
                    </div>
                </div>

                <MahasiswaForm
                    ruangans={ruangans}
                    users={users}
                    ketOptions={ketOptions}
                    tahunOptions={tahunOptions}
                />
            </div>
        </AppLayout>
    );
}
