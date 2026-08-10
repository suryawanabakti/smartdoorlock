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
import { type User } from '@/types/user';
import { Head, Link, router } from '@inertiajs/react';
import { Pagination } from '@/components/pagination';
import { Edit, Image, Mail, Phone, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Manajemen Penjaga',
        href: '/users',
    },
];

interface Props {
    users: PaginatedResponse<User>;
    filters: {
        search?: string;
        role?: string;
    };
    roles: string[];
}

export default function UserIndex({ users, filters, roles }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || 'all');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);


    const handleFilter = () => {
        const filterParams: any = {};
        if (search) filterParams.search = search;
        if (role && role !== 'all') filterParams.role = role;

        router.get('/users', filterParams, {
            preserveState: true,
            replace: true,
        });
    };

    const deleteUser = (user: User) => {
        setUserToDelete(user);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            router.delete(`/users/${userToDelete.id}`);
            setUserToDelete(null);
        }
    };


    const getRoleBadge = (userRole: string) => {
        const variants = {
            super: 'bg-purple-100 text-purple-800 border-purple-200',
            admin: 'bg-red-100 text-red-800 border-red-200',
            penjaga: 'bg-blue-100 text-blue-800 border-blue-200',
            mahasiswa: 'bg-gray-100 text-gray-800 border-gray-200',
        } as const;

        const variantClass =
            variants[userRole as keyof typeof variants] || variants.mahasiswa;

        return (
            <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantClass}`}
            >
                {userRole.toUpperCase()}
            </span>
        );
    };

    const getStatusBadge = (isActive: boolean) => {
        return (
            <Badge variant={isActive ? 'default' : 'secondary'}>
                {isActive ? 'Aktif' : 'Nonaktif'}
            </Badge>
        );
    };

    // Get current user ID from Inertia props or global window object
    const currentUserId = (window as any).userId;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Penjaga" />

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Penjaga"
                description={`Apakah Anda yakin ingin menghapus penjaga ${userToDelete?.name}? Tindakan ini tidak dapat dibatalkan.`}
                variant="destructive"
                confirmText="Hapus"
            />


            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Manajemen Penjaga
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola data penjaga dan akses ruangan
                        </p>
                    </div>
                    <Link href="/users/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Penjaga
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-4 md:flex-row">
                            <div className="flex-1">
                                <Input
                                    placeholder="Cari penjaga berdasarkan nama, email, atau nomor WA..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) =>
                                        e.key === 'Enter' && handleFilter()
                                    }
                                />
                            </div>
                            <Button
                                onClick={handleFilter}
                                className="w-full md:w-auto"
                            >
                                <Search className="mr-2 h-4 w-4" />
                                Filter
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Penjaga</CardTitle>
                        <CardDescription>
                            Total {users.total} penjaga ditemukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[250px]">
                                            Penjaga
                                        </TableHead>
                                        <TableHead>Kontak</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Ruangan</TableHead>

                                        <TableHead className="w-[150px] text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {user.image ? (
                                                        <img
                                                            src={user.image_url}
                                                            alt={user.name}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                                                            <Image className="h-5 w-5 text-gray-500" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    {user.nowa && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Phone className="h-3 w-3" />
                                                            {user.nowa}
                                                        </div>
                                                    )}
                                                    {user.email_notifikasi && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Mail className="h-3 w-3" />
                                                            {
                                                                user.email_notifikasi
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getRoleBadge(user.role)}
                                            </TableCell>
                                            <TableCell>
                                                {user.role === 'penjaga' ? (
                                                    user.ruangans &&
                                                    user.ruangans.length > 0 ? (
                                                        <div className="flex flex-col gap-1">
                                                            {user.ruangans
                                                                .slice(0, 2)
                                                                .map(
                                                                    (
                                                                        ruangan,
                                                                    ) => (
                                                                        <Badge
                                                                            key={
                                                                                ruangan.id
                                                                            }
                                                                            variant="outline"
                                                                            className="w-fit justify-start text-xs"
                                                                        >
                                                                            {
                                                                                ruangan.nama_ruangan
                                                                            }
                                                                            <span className="ml-1 text-muted-foreground">
                                                                                (
                                                                                {
                                                                                    ruangan.type
                                                                                }

                                                                                )
                                                                            </span>
                                                                        </Badge>
                                                                    ),
                                                                )}
                                                            {user.ruangans
                                                                .length > 2 && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="w-fit text-xs"
                                                                >
                                                                    +
                                                                    {user
                                                                        .ruangans
                                                                        .length -
                                                                        2}{' '}
                                                                    ruangan
                                                                    lainnya
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">
                                                            Tidak ada ruangan
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">
                                                        -
                                                    </span>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/users/${user.id}/edit`}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            title="Edit Penjaga"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            deleteUser(user)
                                                        }
                                                        disabled={
                                                            user.id ===
                                                            currentUserId
                                                        }
                                                        title={
                                                            user.id ===
                                                            currentUserId
                                                                ? 'Tidak dapat menghapus akun sendiri'
                                                                : 'Hapus Penjaga'
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {users.data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <Search className="h-8 w-8" />
                                                    <div>
                                                        <p className="font-medium">
                                                            Tidak ada penjaga
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
                            links={users.links}
                            meta={{ from: users.from, to: users.to, total: users.total }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
