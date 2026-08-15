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
import { type HakAkses } from '@/types/hak-akses';
import { Histori } from '@/types/histori';
import { type Ruangan } from '@/types/ruangan';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    ArrowLeft,
    Building,
    Calendar,
    Edit,
    History,
    Lock,
    LockKeyhole,
    Scan,
    Unlock,
    X,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Penjaga',
        href: '/penjaga/dashboard',
    },
    {
        title: 'Ruangan Saya',
        href: '/penjaga/ruangan',
    },
    {
        title: 'Detail Ruangan',
        href: '#',
    },
];

interface Props {
    ruangan: Ruangan;
    statistics: {
        absensi_hari_ini: number;
        sedang_akses: number;
        hak_akses_hari_ini: number;
        total_scanner: number;
        scanner_aktif: number;
    };
    aktivitasTerkini: Absensi[];
    jadwalHariIni: HakAkses[];
}

export default function RuanganPenjagaShow({
    ruangan,
    statistics,
    aktivitasTerkini,
    jadwalHariIni,
}: Props) {
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

    const allHistories: Histori[] =
        ruangan.scaner_statuses?.flatMap(
            (scanner) => scanner.histories || [],
        ) || [];
    const recentHistories = allHistories
        .slice(0, 50)
        .sort(
            (a, b) => new Date(b.waktu).getTime() - new Date(a.waktu).getTime(),
        );

    const formatTime = (dateString: string | null) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = () => {
        if (ruangan.open_api) {
            return (
                <Badge variant="default">
                    <Unlock className="mr-1 h-4 w-4" />
                    Terbuka
                </Badge>
            );
        }
        return (
            <Badge variant="secondary">
                <Lock className="mr-1 h-4 w-4" />
                Tertutup
            </Badge>
        );
    };

    const getRuanganTypeBadge = () => {
        const variants = {
            umum: 'bg-gray-100 text-gray-800 border-gray-200',
            kelas: 'bg-blue-100 text-blue-800 border-blue-200',
            lab: 'bg-purple-100 text-purple-800 border-purple-200',
        } as const;

        const variantClass =
            variants[ruangan.type as keyof typeof variants] || variants.umum;

        return (
            <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantClass}`}
            >
                {ruangan.type.toUpperCase()}
            </span>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${ruangan.nama_ruangan} - Detail`} />

            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/penjaga/ruangan">
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
                                Detail informasi ruangan
                            </p>
                        </div>
                    </div>
                    <Link href={`/penjaga/ruangan/${ruangan.id}/edit`}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Ruangan
                        </Button>
                    </Link>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {statistics.absensi_hari_ini}
                            </div>
                            <div className="text-sm text-blue-800">
                                Absensi Hari Ini
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {statistics.sedang_akses}
                            </div>
                            <div className="text-sm text-orange-800">
                                Sedang Mengakses
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {statistics.hak_akses_hari_ini}
                            </div>
                            <div className="text-sm text-green-800">
                                Hak Akses Hari Ini
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {statistics.total_scanner}
                            </div>
                            <div className="text-sm text-purple-800">
                                Total Scanner
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-indigo-600">
                                {statistics.scanner_aktif}
                            </div>
                            <div className="text-sm text-indigo-800">
                                Scanner Aktif
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Informasi Ruangan */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Informasi Ruangan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                    <p>{getRuanganTypeBadge()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Jam Operasional
                                    </label>
                                    <p className="font-semibold">
                                        {ruangan.jam_buka} - {ruangan.jam_tutup}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Kuota Maksimal
                                    </label>
                                    <p className="font-semibold">
                                        {ruangan.max_register} orang
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Status
                                    </label>
                                    <p>{getStatusBadge()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        PIN
                                    </label>
                                    <p className="font-semibold">
                                        {ruangan.pin_active ? (
                                            <span className="flex items-center gap-1">
                                                <LockKeyhole className="h-4 w-4" />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                <X className="h-4 w-4" />
                                                Nonaktif
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Penanggung Jawab
                                    </label>
                                    {ruangan.penanggung_jawab ? (
                                        <div className="flex flex-wrap gap-1">
                                            {Array.isArray(
                                                ruangan.penanggung_jawab,
                                            ) ? (
                                                ruangan.penanggung_jawab.map(
                                                    (pj, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {pj.label}
                                                        </Badge>
                                                    ),
                                                )
                                            ) : (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {ruangan.penanggung_jawab}
                                                </Badge>
                                            )}
                                        </div>
                                    ) : (
                                        '-'
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Scanner Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Scan className="h-5 w-5" />
                                Scanner ({ruangan.scaner_statuses?.length || 0})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {ruangan.scaner_statuses &&
                                ruangan.scaner_statuses.length > 0 ? (
                                    ruangan.scaner_statuses.map((scanner) => (
                                        <div
                                            key={scanner.id}
                                            className="flex items-center justify-between rounded border p-2"
                                        >
                                            <div>
                                                <div className="text-sm font-medium">
                                                    {scanner.kode}
                                                </div>
                                                <div className="text-xs text-muted-foreground capitalize">
                                                    {scanner.type}
                                                </div>
                                            </div>
                                            <Badge
                                                variant={
                                                    scanner.last
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {scanner.last
                                                    ? 'Aktif'
                                                    : 'Nonaktif'}
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-4 text-center text-muted-foreground">
                                        <Scan className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                        <p className="text-sm">
                                            Tidak ada scanner
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Jadwal Hari Ini & Aktivitas Terkini */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Jadwal Hari Ini */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Jadwal Hari Ini ({jadwalHariIni.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {jadwalHariIni.map((hakAkses) => (
                                    <div
                                        key={hakAkses.id}
                                        className="rounded-lg border p-3"
                                    >
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-sm font-medium">
                                                {hakAkses.jam_masuk} -{' '}
                                                {hakAkses.jam_keluar}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {hakAkses.mahasiswas?.length ||
                                                    0}{' '}
                                                peserta
                                            </Badge>
                                        </div>
                                        <div className="line-clamp-2 text-sm text-muted-foreground">
                                            {hakAkses.tujuan}
                                        </div>
                                    </div>
                                ))}
                                {jadwalHariIni.length === 0 && (
                                    <div className="py-4 text-center text-muted-foreground">
                                        <Calendar className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                        <p className="text-sm">
                                            Tidak ada jadwal hari ini
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Aktivitas Terkini */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Aktivitas Terkini
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {aktivitasTerkini.map((absensi) => (
                                    <div
                                        key={absensi.id}
                                        className="flex items-center justify-between rounded-lg p-2 hover:bg-muted/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`h-2 w-2 rounded-full ${
                                                    absensi.waktu_keluar
                                                        ? 'bg-green-500'
                                                        : 'bg-yellow-500'
                                                }`}
                                            />
                                            <div>
                                                <div className="text-sm font-medium">
                                                    {absensi.nama ||
                                                        'Tidak Diketahui'}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {absensi.nim || 'No NIM'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium">
                                                {formatTime(
                                                    absensi.waktu_masuk,
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {absensi.waktu_keluar
                                                    ? formatTime(
                                                          absensi.waktu_keluar,
                                                      )
                                                    : 'Masih di dalam'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {aktivitasTerkini.length === 0 && (
                                    <div className="py-4 text-center text-muted-foreground">
                                        <Activity className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                        <p className="text-sm">
                                            Belum ada aktivitas hari ini
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat Scan Terbaru</CardTitle>
                        <CardDescription>
                            {recentHistories.length} scan terakhir dari semua
                            scanner di ruangan ini
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentHistories.length > 0 ? (
                            <div className="rounded-md border w-full overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Waktu</TableHead>
                                            <TableHead>Scanner</TableHead>
                                            <TableHead>ID Tag</TableHead>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>NIM</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentHistories.map((history) => (
                                            <TableRow key={history.id}>
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
                                                    {history.nama || '-'}
                                                </TableCell>
                                                <TableCell className="font-mono">
                                                    {history.nim || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(
                                                        history.status,
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
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
                                    Scanner di ruangan ini belum digunakan
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
