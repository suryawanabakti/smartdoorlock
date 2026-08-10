import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Ruangan } from '@/types/ruangan';
import { type User } from '@/types/user';
import { Head } from '@inertiajs/react';
import MahasiswaForm from './Form';

// Breadcrumbs will be handled inside the component

interface Props {
    ruangans: Ruangan[];
    users: User[];
    ketOptions: { value: string; label: string }[];
    tahunOptions: number[];
    filters: {
        ket?: string;
    };
    defaultKet?: string;
    hideKet?: boolean;
}

export default function MahasiswaCreate({
    ruangans,
    users,
    ketOptions,
    tahunOptions,
    filters,
    defaultKet,
    hideKet,
}: Props) {
    const isMahasiswa = filters?.ket === 'mhs';
    const isDosen = filters?.ket === 'dsn';

    let pageTitle = 'Tambah Data Baru';
    let pageSubtitle =
        'Isi form berikut untuk menambahkan data mahasiswa atau dosen';
    let parentTitle = 'Manajemen Mahasiswa & Dosen';
    let parentHref = '/mahasiswas';

    if (isMahasiswa) {
        pageTitle = 'Tambah Mahasiswa';
        pageSubtitle = 'Isi form berikut untuk menambahkan data mahasiswa';
        parentTitle = 'Manajemen Mahasiswa';
        parentHref = '/mahasiswa-list';
    } else if (isDosen) {
        pageTitle = 'Tambah Dosen';
        pageSubtitle = 'Isi form berikut untuk menambahkan data dosen';
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
            href: `/mahasiswas/create${filters?.ket ? `?ket=${filters.ket}` : ''}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={pageTitle} />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {pageTitle}
                        </h1>
                        <p className="text-muted-foreground">{pageSubtitle}</p>
                    </div>
                </div>

                <MahasiswaForm
                    ruangans={ruangans}
                    users={users}
                    ketOptions={ketOptions}
                    tahunOptions={tahunOptions}
                    defaultKet={defaultKet ?? filters?.ket}
                    hideKet={hideKet ?? Boolean(filters?.ket)}
                />
            </div>
        </AppLayout>
    );
}
