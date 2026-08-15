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
import { type Ruangan } from '@/types/ruangan';
import { Head, Link, router } from '@inertiajs/react';
import { Pagination } from '@/components/pagination';
import {
    Activity,
    Building,
    Clock,
    Eye,
    Search,
    Shield,
    User,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Penjaga',
        href: '/penjaga/dashboard',
    },
    {
        title: 'Absensi',
        href: '/penjaga/absensi',
    },
];

interface Props {
    absensis: PaginatedResponse<Absensi>;
    filters: {
        search?: string;
        ruangan_id?: string;
        tanggal?: string;
        status?: string;
    };
    statistics: {
        hari_ini: number;
        sedang_akses: number;
        total_ruangan: number;
    };
    ruanganDijaga: Ruangan[];
}

export default function AbsensiPenjagaIndex({
    absensis,
    filters,
    statistics,
    ruanganDijaga,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [ruanganId, setRuanganId] = useState(filters.ruangan_id || '');
    const [tanggal, setTanggal] = useState(filters.tanggal || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = () => {
        const filterParams: Record<string, string> = {};
        if (search) filterParams.search = search;
        if (ruanganId && ruanganId !== 'all') filterParams.ruangan_id = ruanganId;
        if (tanggal) filterParams.tanggal = tanggal;
        if (status && status !== 'all') filterParams.status = status;

        router.get('/penjaga/absensi', filterParams, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setRuanganId('');
        setTanggal('');
        setStatus('');
        router.get('/penjaga/absensi');
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
            <Head title="Absensi - Penjaga" />

            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                            <Shield className="h-8 w-8" />
                            Data Absensi
                        </h1>
                        <p className="text-muted-foreground">
                            Rekap kehadiran untuk ruangan yang Anda jaga
                        </p>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {statistics.total_ruangan}
                            </div>
                            <div className="text-sm text-blue-800">
                                Ruangan Dijaga
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {statistics.hari_ini}
                            </div>
                            <div className="text-sm text-green-800">
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
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                            <div className="lg:col-span-2">
                                <Input
                                    placeholder="Cari berdasarkan nama, NIM, atau ID Tag..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) =>
                                        e.key === 'Enter' && handleFilter()
                                    }
                                />
                            </div>
                            <Select value={ruanganId} onValueChange={setRuanganId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Ruangan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Ruangan
                                    </SelectItem>
                                    {ruanganDijaga.map((ruangan) => (
                                        <SelectItem
                                            key={ruangan.id}
                                            value={ruangan.id.toString()}
                                        >
                                            {ruangan.nama_ruangan}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                    <SelectItem value="masuk">
                                        Masuk
                                    </SelectItem>
                                    <SelectItem value="keluar">
                                        Selesai
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
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
                        <div className="w-full overflow-x-auto rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Identitas</TableHead>
                                        <TableHead>Ruangan</TableHead>
                                        <TableHead>Waktu Masuk</TableHead>
                                        <TableHead>Waktu Keluar</TableHead>
                                        <TableHead>Durasi</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[80px] text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {absensis.data.map((absensi) => (
                                        <TableRow key={absensi.id}>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-blue-600" />
                                                        <span className="font-medium">
                                                            {absensi.nama ||
                                                                'Tidak Diketahui'}
                                                        </span>
                                                    </div>
                                                    {absensi.nim && (
                                                        <div className="text-sm text-muted-foreground">
                                                            NIM:{' '}
                                                            {absensi.nim}
                                                        </div>
                                                    )}
                                                    <div className="font-mono text-xs text-muted-foreground">
                                                        Tag: {absensi.id_tag}
                                                    </div>
                                                </div>
                                            </TableCell>
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
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <Link
                                                        href={`/penjaga/absensi/${absensi.id}`}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            title="Detail"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {absensis.data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <Activity className="h-8 w-8" />
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

                        {/* Pagination */}
                        <Pagination
                            links={absensis.links}
                            meta={{ from: absensis.from, to: absensis.to, total: absensis.total }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
