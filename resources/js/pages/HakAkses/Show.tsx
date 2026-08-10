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
import { type HakAkses } from '@/types/hak-akses';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Building,
    Calendar,
    CheckCircle,
    Clock,
    Edit,
    Target,
    UserCheck,
    Users2,
    XCircle,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Manajemen Hak Akses',
        href: '/hak-akses',
    },
    {
        title: 'Detail Hak Akses',
        href: '#',
    },
];

interface Props {
    hakAkses: HakAkses;
}

export default function HakAksesShow({ hakAkses }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusBadge = () => {
        if (hakAkses.is_approve) {
            return (
                <Badge variant="default" className="text-sm">
                    ✅ Disetujui
                </Badge>
            );
        }
        return hakAkses.is_by_admin ? (
            <Badge variant="secondary" className="text-sm">
                👨‍💼 Dibuat Admin
            </Badge>
        ) : (
            <Badge variant="outline" className="text-sm">
                ⏳ Menunggu Persetujuan
            </Badge>
        );
    };

    const isPastDate = () => {
        return new Date(hakAkses.tanggal) < new Date();
    };
    console.log(hakAkses);
    const approveHakAkses = () => {
        if (confirm('Setujui hak akses ini?')) {
            router.post(`/hak-akses/${hakAkses.id}/approve`);
        }
    };

    const rejectHakAkses = () => {
        if (confirm('Tolak hak akses ini?')) {
            router.post(`/hak-akses/${hakAkses.id}/reject`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`Detail Hak Akses - ${hakAkses.ruangan?.nama_ruangan}`}
            />

            <div className="flex flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/hak-akses">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Detail Hak Akses
                            </h1>
                            <p className="text-muted-foreground">
                                Informasi lengkap akses ruangan
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {!hakAkses.is_approve && !hakAkses.is_by_admin && (
                            <>
                                <Button
                                    onClick={approveHakAkses}
                                    variant="default"
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Setujui
                                </Button>
                                <Button
                                    onClick={rejectHakAkses}
                                    variant="outline"
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Tolak
                                </Button>
                            </>
                        )}
                        <Link href={`/hak-akses/${hakAkses.id}/edit`}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Main Information */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Informasi Hak Akses</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Ruangan & Jadwal */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Ruangan
                                        </label>
                                        <p className="flex items-center gap-2 text-lg font-semibold">
                                            <Building className="h-5 w-5 text-blue-600" />
                                            {hakAkses.ruangan?.nama_ruangan}
                                        </p>
                                        <Badge
                                            variant="outline"
                                            className="mt-1"
                                        >
                                            {hakAkses.ruangan?.type}
                                        </Badge>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Tanggal
                                        </label>
                                        <p className="flex items-center gap-2 text-lg font-semibold">
                                            <Calendar className="h-5 w-5 text-green-600" />
                                            {formatDate(hakAkses.tanggal)}
                                            {isPastDate() && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2"
                                                >
                                                    Sudah Lewat
                                                </Badge>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Jam Akses
                                        </label>
                                        <p className="flex items-center gap-2 text-lg font-semibold">
                                            <Clock className="h-5 w-5 text-purple-600" />
                                            {hakAkses.jam_masuk} -{' '}
                                            {hakAkses.jam_keluar}
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

                            {/* Tujuan dan Skill */}
                            <div className="space-y-4">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <Target className="h-4 w-4" />
                                        Tujuan Akses
                                    </label>
                                    <p className="mt-1 whitespace-pre-wrap text-gray-900">
                                        {hakAkses.tujuan}
                                    </p>
                                </div>
                                {hakAkses.skill && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Skill yang Dibutuhkan
                                        </label>
                                        <p className="mt-1 whitespace-pre-wrap text-gray-900">
                                            {hakAkses.skill}
                                        </p>
                                    </div>
                                )}
                                {hakAkses.additional_participant && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Peserta Tambahan
                                        </label>
                                        <p className="mt-1 whitespace-pre-wrap text-gray-900">
                                            {hakAkses.additional_participant}
                                        </p>
                                    </div>
                                )}
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
                                        {hakAkses.max_register}
                                    </div>
                                    <div className="text-sm text-blue-800">
                                        Kuota Maksimal
                                    </div>
                                </div>
                                <div className="rounded-lg bg-green-50 p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {hakAkses.mahasiswas?.length || 0}
                                    </div>
                                    <div className="text-sm text-green-800">
                                        Peserta Terdaftar
                                    </div>
                                </div>
                                <div className="rounded-lg bg-orange-50 p-4 text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {Math.max(
                                            0,
                                            hakAkses.max_register -
                                                (hakAkses.mahasiswas?.length ||
                                                    0),
                                        )}
                                    </div>
                                    <div className="text-sm text-orange-800">
                                        Kuota Tersedia
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Daftar Peserta */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users2 className="h-5 w-5" />
                            Daftar Peserta ({hakAkses.mahasiswas?.length || 0})
                        </CardTitle>
                        <CardDescription>
                            Mahasiswa yang memiliki akses ke ruangan ini
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {hakAkses.mahasiswas &&
                        hakAkses.mahasiswas.length > 0 ? (
                            <div className="rounded-md border w-full overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>NIM</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Tahun Masuk</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {hakAkses.mahasiswas.map(
                                            (mahasiswa) => (
                                                <TableRow key={mahasiswa.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                                                                <UserCheck className="h-4 w-4 text-gray-600" />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium">
                                                                    {
                                                                        mahasiswa.nama
                                                                    }
                                                                </div>
                                                                {mahasiswa.user
                                                                    ?.email && (
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {
                                                                            mahasiswa
                                                                                .user
                                                                                .email
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-mono">
                                                        {mahasiswa.nim}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                mahasiswa.status
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {mahasiswa.status
                                                                ? 'Aktif'
                                                                : 'Nonaktif'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {mahasiswa.tahun_masuk}
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="py-8 text-center text-muted-foreground">
                                <Users2 className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                <p className="font-medium">
                                    Belum ada peserta terdaftar
                                </p>
                                <p className="text-sm">
                                    Tambahkan mahasiswa sebagai peserta
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
