import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Ruangan } from '@/types/ruangan';
import { type User } from '@/types/user';
import { Head } from '@inertiajs/react';
import UserForm from './Form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Manajemen Penjaga',
        href: '/users',
    },
    {
        title: 'Edit Penjaga',
        href: '#',
    },
];

interface Props {
    user: User;
    ruangans: Ruangan[];
    roles: string[];
    userRuanganIds: number[];
}

export default function UserEdit({
    user,
    ruangans,
    roles,
    userRuanganIds,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Penjaga - ${user.name}`} />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Edit Penjaga
                        </h1>
                        <p className="text-muted-foreground">
                            Perbarui data penjaga {user.name}
                        </p>
                    </div>
                </div>

                <UserForm
                    user={user}
                    ruangans={ruangans}
                    roles={roles}
                    userRuanganIds={userRuanganIds}
                />
            </div>
        </AppLayout>
    );
}
