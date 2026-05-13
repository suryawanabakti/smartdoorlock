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
import { Pagination } from '@/components/pagination';
import {
    BookOpen,
    Edit,
    Plus,
    Search,
    ToggleLeft,
    ToggleRight,
    Trash2,
    User,
    FileUp,
    Download
} from 'lucide-react';
import { useState, useRef } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';


// Breadcrumbs will be handled inside the component to be dynamic

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
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [mahasiswaToDelete, setMahasiswaToDelete] = useState<Mahasiswa | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const { data, setData, post, processing, reset, errors } = useForm({
        file: null as File | null,
        ket: filters.ket || 'mhs',
    });

    const handleImport = (e: React.FormEvent) => {
        e.preventDefault();
        post('/mahasiswas/import', {
            data: {
                ...data,
                ket: filters.ket || 'mhs',
            },
            onSuccess: () => {
                setIsImportDialogOpen(false);
                reset();
            },
        });
    };



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
        setMahasiswaToDelete(mahasiswa);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (mahasiswaToDelete) {
            router.delete(`/mahasiswas/${mahasiswaToDelete.id}`);
            setMahasiswaToDelete(null);
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

    const isMahasiswa = filters.ket === 'mhs';
    const isDosen = filters.ket === 'dsn';

    let pageTitle = 'Manajemen Mahasiswa & Dosen / Staff';
    let pageSubtitle = 'Kelola data mahasiswa dan dosen / staff';
    let tableTitle = 'Daftar Mahasiswa & Dosen / Staff';

    if (isMahasiswa) {
        pageTitle = 'Manajemen Mahasiswa';
        pageSubtitle = 'Kelola data mahasiswa';
        tableTitle = 'Daftar Mahasiswa';
    } else if (isDosen) {
        pageTitle = 'Manajemen Dosen / Staff';
        pageSubtitle = 'Kelola data dosen / staff';
        tableTitle = 'Daftar Dosen / Staff';
    }


    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: pageTitle,
            href: isMahasiswa
                ? '/mahasiswa-list'
                : isDosen
                    ? '/dosen-list'
                    : '/mahasiswas',
        },
    ];


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={pageTitle} />

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Data"
                description={`Apakah Anda yakin ingin menghapus ${mahasiswaToDelete?.ket === 'dsn' ? 'Dosen / Staff' : 'Mahasiswa'} ${mahasiswaToDelete?.nama}? Tindakan ini tidak dapat dibatalkan.`}
                variant="destructive"
                confirmText="Hapus"
            />


            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {pageTitle}
                        </h1>
                        <p className="text-muted-foreground">
                            {pageSubtitle}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <FileUp className="mr-2 h-4 w-4" />
                                    Import Excel
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Import Data {isDosen ? 'Dosen / Staff' : 'Mahasiswa'}</DialogTitle>
                                    <DialogDescription>
                                        Pilih file Excel (.xlsx, .xls) atau CSV untuk diimport.
                                        Pastikan kolom sesuai dengan format {isDosen ? 'Dosen / Staff' : 'Mahasiswa'}.
                                    </DialogDescription>
                                </DialogHeader>


                                <form onSubmit={handleImport}>
                                    <div className="grid gap-4 py-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium">File Excel/CSV</label>
                                            <Input
                                                type="file"
                                                accept=".xlsx,.xls,.csv"
                                                onChange={e => setData('file', e.target.files ? e.target.files[0] : null)}
                                            />
                                            {errors.file && <p className="text-sm text-red-500">{errors.file}</p>}
                                        </div>
                                        <div className="rounded-md bg-blue-50 p-3 text-xs text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                            <p className="font-semibold mb-1">Format Kolom {isDosen ? 'Dosen' : 'Mahasiswa'}:</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                <li><strong>nama</strong>: Nama Lengkap</li>
                                                <li><strong>{isDosen ? 'nidn / nim' : 'nim'}</strong>: Nomor Induk (Unique)</li>
                                                <li><strong>id_tag</strong>: ID Tag RFID (Opsional)</li>
                                                <li><strong>{isDosen ? 'tahun_gabung' : 'tahun_masuk'}</strong>: Tahun</li>
                                                <li><strong>{isDosen ? 'homebase / kelas' : 'kelas'}</strong>: Nama Ruangan/Kelas</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsImportDialogOpen(false)}>Batal</Button>
                                        <Button type="submit" disabled={processing || !data.file}>
                                            {processing ? 'Mengimport...' : 'Import Sekarang'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Link
                            href={`/mahasiswas/create${filters.ket ? `?ket=${filters.ket}` : ''}`}
                        >
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Data
                            </Button>
                        </Link>
                    </div>

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
                        <CardTitle>{tableTitle}</CardTitle>
                        <CardDescription>
                            Total {mahasiswas.total} data ditemukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{isDosen ? 'Dosen / Staff' : 'Mahasiswa'}</TableHead>
                                        <TableHead>{isDosen ? 'NIDN' : 'NIM'}</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>{isDosen ? 'Tahun Gabung' : 'Angkatan'}</TableHead>
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
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
                                                        {mahasiswa.ket ===
                                                            'dsn' ? (
                                                            <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                        ) : (
                                                            <BookOpen className="h-4 w-4 text-gray-600 dark:text-gray-400" />
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
                                                {getStatusBadge(
                                                    mahasiswa.status,
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant="outline">
                                                    {mahasiswa.tahun_masuk}
                                                </Badge>
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
                        <Pagination
                            links={mahasiswas.links}
                            meta={{ from: mahasiswas.from, to: mahasiswas.to, total: mahasiswas.total }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
