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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type RuanganShowData } from '@/types/ruangan';
import {
    getStatusBadgeVariant,
    getStatusIcon,
    getStatusLabel,
    type Histori,
    type ScanerStatus,
} from '@/types/scaner-status';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building,
    Calendar,
    Clock,
    Edit,
    History,
    Scan,
    Shield,
    User,
    Users,
} from 'lucide-react';

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
        title: 'Detail Ruangan',
        href: '#',
    },
];

interface Props {
    ruangan: RuanganShowData['ruangan'];
    statistics: RuanganShowData['statistics'];
}

export default function RuanganShow({ ruangan, statistics }: Props) {
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatTime = (timeString: string) => {
        return timeString.substring(0, 5); // HH:MM
    };

    const getStatusBadge = (status: number) => {
        const variant = getStatusBadgeVariant(status);
        const icon = getStatusIcon(status);
        const label = getStatusLabel(status);

        return (
            <Badge variant={variant}>
                <span className="mr-1">{icon}</span>
                {label}
            </Badge>
        );
    };

    const getTypeBadge = (type: string) => {
        const variants = {
            dalam: 'bg-blue-100 text-blue-800 border-blue-200',
            luar: 'bg-green-100 text-green-800 border-green-200',
        } as const;

        const variantClass =
            variants[type as keyof typeof variants] || variants.dalam;

        return (
            <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantClass}`}
            >
                <Scan className="mr-1 h-3 w-3" />
                {type.toUpperCase()}
            </span>
        );
    };

    const getRuanganTypeBadge = (type: string) => {
        const variants = {
            umum: 'bg-gray-100 text-gray-800 border-gray-200',
            kelas: 'bg-blue-100 text-blue-800 border-blue-200',
            lab: 'bg-purple-100 text-purple-800 border-purple-200',
        } as const;

        const variantClass =
            variants[type as keyof typeof variants] || variants.umum;

        return (
            <Badge variant="outline" className={variantClass}>
                {type.toUpperCase()}
            </Badge>
        );
    };

    // Get all histories from all scanners in this room
    const allHistories: Histori[] =
        ruangan.scaner_statuses?.flatMap(
            (scanner) => scanner.histories || [],
        ) || [];
    const recentHistories = allHistories
        .slice(0, 50)
        .sort(
            (a, b) => new Date(b.waktu).getTime() - new Date(a.waktu).getTime(),
        );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Ruangan - ${ruangan.nama_ruangan}`} />

            <div className="flex flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/ruangans">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                                <Building className="h-8 w-8" />
                                {ruangan.nama_ruangan}
                            </h1>
                            <p className="text-muted-foreground">
                                Informasi lengkap ruangan dan aktivitas scanner
                            </p>
                        </div>
                    </div>
                    <Link href={`/ruangans/${ruangan.id}/edit`}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Ruangan
                        </Button>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {statistics.total_scanners}
                                </div>
                                <div className="flex items-center justify-center gap-1 text-sm text-blue-800">
                                    <Scan className="h-4 w-4" />
                                    Total Scanner
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {statistics.scanners_dalam}
                                </div>
                                <div className="text-sm text-green-800">
                                    Scanner Dalam
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {statistics.scanners_luar}
                                </div>
                                <div className="text-sm text-purple-800">
                                    Scanner Luar
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                    {statistics.total_mahasiswa}
                                </div>
                                <div className="flex items-center justify-center gap-1 text-sm text-orange-800">
                                    <Users className="h-4 w-4" />
                                    Mahasiswa
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {statistics.total_penjaga}
                                </div>
                                <div className="flex items-center justify-center gap-1 text-sm text-red-800">
                                    <Shield className="h-4 w-4" />
                                    Penjaga
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-indigo-600">
                                    {statistics.total_scan_24jam}
                                </div>
                                <div className="flex items-center justify-center gap-1 text-sm text-indigo-800">
                                    <History className="h-4 w-4" />
                                    Scan 24jam
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="info" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger
                            value="info"
                            className="flex items-center gap-2"
                        >
                            <Building className="h-4 w-4" />
                            Informasi
                        </TabsTrigger>
                        <TabsTrigger
                            value="scanners"
                            className="flex items-center gap-2"
                        >
                            <Scan className="h-4 w-4" />
                            Scanner ({ruangan.scaner_statuses?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className="flex items-center gap-2"
                        >
                            <History className="h-4 w-4" />
                            Riwayat Scan
                        </TabsTrigger>
                        <TabsTrigger
                            value="users"
                            className="flex items-center gap-2"
                        >
                            <Users className="h-4 w-4" />
                            Pengguna
                        </TabsTrigger>
                    </TabsList>

                    {/* Informasi Ruangan Tab */}
                    <TabsContent value="info" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Dasar</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Nama Ruangan
                                            </label>
                                            <p className="font-semibold">
                                                {ruangan.nama_ruangan}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Tipe
                                            </label>
                                            <p>
                                                {getRuanganTypeBadge(
                                                    ruangan.type,
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Jam Buka
                                            </label>
                                            <p className="font-semibold">
                                                {formatTime(ruangan.jam_buka)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Jam Tutup
                                            </label>
                                            <p className="font-semibold">
                                                {formatTime(ruangan.jam_tutup)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Max Register
                                            </label>
                                            <p className="font-semibold">
                                                {ruangan.max_register} orang
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Status API
                                            </label>
                                            <Badge
                                                variant={
                                                    ruangan.open_api
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {ruangan.open_api
                                                    ? 'Open'
                                                    : 'Closed'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Security Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Keamanan & Akses</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span>PIN Active</span>
                                            <Badge
                                                variant={
                                                    ruangan.pin_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {ruangan.pin_active
                                                    ? 'Aktif'
                                                    : 'Nonaktif'}
                                            </Badge>
                                        </div>
                                        {ruangan.penanggung_jawab && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Penanggung Jawab
                                                </label>
                                                {Array.isArray(
                                                    ruangan.penanggung_jawab,
                                                ) ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {ruangan.penanggung_jawab.map(
                                                            (pj, idx) => (
                                                                <Badge
                                                                    key={idx}
                                                                    variant="outline"
                                                                    className="text-xs"
                                                                >
                                                                    {pj.label}
                                                                </Badge>
                                                            ),
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="font-semibold">
                                                        {
                                                            ruangan.penanggung_jawab
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                        {ruangan.mahasiswa_penanggung_jawab && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Mahasiswa Penanggung Jawab
                                                </label>
                                                <p className="font-semibold">
                                                    {
                                                        ruangan
                                                            .mahasiswa_penanggung_jawab
                                                            .nama
                                                    }{' '}
                                                    (
                                                    {
                                                        ruangan
                                                            .mahasiswa_penanggung_jawab
                                                            .nim
                                                    }
                                                    )
                                                </p>
                                            </div>
                                        )}
                                        {ruangan.parent && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Ruangan Induk
                                                </label>
                                                <p className="font-semibold">
                                                    {
                                                        ruangan.parent
                                                            .nama_ruangan
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Scanners Tab */}
                    <TabsContent value="scanners" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Daftar Scanner</CardTitle>
                                <CardDescription>
                                    Scanner yang terpasang di ruangan ini
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {ruangan.scaner_statuses &&
                                ruangan.scaner_statuses.length > 0 ? (
                                    <div className="rounded-md border w-full overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>
                                                        Kode Scanner
                                                    </TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>
                                                        Last Scan
                                                    </TableHead>
                                                    <TableHead>
                                                        Total Scan
                                                    </TableHead>
                                                    <TableHead>
                                                        Status
                                                    </TableHead>
                                                    <TableHead className="w-[100px]">
                                                        Aksi
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {ruangan.scaner_statuses.map(
                                                    (scanner: ScanerStatus) => (
                                                        <TableRow
                                                            key={scanner.id}
                                                        >
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <Scan className="h-4 w-4 text-blue-600" />
                                                                    <span className="font-mono font-medium">
                                                                        {
                                                                            scanner.kode
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                {getTypeBadge(
                                                                    scanner.type,
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {scanner.last ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <Clock className="h-4 w-4 text-gray-500" />
                                                                        {formatDateTime(
                                                                            scanner.last,
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-muted-foreground">
                                                                        Belum
                                                                        ada scan
                                                                    </span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline">
                                                                    {scanner.histories_count ||
                                                                        0}{' '}
                                                                    scan
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant={
                                                                        scanner.last
                                                                            ? 'default'
                                                                            : 'secondary'
                                                                    }
                                                                >
                                                                    {scanner.last
                                                                        ? 'Aktif'
                                                                        : 'Tidak Aktif'}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Link
                                                                    href={`/scaner-status/${scanner.id}`}
                                                                >
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                    >
                                                                        Detail
                                                                    </Button>
                                                                </Link>
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-muted-foreground">
                                        <Scan className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                        <p className="font-medium">
                                            Belum ada scanner terpasang
                                        </p>
                                        <p className="text-sm">
                                            Tambahkan scanner untuk ruangan ini
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Riwayat Scan Terbaru</CardTitle>
                                <CardDescription>
                                    {recentHistories.length} scan terakhir dari
                                    semua scanner di ruangan ini
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {recentHistories.length > 0 ? (
                                    <div className="rounded-md border w-full overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Waktu</TableHead>
                                                    <TableHead>
                                                        Scanner
                                                    </TableHead>
                                                    <TableHead>
                                                        ID Tag
                                                    </TableHead>
                                                    <TableHead>Nama</TableHead>
                                                    <TableHead>NIM</TableHead>
                                                    <TableHead>
                                                        Status
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {recentHistories.map(
                                                    (history) => (
                                                        <TableRow
                                                            key={history.id}
                                                        >
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="h-4 w-4 text-gray-500" />
                                                                    {formatDateTime(
                                                                        history.waktu,
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="font-mono text-sm">
                                                                {history.kode}
                                                            </TableCell>
                                                            <TableCell className="font-mono">
                                                                {history.id_tag}
                                                            </TableCell>
                                                            <TableCell>
                                                                {history.nama ||
                                                                    '-'}
                                                            </TableCell>
                                                            <TableCell className="font-mono">
                                                                {history.nim ||
                                                                    '-'}
                                                            </TableCell>
                                                            <TableCell>
                                                                {getStatusBadge(
                                                                    history.status,
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-muted-foreground">
                                        <History className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                        <p className="font-medium">
                                            Belum ada riwayat scan
                                        </p>
                                        <p className="text-sm">
                                            Scanner di ruangan ini belum
                                            digunakan
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Users Tab */}
                    <TabsContent value="users" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Mahasiswa */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Mahasiswa (
                                        {ruangan.mahasiswas?.length || 0})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {ruangan.mahasiswas &&
                                    ruangan.mahasiswas.length > 0 ? (
                                        <div className="space-y-3">
                                            {ruangan.mahasiswas.map(
                                                (mahasiswa) => (
                                                    <div
                                                        key={mahasiswa.id}
                                                        className="flex items-center justify-between rounded-lg border p-3"
                                                    >
                                                        <div>
                                                            <div className="font-medium">
                                                                {mahasiswa.nama}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                NIM:{' '}
                                                                {mahasiswa.nim}
                                                            </div>
                                                        </div>
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
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-4 text-center text-muted-foreground">
                                            <User className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                            <p className="text-sm">
                                                Tidak ada mahasiswa
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Penjaga */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        Penjaga (
                                        {ruangan.penjaga_ruangans?.length || 0})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {ruangan.penjaga_ruangans &&
                                    ruangan.penjaga_ruangans.length > 0 ? (
                                        <div className="space-y-3">
                                            {ruangan.penjaga_ruangans.map(
                                                (penjaga) => (
                                                    <div
                                                        key={penjaga.id}
                                                        className="flex items-center justify-between rounded-lg border p-3"
                                                    >
                                                        <div>
                                                            <div className="font-medium">
                                                                {
                                                                    penjaga.user
                                                                        ?.name
                                                                }
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {
                                                                    penjaga.user
                                                                        ?.email
                                                                }
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline">
                                                            Penjaga
                                                        </Badge>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-4 text-center text-muted-foreground">
                                            <Shield className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                            <p className="text-sm">
                                                Tidak ada penjaga
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
