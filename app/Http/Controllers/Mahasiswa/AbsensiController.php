<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AbsensiController extends Controller
{
    public function index(Request $request)
    {
        $mahasiswa = auth()->user()->mahasiswa;

        $query = Absensi::with(['ruangan'])
            ->where('id_tag', $mahasiswa->id_tag)
            ->latest('waktu_masuk');

        // Date filter
        if ($request->has('tanggal') && $request->tanggal) {
            $query->whereDate('waktu_masuk', $request->tanggal);
        }

        // Status filter
        if ($request->filled('status') && $request->status !== 'all') {
            if ($request->status === 'masuk') {
                $query->whereNotNull('waktu_masuk')->whereNull('waktu_keluar');
            } elseif ($request->status === 'keluar') {
                $query->whereNotNull('waktu_masuk')->whereNotNull('waktu_keluar');
            }
        }

        $absensis = $query->paginate(20);

        // Statistics untuk mahasiswa
        $statistics = [
            'total' => Absensi::where('id_tag', $mahasiswa->id_tag)->count(),
            'hari_ini' => Absensi::where('id_tag', $mahasiswa->id_tag)
                ->whereDate('waktu_masuk', today())
                ->count(),
            'sedang_akses' => Absensi::where('id_tag', $mahasiswa->id_tag)
                ->whereNotNull('waktu_masuk')
                ->whereNull('waktu_keluar')
                ->count(),
        ];

        return Inertia::render('Mahasiswa/Absensi/Index', [
            'absensis' => $absensis,
            'filters' => $request->only(['tanggal', 'status']),
            'statistics' => $statistics,
        ]);
    }
}
