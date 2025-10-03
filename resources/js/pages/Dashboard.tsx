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
import { type Absensi } from '@/types/absensi';
import { type DashboardData } from '@/types/dashboard';
import { type HakAkses } from '@/types/hak-akses';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    BarChart3,
    Building,
    Calendar,
    CheckCircle,
    Clock,
    DoorOpen,
    GraduationCap,
    Scan,
    Shield,
    TrendingUp,
    User,
    UserCheck,
    Users,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    statistics: DashboardData['statistics'];
    charts: DashboardData['charts'];
    aktivitas_terkini: Absensi[];
    hak_akses_mendatang: HakAkses[];
}

export default function Dashboard({
    statistics,
    charts,
    aktivitas_terkini,
    hak_akses_mendatang,
}: Props) {
    const formatTime = (dateString: string | null) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        });
    };

    // Chart colors
    const chartColors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-red-500',
        'bg-purple-500',
        'bg-indigo-500',
        'bg-pink-500',
        'bg-orange-500',
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            Overview sistem manajemen ruangan dan absensi
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/absensi">
                            <Button variant="outline">
                                <Activity className="mr-2 h-4 w-4" />
                                Lihat Absensi
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Absensi Hari Ini */}
                    <Card className="relative overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {statistics.absensi_hari_ini}
                                    </p>
                                    <p className="text-sm font-medium text-blue-800">
                                        Absensi Hari Ini
                                    </p>
                                    <Badge variant="secondary" className="mt-1">
                                        {statistics.sedang_akses} sedang akses
                                    </Badge>
                                </div>
                                <div className="rounded-full bg-blue-100 p-3">
                                    <UserCheck className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Users */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-green-600">
                                        {statistics.total_users}
                                    </p>
                                    <p className="text-sm font-medium text-green-800">
                                        Total Pengguna
                                    </p>
                                    <div className="mt-1 flex gap-1">
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            M: {statistics.total_mahasiswa}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            D: {statistics.total_dosen}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            P: {statistics.total_penjaga}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ruangan */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {statistics.total_ruangan}
                                    </p>
                                    <p className="text-sm font-medium text-purple-800">
                                        Total Ruangan
                                    </p>
                                    <Badge variant="secondary" className="mt-1">
                                        {statistics.ruangan_aktif} aktif
                                    </Badge>
                                </div>
                                <div className="rounded-full bg-purple-100 p-3">
                                    <Building className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Scanner */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-orange-600">
                                        {statistics.total_scanner}
                                    </p>
                                    <p className="text-sm font-medium text-orange-800">
                                        Total Scanner
                                    </p>
                                    <Badge variant="secondary" className="mt-1">
                                        {statistics.scanner_aktif} aktif
                                    </Badge>
                                </div>
                                <div className="rounded-full bg-orange-100 p-3">
                                    <Scan className="h-6 w-6 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Grafik Absensi 7 Hari */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Trend Absensi 7 Hari Terakhir
                            </CardTitle>
                            <CardDescription>
                                Perkembangan jumlah absensi dalam seminggu
                                terakhir
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
                                                        height: `${Math.max(10, (value / Math.max(...charts.absensi_7_hari.data)) * 100)}%`,
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

                    {/* Grafik Absensi per Ruangan Hari Ini */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DoorOpen className="h-5 w-5" />
                                Absensi per Ruangan (Hari Ini)
                            </CardTitle>
                            <CardDescription>
                                Distribusi absensi berdasarkan ruangan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {charts.absensi_per_ruangan
                                    .slice(0, 5)
                                    .map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`h-3 w-3 rounded-full ${chartColors[index % chartColors.length]}`}
                                                />
                                                <span className="text-sm font-medium">
                                                    {item.nama_ruangan}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">
                                                    {item.total}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {Math.round(
                                                        (item.total /
                                                            statistics.absensi_hari_ini) *
                                                            100,
                                                    )}
                                                    %
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                {charts.absensi_per_ruangan.length > 5 && (
                                    <div className="text-center text-sm text-muted-foreground">
                                        +{charts.absensi_per_ruangan.length - 5}{' '}
                                        ruangan lainnya
                                    </div>
                                )}
                                {charts.absensi_per_ruangan.length === 0 && (
                                    <div className="py-4 text-center text-muted-foreground">
                                        <Calendar className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                        <p>Belum ada absensi hari ini</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Aktivitas Terkini */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Aktivitas Terkini
                            </CardTitle>
                            <CardDescription>
                                10 absensi terbaru yang tercatat dalam sistem
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {aktivitas_terkini.map((absensi, index) => (
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
                                                    {absensi.user?.nama ||
                                                        'Tidak Diketahui'}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {absensi.ruangan
                                                        ?.nama_ruangan ||
                                                        'Ruangan tidak diketahui'}
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
                                {aktivitas_terkini.length === 0 && (
                                    <div className="py-4 text-center text-muted-foreground">
                                        <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                        <p>Belum ada aktivitas</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4">
                                <Link href="/absensi">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                    >
                                        Lihat Semua Aktivitas
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Hak Akses Mendatang */}
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
                                {hak_akses_mendatang.map((hakAkses, index) => (
                                    <div
                                        key={hakAkses.id}
                                        className="rounded-lg border p-3"
                                    >
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-sm font-medium">
                                                {hakAkses.ruangan?.nama_ruangan}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {formatDate(hakAkses.tanggal)}
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
                                {hak_akses_mendatang.length === 0 && (
                                    <div className="py-4 text-center text-muted-foreground">
                                        <Calendar className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                        <p>Tidak ada jadwal mendatang</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4">
                                <Link href="/hak-akses">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                    >
                                        Kelola Hak Akses
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle>Statistik Cepat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
                            <div className="rounded-lg bg-blue-50 p-4">
                                <User className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                                <div className="text-2xl font-bold text-blue-600">
                                    {statistics.total_mahasiswa}
                                </div>
                                <div className="text-sm text-blue-800">
                                    Mahasiswa
                                </div>
                            </div>
                            <div className="rounded-lg bg-green-50 p-4">
                                <GraduationCap className="mx-auto mb-2 h-8 w-8 text-green-600" />
                                <div className="text-2xl font-bold text-green-600">
                                    {statistics.total_dosen}
                                </div>
                                <div className="text-sm text-green-800">
                                    Dosen
                                </div>
                            </div>
                            <div className="rounded-lg bg-purple-50 p-4">
                                <Shield className="mx-auto mb-2 h-8 w-8 text-purple-600" />
                                <div className="text-2xl font-bold text-purple-600">
                                    {statistics.total_penjaga}
                                </div>
                                <div className="text-sm text-purple-800">
                                    Penjaga
                                </div>
                            </div>
                            <div className="rounded-lg bg-orange-50 p-4">
                                <BarChart3 className="mx-auto mb-2 h-8 w-8 text-orange-600" />
                                <div className="text-2xl font-bold text-orange-600">
                                    {statistics.hak_akses_hari_ini}
                                </div>
                                <div className="text-sm text-orange-800">
                                    Hak Akses Hari Ini
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
