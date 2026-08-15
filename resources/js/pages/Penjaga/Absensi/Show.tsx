import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Absensi } from '@/types/absensi';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building,
    Calendar,
    Clock,
    Shield,
    Tag,
    User,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Penjaga',
        href: '/penjaga/dashboard',
    },
    {
        title: 'Absensi',
        href: '/penjaga/absensi',
    },
    {
        title: 'Detail Absensi',
        href: '#',
    },
];

interface Props {
    absensi: Absensi;
}

export default function AbsensiPenjagaShow({ absensi }: Props) {
    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const getDurasi = () => {
        if (absensi.waktu_masuk && absensi.waktu_keluar) {
            const masuk = new Date(absensi.waktu_masuk);
            const keluar = new Date(absensi.waktu_keluar);
            const diffMs = keluar.getTime() - masuk.getTime();

            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor(
                (diffMs % (1000 * 60 * 60)) / (1000 * 60),
            );
            const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

            return `${hours} jam ${minutes} menit ${seconds} detik`;
        }
        return '-';
    };

    const getStatusBadge = () => {
        if (absensi.waktu_masuk && absensi.waktu_keluar) {
            return <Badge variant="default">Selesai</Badge>;
        } else if (absensi.waktu_masuk) {
            return <Badge variant="secondary">Masuk (Belum Keluar)</Badge>;
        }
        return <Badge variant="outline">Tidak Valid</Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`Detail Absensi - ${absensi.nama || absensi.nim || absensi.id_tag}`}
            />

            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/penjaga/absensi">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                                <Shield className="h-8 w-8" />
                                Detail Absensi
                            </h1>
                            <p className="text-muted-foreground">
                                Informasi lengkap data kehadiran
                            </p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Absensi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Identitas */}
                        <div>
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                <User className="h-5 w-5" />
                                Identitas
                            </h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Nama
                                    </label>
                                    <p className="font-semibold">
                                        {absensi.nama || 'Tidak Diketahui'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        NIM
                                    </label>
                                    <p className="font-semibold">
                                        {absensi.nim || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <Tag className="h-4 w-4" />
                                        ID Tag
                                    </label>
                                    <p className="font-mono font-semibold">
                                        {absensi.id_tag}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Waktu */}
                        <div>
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                <Clock className="h-5 w-5" />
                                Waktu Akses
                            </h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Waktu Masuk
                                    </label>
                                    <p className="flex items-center gap-2 font-semibold">
                                        <Calendar className="h-4 w-4 text-green-600" />
                                        {formatDateTime(
                                            absensi.waktu_masuk,
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Waktu Keluar
                                    </label>
                                    <p className="flex items-center gap-2 font-semibold">
                                        <Calendar className="h-4 w-4 text-red-600" />
                                        {formatDateTime(
                                            absensi.waktu_keluar,
                                        )}
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Durasi Akses
                                    </label>
                                    <p className="font-semibold">
                                        {getDurasi()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Ruangan dan Status */}
                        <div>
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                <Building className="h-5 w-5" />
                                Ruangan & Status
                            </h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Ruangan
                                    </label>
                                    <p className="font-semibold">
                                        {absensi.ruangan ? (
                                            <div className="flex items-center gap-2">
                                                <Building className="h-4 w-4" />
                                                {
                                                    absensi.ruangan
                                                        .nama_ruangan
                                                }
                                                <Badge
                                                    variant="outline"
                                                    className="ml-2"
                                                >
                                                    {absensi.ruangan.type}
                                                </Badge>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                -
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Status
                                    </label>
                                    <div className="mt-1">
                                        {getStatusBadge()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Informasi Sistem */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Sistem</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Dibuat Pada
                                </label>
                                <p>{formatDateTime(absensi.created_at)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Diupdate Pada
                                </label>
                                <p>{formatDateTime(absensi.updated_at)}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    ID Record
                                </label>
                                <p className="rounded bg-muted p-2 font-mono text-xs">
                                    {absensi.id}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
