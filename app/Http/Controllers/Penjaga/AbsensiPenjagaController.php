<?php

namespace App\Http\Controllers\Penjaga;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AbsensiPenjagaController extends Controller
{

    public function index(Request $request)
    {
        $user = auth()->user();
        $ruanganIds = $user->ruangans->pluck('id');

        $query = Absensi::with(['ruangan', 'user'])
            ->whereIn('ruangan_id', $ruanganIds)
            ->latest('waktu_masuk');

        // Ruangan filter (hanya ruangan yang dijaga)
        if ($request->filled('ruangan_id') && $request->ruangan_id !== 'all') {
            $requestedRuangan = $request->ruangan_id;
            if ($ruanganIds->contains((int) $requestedRuangan)) {
                $query->where('ruangan_id', $requestedRuangan);
            }
        }

        // Search filter
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nama', 'like', "%{$request->search}%")
                    ->orWhere('nim', 'like', "%{$request->search}%")
                    ->orWhere('id_tag', 'like', "%{$request->search}%");
            });
        }

        // Date filter
        if ($request->has('tanggal') && $request->tanggal) {
            $query->whereDate('waktu_masuk', $request->tanggal);
        }

        // Status filter
        if ($request->has('status') && $request->status) {
            if ($request->status === 'masuk') {
                $query->whereNotNull('waktu_masuk')->whereNull('waktu_keluar');
            } elseif ($request->status === 'keluar') {
                $query->whereNotNull('waktu_masuk')->whereNotNull('waktu_keluar');
            }
        }

        $absensis = $query->paginate(20);

        // Statistics for penjaga's rooms only
        $statistics = [
            'hari_ini' => Absensi::whereIn('ruangan_id', $ruanganIds)
                ->whereDate('waktu_masuk', today())
                ->count(),
            'sedang_akses' => Absensi::whereIn('ruangan_id', $ruanganIds)
                ->whereNotNull('waktu_masuk')
                ->whereNull('waktu_keluar')
                ->count(),
            'total_ruangan' => $ruanganIds->count(),
        ];

        return Inertia::render('Penjaga/Absensi/Index', [
            'absensis' => $absensis,
            'filters' => $request->only(['search', 'ruangan_id', 'tanggal', 'status']),
            'statistics' => $statistics,
            'ruanganDijaga' => $user->ruangans,
        ]);
    }

    public function show(Absensi $absensi)
    {
        $user = auth()->user();
        $ruanganIds = $user->ruangans->pluck('id');

        if (! $ruanganIds->contains($absensi->ruangan_id)) {
            abort(403, 'Anda tidak memiliki akses ke absensi ini.');
        }

        $absensi->load(['ruangan', 'user']);

        return Inertia::render('Penjaga/Absensi/Show', [
            'absensi' => $absensi,
        ]);
    }
}
