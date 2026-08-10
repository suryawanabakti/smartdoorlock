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
    Calendar,
    Clock,
    Download,
    Eye,
    Filter,
    Search,
    Trash2,
    User,
    Users,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Data Absensi',
        href: '/absensi',
    },
];

interface Props {
    absensis: PaginatedResponse<Absensi>;
    filters: {
        search?: string;
        ruangan_id?: string;
        tahun?: string;
        status?: string;
        tanggal_mulai?: string;
        tanggal_selesai?: string;
        hari_ini?: boolean;
    };
    statistics: {
        total: number;
        hari_ini: number;
        sedang_akses: number;
    };
    ruangans: Ruangan[];
    statusOptions: { value: string; label: string }[];
    tahunOptions: string[];
}

export default function AbsensiIndex({
    absensis,
    filters,
    statistics,
    ruangans,
    statusOptions,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [ruanganId, setRuanganId] = useState(filters.ruangan_id || '');
    const [tahun, setTahun] = useState(filters.tahun || '');
    const [status, setStatus] = useState(filters.status || '');
    const [tanggalMulai, setTanggalMulai] = useState(
        filters.tanggal_mulai || '',
    );
    const [tanggalSelesai, setTanggalSelesai] = useState(
        filters.tanggal_selesai || '',
    );
    const [hariIni, setHariIni] = useState(filters.hari_ini || false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const handleFilter = () => {
        const filterParams: any = {};
        if (search) filterParams.search = search;
        if (ruanganId) filterParams.ruangan_id = ruanganId;
        if (tahun) filterParams.tahun = tahun;
        if (status) filterParams.status = status;
        if (tanggalMulai) filterParams.tanggal_mulai = tanggalMulai;
        if (tanggalSelesai) filterParams.tanggal_selesai = tanggalSelesai;
        if (hariIni) filterParams.hari_ini = true;

        router.get('/absensi', filterParams, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setRuanganId('');
        setTahun('');
        setStatus('');
        setTanggalMulai('');
        setTanggalSelesai('');
        setHariIni(false);
        router.get('/absensi');
    };

    const deleteAbsensi = (absensi: Absensi) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus data absensi ${absensi.nama || absensi.nim}?`,
            )
        ) {
            router.delete(`/absensi/${absensi.id}`);
        }
    };

    const exportData = () => {
        const filterParams: any = {};
        if (search) filterParams.search = search;
        if (ruanganId) filterParams.ruangan_id = ruanganId;
        if (tanggalMulai) filterParams.tanggal_mulai = tanggalMulai;
        if (tanggalSelesai) filterParams.tanggal_selesai = tanggalSelesai;

        router.get('/absensi/export', filterParams);
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
            return <Badge variant="default">✅ Selesai</Badge>;
        } else if (absensi.waktu_masuk) {
            return <Badge variant="secondary">🟡 Masuk</Badge>;
        }
        return <Badge variant="outline">⚪ Tidak Valid</Badge>;
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
            <Head title="Data Absensi" />

            <div className="flex flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Data Absensi
                        </h1>
                        <p className="text-muted-foreground">
                            Rekap data kehadiran dan akses ruangan
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={exportData}>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="rounded-full bg-blue-100 p-3">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {statistics.total}
                                    </p>
                                    <p className="text-sm text-blue-800">
                                        Total Absensi
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="rounded-full bg-green-100 p-3">
                                    <Calendar className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-green-600">
                                        {statistics.hari_ini}
                                    </p>
                                    <p className="text-sm text-green-800">
                                        Absensi Hari Ini
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="rounded-full bg-orange-100 p-3">
                                    <Activity className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-orange-600">
                                        {statistics.sedang_akses}
                                    </p>
                                    <p className="text-sm text-orange-800">
                                        Sedang Mengakses
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="md:col-span-2">
                                <Input
                                    placeholder="Cari berdasarkan nama, NIM, atau ID Tag..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) =>
                                        e.key === 'Enter' && handleFilter()
                                    }
                                />
                            </div>
                            <Select
                                value={ruanganId}
                                onValueChange={setRuanganId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Ruangan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Ruangan
                                    </SelectItem>
                                    {ruangans.map((ruangan) => (
                                        <SelectItem
                                            key={ruangan.id}
                                            value={ruangan.id.toString()}
                                        >
                                            {ruangan.nama_ruangan}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleFilter}>
                                <Search className="mr-2 h-4 w-4" />
                                Cari
                            </Button>
                        </div>

                        {/* Advanced Filters */}
                        <div className="mt-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    setShowAdvancedFilters(!showAdvancedFilters)
                                }
                                className="flex items-center gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                Filter Lanjutan
                                {showAdvancedFilters ? ' ↑' : ' ↓'}
                            </Button>

                            {showAdvancedFilters && (
                                <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg bg-muted p-4 md:grid-cols-4">
                                    <Select
                                        value={status}
                                        onValueChange={setStatus}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Status Absensi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Input
                                        type="date"
                                        value={tanggalMulai}
                                        onChange={(e) =>
                                            setTanggalMulai(e.target.value)
                                        }
                                        placeholder="Tanggal Mulai"
                                    />

                                    <Input
                                        type="date"
                                        value={tanggalSelesai}
                                        onChange={(e) =>
                                            setTanggalSelesai(e.target.value)
                                        }
                                        placeholder="Tanggal Selesai"
                                    />

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="hari_ini"
                                            checked={hariIni}
                                            onChange={(e) =>
                                                setHariIni(e.target.checked)
                                            }
                                            className="rounded border-gray-300"
                                        />
                                        <label
                                            htmlFor="hari_ini"
                                            className="text-sm"
                                        >
                                            Hari Ini Saja
                                        </label>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={handleFilter}
                                        >
                                            Terapkan Filter
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={clearFilters}
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                </div>
                            )}
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
                        <div className="rounded-md border w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Identitas</TableHead>
                                        <TableHead>Ruangan</TableHead>
                                        <TableHead>Waktu Masuk</TableHead>
                                        <TableHead>Waktu Keluar</TableHead>
                                        <TableHead>Durasi</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[120px] text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {absensis.data.map((absensi: any) => (
                                        <TableRow key={absensi.id}>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-blue-600" />
                                                        <span className="font-medium">
                                                            {absensi.user
                                                                ?.nama ||
                                                                'Tidak Diketahui'}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        NIM:{' '}
                                                        {absensi.user?.nim ||
                                                            '-'}
                                                    </div>
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
                                                        {String(
                                                            absensi.ruangan
                                                                .nama_ruangan,
                                                        )}
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
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/absensi/${absensi.id}`}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            title="Detail"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            deleteAbsensi(
                                                                absensi,
                                                            )
                                                        }
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
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
                                                    <Search className="h-8 w-8" />
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
