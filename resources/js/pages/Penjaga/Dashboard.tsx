import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    Building,
    Calendar,
    CheckCircle,
    Clock,
    RefreshCw,
    Scan,
    Shield,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Penjaga',
        href: '/penjaga/dashboard',
    },
];

interface Props {
    statistics: {
        total_ruangan: number;
        hak_akses_hari_ini: number;
        absensi_hari_ini: number;
        sedang_akses: number;
    };
    ruanganDijaga: any[];
    hakAksesMendatang: any[];
    aktivitasTerkini: any[];
    charts: {
        absensi_7_hari: {
            labels: string[];
            data: number[];
        };
    };
    scannerStatus: any[];
}

export default function PenjagaDashboard({
    statistics,
    ruanganDijaga,
    hakAksesMendatang,
    aktivitasTerkini,
    charts,
    scannerStatus,
}: Props) {
    const [realTimeData, setRealTimeData] = useState(statistics);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshData = async () => {
        setIsRefreshing(true);
        try {
            const response = await fetch('/penjaga/dashboard/real-time');
            const data = await response.json();
            setRealTimeData((prev) => ({
                ...prev,
                sedang_akses: data.sedang_akses,
                absensi_hari_ini: data.absensi_hari_ini,
            }));
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        // Auto-refresh every 30 seconds
        const interval = setInterval(refreshData, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (dateString: string | null) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Penjaga" />

            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                            <Shield className="h-8 w-8" />
                            Dashboard Penjaga
                        </h1>
                        <p className="text-muted-foreground">
                            Panel pengelolaan ruangan - Data real-time
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={refreshData}
                            disabled={isRefreshing}
                        >
                            <RefreshCw
                                className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                            />
                            {isRefreshing ? 'Memperbarui...' : 'Refresh'}
                        </Button>
                        <Link href="/penjaga/ruangan">
                            <Button>
                                <Building className="mr-2 h-4 w-4" />
                                Kelola Ruangan
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {statistics.total_ruangan}
                                    </p>
                                    <p className="text-sm font-medium text-blue-800">
                                        Ruangan Dijaga
                                    </p>
                                </div>
                                <div className="rounded-full bg-blue-100 p-3">
                                    <Building className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-green-600">
                                        {statistics.hak_akses_hari_ini}
                                    </p>
                                    <p className="text-sm font-medium text-green-800">
                                        Hak Akses Hari Ini
                                    </p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <Calendar className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {realTimeData.absensi_hari_ini}
                                    </p>
                                    <p className="text-sm font-medium text-purple-800">
                                        Absensi Hari Ini
                                    </p>
                                    <div className="mt-1 flex items-center gap-1">
                                        <div
                                            className={`h-2 w-2 rounded-full ${realTimeData.absensi_hari_ini > 0 ? 'bg-green-500' : 'bg-gray-300'}`}
                                        />
                                        <span className="text-xs text-muted-foreground">
                                            Live
                                        </span>
                                    </div>
                                </div>
                                <div className="rounded-full bg-purple-100 p-3">
                                    <Activity className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-orange-600">
                                        {realTimeData.sedang_akses}
                                    </p>
                                    <p className="text-sm font-medium text-orange-800">
                                        Sedang Mengakses
                                    </p>
                                    <div className="mt-1 flex items-center gap-1">
                                        <div
                                            className={`h-2 w-2 rounded-full ${realTimeData.sedang_akses > 0 ? 'animate-pulse bg-orange-500' : 'bg-gray-300'}`}
                                        />
                                        <span className="text-xs text-muted-foreground">
                                            Live
                                        </span>
                                    </div>
                                </div>
                                <div className="rounded-full bg-orange-100 p-3">
                                    <Users className="h-6 w-6 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Ruangan Dijaga & Scanner Status */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Ruangan yang Dijaga
                            </CardTitle>
                            <CardDescription>
                                Daftar ruangan yang menjadi tanggung jawab Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {ruanganDijaga.map((ruangan) => (
                                    <Link
                                        key={ruangan.id}
                                        href={`/penjaga/ruangan/${ruangan.id}`}
                                        className="block rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium">
                                                    {ruangan.nama_ruangan}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    <Badge
                                                        variant="outline"
                                                        className="mr-2"
                                                    >
                                                        {ruangan.type}
                                                    </Badge>
                                                    {ruangan.absensi_hari_ini}{' '}
                                                    absensi •{' '}
                                                    {ruangan.scanner_aktif}/
                                                    {ruangan.total_scanner}{' '}
                                                    scanner aktif
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-2">
                                                    {ruangan.sedang_akses >
                                                        0 && (
                                                        <Badge variant="default">
                                                            {
                                                                ruangan.sedang_akses
                                                            }{' '}
                                                            akses
                                                        </Badge>
                                                    )}
                                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Scanner Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Scan className="h-5 w-5" />
                                Status Scanner
                                <Badge variant="outline">
                                    {
                                        scannerStatus.filter(
                                            (s) =>
                                                s.last &&
                                                new Date(s.last) >=
                                                    new Date(
                                                        Date.now() -
                                                            24 * 60 * 60 * 1000,
                                                    ),
                                        ).length
                                    }
                                    /{scannerStatus.length} aktif
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                                Status scanner di ruangan Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {scannerStatus.slice(0, 5).map((scanner) => {
                                    const isActive =
                                        scanner.last &&
                                        new Date(scanner.last) >=
                                            new Date(
                                                Date.now() -
                                                    24 * 60 * 60 * 1000,
                                            );
                                    return (
                                        <div
                                            key={scanner.id}
                                            className="flex items-center justify-between rounded-lg border p-2"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`h-3 w-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                                                />
                                                <div>
                                                    <div className="text-sm font-medium">
                                                        {scanner.kode}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {
                                                            scanner.ruangan
                                                                ?.nama_ruangan
                                                        }{' '}
                                                        • {scanner.type}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={
                                                    isActive
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                                className="text-xs"
                                            >
                                                {isActive ? 'Aktif' : 'Offline'}
                                            </Badge>
                                        </div>
                                    );
                                })}
                                {scannerStatus.length === 0 && (
                                    <div className="py-4 text-center text-muted-foreground">
                                        <Scanner className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                        <p className="text-sm">
                                            Tidak ada scanner terpasang
                                        </p>
                                    </div>
                                )}
                                {scannerStatus.length > 5 && (
                                    <div className="text-center">
                                        <Button variant="ghost" size="sm">
                                            +{scannerStatus.length - 5} scanner
                                            lainnya
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Hak Akses Mendatang & Grafik */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Hak Akses Mendatang
                            </CardTitle>
                            <CardDescription>
                                Jadwal akses ruangan yang akan datang
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {hakAksesMendatang.map((hakAkses) => (
                                    <div
                                        key={hakAkses.id}
                                        className="rounded-lg border p-3"
                                    >
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-sm font-medium">
                                                {hakAkses.ruangan.nama_ruangan}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {new Date(
                                                    hakAkses.tanggal,
                                                ).toLocaleDateString('id-ID')}
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {hakAkses.jam_masuk} -{' '}
                                            {hakAkses.jam_keluar}
                                        </div>
                                        <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                                            {hakAkses.tujuan}
                                        </div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-xs">
                                                {hakAkses.mahasiswas?.length ||
                                                    0}{' '}
                                                peserta
                                            </span>
                                            <CheckCircle className="h-3 w-3 text-green-500" />
                                        </div>
                                    </div>
                                ))}
                                {hakAksesMendatang.length === 0 && (
                                    <div className="py-4 text-center text-muted-foreground">
                                        <Calendar className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                        <p>Tidak ada jadwal mendatang</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4">
                                <Link href="/penjaga/hak-akses">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                    >
                                        Lihat Semua Hak Akses
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Grafik Absensi 7 Hari */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Trend Absensi 7 Hari
                            </CardTitle>
                            <CardDescription>
                                Perkembangan absensi di ruangan Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex h-40 items-end justify-between gap-1">
                                    {charts.absensi_7_hari.data.map(
                                        (value, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-1 flex-col items-center"
                                            >
                                                <div
                                                    className="w-full rounded-t bg-blue-500 transition-all duration-300 hover:bg-blue-600"
                                                    style={{
                                                        height: `${Math.max(10, (value / Math.max(...charts.absensi_7_hari.data.filter((v) => v > 0)) || 1) * 100)}%`,
                                                    }}
                                                    title={`${value} absensi`}
                                                />
                                                <span className="mt-1 text-xs text-muted-foreground">
                                                    {
                                                        charts.absensi_7_hari
                                                            .labels[index]
                                                    }
                                                </span>
                                            </div>
                                        ),
                                    )}
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>
                                        Total:{' '}
                                        {charts.absensi_7_hari.data.reduce(
                                            (a, b) => a + b,
                                            0,
                                        )}{' '}
                                        absensi
                                    </span>
                                    <span>
                                        Rata-rata:{' '}
                                        {Math.round(
                                            charts.absensi_7_hari.data.reduce(
                                                (a, b) => a + b,
                                                0,
                                            ) / 7,
                                        )}
                                        /hari
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Aktivitas Terkini */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Aktivitas Terkini
                            <div className="flex items-center gap-1">
                                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                                <span className="text-xs text-muted-foreground">
                                    Live
                                </span>
                            </div>
                        </CardTitle>
                        <CardDescription>
                            Aktivitas absensi terbaru di ruangan Anda
                        </CardDescription>
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
                                                    : 'animate-pulse bg-yellow-500'
                                            }`}
                                        />
                                        <div>
                                            <div className="text-sm font-medium">
                                                {absensi.nama ||
                                                    'Tidak Diketahui'}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {absensi.ruangan.nama_ruangan}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium">
                                            {formatTime(absensi.waktu_masuk)}
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
                                    <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                    <p>Belum ada aktivitas hari ini</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-4">
                            <Link href="/penjaga/absensi">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                >
                                    Lihat Semua Absensi
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
