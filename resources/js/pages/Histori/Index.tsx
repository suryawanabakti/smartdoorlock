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
import { type Histori } from '@/types/histori';
import { type Ruangan } from '@/types/ruangan';
import {
    getStatusBadgeVariant,
    getStatusIcon,
    getStatusLabel,
} from '@/types/scaner-status';
import { Head, router } from '@inertiajs/react';
import { Pagination } from '@/components/pagination';
import {
    BarChart3,
    Building,
    Calendar,
    Clock,
    Download,
    Filter,
    RefreshCw,
    Scan,
    Search,
    User,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Riwayat Scan',
        href: '/histori',
    },
];

interface Props {
    historis: PaginatedResponse<Histori>;
    filters: any;
    statistics: any;
    statusOptions: { value: string; label: string }[];
    ruangans: Ruangan[];
    typeOptions: { value: string; label: string }[];
    tahunOptions: number[];
    kelasOptions: Ruangan[];
}

export default function HistoriIndex({
    historis,
    filters,
    statistics,
    statusOptions,
    ruangans,
    typeOptions,
    tahunOptions,
    kelasOptions,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [ruanganId, setRuanganId] = useState(filters.ruangan_id || '');
    const [type, setType] = useState(filters.type || '');
    const [tanggalMulai, setTanggalMulai] = useState(
        filters.tanggal_mulai || '',
    );
    const [tanggalSelesai, setTanggalSelesai] = useState(
        filters.tanggal_selesai || '',
    );
    const [jamMulai, setJamMulai] = useState(filters.jam_mulai || '');
    const [jamSelesai, setJamSelesai] = useState(filters.jam_selesai || '');
    const [kelas, setKelas] = useState(filters.kelas || '');
    const [tahunMasuk, setTahunMasuk] = useState(filters.tahun_masuk || '');
    const [showFilters, setShowFilters] = useState(false);

    const handleFilter = () => {
        const filterParams: any = {};
        if (search) filterParams.search = search;
        if (status !== '') filterParams.status = status;
        if (ruanganId) filterParams.ruangan_id = ruanganId;
        if (type) filterParams.type = type;
        if (tanggalMulai) filterParams.tanggal_mulai = tanggalMulai;
        if (tanggalSelesai) filterParams.tanggal_selesai = tanggalSelesai;
        if (jamMulai) filterParams.jam_mulai = jamMulai;
        if (jamSelesai) filterParams.jam_selesai = jamSelesai;
        if (kelas) filterParams.kelas = kelas;
        if (tahunMasuk) filterParams.tahun_masuk = tahunMasuk;

        router.get('/histori', filterParams, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('');
        setRuanganId('');
        setType('');
        setTanggalMulai('');
        setTanggalSelesai('');
        setJamMulai('');
        setJamSelesai('');
        setKelas('');
        setTahunMasuk('');
        router.get('/histori');
    };

    const exportData = () => {
        const filterParams: any = {};
        if (search) filterParams.search = search;
        if (status !== '') filterParams.status = status;
        if (ruanganId) filterParams.ruangan_id = ruanganId;
        if (type) filterParams.type = type;
        if (tanggalMulai) filterParams.tanggal_mulai = tanggalMulai;
        if (tanggalSelesai) filterParams.tanggal_selesai = tanggalSelesai;
        if (jamMulai) filterParams.jam_mulai = jamMulai;
        if (jamSelesai) filterParams.jam_selesai = jamSelesai;
        if (kelas) filterParams.kelas = kelas;
        if (tahunMasuk) filterParams.tahun_masuk = tahunMasuk;

        const queryString = new URLSearchParams(filterParams).toString();
        window.location.href = `/histori/export?${queryString}`;
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

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isToday = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Scan" />

            <div className="flex flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Riwayat Scan
                        </h1>
                        <p className="text-muted-foreground">
                            Data lengkap aktivitas scanning pintu ruangan
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className={showFilters ? 'bg-secondary' : ''}
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            {showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
                        </Button>
                        <Button variant="default" onClick={exportData} className="bg-green-600 hover:bg-green-700">
                            <Download className="mr-2 h-4 w-4" />
                            Export Excel
                        </Button>
                    </div>
                </div>


                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {statistics.total}
                                </div>
                                <div className="text-sm text-blue-800">
                                    Total Scan
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {statistics.terbuka}
                                </div>
                                <div className="text-sm text-green-800">
                                    ✅ Terbuka
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {statistics.blok}
                                </div>
                                <div className="text-sm text-red-800">
                                    🚫 Blok
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {statistics.tidak_terdaftar}
                                </div>
                                <div className="text-sm text-yellow-800">
                                    ❓ Tidak Terdaftar
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-600">
                                    {statistics.no_akses}
                                </div>
                                <div className="text-sm text-gray-800">
                                    ⛔ No Akses
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                {showFilters && (
                    <Card className="border-blue-100 bg-blue-50/30 shadow-sm transition-all duration-300 dark:border-blue-900/30 dark:bg-blue-950/10">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Filter className="h-5 w-5 text-blue-600" />
                                Filter Data Riwayat
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {/* Search Section */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <Search className="h-3.5 w-3.5" />
                                        Pencarian Mahasiswa
                                    </label>
                                    <Input
                                        placeholder="Nama, NIM, atau ID Tag..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="bg-background"
                                    />
                                    <p className="text-[10px] text-muted-foreground">Cari berdasarkan nama, nim atau id tag</p>
                                </div>

                                {/* Status Section */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <RefreshCw className="h-3.5 w-3.5" />
                                        Status Scan
                                    </label>
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue placeholder="Semua Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Status</SelectItem>
                                            {statusOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Ruangan Section */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <Building className="h-3.5 w-3.5" />
                                        Filter Ruangan
                                    </label>
                                    <Select value={ruanganId} onValueChange={setRuanganId}>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue placeholder="Semua Ruangan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Ruangan</SelectItem>
                                            {ruangans.map((ruangan) => (
                                                <SelectItem key={ruangan.id} value={ruangan.id.toString()}>
                                                    {ruangan.nama_ruangan}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Type Section */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <Scan className="h-3.5 w-3.5" />
                                        Posisi Scanner
                                    </label>
                                    <Select value={type} onValueChange={setType}>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue placeholder="Semua Posisi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {typeOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-6 border-t pt-6 md:grid-cols-2 lg:grid-cols-4">
                                {/* Date Range */}
                                <div className="space-y-2 lg:col-span-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Rentang Tanggal Scan
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="date"
                                            value={tanggalMulai}
                                            onChange={(e) => setTanggalMulai(e.target.value)}
                                            className="bg-background"
                                        />
                                        <span className="text-muted-foreground">s/d</span>
                                        <Input
                                            type="date"
                                            value={tanggalSelesai}
                                            onChange={(e) => setTanggalSelesai(e.target.value)}
                                            className="bg-background"
                                        />
                                    </div>
                                </div>

                                {/* Time Range */}
                                <div className="space-y-2 lg:col-span-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <Clock className="h-3.5 w-3.5" />
                                        Rentang Waktu Scan
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="time"
                                            value={jamMulai}
                                            onChange={(e) => setJamMulai(e.target.value)}
                                            className="bg-background"
                                        />
                                        <span className="text-muted-foreground">s/d</span>
                                        <Input
                                            type="time"
                                            value={jamSelesai}
                                            onChange={(e) => setJamSelesai(e.target.value)}
                                            className="bg-background"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-6 border-t pt-6 md:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <Building className="h-3.5 w-3.5" />
                                        Filter Kelas
                                    </label>
                                    <Select value={kelas} onValueChange={setKelas}>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue placeholder="Semua Kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Kelas</SelectItem>
                                            {kelasOptions.map((kelas) => (
                                                <SelectItem key={kelas.id} value={kelas.id.toString()}>
                                                    {kelas.nama_ruangan}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Tahun Masuk
                                    </label>
                                    <Select value={tahunMasuk} onValueChange={setTahunMasuk}>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue placeholder="Semua Angkatan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Angkatan</SelectItem>
                                            {tahunOptions.map((tahun) => (
                                                <SelectItem key={tahun} value={tahun.toString()}>
                                                    {tahun}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="px-6"
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Reset Semua
                                </Button>
                                <Button
                                    onClick={handleFilter}
                                    className="bg-blue-600 px-8 hover:bg-blue-700"
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    Terapkan Filter
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}


                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Data Riwayat Scan</CardTitle>
                        <CardDescription>
                            Menampilkan {historis.from} - {historis.to} dari{' '}
                            {historis.total} data
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Waktu Scan</TableHead>
                                        <TableHead>Scanner & Ruangan</TableHead>
                                        <TableHead>ID Tag</TableHead>
                                        <TableHead>Mahasiswa</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Detail</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {historis.data.map((histori) => (
                                        <TableRow key={histori.id}>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-gray-500" />
                                                        <span className="font-medium">
                                                            {new Date(
                                                                histori.waktu,
                                                            ).toLocaleDateString(
                                                                'id-ID',
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        {formatTime(
                                                            histori.waktu,
                                                        )}
                                                        {isToday(
                                                            histori.waktu,
                                                        ) && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                Hari Ini
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Scan className="h-4 w-4 text-blue-600" />
                                                        <span className="font-mono text-sm">
                                                            {histori.kode}
                                                        </span>
                                                    </div>
                                                    {histori.scanner
                                                        ?.ruangan && (
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Building className="h-3 w-3" />
                                                            {
                                                                histori.scanner
                                                                    .ruangan
                                                                    .nama_ruangan
                                                            }
                                                        </div>
                                                    )}
                                                    {histori.scanner && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {
                                                                histori.scanner
                                                                    .type
                                                            }
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">
                                                    {histori.id_tag}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {histori.nama ? (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-green-600" />
                                                            <span className="font-medium">
                                                                {histori.nama}
                                                            </span>
                                                        </div>
                                                        {histori.nim && (
                                                            <div className="font-mono text-sm text-muted-foreground">
                                                                NIM:{' '}
                                                                {histori.nim}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        -
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(histori.status)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1 text-xs text-muted-foreground">
                                                    <div>
                                                        Scanner: {histori.kode}
                                                    </div>
                                                    <div>
                                                        Waktu:{' '}
                                                        {formatDateTime(
                                                            histori.waktu,
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {historis.data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <BarChart3 className="h-8 w-8" />
                                                    <div>
                                                        <p className="font-medium">
                                                            Tidak ada data
                                                            ditemukan
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
                            links={historis.links}
                            meta={{ from: historis.from, to: historis.to, total: historis.total }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
