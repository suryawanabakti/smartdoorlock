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
import { type HakAkses } from '@/types/hak-akses';
import { type Mahasiswa } from '@/types/mahasiswa';
import { Head, Link, router } from '@inertiajs/react';
import {
    Building,
    Calendar,
    CheckCircle,
    Clock,
    Edit,
    Eye,
    GraduationCap,
    Plus,
    Search,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Mahasiswa',
        href: '/mahasiswa/dashboard',
    },
    {
        title: 'Hak Akses Saya',
        href: '/mahasiswa/hak-akses',
    },
];

interface Props {
    hakAkses: PaginatedResponse<HakAkses>;
    filters: {
        search?: string;
        status?: string;
    };
    statistics: {
        total: number;
        approved: number;
        pending: number;
    };
    mahasiswa: Mahasiswa;
}

export default function HakAksesMahasiswaIndex({
    hakAkses,
    filters,
    statistics,
    mahasiswa,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilter = () => {
        const filterParams: any = {};
        if (search) filterParams.search = search;
        if (status !== 'all') filterParams.status = status;

        router.get('/mahasiswa/hak-akses', filterParams, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('all');
        router.get('/mahasiswa/hak-akses');
    };

    const deleteHakAkses = (hakAkses: HakAkses) => {
        if (
            confirm(
                `Apakah Anda yakin ingin membatalkan permohonan hak akses untuk ${hakAkses.ruangan?.nama_ruangan}?`,
            )
        ) {
            router.delete(`/mahasiswa/hak-akses/${hakAkses.id}`);
        }
    };

    const getStatusBadge = (hakAkses: HakAkses) => {
        if (hakAkses.is_approve) {
            return (
                <Badge variant="default">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Disetujui
                </Badge>
            );
        }
        return (
            <Badge variant="outline">
                <Clock className="mr-1 h-4 w-4" />
                Menunggu Persetujuan
            </Badge>
        );
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

    const canEdit = (hakAkses: HakAkses) => {
        return !hakAkses.is_approve;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hak Akses Saya - Mahasiswa" />

            <div className="space-y-6 p-4">
                {/* Header */}
                <div>
                    <div>
                        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                            <GraduationCap className="h-8 w-8" />
                            Hak Akses Saya
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola permohonan hak akses ruangan yang Anda ajukan
                        </p>
                    </div>
                    <Link
                        href="/mahasiswa/hak-akses/create"
                        className="mt-4 inline-block"
                    >
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Ajukan Hak Akses
                        </Button>
                    </Link>
                    {/* <Link
                        href="/mahasiswa/hak-akses/available"
                        className="mt-4 ml-3 inline-block"
                    >
                        <Button>
                            <Check className="mr-2 h-4 w-4" />
                            Hak Akses Yang Tersedia
                        </Button>
                    </Link> */}
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="md:col-span-2">
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
                        <CardTitle>Daftar Permohonan Hak Akses</CardTitle>
                        <CardDescription>
                            Total {hakAkses.total} permohonan hak akses
                            ditemukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Desktop Table */}
                        <div className="hidden w-full overflow-x-auto rounded-md border md:block">
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
                                                isToday(item.tanggal)
                                                    ? 'bg-blue-50 dark:bg-blue-900/40'
                                                    : ''
                                            }
                                        >
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 font-medium text-foreground">
                                                        <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
                                                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground dark:text-muted-foreground/80">
                                                            Skill: {item.skill}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                    <span className="font-medium text-foreground">
                                                        {item.mahasiswas
                                                            ?.length || 0}
                                                    </span>
                                                </div>
                                                {item.mahasiswas &&
                                                    item.mahasiswas.length >
                                                        0 && (
                                                        <div className="mt-1 text-xs text-muted-foreground">
                                                            Termasuk Anda +{' '}
                                                            {item.mahasiswas
                                                                .length -
                                                                1}{' '}
                                                            teman
                                                        </div>
                                                    )}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(item)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/mahasiswa/hak-akses/${item.id}`}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            title="Detail"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    {canEdit(item) && (
                                                        <>
                                                            <Link
                                                                href={`/mahasiswa/hak-akses/${item.id}/edit`}
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
                                                                    deleteHakAkses(
                                                                        item,
                                                                    )
                                                                }
                                                                title="Batalkan"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
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
                                                            Belum ada permohonan
                                                            hak akses
                                                        </p>
                                                        <p className="text-sm">
                                                            <Link
                                                                href="/mahasiswa/hak-akses/create"
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                Ajukan hak akses
                                                                pertama Anda
                                                            </Link>
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
                            {hakAkses.data.map((item) => (
                                <Card
                                    key={item.id}
                                    className={
                                        isToday(item.tanggal)
                                            ? 'bg-blue-50 dark:bg-blue-900/40'
                                            : ''
                                    }
                                >
                                    <CardContent className="space-y-4 p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 font-medium text-foreground">
                                                    <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                    {item.ruangan?.nama_ruangan}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(item.tanggal)}
                                                    {isToday(item.tanggal) && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="ml-1 h-4 px-1 py-0 text-[10px]"
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
                                            <div>{getStatusBadge(item)}</div>
                                        </div>

                                        <div>
                                            <p className="line-clamp-2 text-sm font-medium">
                                                {item.tujuan}
                                            </p>
                                            {item.skill && (
                                                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                                                    Skill: {item.skill}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            <span className="font-medium text-foreground">
                                                {item.mahasiswas?.length || 0}{' '}
                                                Peserta
                                            </span>
                                            {item.mahasiswas &&
                                                item.mahasiswas.length > 0 && (
                                                    <span className="text-xs text-muted-foreground">
                                                        (Termasuk Anda +{' '}
                                                        {item.mahasiswas
                                                            .length - 1}{' '}
                                                        teman)
                                                    </span>
                                                )}
                                        </div>

                                        <div className="flex justify-end gap-2 border-t pt-2">
                                            <Link
                                                href={`/mahasiswa/hak-akses/${item.id}`}
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    title="Detail"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            {canEdit(item) && (
                                                <>
                                                    <Link
                                                        href={`/mahasiswa/hak-akses/${item.id}/edit`}
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
                                                        title="Batalkan"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {hakAkses.data.length === 0 && (
                                <div className="rounded-lg border border-dashed py-8 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <Calendar className="h-8 w-8" />
                                        <div>
                                            <p className="font-medium">
                                                Belum ada permohonan hak akses
                                            </p>
                                            <p className="text-sm">
                                                <Link
                                                    href="/mahasiswa/hak-akses/create"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Ajukan hak akses pertama
                                                    Anda
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            links={hakAkses.links}
                            meta={{
                                from: hakAkses.from,
                                to: hakAkses.to,
                                total: hakAkses.total,
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
