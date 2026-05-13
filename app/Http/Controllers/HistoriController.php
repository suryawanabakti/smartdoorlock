<?php

namespace App\Http\Controllers;

use App\Models\Histori;
use App\Models\Mahasiswa;
use App\Models\Ruangan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Exports\HistoriExport;
use Maatwebsite\Excel\Facades\Excel;


class HistoriController extends Controller
{
    public function index(Request $request)
    {
        $query = Histori::with(['scanner.ruangan'])
            ->latest('waktu');

        // Search filter
        if ($request->filled('search') && $request->search !== 'all') {
            $query->where(function ($q) use ($request) {
                $q->where('id_tag', 'like', "%{$request->search}%")
                    ->orWhere('nama', 'like', "%{$request->search}%")
                    ->orWhere('nim', 'like', "%{$request->search}%")
                    ->orWhere('kode', 'like', "%{$request->search}%");
            });
        }

        // Status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Ruangan filter
        if ($request->filled('ruangan_id') && $request->ruangan_id !== 'all') {
            $query->whereHas('scanner', function ($q) use ($request) {
                $q->where('ruangan_id', $request->ruangan_id);
            });
        }

        // Scanner type filter
        if ($request->filled('type') && $request->type !== 'all') {
            $query->whereHas('scanner', function ($q) use ($request) {
                $q->where('type', $request->type);
            });
        }

        // Date range filter
        if ($request->has('tanggal_mulai') && $request->tanggal_mulai) {
            $query->whereDate('waktu', '>=', $request->tanggal_mulai);
        }

        if ($request->has('tanggal_selesai') && $request->tanggal_selesai) {
            $query->whereDate('waktu', '<=', $request->tanggal_selesai);
        }

        // Time range filter
        if ($request->has('jam_mulai') && $request->jam_mulai) {
            $query->whereTime('waktu', '>=', $request->jam_mulai);
        }

        if ($request->has('jam_selesai') && $request->jam_selesai) {
            $query->whereTime('waktu', '<=', $request->jam_selesai);
        }

        // Kelas/Mahasiswa filter
        if ($request->filled('kelas') && $request->kelas !== 'all') {
            $query->whereHas('scanner.ruangan.mahasiswas', function ($q) use ($request) {
                $q->where('ruangan_id', $request->kelas);
            });
        }

        // Tahun masuk filter
        if ($request->filled('tahun_masuk') && $request->tahun_masuk !== 'all') {
            $query->whereHas('scanner.ruangan.mahasiswas', function ($q) use ($request) {
                $q->where('tahun_masuk', $request->tahun_masuk);
            });
        }

        $historis = $query->paginate(20);

        // Get statistics for the filtered results
        $statistics = [
            'total' => $historis->total(),
            'terbuka' => $this->getCountByStatus($query, 1),
            'blok' => $this->getCountByStatus($query, 0),
            'tidak_terdaftar' => $this->getCountByStatus($query, 2),
            'no_akses' => $this->getCountByStatus($query, 3),
        ];

        return Inertia::render('Histori/Index', [
            'historis' => $historis,
            'filters' => $request->only([
                'search', 'status', 'ruangan_id', 'type',
                'tanggal_mulai', 'tanggal_selesai',
                'jam_mulai', 'jam_selesai', 'kelas', 'tahun_masuk',
            ]),
            'statistics' => $statistics,
            'statusOptions' => Histori::getStatusOptions(),
            'ruangans' => Ruangan::all(),
            'typeOptions' => [
                ['value' => 'all', 'label' => 'Semua Type'],
                ['value' => 'dalam', 'label' => 'Scanner Dalam'],
                ['value' => 'luar', 'label' => 'Scanner Luar'],
            ],
            'tahunOptions' => range(date('Y'), date('Y') - 10, -1),
            'kelasOptions' => Ruangan::where('type', 'kelas')->get(),
        ]);
    }

    private function getCountByStatus($query, $status)
    {
        $cloneQuery = clone $query;

        return $cloneQuery->where('status', $status)->count();
    }

    public function export(Request $request)
    {
        $filters = $request->all();
        $fileName = 'riwayat_scan_' . date('Ymd_His') . '.xlsx';
        
        return Excel::download(new HistoriExport($filters), $fileName);
    }


    public function statistics(Request $request)
    {
        $query = Histori::query();

        // Apply the same filters as index method
        if ($request->has('ruangan_id') && $request->ruangan_id) {
            $query->whereHas('scanner', function ($q) use ($request) {
                $q->where('ruangan_id', $request->ruangan_id);
            });
        }

        if ($request->has('tanggal_mulai') && $request->tanggal_mulai) {
            $query->whereDate('waktu', '>=', $request->tanggal_mulai);
        }

        if ($request->has('tanggal_selesai') && $request->tanggal_selesai) {
            $query->whereDate('waktu', '<=', $request->tanggal_selesai);
        }

        $stats = [
            'total_scans' => $query->count(),
            'scans_today' => $query->whereDate('waktu', today())->count(),
            'scans_this_week' => $query->whereBetween('waktu', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'scans_this_month' => $query->whereBetween('waktu', [now()->startOfMonth(), now()->endOfMonth()])->count(),
            'status_counts' => [
                'terbuka' => $query->where('status', 1)->count(),
                'blok' => $query->where('status', 0)->count(),
                'tidak_terdaftar' => $query->where('status', 2)->count(),
                'no_akses' => $query->where('status', 3)->count(),
            ],
        ];

        return response()->json($stats);
    }
}
