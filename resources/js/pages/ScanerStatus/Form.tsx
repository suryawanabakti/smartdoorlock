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
import {
    type ScanerStatus,
    type ScanerStatusFormData,
} from '@/types/scaner-status';
import { useForm } from '@inertiajs/react';
import { Building, Code, Scan } from 'lucide-react';

interface Props {
    scanerStatus?: ScanerStatus;
    ruangans: Ruangan[];
    typeOptions: { value: string; label: string }[];
}

export default function ScanerStatusForm({
    scanerStatus,
    ruangans,
    typeOptions,
}: Props) {
    const { data, setData, errors, processing, post, put } =
        useForm<ScanerStatusFormData>({
            kode: scanerStatus?.kode || '',
            ruangan_id: scanerStatus?.ruangan_id || null,
            type: scanerStatus?.type || 'dalam',
            last: scanerStatus?.last || null,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (scanerStatus) {
            put(`/scaner-status/${scanerStatus.id}`);
        } else {
            post('/scaner-status');
        }
    };

    const generateKode = () => {
        const prefix = data.type === 'dalam' ? 'SCN-IN-' : 'SCN-OUT-';
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        setData('kode', prefix + random);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informasi Scanner */}
            <Card>
                <CardHeader>
                    <CardTitle>Informasi Scanner</CardTitle>
                    <CardDescription>
                        Data dasar konfigurasi scanner
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="type">Type Scanner *</Label>
                            <Select
                                value={data.type}
                                onValueChange={(value: 'dalam' | 'luar') =>
                                    setData('type', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih type scanner" />
                                </SelectTrigger>
                                <SelectContent>
                                    {typeOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Scan className="h-4 w-4" />
                                                {option.label}
                                            </div>
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
                            <Label htmlFor="kode">Kode Scanner *</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="kode"
                                    value={data.kode}
                                    onChange={(e) =>
                                        setData('kode', e.target.value)
                                    }
                                    placeholder="SCN-IN-ABC123"
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={generateKode}
                                    disabled={processing}
                                >
                                    <Code className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Kode unik untuk identifikasi scanner
                            </p>
                            {errors.kode && (
                                <p className="text-sm text-red-600">
                                    {errors.kode}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ruangan_id">Ruangan</Label>
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
                                    <SelectValue placeholder="Pilih ruangan (opsional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="-">
                                        Tidak ada ruangan
                                    </SelectItem>
                                    {ruangans.map((ruangan) => (
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
                                Ruangan tempat scanner dipasang
                            </p>
                            {errors.ruangan_id && (
                                <p className="text-sm text-red-600">
                                    {errors.ruangan_id}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="last">Last Scan</Label>
                            <Input
                                id="last"
                                type="datetime-local"
                                value={
                                    data.last
                                        ? new Date(data.last)
                                              .toISOString()
                                              .slice(0, 16)
                                        : ''
                                }
                                onChange={(e) =>
                                    setData(
                                        'last',
                                        e.target.value
                                            ? new Date(
                                                  e.target.value,
                                              ).toISOString()
                                            : null,
                                    )
                                }
                                disabled={!scanerStatus}
                            />
                            <p className="text-sm text-muted-foreground">
                                Waktu scan terakhir (otomatis diupdate oleh
                                sistem)
                            </p>
                            {errors.last && (
                                <p className="text-sm text-red-600">
                                    {errors.last}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Preview Information */}
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Scan className="h-5 w-5" />
                        Preview Scanner
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="font-medium">
                                    Kode Scanner:
                                </span>
                                <span className="rounded bg-blue-100 px-2 py-1 font-mono">
                                    {data.kode || '-'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Type:</span>
                                <span
                                    className={`rounded px-2 py-1 ${
                                        data.type === 'dalam'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-green-100 text-green-800'
                                    }`}
                                >
                                    {data.type === 'dalam'
                                        ? 'Scanner Dalam'
                                        : 'Scanner Luar'}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="font-medium">Ruangan:</span>
                                <span>
                                    {data.ruangan_id
                                        ? ruangans.find(
                                              (r) => r.id === data.ruangan_id,
                                          )?.nama_ruangan || 'Tidak ditemukan'
                                        : 'Tidak terhubung'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Status:</span>
                                <span
                                    className={`rounded px-2 py-1 ${
                                        data.last
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {data.last ? 'Aktif' : 'Belum Aktif'}
                                </span>
                            </div>
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
                    ) : scanerStatus ? (
                        'Perbarui Scanner'
                    ) : (
                        'Buat Scanner'
                    )}
                </Button>
            </div>
        </form>
    );
}
