import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { isHakAksesPast } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { type HakAkses } from '@/types/hak-akses';
import { type Mahasiswa } from '@/types/mahasiswa';
import { Head, Link, router } from '@inertiajs/react';
import {
    Building,
    Calendar,
    CheckCircle,
    Clock,
    Edit,
    GraduationCap,
    MapPin,
    Trash2,
    Users,
} from 'lucide-react';

interface Props {
    hakAkses: HakAkses;
    mahasiswa: Mahasiswa;
}

export default function HakAksesMahasiswaShow({ hakAkses, mahasiswa }: Props) {
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
            title: 'Detail Hak Akses',
            href: `/mahasiswa/hak-akses/${hakAkses.id}`,
        },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const isToday = (dateString: string) => {
        return (
            new Date(dateString).toDateString() === new Date().toDateString()
        );
    };

    const isPast = () => {
        return isHakAksesPast(hakAkses.tanggal, hakAkses.jam_keluar);
    };

    const getStatusBadge = (hakAkses: HakAkses) => {
        if (hakAkses.is_approve) {
            return (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Disetujui
                </Badge>
            );
        }
        return (
            <Badge
                variant="outline"
                className="border-yellow-200 bg-yellow-50 text-yellow-800"
            >
                <Clock className="mr-1 h-4 w-4" />
                Menunggu Persetujuan
            </Badge>
        );
    };

    const canEdit = !hakAkses.is_approve && !isPast();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Hak Akses - Mahasiswa" />

            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                            <GraduationCap className="h-8 w-8" />
                            Detail Hak Akses
                        </h1>
                        <p className="text-muted-foreground">
                            Informasi lengkap permohonan hak akses ruangan
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/mahasiswa/hak-akses">
                            <Button variant="outline">Kembali</Button>
                        </Link>
                        {canEdit && (
                            <>
                                <Link
                                    href={`/mahasiswa/hak-akses/${hakAkses.id}/edit`}
                                >
                                    <Button>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        if (
                                            confirm(
                                                'Apakah Anda yakin ingin membatalkan permohonan hak akses ini?',
                                            )
                                        ) {
                                            router.delete(
                                                `/mahasiswa/hak-akses/${hakAkses.id}`,
                                            );
                                        }
                                    }}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Batalkan
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Informasi Utama */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Informasi Jadwal */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Informasi Jadwal
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Building className="h-4 w-4 text-blue-600" />
                                            Ruangan
                                        </div>
                                        <div className="text-lg font-semibold">
                                            {hakAkses.ruangan?.nama_ruangan}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {hakAkses.ruangan?.type}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <MapPin className="h-4 w-4 text-green-600" />
                                            Lokasi
                                        </div>
                                        <div className="text-sm">
                                            {hakAkses.ruangan?.lokasi ||
                                                'Tidak tersedia'}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Calendar className="h-4 w-4 text-orange-600" />
                                            Tanggal
                                        </div>
                                        <div className="text-lg font-semibold">
                                            {formatDate(hakAkses.tanggal)}
                                        </div>
                                        <div className="flex gap-2">
                                            {isToday(hakAkses.tanggal) && (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    Hari Ini
                                                </Badge>
                                            )}
                                            {isPast() && (
                                                <Badge
                                                    variant="outline"
                                                    className="bg-gray-100 text-xs"
                                                >
                                                    Sudah Lewat
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Clock className="h-4 w-4 text-purple-600" />
                                            Waktu
                                        </div>
                                        <div className="text-lg font-semibold">
                                            {hakAkses.jam_masuk} -{' '}
                                            {hakAkses.jam_keluar}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tujuan dan Keterangan */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Tujuan dan Keterangan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">
                                        Tujuan Akses
                                    </div>
                                    <div className="rounded-lg bg-muted/50 p-4">
                                        <p className="whitespace-pre-wrap">
                                            {hakAkses.tujuan}
                                        </p>
                                    </div>
                                </div>

                                {hakAkses.skill && (
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Skill yang Dibutuhkan
                                        </div>
                                        <div className="rounded-lg bg-blue-50 p-4">
                                            <p className="whitespace-pre-wrap">
                                                {hakAkses.skill}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {hakAkses.additional_participant && (
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Peserta Tambahan (Non-Mahasiswa)
                                        </div>
                                        <div className="rounded-lg bg-green-50 p-4">
                                            <p className="whitespace-pre-wrap">
                                                {
                                                    hakAkses.additional_participant
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Status Permohonan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-center">
                                    {getStatusBadge(hakAkses)}
                                </div>

                                <div className="space-y-2 text-center">
                                    <div className="text-sm text-muted-foreground">
                                        {hakAkses.is_approve
                                            ? 'Permohonan Anda telah disetujui oleh penjaga ruangan.'
                                            : 'Permohonan Anda sedang menunggu persetujuan penjaga ruangan.'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Informasi Peserta */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Informasi Peserta
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="space-y-1">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {hakAkses.mahasiswas?.length || 0}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Total Peserta
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-2xl font-bold text-green-600">
                                            {hakAkses.max_register}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Kuota Maksimal
                                        </div>
                                    </div>
                                </div>

                                {hakAkses.mahasiswas &&
                                    hakAkses.mahasiswas.length > 0 && (
                                        <div className="space-y-2">
                                            <div className="text-sm font-medium">
                                                Daftar Peserta:
                                            </div>
                                            <div className="max-h-40 overflow-y-auto rounded-lg border">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="h-8 px-3">
                                                                Nama
                                                            </TableHead>
                                                            <TableHead className="h-8 px-3">
                                                                NIM
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {hakAkses.mahasiswas.map(
                                                            (peserta) => (
                                                                <TableRow
                                                                    key={
                                                                        peserta.id
                                                                    }
                                                                    className={
                                                                        peserta.id ===
                                                                        mahasiswa.id
                                                                            ? 'bg-blue-50'
                                                                            : ''
                                                                    }
                                                                >
                                                                    <TableCell className="px-3 py-2 text-sm">
                                                                        <div className="flex items-center gap-2">
                                                                            {
                                                                                peserta.nama
                                                                            }
                                                                            {peserta.id ===
                                                                                mahasiswa.id && (
                                                                                <Badge
                                                                                    variant="outline"
                                                                                    className="text-xs"
                                                                                >
                                                                                    Anda
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="px-3 py-2 text-sm">
                                                                        {
                                                                            peserta.nim
                                                                        }
                                                                    </TableCell>
                                                                </TableRow>
                                                            ),
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    )}
                            </CardContent>
                        </Card>

                        {/* Informasi Tambahan */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Tambahan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Diajukan oleh:
                                    </span>
                                    <span className="font-medium">
                                        {mahasiswa.nama}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        NIM:
                                    </span>
                                    <span>{mahasiswa.nim}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Kelas:
                                    </span>
                                    <span>
                                        {mahasiswa.ruangan?.nama_ruangan || '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Angkatan:
                                    </span>
                                    <span>{mahasiswa.tahun_masuk}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
