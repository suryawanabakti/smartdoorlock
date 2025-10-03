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
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { type Ruangan, type RuanganFormData } from '@/types/ruangan';
import { useForm } from '@inertiajs/react';

interface Props {
    ruangan?: Ruangan;
    parentRuangans: Ruangan[];
    types: string[];
    mahasiswas: any[];
}

export default function RuanganForm({
    ruangan,
    parentRuangans,
    types,
    mahasiswas,
}: Props) {
    const existingPenanggungJawab = ruangan?.penanggung_jawab
        ? Array.isArray(ruangan.penanggung_jawab)
            ? ruangan.penanggung_jawab
            : JSON.parse(ruangan.penanggung_jawab)
        : [];

    const { data, setData, errors, processing, post, put } =
        useForm<RuanganFormData>({
            nama_ruangan: ruangan?.nama_ruangan || '',
            type: ruangan?.type || 'umum',
            open_api: ruangan?.open_api || false,
            pin: ruangan?.pin || '',
            pin_active: ruangan?.pin_active || false,
            parent_id: ruangan?.parent_id || null,
            jam_buka: ruangan?.jam_buka || '00:01',
            jam_tutup: ruangan?.jam_tutup || '23:59',
            max_register: ruangan?.max_register || 10,
            mahasiswa_id: ruangan?.mahasiswa_id || null,
            penanggung_jawab: existingPenanggungJawab,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (ruangan) {
            put(`/ruangans/${ruangan.id}`);
        } else {
            post('/ruangans');
        }
    };

    const handlePenanggungJawabChange = (
        selectedOptions: MultiSelectOption[],
    ) => {
        setData('penanggung_jawab', selectedOptions);
    };

    // Convert null to empty string for Select components
    const parentIdValue = data.parent_id ? data.parent_id.toString() : '';
    const mahasiswaIdValue = data.mahasiswa_id
        ? data.mahasiswa_id.toString()
        : '';

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Informasi Dasar</CardTitle>
                    <CardDescription>Data utama ruangan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="nama_ruangan">Nama Ruangan *</Label>
                            <Input
                                id="nama_ruangan"
                                value={data.nama_ruangan}
                                onChange={(e) =>
                                    setData('nama_ruangan', e.target.value)
                                }
                                placeholder="Masukkan nama ruangan"
                            />
                            {errors.nama_ruangan && (
                                <p className="text-sm text-red-600">
                                    {errors.nama_ruangan}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Type Ruangan *</Label>
                            <Select
                                value={data.type}
                                onValueChange={(
                                    value: 'umum' | 'kelas' | 'lab',
                                ) => setData('type', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih type ruangan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {types.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type.toUpperCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <p className="text-sm text-red-600">
                                    {errors.type}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="parent_id">Ruangan Induk</Label>
                            <Select
                                value={parentIdValue}
                                onValueChange={(value) =>
                                    setData(
                                        'parent_id',
                                        value ? parseInt(value) : null,
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih ruangan induk (opsional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">
                                        Tidak ada
                                    </SelectItem>
                                    {parentRuangans.map((parent) => (
                                        <SelectItem
                                            key={parent.id}
                                            value={parent.id.toString()}
                                        >
                                            {parent.nama_ruangan}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.parent_id && (
                                <p className="text-sm text-red-600">
                                    {errors.parent_id}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="max_register">Max Register *</Label>
                            <Input
                                id="max_register"
                                type="number"
                                min="1"
                                value={data.max_register}
                                onChange={(e) =>
                                    setData(
                                        'max_register',
                                        parseInt(e.target.value) || 1,
                                    )
                                }
                            />
                            {errors.max_register && (
                                <p className="text-sm text-red-600">
                                    {errors.max_register}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="penanggung_jawab">
                            Penanggung Jawab
                        </Label>
                        <MultiSelect
                            options={mahasiswas}
                            value={data.penanggung_jawab || []}
                            onChange={handlePenanggungJawabChange}
                            placeholder="Pilih penanggung jawab..."
                        />
                        {errors.penanggung_jawab && (
                            <p className="text-sm text-red-600">
                                {errors.penanggung_jawab}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Pengaturan Waktu</CardTitle>
                    <CardDescription>
                        Atur jam operasional ruangan
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="jam_buka">Jam Buka *</Label>
                            <Input
                                id="jam_buka"
                                type="time"
                                value={data.jam_buka}
                                onChange={(e) =>
                                    setData('jam_buka', e.target.value)
                                }
                            />
                            {errors.jam_buka && (
                                <p className="text-sm text-red-600">
                                    {errors.jam_buka}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="jam_tutup">Jam Tutup *</Label>
                            <Input
                                id="jam_tutup"
                                type="time"
                                value={data.jam_tutup}
                                onChange={(e) =>
                                    setData('jam_tutup', e.target.value)
                                }
                            />
                            {errors.jam_tutup && (
                                <p className="text-sm text-red-600">
                                    {errors.jam_tutup}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Pengaturan Keamanan</CardTitle>
                    <CardDescription>
                        Atur akses dan keamanan ruangan
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="open_api">Open API</Label>
                            <div className="text-sm text-muted-foreground">
                                Izinkan akses melalui API tanpa autentikasi
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
                            <Label htmlFor="pin_active">Aktifkan PIN</Label>
                            <div className="text-sm text-muted-foreground">
                                Wajibkan PIN untuk akses ruangan
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
                            <Label htmlFor="pin">PIN</Label>
                            <Input
                                id="pin"
                                type="password"
                                value={data.pin || ''}
                                onChange={(e) => setData('pin', e.target.value)}
                                placeholder="Masukkan PIN akses"
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

            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => history.back()}
                >
                    Batal
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing
                        ? 'Menyimpan...'
                        : ruangan
                          ? 'Perbarui'
                          : 'Simpan'}
                </Button>
            </div>
        </form>
    );
}
