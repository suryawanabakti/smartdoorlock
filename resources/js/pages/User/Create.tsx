import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Ruangan } from '@/types/ruangan';
import { Head } from '@inertiajs/react';
import UserForm from './Form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Manajemen User',
        href: '/users',
    },
    {
        title: 'Tambah User',
        href: '/users/create',
    },
];

interface Props {
    ruangans: Ruangan[];
    roles: string[];
}

export default function UserCreate({ ruangans, roles }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah User Baru" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Tambah User Baru
                        </h1>
                        <p className="text-muted-foreground">
                            Isi form berikut untuk menambahkan user baru ke
                            sistem
                        </p>
                    </div>
                </div>

                <UserForm ruangans={ruangans} roles={roles} />
            </div>
        </AppLayout>
    );
}
