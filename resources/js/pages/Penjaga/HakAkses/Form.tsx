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
import { Textarea } from '@/components/ui/textarea';
import { HakAkses, type HakAksesFormData } from '@/types/hak-akses';
import { type Mahasiswa } from '@/types/mahasiswa';
import { type Ruangan } from '@/types/ruangan';
import { useForm } from '@inertiajs/react';
import {
    Box,
    Building,
    CheckCircle,
    Filter,
    UserPlus,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface Props {
    hakAkses?: HakAkses;
    ruanganDijaga: Ruangan[];
    mahasiswas: Mahasiswa[];
    selectedMahasiswaIds?: number[];
}

export default function HakAksesPenjagaForm({
    hakAkses,
    ruanganDijaga,
    mahasiswas,
    selectedMahasiswaIds = [],
}: Props) {
    const [tahunFilter, setTahunFilter] = useState<string>('all');
    const [searchMahasiswa, setSearchMahasiswa] = useState<string>('');

    const normalizeDate = (value?: string) => {
        if (!value) return new Date().toISOString().split('T')[0];
        return value.slice(0, 10);
    };

    const normalizeTime = (value?: string) => {
        if (!value) return '08:00';
        return value.slice(0, 5);
    };

    const { data, setData, errors, processing, post, put } =
        useForm<HakAksesFormData>({
            ruangan_id: hakAkses?.ruangan_id || ruanganDijaga[0]?.id || 0,
            tanggal: normalizeDate(hakAkses?.tanggal),
            jam_masuk: normalizeTime(hakAkses?.jam_masuk),
            jam_keluar: normalizeTime(hakAkses?.jam_keluar),
            tujuan: hakAkses?.tujuan || '',
            skill: hakAkses?.skill || '',
            additional_participant: hakAkses?.additional_participant || '',
            mahasiswa_ids: selectedMahasiswaIds,
            // Penjaga otomatis approve
            is_approve: true,
            is_by_admin: false,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (hakAkses) {
            put(`/penjaga/hak-akses/${hakAkses.id}`);
        } else {
            post('/penjaga/hak-akses');
        }
    };

    // Filter mahasiswa berdasarkan tahun dan pencarian
    const filteredMahasiswas = useMemo(() => {
        return mahasiswas.filter((mahasiswa) => {
            const matchesTahun =
                tahunFilter === 'all' ||
                mahasiswa.tahun_masuk.toString() === tahunFilter;
            const matchesSearch =
                !searchMahasiswa ||
                mahasiswa.nama
                    .toLowerCase()
                    .includes(searchMahasiswa.toLowerCase()) ||
                mahasiswa.nim
                    .toLowerCase()
                    .includes(searchMahasiswa.toLowerCase());
            return matchesTahun && matchesSearch;
        });
    }, [mahasiswas, tahunFilter, searchMahasiswa]);

    // Tahun unik untuk filter
    const tahunOptions = useMemo(() => {
        const years = new Set(mahasiswas.map((m) => m.tahun_masuk));
        return Array.from(years).sort((a, b) => b - a);
    }, [mahasiswas]);

    const selectedMahasiswas = useMemo(() => {
        return mahasiswas.filter((m) => data.mahasiswa_ids?.includes(m.id));
    }, [mahasiswas, data.mahasiswa_ids]);

    const toggleMahasiswa = (mahasiswaId: number) => {
        const currentIds = data.mahasiswa_ids || [];
        const newIds = currentIds.includes(mahasiswaId)
            ? currentIds.filter((id) => id !== mahasiswaId)
            : [...currentIds, mahasiswaId];

        setData('mahasiswa_ids', newIds);
    };

    const selectedRuangan = ruanganDijaga.find(
        (r) => r.id === data.ruangan_id,
    );
    const kuota = selectedRuangan?.max_register || 0;
    const kuotaTersedia = kuota - (data.mahasiswa_ids?.length || 0);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informasi Dasar */}
            <Card>
                <CardHeader>
                    <CardTitle>Informasi Dasar</CardTitle>
                    <CardDescription>
                        Data jadwal dan ruangan untuk hak akses
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="ruangan_id">Ruangan *</Label>
                            <Select
                                value={data.ruangan_id.toString()}
                                onValueChange={(value) =>
                                    setData('ruangan_id', parseInt(value))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih ruangan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ruanganDijaga.map((ruangan) => (
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
                            {errors.ruangan_id && (
                                <p className="text-sm text-red-600">
                                    {errors.ruangan_id}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tanggal">Tanggal *</Label>
                            <Input
                                id="tanggal"
                                type="date"
                                value={data.tanggal}
                                onChange={(e) =>
                                    setData('tanggal', e.target.value)
                                }
                                min={new Date().toISOString().split('T')[0]}
                            />
                            {errors.tanggal && (
                                <p className="text-sm text-red-600">
                                    {errors.tanggal}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="jam_masuk">Jam Masuk *</Label>
                            <Input
                                id="jam_masuk"
                                type="time"
                                value={data.jam_masuk}
                                onChange={(e) =>
                                    setData('jam_masuk', e.target.value)
                                }
                            />
                            {errors.jam_masuk && (
                                <p className="text-sm text-red-600">
                                    {errors.jam_masuk}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="jam_keluar">Jam Keluar *</Label>
                            <Input
                                id="jam_keluar"
                                type="time"
                                value={data.jam_keluar}
                                onChange={(e) =>
                                    setData('jam_keluar', e.target.value)
                                }
                            />
                            {errors.jam_keluar && (
                                <p className="text-sm text-red-600">
                                    {errors.jam_keluar}
                                </p>
                            )}
                        </div>

                        <div className="space-y-4 pt-2">
                             <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-900/20 p-2">
                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <span className="text-sm text-green-800 dark:text-green-200">
                                    Hak akses akan otomatis disetujui karena
                                    dibuat oleh penjaga
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tujuan dan Keterangan */}
            <Card>
                <CardHeader>
                    <CardTitle>Tujuan dan Keterangan</CardTitle>
                    <CardDescription>
                        Informasi tentang penggunaan ruangan
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="tujuan">Tujuan Akses *</Label>
                        <Textarea
                            id="tujuan"
                            value={data.tujuan}
                            onChange={(e) => setData('tujuan', e.target.value)}
                            placeholder="Jelaskan tujuan penggunaan ruangan..."
                            rows={3}
                        />
                        {errors.tujuan && (
                            <p className="text-sm text-red-600">
                                {errors.tujuan}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="skill"
                            className="flex items-center gap-2"
                        >
                            <Box className="h-4 w-4" />
                            Skill yang Dibutuhkan
                        </Label>
                        <Textarea
                            id="skill"
                            value={data.skill || ''}
                            onChange={(e) => setData('skill', e.target.value)}
                            placeholder="Skill atau kemampuan khusus yang diperlukan..."
                            rows={2}
                        />
                        {errors.skill && (
                            <p className="text-sm text-red-600">
                                {errors.skill}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="additional_participant"
                            className="flex items-center gap-2"
                        >
                            <UserPlus className="h-4 w-4" />
                            Peserta Tambahan
                        </Label>
                        <Textarea
                            id="additional_participant"
                            value={data.additional_participant || ''}
                            onChange={(e) =>
                                setData(
                                    'additional_participant',
                                    e.target.value,
                                )
                            }
                            placeholder="Informasi peserta tambahan di luar mahasiswa..."
                            rows={2}
                        />
                        {errors.additional_participant && (
                            <p className="text-sm text-red-600">
                                {errors.additional_participant}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Pemilihan Mahasiswa */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Pemilihan Mahasiswa
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Badge
                                variant={
                                    kuotaTersedia >= 0
                                        ? 'default'
                                        : 'destructive'
                                }
                            >
                                {data.mahasiswa_ids?.length || 0} /{' '}
                                {kuota} terpilih
                            </Badge>
                            {kuotaTersedia >= 0 ? (
                                <span className="text-green-600">
                                    {kuotaTersedia} kuota tersedia
                                </span>
                            ) : (
                                <span className="text-red-600">
                                    Kuota terlampaui!
                                </span>
                            )}
                        </div>
                    </CardTitle>
                    <CardDescription>
                        Pilih mahasiswa yang akan memiliki akses ke ruangan
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Filter Controls */}
                    <div className="mb-4 grid grid-cols-1 gap-4 rounded-lg bg-muted p-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label
                                htmlFor="searchMahasiswa"
                                className="flex items-center gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                Cari Mahasiswa
                            </Label>
                            <Input
                                id="searchMahasiswa"
                                placeholder="Cari nama atau NIM..."
                                value={searchMahasiswa}
                                onChange={(e) =>
                                    setSearchMahasiswa(e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tahunFilter">
                                Filter Tahun Masuk
                            </Label>
                            <Select
                                value={tahunFilter}
                                onValueChange={setTahunFilter}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Tahun" />
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
                        <div className="flex items-end">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setData('mahasiswa_ids', [])}
                            >
                                Hapus Semua
                            </Button>
                        </div>
                    </div>

                    {/* Mahasiswa List */}
                    <div className="rounded-lg border">
                        <div className="max-h-96 overflow-y-auto">
                            {filteredMahasiswas.length > 0 ? (
                                <div className="divide-y">
                                    {filteredMahasiswas.map((mahasiswa) => {
                                        const isSelected =
                                            data.mahasiswa_ids?.includes(
                                                mahasiswa.id,
                                            ) || false;
                                        return (
                                            <div
                                                key={mahasiswa.id}
                                                 className={`flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-muted/50 ${
                                                     isSelected
                                                         ? 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/30'
                                                         : ''
                                                 }`}
                                                onClick={() =>
                                                    toggleMahasiswa(
                                                        mahasiswa.id,
                                                    )
                                                }
                                            >
                                                <div className="flex items-center gap-3">
                                                     <div
                                                         className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                                             isSelected
                                                                 ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                                                                 : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400'
                                                         }`}
                                                     >
                                                         <Users className="h-4 w-4" />
                                                     </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {mahasiswa.nama}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            NIM: {mahasiswa.nim}{' '}
                                                            • Tahun:{' '}
                                                            {
                                                                mahasiswa.tahun_masuk
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant={
                                                            mahasiswa.status
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {mahasiswa.status
                                                            ? 'Aktif'
                                                            : 'Nonaktif'}
                                                    </Badge>
                                                    <div
                                                         className={`h-4 w-4 rounded border-2 ${
                                                             isSelected
                                                                 ? 'border-blue-600 bg-blue-600'
                                                                 : 'border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900'
                                                         }`}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-muted-foreground">
                                    <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                    <p>Tidak ada mahasiswa ditemukan</p>
                                    <p className="text-sm">
                                        Coba ubah filter pencarian
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Selected Mahasiswa Preview */}
                    {selectedMahasiswas.length > 0 && (
                        <div className="mt-4">
                            <Label>Mahasiswa Terpilih:</Label>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {selectedMahasiswas
                                    .slice(0, 5)
                                    .map((mahasiswa) => (
                                        <Badge
                                            key={mahasiswa.id}
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {mahasiswa.nama} ({mahasiswa.nim})
                                        </Badge>
                                    ))}
                                {selectedMahasiswas.length > 5 && (
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        +{selectedMahasiswas.length - 5} lainnya
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

                    {errors.mahasiswa_ids && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.mahasiswa_ids}
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Preview Information */}
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle>Preview Hak Akses</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="font-medium">Ruangan:</span>
                                <span>
                                    {ruanganDijaga.find(
                                        (r) => r.id === data.ruangan_id,
                                    )?.nama_ruangan || 'Belum dipilih'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Tanggal:</span>
                                <span>{data.tanggal || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Jam:</span>
                                <span>
                                    {data.jam_masuk} - {data.jam_keluar}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="font-medium">Status:</span>
                                <Badge variant="default">
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                    Akan Disetujui
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Peserta:</span>
                                <span>
                                    {data.mahasiswa_ids?.length || 0} mahasiswa
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Kuota:</span>
                                <span
                                    className={
                                        kuotaTersedia < 0
                                            ? 'font-semibold text-red-600'
                                            : ''
                                    }
                                >
                                    {kuotaTersedia >= 0
                                        ? `${kuotaTersedia} tersedia`
                                        : 'Terlampaui!'}
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
                    disabled={processing || kuotaTersedia < 0}
                    className="sm:w-auto"
                >
                    {processing ? (
                        <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Menyimpan...
                        </>
                    ) : hakAkses ? (
                        'Perbarui Hak Akses'
                    ) : (
                        'Buat Hak Akses'
                    )}
                </Button>
            </div>
        </form>
    );
}
