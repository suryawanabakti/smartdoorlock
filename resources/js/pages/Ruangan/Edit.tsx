import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Ruangan } from '@/types/ruangan';
import { Head } from '@inertiajs/react';
import RuanganForm from './Form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Manajemen Ruangan',
        href: '/ruangans',
    },
    {
        title: 'Edit Ruangan',
        href: '#',
    },
];

interface Props {
    ruangan: Ruangan;
    parentRuangans: Ruangan[];
    types: string[];
    mahasiswas: any[];
}

export default function RuanganEdit({
    ruangan,
    parentRuangans,
    types,
    mahasiswas,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Ruangan" />

            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Edit Ruangan
                    </h1>
                    <p className="text-muted-foreground">
                        Perbarui data ruangan
                    </p>
                </div>

                <RuanganForm
                    ruangan={ruangan}
                    parentRuangans={parentRuangans}
                    types={types}
                    mahasiswas={mahasiswas}
                />
            </div>
        </AppLayout>
    );
}
