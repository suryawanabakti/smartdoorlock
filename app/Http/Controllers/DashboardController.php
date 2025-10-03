<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\HakAkses;
use App\Models\Mahasiswa;
use App\Models\Ruangan;
use App\Models\ScanerStatus;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        if (auth()->user()->role == 'mahasiswa') {
            return redirect('/mahasiswa/dashboard');
        }
        if (auth()->user()->role == 'penjaga') {
            return redirect('/penjaga/dashboard');
        }
        // Statistik Hari Ini
        $absensiHariIni = Absensi::whereDate('waktu_masuk', today())->count();
        $sedangAkses = Absensi::whereDate('waktu_masuk', today())
            ->whereNull('waktu_keluar')
            ->count();

        // Statistik User
        $totalUsers = User::count();
        $totalMahasiswa = Mahasiswa::where('ket', 'mahasiswa')->count();
        $totalDosen = Mahasiswa::where('ket', 'dosen')->count();
        $totalPenjaga = User::where('role', 'penjaga')->count();

        // Statistik Ruangan
        $totalRuangan = Ruangan::count();
        $ruanganAktif = Ruangan::where('open_api', true)->count();
        $totalScanner = ScanerStatus::count();

        // Hak Akses Hari Ini
        $hakAksesHariIni = HakAkses::whereDate('tanggal', today())
            ->where('is_approve', true)
            ->count();

        // Grafik Absensi 7 Hari Terakhir
        $absensi7Hari = Absensi::where('waktu_masuk', '>=', now()->subDays(7))
            ->selectRaw('DATE(waktu_masuk) as tanggal, COUNT(*) as total')
            ->groupBy('tanggal')
            ->orderBy('tanggal')
            ->get()
            ->pluck('total', 'tanggal');

        // Grafik Absensi per Ruangan Hari Ini
        $absensiPerRuanganHariIni = Absensi::whereDate('waktu_masuk', today())
            ->join('ruangans', 'absensis.ruangan_id', '=', 'ruangans.id')
            ->select('ruangans.nama_ruangan', DB::raw('COUNT(*) as total'))
            ->groupBy('ruangans.id', 'ruangans.nama_ruangan')
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get();

        // Grafik Status User
        $userStatus = [
            'admin' => User::where('role', 'admin')->count(),
            'super' => User::where('role', 'super')->count(),
            'penjaga' => User::where('role', 'penjaga')->count(),
            'mahasiswa' => User::where('role', 'mahasiswa')->count(),
            'dosen' => User::where('role', 'dosen')->count(),
        ];

        // Aktivitas Terkini (10 absensi terbaru)
        $aktivitasTerkini = Absensi::with('ruangan', 'user')
            ->latest('waktu_masuk')
            ->take(10)
            ->get();

        // Scanner Activity
        $scannerAktif = ScanerStatus::whereNotNull('last')
            ->where('last', '>=', now()->subHours(24))
            ->count();

        // Hak Akses Mendatang
        $hakAksesMendatang = HakAkses::with('ruangan')
            ->where('tanggal', '>=', today())
            ->where('is_approve', true)
            ->orderBy('tanggal')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'statistics' => [
                'absensi_hari_ini' => $absensiHariIni,
                'sedang_akses' => $sedangAkses,
                'total_users' => $totalUsers,
                'total_mahasiswa' => $totalMahasiswa,
                'total_dosen' => $totalDosen,
                'total_penjaga' => $totalPenjaga,
                'total_ruangan' => $totalRuangan,
                'ruangan_aktif' => $ruanganAktif,
                'total_scanner' => $totalScanner,
                'scanner_aktif' => $scannerAktif,
                'hak_akses_hari_ini' => $hakAksesHariIni,
            ],
            'charts' => [
                'absensi_7_hari' => $this->formatChartData($absensi7Hari, 7),
                'absensi_per_ruangan' => $absensiPerRuanganHariIni,
                'user_status' => $userStatus,
            ],
            'aktivitas_terkini' => $aktivitasTerkini,
            'hak_akses_mendatang' => $hakAksesMendatang,
        ]);
    }

    private function formatChartData($data, $days)
    {
        $chartData = [];
        $labels = [];

        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $labels[] = now()->subDays($i)->format('d M');
            $chartData[] = $data[$date] ?? 0;
        }

        return [
            'labels' => $labels,
            'data' => $chartData,
        ];
    }
}
