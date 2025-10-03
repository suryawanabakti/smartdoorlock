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
import { type HakAksesFormData } from '@/types/hak-akses';
import { type Mahasiswa } from '@/types/mahasiswa';
import { type Ruangan } from '@/types/ruangan';
import { useForm } from '@inertiajs/react';
import {
    Box,
    Building,
    Filter,
    GraduationCap,
    UserCheck,
    UserPlus,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface Props {
    hakAkses?: HakAkses;
    ruangans: Ruangan[];
    temanKelas: Mahasiswa[];
    mahasiswa: Mahasiswa;
    selectedMahasiswaIds?: number[];
}

export default function HakAksesMahasiswaForm({
    hakAkses,
    ruangans,
    temanKelas,
    mahasiswa,
    selectedMahasiswaIds = [],
}: Props) {
    const [filterType, setFilterType] = useState<
        'all' | 'teman_kelas' | 'tahun_masuk'
    >('teman_kelas');
    const [searchMahasiswa, setSearchMahasiswa] = useState<string>('');

    const { data, setData, errors, processing, post, put } =
        useForm<HakAksesFormData>({
            ruangan_id: hakAkses?.ruangan_id || ruangans[0]?.id || 0,
            tanggal:
                hakAkses?.tanggal || new Date().toISOString().split('T')[0],
            jam_masuk: hakAkses?.jam_masuk || '08:00',
            jam_keluar: hakAkses?.jam_keluar || '10:00',
            tujuan: hakAkses?.tujuan || '',
            skill: hakAkses?.skill || '',
            additional_participant: hakAkses?.additional_participant || '',
            max_register: hakAkses?.max_register || 10,
            mahasiswa_ids: selectedMahasiswaIds,
            is_approve: false,
            is_by_admin: false,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (hakAkses) {
            put(`/mahasiswa/hak-akses/${hakAkses.id}`);
        } else {
            post('/mahasiswa/hak-akses');
        }
    };

    // Filter mahasiswa berdasarkan jenis filter dan pencarian
    const filteredMahasiswas = useMemo(() => {
        let filtered = temanKelas;

        if (filterType === 'teman_kelas') {
            filtered = temanKelas.filter(
                (m) =>
                    m.ruangan_id === mahasiswa.ruangan_id &&
                    m.tahun_masuk === mahasiswa.tahun_masuk,
            );
        } else if (filterType === 'tahun_masuk') {
            filtered = temanKelas.filter(
                (m) => m.tahun_masuk === mahasiswa.tahun_masuk,
            );
        }
        // 'all' sudah termasuk semua temanKelas

        if (searchMahasiswa) {
            filtered = filtered.filter(
                (m) =>
                    m.nama
                        .toLowerCase()
                        .includes(searchMahasiswa.toLowerCase()) ||
                    m.nim.toLowerCase().includes(searchMahasiswa.toLowerCase()),
            );
        }

        return filtered;
    }, [temanKelas, filterType, searchMahasiswa, mahasiswa]);

    const selectedMahasiswas = useMemo(() => {
        return temanKelas.filter((m) => data.mahasiswa_ids?.includes(m.id));
    }, [temanKelas, data.mahasiswa_ids]);

    const toggleMahasiswa = (mahasiswaId: number) => {
        const currentIds = data.mahasiswa_ids || [];
        const newIds = currentIds.includes(mahasiswaId)
            ? currentIds.filter((id) => id !== mahasiswaId)
            : [...currentIds, mahasiswaId];

        setData('mahasiswa_ids', newIds);
    };

    const selectAllFiltered = () => {
        const filteredIds = filteredMahasiswas.map((m) => m.id);
        const currentIds = data.mahasiswa_ids || [];
        const newIds = [...new Set([...currentIds, ...filteredIds])];
        setData('mahasiswa_ids', newIds);
    };

    const deselectAllFiltered = () => {
        const filteredIds = filteredMahasiswas.map((m) => m.id);
        const currentIds = data.mahasiswa_ids || [];
        const newIds = currentIds.filter((id) => !filteredIds.includes(id));
        setData('mahasiswa_ids', newIds);
    };

    const isMahasiswaSelected = (mahasiswaId: number) => {
        return data.mahasiswa_ids?.includes(mahasiswaId) || false;
    };

    const kuotaTersedia =
        data.max_register - (data.mahasiswa_ids?.length || 0) - 1; // -1 untuk diri sendiri

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

                        <div className="space-y-2">
                            <Label htmlFor="max_register">
                                Kuota Maksimal *
                            </Label>
                            <Input
                                id="max_register"
                                type="number"
                                min="1"
                                max="20"
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

                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-2">
                                <UserCheck className="h-4 w-4 text-blue-600" />
                                <span className="text-sm text-blue-800">
                                    Anda otomatis termasuk sebagai peserta
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
                            placeholder="Jelaskan tujuan penggunaan ruangan (praktikum, belajar kelompok, penelitian, dll)..."
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
                            placeholder="Skill atau kemampuan khusus yang diperlukan untuk kegiatan ini..."
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
                            Peserta Tambahan (Non-Mahasiswa)
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
                            placeholder="Informasi peserta tambahan di luar mahasiswa (jika ada)..."
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

            {/* Pemilihan Teman */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Undang Teman
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Badge
                                variant={
                                    kuotaTersedia >= 0
                                        ? 'default'
                                        : 'destructive'
                                }
                            >
                                {data.mahasiswa_ids?.length || 0} teman + Anda
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
                        Pilih teman yang akan diajak (opsional)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Filter Controls */}
                    <div className="mb-4 grid grid-cols-1 gap-4 rounded-lg bg-muted p-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                Filter Teman
                            </Label>
                            <Select
                                value={filterType}
                                onValueChange={(value: any) =>
                                    setFilterType(value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="teman_kelas">
                                        Teman Sekelas
                                    </SelectItem>
                                    <SelectItem value="tahun_masuk">
                                        Teman Angkatan
                                    </SelectItem>
                                    <SelectItem value="all">
                                        Semua Mahasiswa
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Cari Teman</Label>
                            <Input
                                placeholder="Cari nama atau NIM..."
                                value={searchMahasiswa}
                                onChange={(e) =>
                                    setSearchMahasiswa(e.target.value)
                                }
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={selectAllFiltered}
                            >
                                Pilih Semua
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={deselectAllFiltered}
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
                                    {filteredMahasiswas.map((teman) => (
                                        <div
                                            key={teman.id}
                                            className={`flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-muted/50 ${
                                                isMahasiswaSelected(teman.id)
                                                    ? 'border-l-4 border-l-blue-500 bg-blue-50'
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                toggleMahasiswa(teman.id)
                                            }
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                                        isMahasiswaSelected(
                                                            teman.id,
                                                        )
                                                            ? 'bg-blue-100 text-blue-600'
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}
                                                >
                                                    <GraduationCap className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">
                                                        {teman.nama}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        NIM: {teman.nim} •{' '}
                                                        {teman.ruangan
                                                            ?.nama_ruangan ||
                                                            'Tidak ada kelas'}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Angkatan:{' '}
                                                        {teman.tahun_masuk}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={
                                                        teman.status
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {teman.status
                                                        ? 'Aktif'
                                                        : 'Nonaktif'}
                                                </Badge>
                                                <div
                                                    className={`h-4 w-4 rounded border-2 ${
                                                        isMahasiswaSelected(
                                                            teman.id,
                                                        )
                                                            ? 'border-blue-600 bg-blue-600'
                                                            : 'border-gray-300 bg-white'
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-muted-foreground">
                                    <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                    <p>Tidak ada teman ditemukan</p>
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
                            <Label>Teman Terpilih:</Label>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {selectedMahasiswas.slice(0, 5).map((teman) => (
                                    <Badge
                                        key={teman.id}
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {teman.nama} ({teman.nim})
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
                    <CardTitle>Preview Permohonan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="font-medium">Ruangan:</span>
                                <span>
                                    {data.ruangan_id
                                        ? ruangans.find(
                                              (r) => r.id === data.ruangan_id,
                                          )?.nama_ruangan || 'Tidak ditemukan'
                                        : 'Belum dipilih'}
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
                                <Badge variant="outline">
                                    ⏳ Menunggu Persetujuan
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">
                                    Total Peserta:
                                </span>
                                <span>
                                    {(data.mahasiswa_ids?.length || 0) + 1}{' '}
                                    orang
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
                        'Perbarui Permohonan'
                    ) : (
                        'Ajukan Permohonan'
                    )}
                </Button>
            </div>
        </form>
    );
}
