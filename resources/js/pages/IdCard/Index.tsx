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
import { type BreadcrumbItem } from '@/types';
import { type IdCard, type IdCardStatistics } from '@/types/id-card';
import { Head, router } from '@inertiajs/react';
import {
    BookOpen,
    Clock,
    CreditCard,
    GraduationCap,
    Hash,
    Search,
    ShieldAlert,
    ShieldCheck,
    ShieldOff,
    Wifi,
    WifiOff,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    idCards: {
        data: IdCard[];
        total: number;
        from: number;
        to: number;
        current_page: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    filters: {
        search?: string;
        status?: string;
        ket?: string;
        kategori?: string;
        tahun_masuk?: string;
    };
    statistics: IdCardStatistics;
    statusOptions: { value: string; label: string }[];
    ketOptions: { value: string; label: string }[];
    kategoriOptions: { value: string; label: string }[];
    tahunOptions: number[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'ID Card',
        href: '/id-cards',
    },
];

export default function IdCardIndex({
    idCards,
    filters,
    statistics,
    statusOptions,
    ketOptions,
    kategoriOptions,
    tahunOptions,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [ket, setKet] = useState(filters.ket || 'all');
    const [kategori, setKategori] = useState(filters.kategori || 'all');
    const [tahunMasuk, setTahunMasuk] = useState(filters.tahun_masuk || 'all');

    const handleFilter = () => {
        const filterParams: Record<string, string> = {};
        if (search) filterParams.search = search;
        if (status !== 'all') filterParams.status = status;
        if (ket !== 'all') filterParams.ket = ket;
        if (kategori !== 'all') filterParams.kategori = kategori;
        if (tahunMasuk !== 'all') filterParams.tahun_masuk = tahunMasuk;

        router.get('/id-cards', filterParams, {
            preserveState: true,
            replace: true,
        });
    };

    const getKategoriBadge = (kategori: string) => {
        switch (kategori) {
            case 'aktif':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        <Wifi className="h-3 w-3" />
                        Aktif
                    </span>
                );
            case 'jarang':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                        <Clock className="h-3 w-3" />
                        Jarang
                    </span>
                );
            case 'tidak_aktif':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                        <WifiOff className="h-3 w-3" />
                        Tidak Aktif
                    </span>
                );
            case 'belum_pernah':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                        <ShieldOff className="h-3 w-3" />
                        Belum Pernah
                    </span>
                );
            default:
                return null;
        }
    };

    const getKetBadge = (ket: string) => {
        if (ket === 'dsn') {
            return (
                <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
                    DSN
                </span>
            );
        }
        return (
            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                MHS
            </span>
        );
    };

    const getStatusBadge = (status: number) => {
        return status ? (
            <Badge
                variant="default"
                className="bg-green-600 hover:bg-green-700"
            >
                Aktif
            </Badge>
        ) : (
            <Badge variant="secondary">Nonaktif</Badge>
        );
    };

    const formatHari = (hari: number | null) => {
        if (hari === null) return '-';
        if (hari === 0) return 'Hari ini';
        if (hari === 1) return '1 hari lalu';
        return `${hari} hari lalu`;
    };

    const formatDate = (date: string | null) => {
        if (!date) return '-';
        const d = new Date(date);
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="ID Card" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            ID Card
                        </h1>
                        <p className="text-muted-foreground">
                            Pantau penggunaan seluruh ID Card yang terdaftar
                            dalam sistem
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <Card className="relative overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {statistics.cards_with_tag}
                                    </p>
                                    <p className="text-sm font-medium text-blue-800">
                                        Total ID Card
                                    </p>
                                    {statistics.cards_without_tag > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="mt-1 text-xs"
                                        >
                                            {statistics.cards_without_tag} tanpa
                                            tag
                                        </Badge>
                                    )}
                                </div>
                                <div className="rounded-full bg-blue-100 p-3">
                                    <CreditCard className="h-5 w-5 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-green-600">
                                        {statistics.aktif}
                                    </p>
                                    <p className="text-sm font-medium text-green-800">
                                        Aktif Digunakan
                                    </p>
                                    <p className="mt-0.5 text-xs text-green-600">
                                        &lt; 7 hari terakhir
                                    </p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <ShieldCheck className="h-5 w-5 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {statistics.jarang +
                                            statistics.tidak_aktif}
                                    </p>
                                    <p className="text-sm font-medium text-yellow-800">
                                        Kurang Aktif
                                    </p>
                                    <p className="mt-0.5 text-xs text-yellow-600">
                                        {statistics.jarang} jarang &bull;{' '}
                                        {statistics.tidak_aktif} tidak aktif
                                    </p>
                                </div>
                                <div className="rounded-full bg-yellow-100 p-3">
                                    <ShieldAlert className="h-5 w-5 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-gray-600">
                                        {statistics.belum_pernah}
                                    </p>
                                    <p className="text-sm font-medium text-gray-800">
                                        Belum Digunakan
                                    </p>
                                    <p className="mt-0.5 text-xs text-gray-500">
                                        Tidak ada riwayat scan
                                    </p>
                                </div>
                                <div className="rounded-full bg-gray-100 p-3">
                                    <ShieldOff className="h-5 w-5 text-gray-600" />
                                </div>
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
                            <Select
                                value={kategori}
                                onValueChange={setKategori}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Kategori Penggunaan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kategoriOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={ket} onValueChange={setKet}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Jenis" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ketOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={tahunMasuk}
                                onValueChange={setTahunMasuk}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Tahun Masuk" />
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
                        <div className="mt-4 flex justify-end">
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
                        <CardTitle>Daftar ID Card</CardTitle>
                        <CardDescription>
                            Menampilkan {idCards.from} hingga {idCards.to} dari{' '}
                            {idCards.total} ID Card terdaftar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full overflow-x-auto rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="min-w-[200px]">
                                            Pemilik
                                        </TableHead>
                                        <TableHead className="min-w-[120px]">
                                            ID Tag
                                        </TableHead>
                                        <TableHead className="min-w-[100px]">
                                            Jenis
                                        </TableHead>
                                        <TableHead className="min-w-[80px]">
                                            Status
                                        </TableHead>
                                        <TableHead className="min-w-[140px]">
                                            Kategori
                                        </TableHead>

                                        <TableHead className="min-w-[120px]">
                                            Scan Terakhir
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {idCards.data.map((card) => (
                                        <TableRow key={card.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
                                                        {card.ket === 'dsn' ? (
                                                            <BookOpen className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                        ) : (
                                                            <GraduationCap className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {card.nama}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {card.nim}
                                                            {card.ruangan_nama &&
                                                                ` \u2022 ${card.ruangan_nama}`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <Hash className="h-3 w-3 text-muted-foreground" />
                                                    <span className="font-mono text-sm">
                                                        {card.id_tag}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getKetBadge(card.ket)}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(card.status)}
                                            </TableCell>
                                            <TableCell>
                                                {getKategoriBadge(
                                                    card.kategori_penggunaan,
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <div>
                                                    <div className="text-sm">
                                                        {formatDate(
                                                            card.last_scan,
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {formatHari(
                                                            card.hari_sejak_scan,
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {idCards.data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className="py-12 text-center text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="rounded-full bg-gray-100 p-4 dark:bg-neutral-800">
                                                        <CreditCard className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">
                                                            Tidak ada ID Card
                                                            ditemukan
                                                        </p>
                                                        <p className="mt-1 text-sm">
                                                            Pastikan sudah
                                                            mendaftarkan ID Tag
                                                            pada data mahasiswa
                                                            atau dosen
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
                            links={idCards.links}
                            meta={{
                                from: idCards.from,
                                to: idCards.to,
                                total: idCards.total,
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
