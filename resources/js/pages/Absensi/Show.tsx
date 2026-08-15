import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Absensi } from '@/types/absensi';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building,
    Calendar,
    CheckCircle,
    Circle,
    Clock,
    History,
    Tag,
    User,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Data Absensi',
        href: '/absensi',
    },
    {
        title: 'Detail Absensi',
        href: '#',
    },
];

interface Props {
    absensi: Absensi;
    absensiTerkait: Absensi[];
}

export default function AbsensiShow({ absensi, absensiTerkait }: Props) {
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
            return (
                <Badge variant="default">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Selesai
                </Badge>
            );
        } else if (absensi.waktu_masuk) {
            return (
                <Badge variant="secondary">
                    <Clock className="mr-1 h-4 w-4" />
                    Masuk (Belum Keluar)
                </Badge>
            );
        }
        return (
            <Badge variant="outline">
                <Circle className="mr-1 h-4 w-4" />
                Tidak Valid
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`Detail Absensi - ${absensi.user?.nama || absensi.user?.nim}`}
            />

            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/absensi">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Detail Absensi
                            </h1>
                            <p className="text-muted-foreground">
                                Informasi lengkap data kehadiran
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Information */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
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
                                            {absensi.user?.nama ||
                                                'Tidak Diketahui'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            NIM
                                        </label>
                                        <p className="font-semibold">
                                            {absensi.user?.nim || '-'}
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

                    {/* Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistik</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="rounded-lg bg-blue-50 p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {absensi.waktu_masuk ? 'Ya' : 'Tidak'}
                                    </div>
                                    <div className="text-sm text-blue-800">
                                        Tercatat Masuk
                                    </div>
                                </div>
                                <div className="rounded-lg bg-green-50 p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {absensi.waktu_keluar ? 'Ya' : 'Tidak'}
                                    </div>
                                    <div className="text-sm text-green-800">
                                        Tercatat Keluar
                                    </div>
                                </div>
                                {absensi.waktu_masuk &&
                                    absensi.waktu_keluar && (
                                        <div className="rounded-lg bg-purple-50 p-4 text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {absensi.lama_akses_menit || 0}{' '}
                                                m
                                            </div>
                                            <div className="text-sm text-purple-800">
                                                Lama Akses
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Riwayat Terkait */}
                {absensiTerkait.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-5 w-5" />
                                Riwayat Akses Terkait
                                <Badge variant="outline">
                                    {absensiTerkait.length} akses
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                                Riwayat akses sebelumnya dengan ID Tag yang sama
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border w-full overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Ruangan</TableHead>
                                            <TableHead>Waktu Masuk</TableHead>
                                            <TableHead>Waktu Keluar</TableHead>
                                            <TableHead>Durasi</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {absensiTerkait.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    {item.waktu_masuk
                                                        ? new Date(
                                                              item.waktu_masuk,
                                                          ).toLocaleDateString(
                                                              'id-ID',
                                                              {
                                                                  weekday:
                                                                      'short',
                                                                  year: 'numeric',
                                                                  month: 'short',
                                                                  day: 'numeric',
                                                              },
                                                          )
                                                        : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {item.ruangan ? (
                                                        <div className="flex items-center gap-2">
                                                            <Building className="h-3 w-3" />
                                                            {
                                                                item.ruangan
                                                                    .nama_ruangan
                                                            }
                                                        </div>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {item.waktu_masuk
                                                        ? new Date(
                                                              item.waktu_masuk,
                                                          ).toLocaleTimeString(
                                                              'id-ID',
                                                              {
                                                                  hour: '2-digit',
                                                                  minute: '2-digit',
                                                              },
                                                          )
                                                        : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {item.waktu_keluar
                                                        ? new Date(
                                                              item.waktu_keluar,
                                                          ).toLocaleTimeString(
                                                              'id-ID',
                                                              {
                                                                  hour: '2-digit',
                                                                  minute: '2-digit',
                                                              },
                                                          )
                                                        : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {item.waktu_masuk &&
                                                    item.waktu_keluar
                                                        ? (() => {
                                                              const masuk =
                                                                  new Date(
                                                                      item.waktu_masuk,
                                                                  );
                                                              const keluar =
                                                                  new Date(
                                                                      item.waktu_keluar,
                                                                  );
                                                              const diffMs =
                                                                  keluar.getTime() -
                                                                  masuk.getTime();
                                                              const hours =
                                                                  Math.floor(
                                                                      diffMs /
                                                                          (1000 *
                                                                              60 *
                                                                              60),
                                                                  );
                                                              const minutes =
                                                                  Math.floor(
                                                                      (diffMs %
                                                                          (1000 *
                                                                              60 *
                                                                              60)) /
                                                                          (1000 *
                                                                              60),
                                                                  );
                                                              return `${hours}j ${minutes}m`;
                                                          })()
                                                        : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {item.waktu_masuk &&
                                                    item.waktu_keluar ? (
                                                        <Badge variant="default">
                                                            Selesai
                                                        </Badge>
                                                    ) : item.waktu_masuk ? (
                                                        <Badge variant="secondary">
                                                            Masuk
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline">
                                                            Tidak Valid
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

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
