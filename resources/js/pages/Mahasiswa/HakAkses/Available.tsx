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
import { Pagination } from '@/components/pagination';
import {
    ArrowLeft,
    Building,
    Calendar,
    CheckCircle,
    Clock,
    Search,
    UserPlus,
    Users,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Mahasiswa',
        href: '/mahasiswa/dashboard',
    },
    {
        title: 'Hak Akses Tersedia',
        href: '/mahasiswa/hak-akses/available',
    },
];

interface Props {
    availableHakAkses: PaginatedResponse<HakAkses>;
    filters: {
        search?: string;
    };
    mahasiswa: Mahasiswa;
}

export default function HakAksesMahasiswaAvailable({
    availableHakAkses,
    filters,
    mahasiswa,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleFilter = () => {
        const filterParams: any = {};
        if (search) filterParams.search = search;

        router.get('/mahasiswa/hak-akses/available', filterParams, {
            preserveState: true,
            replace: true,
        });
    };

    const joinHakAkses = (hakAkses: HakAkses) => {
        if (
            confirm(
                `Bergabung dengan hak akses ${hakAkses.ruangan?.nama_ruangan}?`,
            )
        ) {
            router.post(`/mahasiswa/hak-akses/${hakAkses.id}/join`);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getKuotaTersedia = (hakAkses: HakAkses) => {
        return hakAkses.max_register - (hakAkses.mahasiswas?.length || 0);
    };

    const isAlreadyJoined = (hakAkses: HakAkses) => {
        return hakAkses.mahasiswas?.some((m) => m.id === mahasiswa.id) || false;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hak Akses Tersedia - Mahasiswa" />

            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                            <UserPlus className="h-8 w-8" />
                            Hak Akses Tersedia
                        </h1>
                        <p className="text-muted-foreground">
                            Daftar hak akses ruangan yang tersedia untuk diikuti
                        </p>
                    </div>
                    <Link href="/mahasiswa/hak-akses">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Cari berdasarkan tujuan atau ruangan..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) =>
                                        e.key === 'Enter' && handleFilter()
                                    }
                                />
                            </div>
                            <Button onClick={handleFilter}>
                                <Search className="mr-2 h-4 w-4" />
                                Cari
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Hak Akses Tersedia</CardTitle>
                        <CardDescription>
                            Total {availableHakAkses.total} hak akses tersedia
                            ditemukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ruangan & Jadwal</TableHead>
                                        <TableHead>Tujuan & Pembuat</TableHead>
                                        <TableHead>Kuota</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[120px] text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {availableHakAkses.data.map((item) => {
                                        const kuotaTersedia =
                                            getKuotaTersedia(item);
                                        const sudahBergabung =
                                            isAlreadyJoined(item);

                                        return (
                                            <TableRow key={item.id}>
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
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-xs">
                                                        <p className="line-clamp-2 font-medium">
                                                            {item.tujuan}
                                                        </p>
                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            Dibuat oleh:{' '}
                                                            {item
                                                                .mahasiswas?.[0]
                                                                ?.nama ||
                                                                'Tidak diketahui'}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4 text-green-600" />
                                                            <span className="font-medium">
                                                                {item.mahasiswas
                                                                    ?.length ||
                                                                    0}
                                                            </span>
                                                            <span className="text-muted-foreground">
                                                                /
                                                            </span>
                                                            <span>
                                                                {
                                                                    item.max_register
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {kuotaTersedia}{' '}
                                                            kuota tersedia
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="default">
                                                        ✅ Tersedia
                                                    </Badge>
                                                    {sudahBergabung && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="mt-1"
                                                        >
                                                            ✓ Sudah Bergabung
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-end gap-2">
                                                        {!sudahBergabung &&
                                                        kuotaTersedia > 0 ? (
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                onClick={() =>
                                                                    joinHakAkses(
                                                                        item,
                                                                    )
                                                                }
                                                            >
                                                                <UserPlus className="mr-1 h-4 w-4" />
                                                                Gabung
                                                            </Button>
                                                        ) : sudahBergabung ? (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                disabled
                                                            >
                                                                <CheckCircle className="mr-1 h-4 w-4" />
                                                                Sudah Gabung
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                disabled
                                                            >
                                                                Kuota Penuh
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {availableHakAkses.data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <UserPlus className="h-8 w-8" />
                                                    <div>
                                                        <p className="font-medium">
                                                            Tidak ada hak akses
                                                            tersedia
                                                        </p>
                                                        <p className="text-sm">
                                                            <Link
                                                                href="/mahasiswa/hak-akses/create"
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                Ajukan hak akses
                                                                baru
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

                        {/* Pagination */}
                        <Pagination
                            links={availableHakAkses.links}
                            meta={{ from: availableHakAkses.from, to: availableHakAkses.to, total: availableHakAkses.total }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
