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
import { Label } from '@/components/ui/label';
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
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select';
import AppLayout from '@/layouts/app-layout';
import { PaginatedResponse, type BreadcrumbItem } from '@/types';
import { type Mahasiswa } from '@/types/mahasiswa';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Pagination } from '@/components/pagination';
import { ConfirmDialog } from '@/components/confirm-dialog';
import {
    Building2,
    Edit,
    FileUp,
    Plus,
    Search,
    ToggleLeft,
    ToggleRight,
    Trash2,
    User,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface RuanganItem {
    id: number;
    nama_ruangan: string;
    type: string;
}

interface Props {
    mahasiswas: PaginatedResponse<Mahasiswa>;
    ruangans?: RuanganItem[];
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
    ruangans = [],
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

    // Bulk selection state
    const [selectedDosenIds, setSelectedDosenIds] = useState<number[]>([]);
    const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
    const [bulkRuanganOptions, setBulkRuanganOptions] = useState<MultiSelectOption[]>([]);
    const [bulkMode, setBulkMode] = useState<'add' | 'set' | 'remove'>('add');
    const [isSubmittingBulk, setIsSubmittingBulk] = useState(false);

    const allRuanganOptions: MultiSelectOption[] = useMemo(() => {
        return (ruangans || []).map((r) => ({
            value: r.id,
            label: `${r.nama_ruangan} (${r.type})`,
        }));
    }, [ruangans]);

    const allIdsOnPage = mahasiswas.data.map((d) => d.id);
    const isAllSelected =
        allIdsOnPage.length > 0 &&
        allIdsOnPage.every((id) => selectedDosenIds.includes(id));

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedDosenIds((prev) =>
                prev.filter((id) => !allIdsOnPage.includes(id)),
            );
        } else {
            setSelectedDosenIds((prev) =>
                Array.from(new Set([...prev, ...allIdsOnPage])),
            );
        }
    };

    const toggleSelectOne = (id: number) => {
        setSelectedDosenIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    };

    const handleBulkSubmit = () => {
        if (selectedDosenIds.length === 0 || bulkRuanganOptions.length === 0) return;

        setIsSubmittingBulk(true);
        router.post(
            '/dosen/bulk-penanggung-jawab',
            {
                dosen_ids: selectedDosenIds,
                ruangan_ids: bulkRuanganOptions.map((o) => o.value),
                mode: bulkMode,
            },
            {
                onSuccess: () => {
                    setIsBulkDialogOpen(false);
                    setSelectedDosenIds([]);
                    setBulkRuanganOptions([]);
                },
                onFinish: () => {
                    setIsSubmittingBulk(false);
                },
            },
        );
    };

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
                        {/* Bulk Action Bar */}
                        {selectedDosenIds.length > 0 && (
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 dark:bg-primary/10">
                                <div className="flex items-center gap-2">
                                    <Badge variant="default" className="text-sm font-medium">
                                        {selectedDosenIds.length} Dosen Dipilih
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-xs text-muted-foreground hover:text-destructive"
                                        onClick={() => setSelectedDosenIds([])}
                                    >
                                        Batal Pilih
                                    </Button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setBulkRuanganOptions([]);
                                            setIsBulkDialogOpen(true);
                                        }}
                                    >
                                        <Building2 className="mr-2 h-4 w-4" />
                                        Atur Penanggung Jawab Ruangan ({selectedDosenIds.length})
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="rounded-md border w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40px]">
                                            <Checkbox
                                                checked={isAllSelected}
                                                onCheckedChange={toggleSelectAll}
                                                aria-label="Pilih semua dosen"
                                            />
                                        </TableHead>
                                        <TableHead>Dosen / Staff</TableHead>
                                        <TableHead>Penanggung Jawab Ruangan</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Tahun Gabung</TableHead>
                                        <TableHead className="w-[120px] text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mahasiswas.data.map((dosen) => {
                                        const isSelected = selectedDosenIds.includes(dosen.id);
                                        return (
                                            <TableRow
                                                key={dosen.id}
                                                data-state={isSelected ? 'selected' : undefined}
                                            >
                                                <TableCell>
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onCheckedChange={() => toggleSelectOne(dosen.id)}
                                                        aria-label={`Pilih ${dosen.nama}`}
                                                    />
                                                </TableCell>
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
                                                    {dosen.penanggung_jawab_ruangans && dosen.penanggung_jawab_ruangans.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1 max-w-[280px]">
                                                            {dosen.penanggung_jawab_ruangans.map((r) => (
                                                                <Badge
                                                                    key={r.id}
                                                                    variant="outline"
                                                                    className="text-xs bg-muted/40 font-normal"
                                                                >
                                                                    {r.nama_ruangan}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic">
                                                            Belum ada
                                                        </span>
                                                    )}
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
                                                            href={`/dosen/${dosen.id}/edit`}
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
                                        );
                                    })}
                                    {mahasiswas.data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
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

                {/* Dialog Bulk Penanggung Jawab */}
                <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Atur Penanggung Jawab Ruangan</DialogTitle>
                            <DialogDescription>
                                Tentukan ruangan untuk {selectedDosenIds.length} dosen terpilih.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-2">
                            {/* Mode Selection */}
                            <div className="space-y-2">
                                <Label>Mode Aksi</Label>
                                <Select
                                    value={bulkMode}
                                    onValueChange={(val: any) => setBulkMode(val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="add">
                                            Tambahkan ke Ruangan
                                        </SelectItem>
                                        <SelectItem value="set">
                                            Tetapkan / Ganti Ruangan
                                        </SelectItem>
                                        <SelectItem value="remove">
                                            Cabut dari Ruangan
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    {bulkMode === 'add' &&
                                        'Menambahkan ruangan terpilih ke dosen tanpa menghapus ruangan yang sudah dipegang sebelumnya.'}
                                    {bulkMode === 'set' &&
                                        'Mengganti daftar ruangan penanggung jawab dosen dengan ruangan yang dipilih.'}
                                    {bulkMode === 'remove' &&
                                        'Mencabut hak akses penanggung jawab dosen dari ruangan yang dipilih.'}
                                </p>
                            </div>

                            {/* Ruangan MultiSelect */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Pilih Ruangan</Label>
                                    <div className="flex items-center gap-2 text-xs">
                                        <button
                                            type="button"
                                            onClick={() => setBulkRuanganOptions(allRuanganOptions)}
                                            className="font-medium text-primary hover:underline"
                                        >
                                            Pilih Semua
                                        </button>
                                        {bulkRuanganOptions.length > 0 && (
                                            <>
                                                <span className="text-muted-foreground">•</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setBulkRuanganOptions([])}
                                                    className="text-muted-foreground hover:text-destructive hover:underline"
                                                >
                                                    Batal Semua
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <MultiSelect
                                    options={allRuanganOptions}
                                    value={bulkRuanganOptions}
                                    onChange={setBulkRuanganOptions}
                                    placeholder="Pilih ruangan..."
                                    selectAllText="Pilih Semua Ruangan"
                                />
                            </div>

                            {/* Summary */}
                            <div className="rounded-md bg-muted/60 p-3 text-xs space-y-1">
                                <p className="font-semibold text-foreground">
                                    Dosen yang dipilih ({selectedDosenIds.length}):
                                </p>
                                <p className="text-muted-foreground line-clamp-3">
                                    {mahasiswas.data
                                        .filter((d) => selectedDosenIds.includes(d.id))
                                        .map((d) => d.nama)
                                        .join(', ')}
                                </p>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsBulkDialogOpen(false)}
                                disabled={isSubmittingBulk}
                            >
                                Batal
                            </Button>
                            <Button
                                type="button"
                                onClick={handleBulkSubmit}
                                disabled={isSubmittingBulk || bulkRuanganOptions.length === 0}
                            >
                                {isSubmittingBulk ? 'Menyimpan...' : 'Simpan Penugasan'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
