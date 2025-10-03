<?php

namespace App\Http\Controllers\Penjaga;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\HakAkses;
use App\Models\Ruangan;
use App\Models\ScanerStatus;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Get ruangan yang dijaga oleh penjaga
        $ruanganIds = $user->ruangans->pluck('id');
        $ruanganDijaga = $user->ruangans;

        // Statistik untuk ruangan yang dijaga
        $statistics = [
            'total_ruangan' => $ruanganIds->count(),
            'hak_akses_hari_ini' => HakAkses::whereIn('ruangan_id', $ruanganIds)
                ->whereDate('tanggal', today())
                ->where('is_approve', true)
                ->count(),
            'absensi_hari_ini' => Absensi::whereIn('ruangan_id', $ruanganIds)
                ->whereDate('waktu_masuk', today())
                ->count(),
            'sedang_akses' => Absensi::whereIn('ruangan_id', $ruanganIds)
                ->whereNotNull('waktu_masuk')
                ->whereNull('waktu_keluar')
                ->count(),
        ];

        // Tambahkan statistik untuk setiap ruangan
        $ruanganDijaga->each(function ($ruangan) {
            $ruangan->absensi_hari_ini = $ruangan->absensis()
                ->whereDate('waktu_masuk', today())
                ->count();
            $ruangan->sedang_akses = $ruangan->absensis()
                ->whereDate('waktu_masuk', today())
                ->whereNull('waktu_keluar')
                ->count();
            $ruangan->total_scanner = $ruangan->scanerStatuses()->count();
            $ruangan->scanner_aktif = $ruangan->scanerStatuses()
                ->whereNotNull('last')
                ->where('last', '>=', now()->subHours(24))
                ->count();
        });

        // Hak Akses Mendatang (5 hari ke depan)
        $hakAksesMendatang = HakAkses::with(['ruangan', 'mahasiswas'])
            ->whereIn('ruangan_id', $ruanganIds)
            ->where('tanggal', '>=', today())
            ->where('is_approve', true)
            ->orderBy('tanggal')
            ->take(5)
            ->get();

        // Aktivitas Terkini (10 absensi terbaru di ruangan penjaga)
        $aktivitasTerkini = Absensi::with(['ruangan', 'user'])
            ->whereIn('ruangan_id', $ruanganIds)
            ->latest('waktu_masuk')
            ->take(10)
            ->get();

        // Grafik Absensi 7 Hari Terakhir untuk ruangan penjaga
        $absensi7Hari = Absensi::whereIn('ruangan_id', $ruanganIds)
            ->where('waktu_masuk', '>=', now()->subDays(7))
            ->selectRaw('DATE(waktu_masuk) as tanggal, COUNT(*) as total')
            ->groupBy('tanggal')
            ->orderBy('tanggal')
            ->get()
            ->pluck('total', 'tanggal');

        // Scanner Status untuk ruangan penjaga
        $scannerStatus = ScanerStatus::whereIn('ruangan_id', $ruanganIds)
            ->with('ruangan')
            ->get();

        return Inertia::render('Penjaga/Dashboard', [
            'user' => $user,
            'statistics' => $statistics,
            'ruanganDijaga' => $ruanganDijaga,
            'hakAksesMendatang' => $hakAksesMendatang,
            'aktivitasTerkini' => $aktivitasTerkini,
            'charts' => [
                'absensi_7_hari' => $this->formatChartData($absensi7Hari, 7),
            ],
            'scannerStatus' => $scannerStatus,
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

    public function getRealTimeData()
    {
        $user = auth()->user();
        $ruanganIds = $user->ruangans->pluck('id');

        $realTimeData = [
            'sedang_akses' => Absensi::whereIn('ruangan_id', $ruanganIds)
                ->whereNotNull('waktu_masuk')
                ->whereNull('waktu_keluar')
                ->count(),
            'absensi_hari_ini' => Absensi::whereIn('ruangan_id', $ruanganIds)
                ->whereDate('waktu_masuk', today())
                ->count(),
            'scanner_aktif' => ScanerStatus::whereIn('ruangan_id', $ruanganIds)
                ->whereNotNull('last')
                ->where('last', '>=', now()->subHours(24))
                ->count(),
        ];

        return response()->json($realTimeData);
    }

    public function getRuanganStats($ruanganId)
    {
        $user = auth()->user();
        $ruanganIds = $user->ruangans->pluck('id');

        // Pastikan ruangan termasuk yang dijaga
        if (! $ruanganIds->contains($ruanganId)) {
            abort(403, 'Anda tidak memiliki akses ke ruangan ini.');
        }

        $ruangan = Ruangan::findOrFail($ruanganId);

        $stats = [
            'nama_ruangan' => $ruangan->nama_ruangan,
            'absensi_hari_ini' => $ruangan->absensis()
                ->whereDate('waktu_masuk', today())
                ->count(),
            'sedang_akses' => $ruangan->absensis()
                ->whereNotNull('waktu_masuk')
                ->whereNull('waktu_keluar')
                ->count(),
            'hak_akses_hari_ini' => $ruangan->hakAkses()
                ->whereDate('tanggal', today())
                ->where('is_approve', true)
                ->count(),
            'total_scanner' => $ruangan->scanerStatuses()->count(),
            'scanner_aktif' => $ruangan->scanerStatuses()
                ->whereNotNull('last')
                ->where('last', '>=', now()->subHours(24))
                ->count(),
        ];

        return response()->json($stats);
    }
}
