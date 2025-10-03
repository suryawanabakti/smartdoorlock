import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Mahasiswa } from '@/types/mahasiswa';
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
        title: 'Manajemen Mahasiswa/dsn',
        href: '/mahasiswas',
    },
    {
        title: 'Edit Data',
        href: '#',
    },
];

interface Props {
    mahasiswa: Mahasiswa;
    ruangans: Ruangan[];
    users: User[];
    ketOptions: { value: string; label: string }[];
    tahunOptions: number[];
}

export default function MahasiswaEdit({
    mahasiswa,
    ruangans,
    users,
    ketOptions,
    tahunOptions,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`Edit ${mahasiswa.ket === 'dsn' ? 'dsn' : 'mhs'} - ${mahasiswa.nama}`}
            />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Edit Data
                        </h1>
                        <p className="text-muted-foreground">
                            Perbarui data{' '}
                            {mahasiswa.ket === 'dsn' ? 'dsn' : 'mhs'}{' '}
                            {mahasiswa.nama}
                        </p>
                    </div>
                </div>

                <MahasiswaForm
                    mahasiswa={mahasiswa}
                    ruangans={ruangans}
                    users={users}
                    ketOptions={ketOptions}
                    tahunOptions={tahunOptions}
                />
            </div>
        </AppLayout>
    );
}
