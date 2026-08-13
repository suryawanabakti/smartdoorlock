import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { type Mahasiswa } from '@/types/mahasiswa';
import { type Ruangan } from '@/types/ruangan';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import HakAksesForm from './Form';

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
        title: 'Ajukan Hak Akses',
        href: '/mahasiswa/hak-akses/create',
    },
];

interface Props {
    ruangans: Ruangan[];
    temanKelas: Mahasiswa[];
    mahasiswa: Mahasiswa;
}

export default function HakAksesMahasiswaCreate({
    ruangans,
    temanKelas,
    mahasiswa,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ajukan Hak Akses - Mahasiswa" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                            Ajukan Hak Akses Baru
                        </h1>
                        <p className="text-muted-foreground">
                            Ajukan permohonan akses ruangan untuk kegiatan
                            akademik
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/mahasiswa/hak-akses">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                    </div>
                </div>

                <HakAksesForm
                    ruangans={ruangans}
                    temanKelas={temanKelas}
                    mahasiswa={mahasiswa}
                />
            </div>
        </AppLayout>
    );
}
