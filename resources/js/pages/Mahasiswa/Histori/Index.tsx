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
import type { HistoriStatistics } from '@/types/histori';
import { type Histori, type HistoriFilters } from '@/types/histori';
import {
    getStatusBadgeVariant,
    getStatusIcon,
    getStatusLabel,
} from '@/types/scaner-status';
import { Head, router } from '@inertiajs/react';
import {
    Building,
    Calendar,
    Clock,
    Filter,
    History,
    RefreshCw,
    Scan,
    Search,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/mahasiswa/dashboard',
    },
    {
        title: 'Riwayat Scan',
        href: '/mahasiswa/histori',
    },
];

interface Props {
    historis: PaginatedResponse<Histori>;
    filters: HistoriFilters;
    statistics: HistoriStatistics;
    statusOptions: { value: string; label: string }[];
    typeOptions: { value: string; label: string }[];
}

export default function MahasiswaHistoriIndex({
    historis,
    filters,
    statistics,
    statusOptions,
    typeOptions,
}: Props) {
    const [status, setStatus] = useState(filters.status || '');
    const [type, setType] = useState(filters.type || '');
    const [tanggalMulai, setTanggalMulai] = useState(
        filters.tanggal_mulai || '',
    );
    const [tanggalSelesai, setTanggalSelesai] = useState(
        filters.tanggal_selesai || '',
    );
    const [showFilters, setShowFilters] = useState(false);

    const handleFilter = () => {
        const filterParams: Record<string, string> = {};
        if (status !== '') filterParams.status = status;
        if (type) filterParams.type = type;
        if (tanggalMulai) filterParams.tanggal_mulai = tanggalMulai;
        if (tanggalSelesai) filterParams.tanggal_selesai = tanggalSelesai;

        router.get('/mahasiswa/histori', filterParams, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setStatus('');
        setType('');
        setTanggalMulai('');
        setTanggalSelesai('');
        router.get('/mahasiswa/histori');
    };

    const getStatusBadge = (status: number) => {
        const variant = getStatusBadgeVariant(status);
        const Icon = getStatusIcon(status);
        const label = getStatusLabel(status);

        return (
            <Badge variant={variant}>
                <Icon className="mr-1 h-4 w-4" />
                {label}
            </Badge>
        );
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
                            Aktivitas scanning pintu ruangan Anda
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className={showFilters ? 'bg-secondary' : ''}
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        {showFilters
                            ? 'Sembunyikan Filter'
                            : 'Tampilkan Filter'}
                    </Button>
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
                                {/* Status Section */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <RefreshCw className="h-3.5 w-3.5" />
                                        Status Scan
                                    </label>
                                    <Select
                                        value={status}
                                        onValueChange={setStatus}
                                    >
                                        <SelectTrigger className="bg-background">
                                            <SelectValue placeholder="Semua Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua Status
                                            </SelectItem>
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

                                {/* Type Section */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <Scan className="h-3.5 w-3.5" />
                                        Posisi Scanner
                                    </label>
                                    <Select
                                        value={type}
                                        onValueChange={setType}
                                    >
                                        <SelectTrigger className="bg-background">
                                            <SelectValue placeholder="Semua Posisi" />
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
                                            onChange={(e) =>
                                                setTanggalMulai(e.target.value)
                                            }
                                            className="bg-background"
                                        />
                                        <span className="text-muted-foreground">
                                            s/d
                                        </span>
                                        <Input
                                            type="date"
                                            value={tanggalSelesai}
                                            onChange={(e) =>
                                                setTanggalSelesai(
                                                    e.target.value,
                                                )
                                            }
                                            className="bg-background"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t pt-6">
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
                        <div className="hidden w-full overflow-x-auto rounded-md border md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Waktu Scan</TableHead>
                                        <TableHead>Scanner & Ruangan</TableHead>
                                        <TableHead>Status</TableHead>
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
                                                {getStatusBadge(histori.status)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {historis.data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={3}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <History className="h-8 w-8" />
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

                        {/* Mobile Card List */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {historis.data.map((histori) => (
                                <Card key={histori.id}>
                                    <CardContent className="space-y-3 p-4">
                                        <div className="flex items-start justify-between gap-2">
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
                                                    {formatTime(histori.waktu)}
                                                    {isToday(histori.waktu) && (
                                                        <Badge
                                                            variant="outline"
                                                            className="ml-1 h-4 px-1 py-0 text-[10px]"
                                                        >
                                                            Hari Ini
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                {getStatusBadge(histori.status)}
                                            </div>
                                        </div>

                                        <div className="flex items-start justify-between gap-2 border-t pt-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Scan className="h-4 w-4 text-blue-600" />
                                                    <span className="font-mono text-sm">
                                                        {histori.kode}
                                                    </span>
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
                                                {histori.scanner?.ruangan && (
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Building className="h-3 w-3" />
                                                        {
                                                            histori.scanner
                                                                .ruangan
                                                                .nama_ruangan
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {historis.data.length === 0 && (
                                <div className="py-8 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <History className="h-8 w-8" />
                                        <div>
                                            <p className="font-medium">
                                                Tidak ada data ditemukan
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
                            links={historis.links}
                            meta={{
                                from: historis.from,
                                to: historis.to,
                                total: historis.total,
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
