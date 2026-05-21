import { StatCard } from '@/components/StatCard';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import { DashboardData } from '@/types/mahasiswa';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    Calendar,
    CheckCircle,
    Clock,
    DoorOpen,
    User,
} from 'lucide-react';

interface Props {
    statistics: DashboardData['statistics'];
    hakAksesDisetujui: DashboardData['hakAksesDisetujui'];
    aktivitasTerkini: DashboardData['aktivitasTerkini'];
    mahasiswa: DashboardData['mahasiswa'];
}

const MahasiswaDashboard = ({
    statistics,
    hakAksesDisetujui,
    aktivitasTerkini,
    mahasiswa,
}: Props) => {
    const { auth } = usePage<any>().props;
    const isProfileIncomplete = !auth.user.nowa || !auth.user.email_notifikasi;

    const breadcrumbs = [{ title: 'Dashboard', href: '/mahasiswa/dashboard' }];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (timeString: string) => {
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString(
            'id-ID',
            {
                hour: '2-digit',
                minute: '2-digit',
            },
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Masuk':
                return <Badge variant="default">Masuk</Badge>;
            case 'Selesai':
                return <Badge variant="secondary">Selesai</Badge>;
            case 'Tidak Valid':
                return <Badge variant="destructive">Tidak Valid</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Mahasiswa" />

            <div className="space-y-6 p-4">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Selamat Datang, {mahasiswa.nama}!
                    </h1>
                    <p className="text-muted-foreground">
                        NIM: {mahasiswa.nim} | ID Tag: {mahasiswa.id_tag}
                    </p>
                </div>

                {isProfileIncomplete && (
                    <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800 [&>svg]:text-yellow-800">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Profil Belum Lengkap</AlertTitle>
                        <AlertDescription className="text-yellow-800/90">
                            Sangat disarankan untuk mengisi <strong>Nomor WA aktif</strong> dan <strong>Email Notifikasi</strong> agar Anda dapat menerima pemberitahuan penting (seperti status persetujuan ruangan dan peringatan jam pulang). <br />
                            <Link href="/settings/profile" className="mt-1 inline-block font-medium underline hover:text-yellow-900">
                                Lengkapi Profil Sekarang
                            </Link>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Statistics Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Hak Akses Disetujui"
                        value={statistics.hak_akses_disetujui}
                        icon={
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        }
                        description="Total akses ruangan yang disetujui"
                    />
                    <StatCard
                        title="Menunggu Persetujuan"
                        value={statistics.hak_akses_menunggu}
                        icon={
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                        }
                        description="Permohonan akses yang sedang diproses"
                    />
                    <StatCard
                        title="Total Absensi"
                        value={statistics.total_absensi}
                        icon={<DoorOpen className="h-4 w-4 text-blue-500" />}
                        description="Riwayat kehadiran keseluruhan"
                    />
                    <StatCard
                        title="Absensi Hari Ini"
                        value={statistics.absensi_hari_ini}
                        icon={<User className="h-4 w-4 text-purple-500" />}
                        description="Kehadiran pada hari ini"
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Hak Akses yang Disetujui */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Hak Akses Mendatang
                            </CardTitle>
                            <CardDescription>
                                Daftar akses ruangan yang sudah disetujui
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {hakAksesDisetujui.length === 0 ? (
                                <div className="py-6 text-center text-muted-foreground">
                                    <Calendar className="mx-auto mb-2 h-12 w-12 opacity-50" />
                                    <p>Tidak ada hak akses yang disetujui</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {hakAksesDisetujui.map((hakAkses) => (
                                        <div
                                            key={hakAkses.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div className="space-y-1">
                                                <div className="font-medium">
                                                    {hakAkses.ruangan.nama}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDate(
                                                        hakAkses.tanggal,
                                                    )}{' '}
                                                    •{' '}
                                                    {formatTime(
                                                        hakAkses.jam_masuk,
                                                    )}{' '}
                                                    -{' '}
                                                    {formatTime(
                                                        hakAkses.jam_keluar,
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {hakAkses.tujuan}
                                                </div>
                                            </div>
                                            <Badge variant="default">
                                                Disetujui
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Aktivitas Terkini */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Aktivitas Terkini
                            </CardTitle>
                            <CardDescription>
                                Riwayat absensi terbaru
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {aktivitasTerkini.length === 0 ? (
                                <div className="py-6 text-center text-muted-foreground">
                                    <DoorOpen className="mx-auto mb-2 h-12 w-12 opacity-50" />
                                    <p>Belum ada riwayat absensi</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {aktivitasTerkini.map((absensi) => (
                                        <div
                                            key={absensi.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div className="space-y-1">
                                                <div className="font-medium">
                                                    {absensi.ruangan.nama}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(
                                                        absensi.waktu_masuk,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                        {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        },
                                                    )}{' '}
                                                    •{' '}
                                                    {new Date(
                                                        absensi.waktu_masuk,
                                                    ).toLocaleTimeString(
                                                        'id-ID',
                                                        {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        },
                                                    )}
                                                </div>
                                                {absensi.waktu_keluar && (
                                                    <div className="text-xs text-muted-foreground">
                                                        Keluar:{' '}
                                                        {new Date(
                                                            absensi.waktu_keluar,
                                                        ).toLocaleTimeString(
                                                            'id-ID',
                                                            {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            },
                                                        )}{' '}
                                                        • Durasi:{' '}
                                                        {absensi.durasi}
                                                    </div>
                                                )}
                                            </div>
                                            {getStatusBadge(absensi.status)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default MahasiswaDashboard;
