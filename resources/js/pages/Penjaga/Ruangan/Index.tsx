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
import { type Ruangan } from '@/types/ruangan';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    BarChart3,
    Building,
    Calendar,
    Scan,
    Shield,
    Users,
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
];

interface Props {
    ruanganDijaga: Ruangan[];
    statistics: {
        total_ruangan: number;
        total_absensi_hari_ini: number;
        total_sedang_akses: number;
        total_hak_akses_hari_ini: number;
    };
}

export default function RuanganPenjagaIndex({
    ruanganDijaga,
    statistics,
}: Props) {
    const getRuanganTypeBadge = (type: string) => {
        const variants = {
            umum: 'bg-gray-100 text-gray-800 border-gray-200',
            kelas: 'bg-blue-100 text-blue-800 border-blue-200',
            lab: 'bg-purple-100 text-purple-800 border-purple-200',
        } as const;

        const variantClass =
            variants[type as keyof typeof variants] || variants.umum;

        return (
            <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantClass}`}
            >
                {type.toUpperCase()}
            </span>
        );
    };

    const getStatusBadge = (ruangan: Ruangan) => {
        if (ruangan.open_api) {
            return <Badge variant="default">🟢 Terbuka</Badge>;
        }
        return <Badge variant="secondary">🔒 Tertutup</Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ruangan Saya - Penjaga" />

            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                            <Shield className="h-8 w-8" />
                            Ruangan yang Dijaga
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola ruangan yang menjadi tanggung jawab Anda
                        </p>
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
                                        Total Ruangan
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
                                        {statistics.total_absensi_hari_ini}
                                    </p>
                                    <p className="text-sm font-medium text-green-800">
                                        Absensi Hari Ini
                                    </p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <Activity className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-orange-600">
                                        {statistics.total_sedang_akses}
                                    </p>
                                    <p className="text-sm font-medium text-orange-800">
                                        Sedang Mengakses
                                    </p>
                                </div>
                                <div className="rounded-full bg-orange-100 p-3">
                                    <Users className="h-6 w-6 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {statistics.total_hak_akses_hari_ini}
                                    </p>
                                    <p className="text-sm font-medium text-purple-800">
                                        Hak Akses Hari Ini
                                    </p>
                                </div>
                                <div className="rounded-full bg-purple-100 p-3">
                                    <Calendar className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Ruangan List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Ruangan</CardTitle>
                        <CardDescription>
                            {ruanganDijaga.length} ruangan yang menjadi tanggung
                            jawab Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {ruanganDijaga.map((ruangan) => (
                                <div
                                    key={ruangan.id}
                                    className="rounded-lg border p-6 transition-shadow hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="mb-3 flex items-center gap-3">
                                                <div className="rounded-lg bg-blue-100 p-2">
                                                    <Building className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold">
                                                        {ruangan.nama_ruangan}
                                                    </h3>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        {getRuanganTypeBadge(
                                                            ruangan.type,
                                                        )}
                                                        {getStatusBadge(
                                                            ruangan,
                                                        )}
                                                        {ruangan.pin_active && (
                                                            <Badge variant="outline">
                                                                🔐 PIN Active
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ruangan Details */}
                                            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Activity className="h-4 w-4 text-green-600" />
                                                    <span>
                                                        {
                                                            ruangan.absensi_hari_ini
                                                        }{' '}
                                                        absensi hari ini
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Users className="h-4 w-4 text-orange-600" />
                                                    <span>
                                                        {ruangan.sedang_akses}{' '}
                                                        sedang mengakses
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Scan className="h-4 w-4 text-purple-600" />
                                                    <span>
                                                        {ruangan.total_scanner}{' '}
                                                        scanner (
                                                        {ruangan.scanner_aktif}{' '}
                                                        aktif)
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <BarChart3 className="h-4 w-4 text-blue-600" />
                                                    <span>
                                                        Kuota:{' '}
                                                        {ruangan.max_register}{' '}
                                                        orang
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Jam Operasional */}
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <span>🕒</span>
                                                    <span>
                                                        {ruangan.jam_buka} -{' '}
                                                        {ruangan.jam_tutup}
                                                    </span>
                                                </div>
                                                {ruangan.penanggung_jawab ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {Array.isArray(
                                                            ruangan.penanggung_jawab,
                                                        ) ? (
                                                            ruangan.penanggung_jawab.map(
                                                                (pj, index) => (
                                                                    <Badge
                                                                        key={
                                                                            index
                                                                        }
                                                                        variant="outline"
                                                                        className="text-xs"
                                                                    >
                                                                        {
                                                                            pj.label
                                                                        }
                                                                    </Badge>
                                                                ),
                                                            )
                                                        ) : (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {
                                                                    ruangan.penanggung_jawab
                                                                }
                                                            </Badge>
                                                        )}
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </div>
                                        </div>

                                        <div className="ml-4 flex flex-col gap-2">
                                            <Link
                                                href={`/penjaga/ruangan/${ruangan.id}`}
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                >
                                                    <Activity className="mr-2 h-4 w-4" />
                                                    Detail
                                                </Button>
                                            </Link>
                                            <Link
                                                href={`/penjaga/ruangan/${ruangan.id}/edit`}
                                            >
                                                <Button
                                                    size="sm"
                                                    className="w-full"
                                                >
                                                    <Building className="mr-2 h-4 w-4" />
                                                    Edit
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {ruanganDijaga.length === 0 && (
                                <div className="py-12 text-center">
                                    <Building className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-50" />
                                    <h3 className="mb-2 text-lg font-semibold text-muted-foreground">
                                        Belum Ada Ruangan
                                    </h3>
                                    <p className="mb-4 text-muted-foreground">
                                        Anda belum ditugaskan untuk menjaga
                                        ruangan apapun.
                                    </p>
                                    <Button variant="outline">
                                        Hubungi Administrator
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">
                                Kelola Hak Akses
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-3 text-sm text-muted-foreground">
                                Kelola jadwal akses untuk ruangan Anda
                            </p>
                            <Link href="/penjaga/hak-akses">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Lihat Hak Akses
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">
                                Lihat Absensi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-3 text-sm text-muted-foreground">
                                Pantau aktivitas absensi di ruangan Anda
                            </p>
                            <Link href="/penjaga/absensi">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                >
                                    <Activity className="mr-2 h-4 w-4" />
                                    Lihat Absensi
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Scanner</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-3 text-sm text-muted-foreground">
                                Monitor status scanner di ruangan Anda
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                disabled
                            >
                                <Scan className="mr-2 h-4 w-4" />
                                Lihat Scanner
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
