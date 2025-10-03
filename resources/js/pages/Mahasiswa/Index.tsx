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
import { type Mahasiswa } from '@/types/mahasiswa';
import { Head, Link, router } from '@inertiajs/react';
import {
    BookOpen,
    Edit,
    Plus,
    Search,
    ToggleLeft,
    ToggleRight,
    Trash2,
    User,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Manajemen Mahasiswa/Dosen',
        href: '/mahasiswas',
    },
];

interface Props {
    mahasiswas: PaginatedResponse<Mahasiswa>;
    filters: {
        search?: string;
        status?: string;
        ket?: string;
        tahun_masuk?: string;
    };
    statusOptions: { value: string; label: string }[];
    ketOptions: { value: string; label: string }[];
    tahunOptions: number[];
}

export default function MahasiswaIndex({
    mahasiswas,
    filters,
    statusOptions,
    ketOptions,
    tahunOptions,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [ket, setKet] = useState(filters.ket || '');
    const [tahunMasuk, setTahunMasuk] = useState(filters.tahun_masuk || '');

    const handleFilter = () => {
        const filterParams: any = {};
        if (search) filterParams.search = search;
        if (status !== '') filterParams.status = status;
        if (ket) filterParams.ket = ket;
        if (tahunMasuk) filterParams.tahun_masuk = tahunMasuk;

        router.get('/mahasiswas', filterParams, {
            preserveState: true,
            replace: true,
        });
    };

    const deleteMahasiswa = (mahasiswa: Mahasiswa) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus ${mahasiswa.ket} ${mahasiswa.nama}?`,
            )
        ) {
            router.delete(`/mahasiswas/${mahasiswa.id}`);
        }
    };

    const toggleStatus = (mahasiswa: Mahasiswa) => {
        router.post(`/mahasiswas/${mahasiswa.id}/toggle-status`);
    };

    const getStatusBadge = (status: number) => {
        return (
            <Badge variant={status ? 'default' : 'secondary'}>
                {status ? 'Aktif' : 'Nonaktif'}
            </Badge>
        );
    };

    const getKetBadge = (ket: string) => {
        const variants = {
            dsn: 'bg-purple-100 text-purple-800 border-purple-200',
            mhs: 'bg-blue-100 text-blue-800 border-blue-200',
        } as const;

        const variantClass =
            variants[ket as keyof typeof variants] || variants.mhs;

        return (
            <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantClass}`}
            >
                {ket.toUpperCase()}
            </span>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Mahasiswa/Dosen" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Manajemen Mahasiswa & Dosen
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola data mahasiswa dan dosen
                        </p>
                    </div>
                    <Link href="/mahasiswas/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Data
                        </Button>
                    </Link>
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
                        <CardTitle>Daftar Mahasiswa & Dosen</CardTitle>
                        <CardDescription>
                            Total {mahasiswas.total} data ditemukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Identitas</TableHead>
                                        <TableHead>NIM/NIDN</TableHead>
                                        <TableHead>Kelas/Ruangan</TableHead>
                                        <TableHead>Jenis</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Tahun</TableHead>
                                        <TableHead className="w-[120px] text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mahasiswas.data.map((mahasiswa) => (
                                        <TableRow key={mahasiswa.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                                                        {mahasiswa.ket ===
                                                        'dsn' ? (
                                                            <User className="h-4 w-4 text-gray-600" />
                                                        ) : (
                                                            <BookOpen className="h-4 w-4 text-gray-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {mahasiswa.nama}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {mahasiswa.id_tag ||
                                                                'No Tag'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono">
                                                {mahasiswa.nim}
                                            </TableCell>
                                            <TableCell>
                                                {mahasiswa.ruangan ? (
                                                    <div>
                                                        <div className="font-medium">
                                                            {
                                                                mahasiswa
                                                                    .ruangan
                                                                    .nama_ruangan
                                                            }
                                                        </div>
                                                        <div className="text-sm text-muted-foreground capitalize">
                                                            {
                                                                mahasiswa
                                                                    .ruangan
                                                                    .type
                                                            }
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        -
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {getKetBadge(mahasiswa.ket)}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(
                                                    mahasiswa.status,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {mahasiswa.tahun_masuk}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            toggleStatus(
                                                                mahasiswa,
                                                            )
                                                        }
                                                        title={
                                                            mahasiswa.status
                                                                ? 'Nonaktifkan'
                                                                : 'Aktifkan'
                                                        }
                                                    >
                                                        {mahasiswa.status ? (
                                                            <ToggleRight className="h-4 w-4" />
                                                        ) : (
                                                            <ToggleLeft className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Link
                                                        href={`/mahasiswas/${mahasiswa.id}/edit`}
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
                                                            deleteMahasiswa(
                                                                mahasiswa,
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
                                    {mahasiswas.data.length === 0 && (
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
                        {mahasiswas.links.length > 3 && (
                            <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {mahasiswas.from} hingga{' '}
                                    {mahasiswas.to} dari {mahasiswas.total}{' '}
                                    hasil
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {mahasiswas.links.map((link, index) => (
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
