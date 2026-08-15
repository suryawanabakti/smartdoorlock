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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { PaginatedResponse, type BreadcrumbItem } from '@/types';
import { type Mahasiswa } from '@/types/mahasiswa';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Pagination } from '@/components/pagination';
import { ConfirmDialog } from '@/components/confirm-dialog';
import {
    Edit,
    FileUp,
    Plus,
    Search,
    ToggleLeft,
    ToggleRight,
    Trash2,
    User,
} from 'lucide-react';
import { useState } from 'react';

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

export default function DosenIndex({
    mahasiswas,
    filters,
    statusOptions,
    tahunOptions,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [tahunMasuk, setTahunMasuk] = useState(filters.tahun_masuk || '');
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [dosenToDelete, setDosenToDelete] = useState<Mahasiswa | null>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        file: null as File | null,
        ket: 'dsn',
    });

    const handleImport = (e: React.FormEvent) => {
        e.preventDefault();
        post('/mahasiswas/import', {
            data: {
                ...data,
                ket: 'dsn',
            },
            onSuccess: () => {
                setIsImportDialogOpen(false);
                reset();
            },
        });
    };

    const handleFilter = () => {
        const filterParams: Record<string, string> = {};
        if (search) filterParams.search = search;
        if (status !== '') filterParams.status = status;
        if (tahunMasuk) filterParams.tahun_masuk = tahunMasuk;

        router.get('/dosen-list', filterParams, {
            preserveState: true,
            replace: true,
        });
    };

    const deleteDosen = (dosen: Mahasiswa) => {
        setDosenToDelete(dosen);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (dosenToDelete) {
            router.delete(`/mahasiswas/${dosenToDelete.id}`);
            setDosenToDelete(null);
        }
    };

    const toggleStatus = (dosen: Mahasiswa) => {
        router.post(`/mahasiswas/${dosen.id}/toggle-status`);
    };

    const getStatusBadge = (status: number) => {
        return (
            <Badge variant={status ? 'default' : 'secondary'}>
                {status ? 'Aktif' : 'Nonaktif'}
            </Badge>
        );
    };

    const pageTitle = 'Manajemen Dosen / Staff';
    const pageSubtitle = 'Kelola data dosen / staff';
    const tableTitle = 'Daftar Dosen / Staff';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: pageTitle,
            href: '/dosen-list',
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
                description={`Apakah Anda yakin ingin menghapus Dosen / Staff ${dosenToDelete?.nama}? Tindakan ini tidak dapat dibatalkan.`}
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
                                    <DialogTitle>Import Data Dosen / Staff</DialogTitle>
                                    <DialogDescription>
                                        Pilih file Excel (.xlsx, .xls) atau CSV untuk diimport.
                                        Pastikan kolom sesuai dengan format Dosen / Staff.
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
                                            <p className="font-semibold mb-1">Format Kolom Dosen:</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                <li><strong>nama</strong>: Nama Lengkap</li>
                                                <li><strong>nidn</strong>: Nomor Induk (Unique)</li>
                                                <li><strong>id_tag</strong>: ID Tag RFID (Opsional)</li>
                                                <li><strong>tahun_gabung</strong>: Tahun</li>
                                                <li><strong>homebase</strong>: Nama Ruangan/Kelas</li>
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
                        <Link href="/mahasiswas/create?ket=dsn">
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
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="lg:col-span-2">
                                <Input
                                    placeholder="Cari berdasarkan nama, NIDN, atau ID Tag..."
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
                                value={tahunMasuk}
                                onValueChange={setTahunMasuk}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Tahun Gabung" />
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
                        <div className="rounded-md border w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Dosen / Staff</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Tahun Gabung</TableHead>
                                        <TableHead className="w-[120px] text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mahasiswas.data.map((dosen) => (
                                        <TableRow key={dosen.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
                                                        <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {dosen.nama}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {dosen.id_tag ||
                                                                'No Tag'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(
                                                    dosen.status,
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant="outline">
                                                    {dosen.tahun_masuk}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            toggleStatus(
                                                                dosen,
                                                            )
                                                        }
                                                        title={
                                                            dosen.status
                                                                ? 'Nonaktifkan'
                                                                : 'Aktifkan'
                                                        }
                                                    >
                                                        {dosen.status ? (
                                                            <ToggleRight className="h-4 w-4" />
                                                        ) : (
                                                            <ToggleLeft className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Link
                                                        href={`/mahasiswas/${dosen.id}/edit`}
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
                                                            deleteDosen(
                                                                dosen,
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
                                                colSpan={4}
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
