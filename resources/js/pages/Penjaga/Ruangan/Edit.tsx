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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Ruangan } from '@/types/ruangan';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Shield } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Penjaga',
        href: '/penjaga/dashboard',
    },
    {
        title: 'Ruangan Saya',
        href: '/penjaga/ruangan',
    },
    {
        title: 'Edit Ruangan',
        href: '#',
    },
];

interface Props {
    ruangan: Ruangan;
}

interface RuanganFormData {
    nama_ruangan: string;
    jam_buka: string;
    jam_tutup: string;
    max_register: number;
    pin?: string;
    pin_active: boolean;
    open_api: boolean;
    penanggung_jawab?: string;
}

export default function RuanganPenjagaEdit({ ruangan }: Props) {
    const { data, setData, errors, processing, put } = useForm<RuanganFormData>(
        {
            nama_ruangan: ruangan.nama_ruangan || '',
            jam_buka: ruangan.jam_buka || '08:00',
            jam_tutup: ruangan.jam_tutup || '17:00',
            max_register: ruangan.max_register || 10,
            pin: ruangan.pin || '',
            pin_active: ruangan.pin_active || false,
            open_api: ruangan.open_api || false,
            penanggung_jawab: ruangan.penanggung_jawab || '',
        },
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/penjaga/ruangan/${ruangan.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${ruangan.nama_ruangan}`} />

            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/penjaga/ruangan/${ruangan.id}`}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                                <Shield className="h-8 w-8" />
                                Edit Ruangan
                            </h1>
                            <p className="text-muted-foreground">
                                Perbarui informasi ruangan{' '}
                                {ruangan.nama_ruangan}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Informasi Dasar */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Informasi Dasar</CardTitle>
                                <CardDescription>
                                    Data utama ruangan
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_ruangan">
                                        Nama Ruangan *
                                    </Label>
                                    <Input
                                        id="nama_ruangan"
                                        value={data.nama_ruangan}
                                        onChange={(e) =>
                                            setData(
                                                'nama_ruangan',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Masukkan nama ruangan"
                                    />
                                    {errors.nama_ruangan && (
                                        <p className="text-sm text-red-600">
                                            {errors.nama_ruangan}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="jam_buka">
                                            Jam Buka *
                                        </Label>
                                        <Input
                                            id="jam_buka"
                                            type="time"
                                            value={data.jam_buka}
                                            onChange={(e) =>
                                                setData(
                                                    'jam_buka',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.jam_buka && (
                                            <p className="text-sm text-red-600">
                                                {errors.jam_buka}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="jam_tutup">
                                            Jam Tutup *
                                        </Label>
                                        <Input
                                            id="jam_tutup"
                                            type="time"
                                            value={data.jam_tutup}
                                            onChange={(e) =>
                                                setData(
                                                    'jam_tutup',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.jam_tutup && (
                                            <p className="text-sm text-red-600">
                                                {errors.jam_tutup}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="max_register">
                                        Kuota Maksimal *
                                    </Label>
                                    <Input
                                        id="max_register"
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={data.max_register}
                                        onChange={(e) =>
                                            setData(
                                                'max_register',
                                                parseInt(e.target.value),
                                            )
                                        }
                                    />
                                    {errors.max_register && (
                                        <p className="text-sm text-red-600">
                                            {errors.max_register}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="penanggung_jawab">
                                        Penanggung Jawab
                                    </Label>
                                    <Textarea
                                        id="penanggung_jawab"
                                        value={data.penanggung_jawab || ''}
                                        onChange={(e) =>
                                            setData(
                                                'penanggung_jawab',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Masukkan nama penanggung jawab"
                                        rows={2}
                                    />
                                    {errors.penanggung_jawab && (
                                        <p className="text-sm text-red-600">
                                            {errors.penanggung_jawab}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pengaturan Keamanan */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pengaturan Keamanan</CardTitle>
                                <CardDescription>
                                    Atur akses dan keamanan
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="open_api">
                                            Buka Akses API
                                        </Label>
                                        <div className="text-sm text-muted-foreground">
                                            Izinkan akses melalui API
                                        </div>
                                    </div>
                                    <Switch
                                        checked={data.open_api}
                                        onCheckedChange={(checked) =>
                                            setData('open_api', checked)
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="pin_active">
                                            Aktifkan PIN
                                        </Label>
                                        <div className="text-sm text-muted-foreground">
                                            Wajibkan PIN untuk akses
                                        </div>
                                    </div>
                                    <Switch
                                        checked={data.pin_active}
                                        onCheckedChange={(checked) =>
                                            setData('pin_active', checked)
                                        }
                                    />
                                </div>

                                {data.pin_active && (
                                    <div className="space-y-2">
                                        <Label htmlFor="pin">PIN Akses</Label>
                                        <Input
                                            id="pin"
                                            type="password"
                                            value={data.pin || ''}
                                            onChange={(e) =>
                                                setData('pin', e.target.value)
                                            }
                                            placeholder="Masukkan PIN"
                                        />
                                        {errors.pin && (
                                            <p className="text-sm text-red-600">
                                                {errors.pin}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse justify-end gap-4 border-t pt-6 sm:flex-row">
                        <Link href={`/penjaga/ruangan/${ruangan.id}`}>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={processing}
                            >
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Menyimpan...
                                </>
                            ) : (
                                'Simpan Perubahan'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
