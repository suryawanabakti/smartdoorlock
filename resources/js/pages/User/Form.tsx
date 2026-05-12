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
import { type Ruangan } from '@/types/ruangan';
import { type User, type UserFormData } from '@/types/user';
import { useForm } from '@inertiajs/react';
import { Upload, User as UserIcon, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface Props {
    user?: User;
    ruangans: Ruangan[];
    roles: string[];
    userRuanganIds?: number[];
}

export default function UserForm({
    user,
    ruangans,
    roles,
    userRuanganIds = [],
}: Props) {
    const [imagePreview, setImagePreview] = useState<string | null>(
        user?.image_url || null,
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, errors, processing, post, put, reset } =
        useForm<UserFormData>({
            name: user?.name || '',
            email: user?.email || '',
            email_notifikasi: user?.email_notifikasi || '',
            password: '',
            password_confirmation: '',
            role: user?.role || 'penjaga',
            nowa: user?.nowa || '',
            image: null,
            ruangan_ids: userRuanganIds,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create FormData for file upload
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            const value = data[key as keyof UserFormData];
            if (value !== null && value !== undefined) {
                if (key === 'ruangan_ids' && Array.isArray(value)) {
                    value.forEach((id) =>
                        formData.append('ruangan_ids[]', id.toString()),
                    );
                } else if (key === 'image' && value instanceof File) {
                    formData.append('image', value);
                } else {
                    formData.append(key, value as string | Blob);
                }
            }
        });

        if (user) {
            post(`/users/${user.id}`, {
                data: formData,
                forceFormData: true,
                onSuccess: () => reset('password', 'password_confirmation'),
            });
        } else {
            post('/users', {
                data: formData,
                forceFormData: true,
                onSuccess: () => reset(),
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type and size
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                // 2MB
                alert('Image size should be less than 2MB');
                return;
            }

            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informasi Dasar */}
            <Card>
                <CardHeader>
                    <CardTitle>Informasi Dasar</CardTitle>
                    <CardDescription>
                        Data utama penjaga yang akan dibuat
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Foto Profil */}
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                        <div className="flex-shrink-0">
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-20 w-20 rounded-full border-2 border-gray-200 object-cover"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                        onClick={removeImage}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-100">
                                    <UserIcon className="h-8 w-8 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="image">Foto Profil</Label>
                            <div className="flex gap-2">
                                <input
                                    ref={fileInputRef}
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={triggerFileInput}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Pilih Foto
                                </Button>
                                {imagePreview && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={removeImage}
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Hapus
                                    </Button>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Format: JPG, PNG, maksimal 2MB
                            </p>
                            {errors.image && (
                                <p className="text-sm text-red-600">
                                    {errors.image}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Masukkan nama lengkap"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            {/* Role is fixed to penjaga, hidden from UI as per request */}
                            <Input type="hidden" id="role" value={data.role} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder="email@example.com"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email_notifikasi">
                                Email Notifikasi
                            </Label>
                            <Input
                                id="email_notifikasi"
                                type="email"
                                value={data.email_notifikasi}
                                onChange={(e) =>
                                    setData('email_notifikasi', e.target.value)
                                }
                                placeholder="notifikasi@example.com"
                            />
                            {errors.email_notifikasi && (
                                <p className="text-sm text-red-600">
                                    {errors.email_notifikasi}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nowa">Nomor WhatsApp</Label>
                            <Input
                                id="nowa"
                                value={data.nowa}
                                onChange={(e) =>
                                    setData('nowa', e.target.value)
                                }
                                placeholder="6281234567890"
                            />
                            {errors.nowa && (
                                <p className="text-sm text-red-600">
                                    {errors.nowa}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Password */}
            <Card>
                <CardHeader>
                    <CardTitle>{user ? 'Ubah Password' : 'Password'}</CardTitle>
                    <CardDescription>
                        {user
                            ? 'Kosongkan jika tidak ingin mengubah password'
                            : 'Buat password untuk penjaga baru'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                {user ? 'Password Baru' : 'Password *'}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                placeholder={
                                    user
                                        ? 'Password baru (opsional)'
                                        : 'Masukkan password'
                                }
                            />
                            {errors.password && (
                                <p className="text-sm text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">
                                {user
                                    ? 'Konfirmasi Password Baru'
                                    : 'Konfirmasi Password *'}
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                placeholder={
                                    user
                                        ? 'Konfirmasi password baru'
                                        : 'Konfirmasi password'
                                }
                            />
                            {errors.password_confirmation && (
                                <p className="text-sm text-red-600">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Ruangan Assignment - Khusus untuk penjaga */}
            {data.role === 'penjaga' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Penugasan Ruangan</CardTitle>
                        <CardDescription>
                            Pilih ruangan yang akan dijaga oleh penjaga ini
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Ruangan yang Dijaga</Label>
                                <span className="text-sm text-muted-foreground">
                                    {data.ruangan_ids?.length || 0} ruangan
                                    dipilih
                                </span>
                            </div>

                            {ruangans.length > 0 ? (
                                <div className="grid max-h-80 grid-cols-1 gap-3 overflow-y-auto rounded-lg border p-3 md:grid-cols-2 lg:grid-cols-3">
                                    {ruangans.map((ruangan) => (
                                        <div
                                            key={ruangan.id}
                                            className="flex items-start space-x-2 rounded-lg border p-2 transition-colors hover:bg-gray-50"
                                        >
                                            <input
                                                type="checkbox"
                                                id={`ruangan-${ruangan.id}`}
                                                checked={
                                                    data.ruangan_ids?.includes(
                                                        ruangan.id,
                                                    ) || false
                                                }
                                                onChange={(e) => {
                                                    const updatedIds = e.target
                                                        .checked
                                                        ? [
                                                              ...(data.ruangan_ids ||
                                                                  []),
                                                              ruangan.id,
                                                          ]
                                                        : (
                                                              data.ruangan_ids ||
                                                              []
                                                          ).filter(
                                                              (id) =>
                                                                  id !==
                                                                  ruangan.id,
                                                          );
                                                    setData(
                                                        'ruangan_ids',
                                                        updatedIds,
                                                    );
                                                }}
                                                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label
                                                htmlFor={`ruangan-${ruangan.id}`}
                                                className="flex-1 cursor-pointer text-sm"
                                            >
                                                <div className="font-medium text-gray-900">
                                                    {ruangan.nama_ruangan}
                                                </div>
                                                <div className="text-gray-600">
                                                    Tipe:{' '}
                                                    <span className="capitalize">
                                                        {ruangan.type}
                                                    </span>
                                                </div>
                                                {ruangan.jam_buka &&
                                                    ruangan.jam_tutup && (
                                                        <div className="text-xs text-gray-500">
                                                            {ruangan.jam_buka} -{' '}
                                                            {ruangan.jam_tutup}
                                                        </div>
                                                    )}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-muted-foreground">
                                    <p>Tidak ada ruangan tersedia</p>
                                    <p className="text-sm">
                                        Silakan buat ruangan terlebih dahulu
                                    </p>
                                </div>
                            )}

                            {errors.ruangan_ids && (
                                <p className="text-sm text-red-600">
                                    {errors.ruangan_ids}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

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
                    ) : user ? (
                        'Perbarui Penjaga'
                    ) : (
                        'Buat Penjaga'
                    )}
                </Button>
            </div>
        </form>
    );
}
