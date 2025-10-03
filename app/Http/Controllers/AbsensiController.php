<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\Ruangan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AbsensiController extends Controller
{
    public function index(Request $request)
    {
        $query = Absensi::with(['ruangan', 'user'])
            ->latest('waktu_masuk');

        // Search filter
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nama', 'like', "%{$request->search}%")
                    ->orWhere('nim', 'like', "%{$request->search}%")
                    ->orWhere('id_tag', 'like', "%{$request->search}%");
            });
        }

        // Ruangan filter
        if ($request->has('ruangan_id') && $request->ruangan_id) {
            $query->where('ruangan_id', $request->ruangan_id);
        }

        // Tahun filter
        if ($request->has('tahun') && $request->tahun) {
            $query->where('tahun', $request->tahun);
        }

        // Status filter
        if ($request->has('status') && $request->status) {
            if ($request->status === 'masuk') {
                $query->whereNotNull('waktu_masuk')->whereNull('waktu_keluar');
            } elseif ($request->status === 'keluar') {
                $query->whereNotNull('waktu_masuk')->whereNotNull('waktu_keluar');
            } elseif ($request->status === 'belum_keluar') {
                $query->whereNotNull('waktu_masuk')->whereNull('waktu_keluar');
            }
        }

        // Date range filter
        if ($request->has('tanggal_mulai') && $request->tanggal_mulai) {
            $startDate = Carbon::parse($request->tanggal_mulai)->startOfDay();
            if ($request->has('tanggal_selesai') && $request->tanggal_selesai) {
                $endDate = Carbon::parse($request->tanggal_selesai)->endOfDay();
            } else {
                $endDate = Carbon::parse($request->tanggal_mulai)->endOfDay();
            }
            $query->whereBetween('waktu_masuk', [$startDate, $endDate]);
        }

        // Filter hari ini
        if ($request->has('hari_ini') && $request->hari_ini) {
            $query->whereDate('waktu_masuk', today());
        }

        $absensis = $query->paginate(20);

        // Statistics
        $totalAbsensi = Absensi::count();
        $absensiHariIni = Absensi::whereDate('waktu_masuk', today())->count();
        $sedangAkses = Absensi::whereNotNull('waktu_masuk')->whereNull('waktu_keluar')->count();

        return Inertia::render('Absensi/Index', [
            'absensis' => $absensis,
            'filters' => $request->only([
                'search', 'ruangan_id', 'tahun', 'status',
                'tanggal_mulai', 'tanggal_selesai', 'hari_ini',
            ]),
            'statistics' => [
                'total' => $totalAbsensi,
                'hari_ini' => $absensiHariIni,
                'sedang_akses' => $sedangAkses,
            ],
            'ruangans' => Ruangan::all(),
            'statusOptions' => [
                ['value' => 'all', 'label' => 'Semua Status'],
                ['value' => 'masuk', 'label' => 'Sudah Masuk'],
                ['value' => 'keluar', 'label' => 'Sudah Keluar'],
                ['value' => 'belum_keluar', 'label' => 'Belum Keluar'],
            ],
        ]);
    }

    public function show(Absensi $absensi)
    {
        $absensi->load(['ruangan', 'user']);

        // Get related absensi for the same person
        $absensiTerkait = Absensi::where('id_tag', $absensi->id_tag)
            ->where('id', '!=', $absensi->id)
            ->with('ruangan')
            ->latest('waktu_masuk')
            ->take(10)
            ->get();

        return Inertia::render('Absensi/Show', [
            'absensi' => $absensi,
            'absensiTerkait' => $absensiTerkait,
        ]);
    }

    public function destroy(Absensi $absensi)
    {
        $absensi->delete();

        return redirect()->route('absensi.index')
            ->with('success', 'Data absensi berhasil dihapus.');
    }

    public function export(Request $request)
    {
        $query = Absensi::with(['ruangan']);

        // Apply same filters as index
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nama', 'like', "%{$request->search}%")
                    ->orWhere('nim', 'like', "%{$request->search}%");
            });
        }

        if ($request->has('ruangan_id') && $request->ruangan_id) {
            $query->where('ruangan_id', $request->ruangan_id);
        }

        if ($request->has('tanggal_mulai') && $request->tanggal_mulai) {
            $startDate = Carbon::parse($request->tanggal_mulai)->startOfDay();
            if ($request->has('tanggal_selesai') && $request->tanggal_selesai) {
                $endDate = Carbon::parse($request->tanggal_selesai)->endOfDay();
            } else {
                $endDate = Carbon::now()->endOfDay();
            }
            $query->whereBetween('waktu_masuk', [$startDate, $endDate]);
        }

        $absensis = $query->latest('waktu_masuk')->get();

        // Return JSON for now, can be extended to CSV/Excel
        return response()->json([
            'data' => $absensis,
            'filters' => $request->all(),
        ]);
    }

    public function exportExcel(Request $request)
    {
        $query = Absensi::with(['ruangan']);

        // Apply filters
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nama', 'like', "%{$request->search}%")
                    ->orWhere('nim', 'like', "%{$request->search}%")
                    ->orWhere('id_tag', 'like', "%{$request->search}%");
            });
        }

        if ($request->has('ruangan_id') && $request->ruangan_id) {
            $query->where('ruangan_id', $request->ruangan_id);
        }

        if ($request->has('tanggal_mulai') && $request->tanggal_mulai) {
            $startDate = Carbon::parse($request->tanggal_mulai)->startOfDay();
            if ($request->has('tanggal_selesai') && $request->tanggal_selesai) {
                $endDate = Carbon::parse($request->tanggal_selesai)->endOfDay();
            } else {
                $endDate = Carbon::now()->endOfDay();
            }
            $query->whereBetween('waktu_masuk', [$startDate, $endDate]);
        }

        $absensis = $query->latest('waktu_masuk')->get();

        // Generate CSV
        $fileName = 'absensi-'.now()->format('Y-m-d-H-i-s').'.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="'.$fileName.'"',
        ];

        $callback = function () use ($absensis) {
            $file = fopen('php://output', 'w');

            // Header
            fputcsv($file, [
                'Nama',
                'NIM',
                'ID Tag',
                'Tahun',
                'Ruangan',
                'Waktu Masuk',
                'Waktu Keluar',
                'Durasi (Menit)',
                'Status',
            ]);

            // Data
            foreach ($absensis as $absensi) {
                $durasi = $absensi->waktu_masuk && $absensi->waktu_keluar
                    ? $absensi->waktu_masuk->diffInMinutes($absensi->waktu_keluar)
                    : 0;

                fputcsv($file, [
                    $absensi->nama ?? 'Tidak Diketahui',
                    $absensi->nim ?? '-',
                    $absensi->id_tag,
                    $absensi->tahun ?? '-',
                    $absensi->ruangan?->nama_ruangan ?? '-',
                    $absensi->waktu_masuk?->format('Y-m-d H:i:s') ?? '-',
                    $absensi->waktu_keluar?->format('Y-m-d H:i:s') ?? '-',
                    $durasi,
                    $absensi->status,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
