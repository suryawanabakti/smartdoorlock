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
import {
    Building,
    Calendar,
    Clock,
    Edit,
    Eye,
    Plus,
    Search,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Manajemen Hak Akses',
        href: '/hak-akses',
    },
];

interface Props {
    hakAkses: PaginatedResponse<HakAkses>;
    filters: {
        search?: string;
        status?: string;
        ruangan_id?: string;
        tanggal?: string;
        tahun?: string;
    };
    statusOptions: { value: string; label: string }[];
    ruangans: Ruangan[];
    tahunOptions: number[];
}

export default function HakAksesIndex({
    hakAkses,
    filters,
    statusOptions,
    ruangans,
    tahunOptions,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [ruanganId, setRuanganId] = useState(filters.ruangan_id || '');
    const [tanggal, setTanggal] = useState(filters.tanggal || '');
    const [tahun, setTahun] = useState(filters.tahun || '');

    const handleFilter = () => {
        const filterParams: any = {};
        if (search) filterParams.search = search;
        if (status) filterParams.status = status;
        if (ruanganId) filterParams.ruangan_id = ruanganId;
        if (tanggal) filterParams.tanggal = tanggal;
        if (tahun) filterParams.tahun = tahun;

        router.get('/hak-akses', filterParams, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('');
        setRuanganId('');
        setTanggal('');
        setTahun('');
        router.get('/hak-akses');
    };

    const deleteHakAkses = (hakAkses: HakAkses) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus hak akses untuk ${hakAkses.ruangan?.nama_ruangan} pada ${hakAkses.tanggal}?`,
            )
        ) {
            router.delete(`/hak-akses/${hakAkses.id}`);
        }
    };

    const getStatusBadge = (hakAkses: HakAkses) => {
        if (hakAkses.is_approve) {
            return <Badge variant="default">✅ Disetujui</Badge>;
        }
        return hakAkses.is_by_admin ? (
            <Badge variant="secondary">👨‍💼 Dibuat Admin</Badge>
        ) : (
            <Badge variant="outline">⏳ Menunggu</Badge>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const isPastDate = (dateString: string) => {
        return new Date(dateString) < new Date();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Hak Akses" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Manajemen Hak Akses
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola akses ruangan untuk mahasiswa
                        </p>
                    </div>
                    <Link href="/hak-akses/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Hak Akses
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                            <div className="lg:col-span-2">
                                <Input
                                    placeholder="Cari berdasarkan tujuan atau ruangan..."
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
                            <Select value={tahun} onValueChange={setTahun}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Tahun" />
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
                        <div className="mt-4 flex gap-2">
                            <Button onClick={handleFilter}>
                                <Search className="mr-2 h-4 w-4" />
                                Filter
                            </Button>
                            <Button variant="outline" onClick={clearFilters}>
                                Reset Filter
                            </Button>
                            {tanggal && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    Filter tanggal: {formatDate(tanggal)}
                                </div>
                            )}
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
                                        <TableHead className="w-[150px] text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {hakAkses.data.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className={
                                                isPastDate(item.tanggal)
                                                    ? 'bg-muted/50'
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
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        {item.jam_masuk} -{' '}
                                                        {item.jam_keluar}
                                                    </div>
                                                    {isPastDate(
                                                        item.tanggal,
                                                    ) && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            Sudah Lewat
                                                        </Badge>
                                                    )}
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
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-green-600" />
                                                        <span className="font-medium">
                                                            {item.mahasiswas
                                                                ?.length || 0}
                                                        </span>
                                                    </div>

                                                    {item.mahasiswas &&
                                                        item.mahasiswas.length >
                                                            0 && (
                                                            <div className="text-xs">
                                                                {item.mahasiswas
                                                                    .slice(0, 2)
                                                                    .map(
                                                                        (m) =>
                                                                            m.nama,
                                                                    )
                                                                    .join(', ')}
                                                                {item.mahasiswas
                                                                    .length >
                                                                    2 &&
                                                                    ` +${item.mahasiswas.length - 2} lainnya`}
                                                            </div>
                                                        )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(item)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/hak-akses/${item.id}`}
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
                                                        href={`/hak-akses/${item.id}/edit`}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            title="Edit"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
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
                        {hakAkses.links.length > 3 && (
                            <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {hakAkses.from} hingga{' '}
                                    {hakAkses.to} dari {hakAkses.total} hasil
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {hakAkses.links.map((link, index) => (
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
