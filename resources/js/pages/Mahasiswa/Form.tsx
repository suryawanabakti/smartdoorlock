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
import { Switch } from '@/components/ui/switch';
import { type Mahasiswa, type MahasiswaFormData } from '@/types/mahasiswa';
import { type Ruangan } from '@/types/ruangan';
import { type User } from '@/types/user';
import { useForm } from '@inertiajs/react';
import {
    BookOpen,
    Building,
    GraduationCap,
    User2,
    User2Icon,
} from 'lucide-react';

interface Props {
    mahasiswa?: Mahasiswa;
    ruangans: Ruangan[];
    users: User[];
    ketOptions: { value: string; label: string }[];
    tahunOptions: number[];
}

export default function MahasiswaForm({
    mahasiswa,
    ruangans,
    users,
    ketOptions,
    tahunOptions,
}: Props) {
    const { data, setData, errors, processing, post, put, reset } =
        useForm<MahasiswaFormData>({
            user_id: mahasiswa?.user_id || null,
            id_tag: mahasiswa?.id_tag || '',
            nama: mahasiswa?.nama || '',
            nim: mahasiswa?.nim || '',
            pin: mahasiswa?.pin || '',
            ruangan_id: mahasiswa?.ruangan_id || null,
            ket: mahasiswa?.ket || 'mhs',
            status: mahasiswa ? Boolean(mahasiswa.status) : true,
            tahun_masuk: mahasiswa?.tahun_masuk || new Date().getFullYear(),
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mahasiswa) {
            put(`/mahasiswas/${mahasiswa.id}`, {
                onSuccess: () => reset(),
            });
        } else {
            post('/mahasiswas', {
                onSuccess: () => reset(),
            });
        }
    };

    // Filter users berdasarkan ket yang dipilih
    const filteredUsers = users.filter((user) =>
        data.ket === 'dsn' ? user.role === 'dsn' : user.role === 'mahasiswa',
    );

    // Filter ruangan hanya yang type kelas untuk mahasiswa
    const filteredRuangans =
        data.ket === 'mahasiswa'
            ? ruangans.filter((ruangan) => ruangan.type === 'kelas')
            : ruangans;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informasi Dasar */}
            <Card>
                <CardHeader>
                    <CardTitle>Informasi Dasar</CardTitle>
                    <CardDescription>
                        Data utama mahasiswa atau dosen
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Lengkap *</Label>
                            <Input
                                id="nama"
                                value={data.nama}
                                onChange={(e) =>
                                    setData('nama', e.target.value)
                                }
                                placeholder="Masukkan nama lengkap"
                            />
                            {errors.nama && (
                                <p className="text-sm text-red-600">
                                    {errors.nama}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nim">
                                {data.ket === 'dsn' ? 'NIDN *' : 'NIM *'}
                            </Label>
                            <Input
                                id="nim"
                                value={data.nim}
                                onChange={(e) => setData('nim', e.target.value)}
                                placeholder={
                                    data.ket === 'dsn'
                                        ? 'Masukkan NIDN'
                                        : 'Masukkan NIM'
                                }
                            />
                            {errors.nim && (
                                <p className="text-sm text-red-600">
                                    {errors.nim}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ket">Jenis *</Label>
                            <Select
                                value={data.ket}
                                onValueChange={(value: 'mahasiswa' | 'dsn') =>
                                    setData('ket', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih jenis" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ketOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            <div className="flex items-center gap-2">
                                                {option.value === 'dsn' ? (
                                                    <User2 className="h-4 w-4" />
                                                ) : (
                                                    <BookOpen className="h-4 w-4" />
                                                )}
                                                {option.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.ket && (
                                <p className="text-sm text-red-600">
                                    {errors.ket}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tahun_masuk">Tahun Masuk *</Label>
                            <Select
                                value={data.tahun_masuk.toString()}
                                onValueChange={(value) =>
                                    setData('tahun_masuk', parseInt(value))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih tahun masuk" />
                                </SelectTrigger>
                                <SelectContent>
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
                            {errors.tahun_masuk && (
                                <p className="text-sm text-red-600">
                                    {errors.tahun_masuk}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="id_tag">ID Tag</Label>
                            <Input
                                id="id_tag"
                                value={data.id_tag || ''}
                                onChange={(e) =>
                                    setData('id_tag', e.target.value)
                                }
                                placeholder="Masukkan ID Tag (opsional)"
                            />
                            {errors.id_tag && (
                                <p className="text-sm text-red-600">
                                    {errors.id_tag}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pin">PIN</Label>
                            <Input
                                id="pin"
                                type="password"
                                value={data.pin || ''}
                                onChange={(e) => setData('pin', e.target.value)}
                                placeholder="Masukkan PIN (opsional)"
                            />
                            {errors.pin && (
                                <p className="text-sm text-red-600">
                                    {errors.pin}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Relasi dan User Account */}
            <Card>
                <CardHeader>
                    <CardTitle>Relasi dan Akun</CardTitle>
                    <CardDescription>
                        Hubungan dengan user account dan ruangan
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="user_id">User Account</Label>
                            <Select
                                value={data.user_id?.toString() || ''}
                                onValueChange={(value) =>
                                    setData(
                                        'user_id',
                                        value ? parseInt(value) : null,
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih user account (opsional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="-">
                                        Tidak ada user account
                                    </SelectItem>
                                    {filteredUsers.map((user) => (
                                        <SelectItem
                                            key={user.id}
                                            value={user.id.toString()}
                                        >
                                            <div className="flex items-center gap-2">
                                                {user.image_url ? (
                                                    <img
                                                        src={user.image_url}
                                                        alt={user.name}
                                                        className="h-4 w-4 rounded-full"
                                                    />
                                                ) : (
                                                    <User2Icon className="h-4 w-4" />
                                                )}
                                                {user.name} ({user.email})
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-muted-foreground">
                                Pilih user account yang terkait dengan data ini
                            </p>
                            {errors.user_id && (
                                <p className="text-sm text-red-600">
                                    {errors.user_id}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ruangan_id">
                                {data.ket === 'dsn' ? 'Ruangan' : 'Kelas'}
                            </Label>
                            <Select
                                value={data.ruangan_id?.toString() || ''}
                                onValueChange={(value) =>
                                    setData(
                                        'ruangan_id',
                                        value ? parseInt(value) : null,
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={
                                            data.ket === 'dsn'
                                                ? 'Pilih ruangan (opsional)'
                                                : 'Pilih kelas (opsional)'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="-">
                                        Tidak ada{' '}
                                        {data.ket === 'dsn'
                                            ? 'ruangan'
                                            : 'kelas'}
                                    </SelectItem>
                                    {filteredRuangans.map((ruangan) => (
                                        <SelectItem
                                            key={ruangan.id}
                                            value={ruangan.id.toString()}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Building className="h-4 w-4" />
                                                {ruangan.nama_ruangan} (
                                                {ruangan.type})
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-muted-foreground">
                                {data.ket === 'dsn'
                                    ? 'Ruangan tempat dosen mengajar'
                                    : 'Kelas tempat mahasiswa belajar'}
                            </p>
                            {errors.ruangan_id && (
                                <p className="text-sm text-red-600">
                                    {errors.ruangan_id}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Status */}
            <Card>
                <CardHeader>
                    <CardTitle>Status</CardTitle>
                    <CardDescription>
                        Atur status keaktifan data
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="status">Status Aktif</Label>
                            <div className="text-sm text-muted-foreground">
                                {data.status
                                    ? 'Data aktif dan dapat digunakan'
                                    : 'Data nonaktif dan tidak dapat digunakan'}
                            </div>
                        </div>
                        <Switch
                            checked={data.status}
                            onCheckedChange={(checked) =>
                                setData('status', checked)
                            }
                        />
                    </div>
                    {errors.status && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.status}
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Preview Info */}
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Preview Informasi
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        <div>
                            <span className="font-medium">Nama:</span>{' '}
                            {data.nama || '-'}
                        </div>
                        <div>
                            <span className="font-medium">
                                {data.ket === 'dsn' ? 'NIDN' : 'NIM'}:
                            </span>{' '}
                            {data.nim || '-'}
                        </div>
                        <div>
                            <span className="font-medium">Jenis:</span>{' '}
                            {data.ket === 'dsn' ? 'dsn' : 'Mahasiswa'}
                        </div>
                        <div>
                            <span className="font-medium">Tahun Masuk:</span>{' '}
                            {data.tahun_masuk}
                        </div>
                        <div>
                            <span className="font-medium">Status:</span>
                            <span
                                className={`ml-2 rounded-full px-2 py-1 text-xs ${
                                    data.status
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                            >
                                {data.status ? 'Aktif' : 'Nonaktif'}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium">ID Tag:</span>{' '}
                            {data.id_tag || 'Tidak ada'}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col-reverse justify-end gap-4 border-t pt-6 sm:flex-row">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                    disabled={processing}
                >
                    Batal
                </Button>
                <Button
                    type="submit"
                    disabled={processing}
                    className="sm:w-auto"
                >
                    {processing ? (
                        <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Menyimpan...
                        </>
                    ) : mahasiswa ? (
                        'Perbarui Data'
                    ) : (
                        'Buat Data'
                    )}
                </Button>
            </div>
        </form>
    );
}
