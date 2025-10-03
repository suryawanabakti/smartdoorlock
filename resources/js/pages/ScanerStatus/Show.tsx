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
import { type Histori, type ScanerStatus } from '@/types/scaner-status';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building,
    Calendar,
    CheckCircle,
    Clock,
    Eye,
    Scan,
    XCircle,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Manajemen Scanner',
        href: '/scaner-status',
    },
    {
        title: 'Detail Scanner',
        href: '#',
    },
];

interface Props {
    scanerStatus: ScanerStatus;
    histories: Histori[];
}

export default function ScanerStatusShow({ scanerStatus, histories }: Props) {
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const getStatusBadge = (status: boolean) => {
        return (
            <Badge variant={status ? 'default' : 'destructive'}>
                {status ? (
                    <CheckCircle className="mr-1 h-3 w-3" />
                ) : (
                    <XCircle className="mr-1 h-3 w-3" />
                )}
                {status ? 'Berhasil' : 'Gagal'}
            </Badge>
        );
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} menit lalu`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} jam lalu`;

        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} hari lalu`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Scanner - ${scanerStatus.kode}`} />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/scaner-status">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Detail Scanner
                            </h1>
                            <p className="text-muted-foreground">
                                Informasi lengkap scanner {scanerStatus.kode}
                            </p>
                        </div>
                    </div>
                    <Link href={`/scaner-status/${scanerStatus.id}/edit`}>
                        <Button>Edit Scanner</Button>
                    </Link>
                </div>

                {/* Scanner Information */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Scan className="h-5 w-5" />
                                Informasi Scanner
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Kode Scanner
                                        </label>
                                        <p className="font-mono text-lg font-semibold">
                                            {scanerStatus.kode}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Type Scanner
                                        </label>
                                        <div className="mt-1">
                                            <Badge
                                                variant={
                                                    scanerStatus.type ===
                                                    'dalam'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {scanerStatus.type === 'dalam'
                                                    ? 'Scanner Dalam'
                                                    : 'Scanner Luar'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Status
                                        </label>
                                        <div className="mt-1">
                                            <Badge
                                                variant={
                                                    scanerStatus.last
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {scanerStatus.last
                                                    ? 'Aktif'
                                                    : 'Tidak Aktif'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Ruangan
                                        </label>
                                        <p className="text-lg font-semibold">
                                            {scanerStatus.ruangan ? (
                                                <div className="flex items-center gap-2">
                                                    <Building className="h-4 w-4" />
                                                    {
                                                        scanerStatus.ruangan
                                                            .nama_ruangan
                                                    }
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    Tidak terhubung ruangan
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Last Scan
                                        </label>
                                        <p className="text-lg font-semibold">
                                            {scanerStatus.last ? (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    {formatDateTime(
                                                        scanerStatus.last,
                                                    )}
                                                    <span className="text-sm text-muted-foreground">
                                                        (
                                                        {getTimeAgo(
                                                            scanerStatus.last,
                                                        )}
                                                        )
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    Belum ada scan
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Dibuat Pada
                                        </label>
                                        <p className="text-sm">
                                            {formatDateTime(
                                                scanerStatus.created_at,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Statistik
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="rounded-lg bg-blue-50 p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {histories.length}
                                    </div>
                                    <div className="text-sm text-blue-800">
                                        Total Scan
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-lg bg-green-50 p-3 text-center">
                                        <div className="text-lg font-bold text-green-600">
                                            {
                                                histories.filter(
                                                    (h) => h.status,
                                                ).length
                                            }
                                        </div>
                                        <div className="text-xs text-green-800">
                                            Berhasil
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-red-50 p-3 text-center">
                                        <div className="text-lg font-bold text-red-600">
                                            {
                                                histories.filter(
                                                    (h) => !h.status,
                                                ).length
                                            }
                                        </div>
                                        <div className="text-xs text-red-800">
                                            Gagal
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Scan History */}
                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat Scan Terbaru</CardTitle>
                        <CardDescription>
                            {histories.length} scan terakhir dari scanner ini
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {histories.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Waktu</TableHead>
                                            <TableHead>ID Tag</TableHead>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>NIM</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {histories.map((history) => (
                                            <TableRow key={history.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-gray-500" />
                                                        {formatDateTime(
                                                            history.waktu,
                                                        )}
                                                    </div>
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
                                <Eye className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                <p className="font-medium">
                                    Belum ada riwayat scan
                                </p>
                                <p className="text-sm">
                                    Scanner belum digunakan untuk melakukan scan
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
