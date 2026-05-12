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
import { type HakAkses } from '@/types/hak-akses';
import { type Ruangan } from '@/types/ruangan';
import { Head, Link, router } from '@inertiajs/react';
import { Pagination } from '@/components/pagination';
import {
    Building,
    Calendar,
    CheckCircle,
    Clock,
    Edit,
    Eye,
    Plus,
    Search,
    Shield,
    Trash2,
    Users,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Penjaga',
        href: '/penjaga/dashboard',
    },
    {
        title: 'Hak Akses',
        href: '/penjaga/hak-akses',
    },
];

interface Props {
    hakAkses: PaginatedResponse<HakAkses>;
    filters: {
        search?: string;
        status?: string;
        tanggal?: string;
    };
    ruanganDijaga: Ruangan[];
    statistics: {
        total: number;
        approved: number;
        pending: number;
        today: number;
    };
}

export default function HakAksesPenjagaIndex({
    hakAkses,
    filters,
    ruanganDijaga,
    statistics,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [tanggal, setTanggal] = useState(filters.tanggal || '');

    const handleFilter = () => {
        const filterParams: any = {};
        if (search) filterParams.search = search;
        if (status !== 'all') filterParams.status = status;
        if (tanggal) filterParams.tanggal = tanggal;

        router.get('/penjaga/hak-akses', filterParams, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('all');
        setTanggal('');
        router.get('/penjaga/hak-akses');
    };

    const deleteHakAkses = (hakAkses: HakAkses) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus hak akses untuk ${hakAkses.ruangan?.nama_ruangan}?`,
            )
        ) {
            router.delete(`/penjaga/hak-akses/${hakAkses.id}`);
        }
    };

    const approveHakAkses = (hakAkses: HakAkses) => {
        if (confirm('Setujui hak akses ini?')) {
            router.post(`/penjaga/hak-akses/${hakAkses.id}/approve`);
        }
    };

    const rejectHakAkses = (hakAkses: HakAkses) => {
        if (confirm('Tolak hak akses ini?')) {
            router.post(`/penjaga/hak-akses/${hakAkses.id}/reject`);
        }
    };

    const getStatusBadge = (hakAkses: HakAkses) => {
        if (hakAkses.is_approve) {
            return <Badge variant="default">✅ Disetujui</Badge>;
        }
        return <Badge variant="outline">⏳ Menunggu</Badge>;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        });
    };

    const isToday = (dateString: string) => {
        return (
            new Date(dateString).toDateString() === new Date().toDateString()
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hak Akses - Penjaga" />

            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                            <Shield className="h-8 w-8" />
                            Manajemen Hak Akses
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola hak akses untuk ruangan yang Anda jaga
                        </p>
                    </div>
                    <Link href="/penjaga/hak-akses/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Hak Akses
                        </Button>
                    </Link>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {statistics.total}
                            </div>
                            <div className="text-sm text-blue-800">
                                Total Hak Akses
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {statistics.approved}
                            </div>
                            <div className="text-sm text-green-800">
                                Disetujui
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                                {statistics.pending}
                            </div>
                            <div className="text-sm text-yellow-800">
                                Menunggu
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {statistics.today}
                            </div>
                            <div className="text-sm text-purple-800">
                                Hari Ini
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
                                    placeholder="Cari berdasarkan tujuan atau nama mahasiswa..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) =>
                                        e.key === 'Enter' && handleFilter()
                                    }
                                />
                            </div>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Status
                                    </SelectItem>
                                    <SelectItem value="approved">
                                        Disetujui
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Menunggu
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleFilter}
                                    className="flex-1"
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    Cari
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Hak Akses</CardTitle>
                        <CardDescription>
                            Total {hakAkses.total} hak akses ditemukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ruangan & Jadwal</TableHead>
                                        <TableHead>Tujuan</TableHead>
                                        <TableHead>Peserta</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[180px] text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {hakAkses.data.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className={
                                                isToday(item.tanggal)
                                                    ? 'bg-blue-50'
                                                    : ''
                                            }
                                        >
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 font-medium">
                                                        <Building className="h-4 w-4 text-blue-600" />
                                                        {
                                                            item.ruangan
                                                                ?.nama_ruangan
                                                        }
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(
                                                            item.tanggal,
                                                        )}
                                                        {isToday(
                                                            item.tanggal,
                                                        ) && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-xs"
                                                            >
                                                                Hari Ini
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        {item.jam_masuk} -{' '}
                                                        {item.jam_keluar}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-xs">
                                                    <p className="line-clamp-2 font-medium">
                                                        {item.tujuan}
                                                    </p>
                                                    {item.skill && (
                                                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                                                            Skill: {item.skill}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-green-600" />
                                                    <span className="font-medium">
                                                        {item.mahasiswas
                                                            ?.length || 0}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(item)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/penjaga/hak-akses/${item.id}`}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            title="Detail"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/penjaga/hak-akses/${item.id}/edit`}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            title="Edit"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    {!item.is_approve && (
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() =>
                                                                approveHakAkses(
                                                                    item,
                                                                )
                                                            }
                                                            title="Setujui"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {item.is_approve && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                rejectHakAkses(
                                                                    item,
                                                                )
                                                            }
                                                            title="Tolak"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            deleteHakAkses(item)
                                                        }
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {hakAkses.data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <Calendar className="h-8 w-8" />
                                                    <div>
                                                        <p className="font-medium">
                                                            Tidak ada hak akses
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
                            links={hakAkses.links}
                            meta={{ from: hakAkses.from, to: hakAkses.to, total: hakAkses.total }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
