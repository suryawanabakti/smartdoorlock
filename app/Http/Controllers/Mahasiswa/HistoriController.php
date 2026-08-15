<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Histori;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HistoriController extends Controller
{
    public function index(Request $request)
    {
        $mahasiswa = auth()->user()->mahasiswa;

        $query = Histori::with(['scanner.ruangan'])
            ->where('id_tag', $mahasiswa->id_tag)
            ->latest('waktu');

        // Status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
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

        $historis = $query->paginate(20);

        // Get statistics
        $statistics = [
            'total' => $historis->total(),
            'terbuka' => $this->getCountByStatus($query, 1),
            'blok' => $this->getCountByStatus($query, 0),
            'tidak_terdaftar' => $this->getCountByStatus($query, 2),
            'no_akses' => $this->getCountByStatus($query, 3),
        ];

        return Inertia::render('Mahasiswa/Histori/Index', [
            'historis' => $historis,
            'filters' => $request->only([
                'status', 'type', 'tanggal_mulai', 'tanggal_selesai',
            ]),
            'statistics' => $statistics,
            'statusOptions' => Histori::getStatusOptions(),
            'typeOptions' => [
                ['value' => 'all', 'label' => 'Semua Type'],
                ['value' => 'dalam', 'label' => 'Scanner Dalam'],
                ['value' => 'luar', 'label' => 'Scanner Luar'],
            ],
        ]);
    }

    private function getCountByStatus($query, $status)
    {
        $cloneQuery = clone $query;

        return $cloneQuery->where('status', $status)->count();
    }
}
