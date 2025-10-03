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
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, RefreshCcw, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Manajemen Ruangan',
        href: '/ruangans',
    },
];

interface Props {
    ruangans: PaginatedResponse<Ruangan>;
    filters: {
        search?: string;
        type?: string;
    };
}

export default function RuanganIndex({ ruangans, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || '');

    const handleFilter = () => {
        const filters: any = {};

        if (search) filters.search = search;
        if (type && type !== 'all') filters.type = type;

        router.get('/ruangans', filters, {
            preserveState: true,
            replace: true,
        });
    };

    const deleteRuangan = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus ruangan ini?')) {
            router.delete(`/ruangans/${id}`);
        }
    };

    const getTypeBadge = (type: string) => {
        const variants = {
            umum: 'default',
            kelas: 'secondary',
            lab: 'destructive',
        } as const;

        return (
            <Badge
                variant={variants[type as keyof typeof variants] || 'default'}
            >
                {type.toUpperCase()}
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Ruangan" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Manajemen Ruangan
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola data ruangan dan aksesnya
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/ruangans/reset-api">
                            <Button>
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Reset API
                            </Button>
                        </Link>
                        <Link href="/ruangans/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Ruangan
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Cari ruangan..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) =>
                                        e.key === 'Enter' && handleFilter()
                                    }
                                />
                            </div>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Semua Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Type
                                    </SelectItem>
                                    <SelectItem value="umum">Umum</SelectItem>
                                    <SelectItem value="kelas">Kelas</SelectItem>
                                    <SelectItem value="lab">Lab</SelectItem>
                                </SelectContent>
                            </Select>
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
                        <CardTitle>Daftar Ruangan</CardTitle>
                        <CardDescription>
                            Total {ruangans.total} ruangan ditemukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Ruangan</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Jam Buka</TableHead>
                                    <TableHead>Max Register</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Penanggung Jawab</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ruangans.data.map((ruangan) => (
                                    <TableRow key={ruangan.id}>
                                        <TableCell className="font-medium">
                                            {ruangan.nama_ruangan}
                                            {ruangan.parent && (
                                                <div className="text-sm text-muted-foreground">
                                                    Sub dari:{' '}
                                                    {
                                                        ruangan.parent
                                                            .nama_ruangan
                                                    }
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {getTypeBadge(ruangan.type)}
                                        </TableCell>
                                        <TableCell>
                                            {ruangan.jam_buka} -{' '}
                                            {ruangan.jam_tutup}
                                        </TableCell>
                                        <TableCell>
                                            {ruangan.max_register}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <Badge
                                                    variant={
                                                        ruangan.open_api
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {ruangan.open_api
                                                        ? 'Open API'
                                                        : 'Closed'}
                                                </Badge>
                                                {ruangan.pin_active && (
                                                    <Badge variant="outline">
                                                        PIN Active
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {ruangan.penanggung_jawab ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {Array.isArray(
                                                        ruangan.penanggung_jawab,
                                                    ) ? (
                                                        ruangan.penanggung_jawab.map(
                                                            (pj, index) => (
                                                                <Badge
                                                                    key={index}
                                                                    variant="outline"
                                                                    className="text-xs"
                                                                >
                                                                    {pj.label}
                                                                </Badge>
                                                            ),
                                                        )
                                                    ) : (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {
                                                                ruangan.penanggung_jawab
                                                            }
                                                        </Badge>
                                                    )}
                                                </div>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/ruangans/${ruangan.id}`}
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
                                                    href={`/ruangans/${ruangan.id}/edit`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        deleteRuangan(
                                                            ruangan.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {ruangans.data.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            Tidak ada data ruangan
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {ruangans.links.length > 3 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {ruangans.from} hingga{' '}
                                    {ruangans.to} dari {ruangans.total} hasil
                                </div>
                                <div className="flex gap-1">
                                    {ruangans.links.map((link, index) => (
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
