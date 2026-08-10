import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Mahasiswa } from '@/types/mahasiswa';
import { type Ruangan } from '@/types/ruangan';
import { type User } from '@/types/user';
import { Head } from '@inertiajs/react';
import MahasiswaForm from './Form';

// Breadcrumbs will be handled inside the component

interface Props {
    mahasiswa: Mahasiswa;
    ruangans: Ruangan[];
    users: User[];
    ketOptions: { value: string; label: string }[];
    tahunOptions: number[];
    defaultKet?: string;
    hideKet?: boolean;
}

export default function MahasiswaEdit({
    mahasiswa,
    ruangans,
    users,
    ketOptions,
    tahunOptions,
    defaultKet,
    hideKet,
}: Props) {
    const isMahasiswa = mahasiswa.ket === 'mhs';
    const isDosen = mahasiswa.ket === 'dsn';

    let pageTitle = 'Edit Data';
    let parentTitle = 'Manajemen Mahasiswa & Dosen';
    let parentHref = '/mahasiswas';
    let label = isDosen ? 'Dosen' : 'Mahasiswa';

    if (isMahasiswa) {
        pageTitle = 'Edit Mahasiswa';
        parentTitle = 'Manajemen Mahasiswa';
        parentHref = '/mahasiswa-list';
    } else if (isDosen) {
        pageTitle = 'Edit Dosen';
        parentTitle = 'Manajemen Dosen';
        parentHref = '/dosen-list';
    }

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: parentTitle,
            href: parentHref,
        },
        {
            title: pageTitle,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${pageTitle} - ${mahasiswa.nama}`} />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {pageTitle}
                        </h1>
                        <p className="text-muted-foreground">
                            Perbarui data {label} {mahasiswa.nama}
                        </p>
                    </div>
                </div>

                <MahasiswaForm
                    mahasiswa={mahasiswa}
                    ruangans={ruangans}
                    users={users}
                    ketOptions={ketOptions}
                    tahunOptions={tahunOptions}
                    defaultKet={defaultKet}
                    hideKet={hideKet}
                />
            </div>
        </AppLayout>
    );
}
