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
        // Implement export functionality
        alert('Fitur export akan diimplementasikan');
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
                            Data lengkap aktivitas scanning
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={exportData}>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Filter Data
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Pencarian
                                    </label>
                                    <Input
                                        placeholder="Cari ID Tag, Nama, NIM..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Status
                                    </label>
                                    <Select
                                        value={status}
                                        onValueChange={setStatus}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Semua Status" />
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
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Ruangan
                                    </label>
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
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Type Scanner
                                    </label>
                                    <Select
                                        value={type}
                                        onValueChange={setType}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Semua Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {typeOptions.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Tanggal Mulai
                                    </label>
                                    <Input
                                        type="date"
                                        value={tanggalMulai}
                                        onChange={(e) =>
                                            setTanggalMulai(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Tanggal Selesai
                                    </label>
                                    <Input
                                        type="date"
                                        value={tanggalSelesai}
                                        onChange={(e) =>
                                            setTanggalSelesai(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Jam Mulai
                                    </label>
                                    <Input
                                        type="time"
                                        value={jamMulai}
                                        onChange={(e) =>
                                            setJamMulai(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Jam Selesai
                                    </label>
                                    <Input
                                        type="time"
                                        value={jamSelesai}
                                        onChange={(e) =>
                                            setJamSelesai(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Kelas
                                    </label>
                                    <Select
                                        value={kelas}
                                        onValueChange={setKelas}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Semua Kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua Kelas
                                            </SelectItem>
                                            {kelasOptions.map((kelas) => (
                                                <SelectItem
                                                    key={kelas.id}
                                                    value={kelas.id.toString()}
                                                >
                                                    {kelas.nama_ruangan}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Tahun Masuk
                                    </label>
                                    <Select
                                        value={tahunMasuk}
                                        onValueChange={setTahunMasuk}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Semua Tahun" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua Tahun
                                            </SelectItem>
                                            {tahunOptions.map((tahun) => (
                                                <SelectItem
                                                    key={tahun}
                                                    value={tahun.toString()}
                                                >
                                                    {tahun}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Button onClick={handleFilter}>
                                    <Search className="mr-2 h-4 w-4" />
                                    Terapkan Filter
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Reset Filter
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
                        <div className="rounded-md border">
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
                        {historis.links.length > 3 && (
                            <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {historis.from} hingga{' '}
                                    {historis.to} dari {historis.total} hasil
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {historis.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={
                                                link.active
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() =>
                                                router.get(link.url!)
                                            }
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                            className={
                                                link.active
                                                    ? 'bg-primary text-primary-foreground'
                                                    : ''
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
