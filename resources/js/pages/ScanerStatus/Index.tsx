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
import { type Ruangan } from '@/types/ruangan';
import { type ScanerStatus } from '@/types/scaner-status';
import { Head, Link, router } from '@inertiajs/react';
import { Pagination } from '@/components/pagination';
import {
    Building,
    Clock,
    Edit,
    Eye,
    Plus,
    Scan,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Manajemen Scanner',
        href: '/scaner-status',
    },
];

interface Props {
    scanerStatuses: PaginatedResponse<ScanerStatus>;
    filters: {
        search?: string;
        type?: string;
        ruangan_id?: string;
    };
    typeOptions: { value: string; label: string }[];
    ruangans: Ruangan[];
}

export default function ScanerStatusIndex({
    scanerStatuses,
    filters,
    typeOptions,
    ruangans,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || '');
    const [ruanganId, setRuanganId] = useState(filters.ruangan_id || '');

    const handleFilter = () => {
        const filterParams: any = {};
        if (search) filterParams.search = search;
        if (type) filterParams.type = type;
        if (ruanganId) filterParams.ruangan_id = ruanganId;

        router.get('/scaner-status', filterParams, {
            preserveState: true,
            replace: true,
        });
    };

    const deleteScanerStatus = (scanerStatus: ScanerStatus) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus scanner ${scanerStatus.kode}?`,
            )
        ) {
            router.delete(`/scaner-status/${scanerStatus.id}`);
        }
    };

    const getTypeBadge = (type: string) => {
        const variants = {
            dalam: 'bg-blue-100 text-blue-800 border-blue-200',
            luar: 'bg-green-100 text-green-800 border-green-200',
        } as const;

        const variantClass =
            variants[type as keyof typeof variants] || variants.dalam;

        return (
            <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantClass}`}
            >
                <Scan className="mr-1 h-3 w-3" />
                {type.toUpperCase()}
            </span>
        );
    };

    const formatLastScan = (last: string | null) => {
        if (!last) return '-';

        const date = new Date(last);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} menit lalu`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} jam lalu`;

        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} hari lalu`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Scanner Status" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Manajemen Scanner
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola data scanner dalam dan luar ruangan
                        </p>
                    </div>
                    <Link href="/scaner-status/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Scanner
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="lg:col-span-2">
                                <Input
                                    placeholder="Cari berdasarkan kode scanner atau nama ruangan..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) =>
                                        e.key === 'Enter' && handleFilter()
                                    }
                                />
                            </div>
                            <Select value={type} onValueChange={setType}>
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
                        <CardTitle>Daftar Scanner</CardTitle>
                        <CardDescription>
                            Total {scanerStatuses.total} scanner ditemukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kode Scanner</TableHead>
                                        <TableHead>Ruangan</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Last Scan</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[150px] text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {scanerStatuses.data.map((scanerStatus) => (
                                        <TableRow key={scanerStatus.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Scan className="h-4 w-4 text-blue-600" />
                                                    <span className="font-mono font-medium">
                                                        {scanerStatus.kode}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {scanerStatus.ruangan ? (
                                                    <div className="flex items-center gap-2">
                                                        <Building className="h-4 w-4 text-gray-500" />
                                                        {
                                                            scanerStatus.ruangan
                                                                .nama_ruangan
                                                        }
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        -
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {getTypeBadge(
                                                    scanerStatus.type,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-gray-500" />
                                                    {formatLastScan(
                                                        scanerStatus.last,
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        scanerStatus.last
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {scanerStatus.last
                                                        ? 'Aktif'
                                                        : 'Tidak Aktif'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/scaner-status/${scanerStatus.id}`}
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
                                                        href={`/scaner-status/${scanerStatus.id}/edit`}
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
                                                            deleteScanerStatus(
                                                                scanerStatus,
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
                                    {scanerStatuses.data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <Scan className="h-8 w-8" />
                                                    <div>
                                                        <p className="font-medium">
                                                            Tidak ada scanner
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
                            links={scanerStatuses.links}
                            meta={{ from: scanerStatuses.from, to: scanerStatuses.to, total: scanerStatuses.total }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
