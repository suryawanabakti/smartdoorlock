import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { PaginatedResponse, type BreadcrumbItem } from '@/types';
import { type Absensi } from '@/types/absensi';
import { Head, router } from '@inertiajs/react';
import {
    Building,
    ClipboardCheck,
    Clock,
    DoorOpen,
    Search,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/mahasiswa/dashboard',
    },
    {
        title: 'Absensi',
        href: '/mahasiswa/absensi',
    },
];

interface Props {
    absensis: PaginatedResponse<Absensi>;
    filters: {
        tanggal?: string;
        status?: string;
    };
    statistics: {
        total: number;
        hari_ini: number;
        sedang_akses: number;
    };
}

export default function MahasiswaAbsensiIndex({
    absensis,
    filters,
    statistics,
}: Props) {
    const [tanggal, setTanggal] = useState(filters.tanggal || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = () => {
        const filterParams: Record<string, string> = {};
        if (tanggal) filterParams.tanggal = tanggal;
        if (status && status !== 'all') filterParams.status = status;

        router.get('/mahasiswa/absensi', filterParams, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setTanggal('');
        setStatus('');
        router.get('/mahasiswa/absensi');
    };

    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatTime = (dateString: string | null) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (absensi: Absensi) => {
        if (absensi.waktu_masuk && absensi.waktu_keluar) {
            return <Badge variant="default">Selesai</Badge>;
        } else if (absensi.waktu_masuk) {
            return <Badge variant="secondary">Masuk</Badge>;
        }
        return <Badge variant="outline">Tidak Valid</Badge>;
    };

    const getDurasi = (absensi: Absensi) => {
        if (absensi.waktu_masuk && absensi.waktu_keluar) {
            const masuk = new Date(absensi.waktu_masuk);
            const keluar = new Date(absensi.waktu_keluar);
            const diffMs = keluar.getTime() - masuk.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const hours = Math.floor(diffMins / 60);
            const minutes = diffMins % 60;
            return `${hours}j ${minutes}m`;
        }
        return '-';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Absensi - Mahasiswa" />

            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                            <ClipboardCheck className="h-8 w-8" />
                            Data Absensi
                        </h1>
                        <p className="text-muted-foreground">
                            Rekap kehadiran Anda
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Input
                                type="date"
                                value={tanggal}
                                onChange={(e) => setTanggal(e.target.value)}
                            />
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Status
                                    </SelectItem>
                                    <SelectItem value="masuk">Masuk</SelectItem>
                                    <SelectItem value="keluar">
                                        Selesai
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                >
                                    Reset
                                </Button>
                                <Button onClick={handleFilter}>
                                    <Search className="mr-2 h-4 w-4" />
                                    Filter
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Absensi</CardTitle>
                        <CardDescription>
                            Total {absensis.total} data absensi ditemukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="hidden w-full overflow-x-auto rounded-md border md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ruangan</TableHead>
                                        <TableHead>Waktu Masuk</TableHead>
                                        <TableHead>Waktu Keluar</TableHead>
                                        <TableHead>Durasi</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {absensis.data.map((absensi) => (
                                        <TableRow key={absensi.id}>
                                            <TableCell>
                                                {absensi.ruangan
                                                    ?.nama_ruangan ? (
                                                    <div className="flex items-center gap-2">
                                                        <Building className="h-4 w-4 text-gray-500" />
                                                        {
                                                            absensi.ruangan
                                                                .nama_ruangan
                                                        }
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        -
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-green-600" />
                                                    {formatTime(
                                                        absensi.waktu_masuk,
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {formatDateTime(
                                                        absensi.waktu_masuk,
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-red-600" />
                                                    {formatTime(
                                                        absensi.waktu_keluar,
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {formatDateTime(
                                                        absensi.waktu_keluar,
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-mono text-sm">
                                                    {getDurasi(absensi)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(absensi)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {absensis.data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <DoorOpen className="h-8 w-8" />
                                                    <div>
                                                        <p className="font-medium">
                                                            Tidak ada data
                                                            absensi ditemukan
                                                        </p>
                                                        <p className="text-sm">
                                                            Coba ubah filter
                                                            pencarian Anda
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Card List */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {absensis.data.map((absensi) => (
                                <Card key={absensi.id}>
                                    <CardContent className="space-y-3 p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="space-y-1">
                                                {absensi.ruangan
                                                    ?.nama_ruangan ? (
                                                    <div className="flex items-center gap-2 font-medium">
                                                        <Building className="h-4 w-4 text-gray-500" />
                                                        {
                                                            absensi.ruangan
                                                                .nama_ruangan
                                                        }
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        -
                                                    </span>
                                                )}
                                            </div>
                                            <div>{getStatusBadge(absensi)}</div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 border-t pt-3 text-sm">
                                            <div className="space-y-1">
                                                <div className="text-xs text-muted-foreground">
                                                    Waktu Masuk
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3.5 w-3.5 text-green-600" />
                                                    {formatTime(
                                                        absensi.waktu_masuk,
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-xs text-muted-foreground">
                                                    Waktu Keluar
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3.5 w-3.5 text-red-600" />
                                                    {formatTime(
                                                        absensi.waktu_keluar,
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t pt-3 text-sm">
                                            <span className="text-muted-foreground">
                                                Durasi
                                            </span>
                                            <span className="font-mono">
                                                {getDurasi(absensi)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {absensis.data.length === 0 && (
                                <div className="py-8 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <DoorOpen className="h-8 w-8" />
                                        <div>
                                            <p className="font-medium">
                                                Tidak ada data absensi ditemukan
                                            </p>
                                            <p className="text-sm">
                                                Coba ubah filter pencarian Anda
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            links={absensis.links}
                            meta={{
                                from: absensis.from,
                                to: absensis.to,
                                total: absensis.total,
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
