<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\HakAkses;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $mahasiswa = $user->mahasiswa;

        // Statistik untuk mahasiswa
        $statistics = [
            'hak_akses_disetujui' => HakAkses::whereHas('mahasiswas', function ($query) use ($mahasiswa) {
                $query->where('mahasiswa_id', $mahasiswa->id);
            })->where('is_approve', true)->count(),
            'hak_akses_menunggu' => HakAkses::whereHas('mahasiswas', function ($query) use ($mahasiswa) {
                $query->where('mahasiswa_id', $mahasiswa->id);
            })->where('is_approve', false)->count(),
            'total_absensi' => Absensi::where('id_tag', $mahasiswa->id_tag)->count(),
            'absensi_hari_ini' => Absensi::where('id_tag', $mahasiswa->id_tag)
                ->whereDate('waktu_masuk', today())
                ->count(),
        ];

        // Hak akses yang disetujui
        $hakAksesDisetujui = HakAkses::with(['ruangan'])
            ->whereHas('mahasiswas', function ($query) use ($mahasiswa) {
                $query->where('mahasiswa_id', $mahasiswa->id);
            })
            ->where('is_approve', true)
            ->where('tanggal', '>=', today())
            ->orderBy('tanggal')
            ->take(5)
            ->get();

        // Aktivitas absensi terbaru
        $aktivitasTerkini = Absensi::with(['ruangan'])
            ->where('id_tag', $mahasiswa->id_tag)
            ->latest('waktu_masuk')
            ->take(10)
            ->get();

        return Inertia::render('Mahasiswa/Dashboard', [
            'statistics' => $statistics,
            'hakAksesDisetujui' => $hakAksesDisetujui,
            'aktivitasTerkini' => $aktivitasTerkini,
            'mahasiswa' => $mahasiswa,
        ]);
    }
}
