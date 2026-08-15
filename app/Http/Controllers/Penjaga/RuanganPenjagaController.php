<?php

namespace App\Http\Controllers\Penjaga;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use App\Models\Ruangan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RuanganPenjagaController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $ruanganDijaga = $user->ruangans()->with(['scanerStatuses', 'hakAkses' => function ($query) {
            $query->whereDate('tanggal', today())->where('is_approve', true);
        }])->get();

        // Statistics for each room
        $ruanganDijaga->each(function ($ruangan) {
            $ruangan->absensi_hari_ini = $ruangan->absensis()
                ->whereDate('waktu_masuk', today())
                ->count();
            $ruangan->sedang_akses = $ruangan->absensis()
                ->whereDate('waktu_masuk', today())
                ->whereNull('waktu_keluar')
                ->count();
            $ruangan->total_scanner = $ruangan->scanerStatuses()->count();
        });

        // Get additional data for statistics
        $totalMahasiswa = 0;
        $totalPenjaga = 0;

        foreach ($ruanganDijaga as $ruangan) {
            $totalMahasiswa += $ruangan->mahasiswas->count();
            $totalPenjaga += $ruangan->penjagaRuangans->count();
        }

        $statistics = [
            'total_ruangan' => $ruanganDijaga->count(), // Ini yang ditambahkan
            'total_absensi_hari_ini' => $ruanganDijaga->sum('absensi_hari_ini'),
            'total_sedang_akses' => $ruanganDijaga->sum('sedang_akses'),
            'total_hak_akses_hari_ini' => $ruanganDijaga->sum(function ($ruangan) {
                return $ruangan->hakAkses->count();
            }),
            'total_scanners' => $ruanganDijaga->sum('total_scanner'),
            'scanners_dalam' => $ruanganDijaga->sum(function ($ruangan) {
                return $ruangan->scanerStatuses->where('type', 'dalam')->count();
            }),
            'scanners_luar' => $ruanganDijaga->sum(function ($ruangan) {
                return $ruangan->scanerStatuses->where('type', 'luar')->count();
            }),
            'total_mahasiswa' => $totalMahasiswa,
            'total_penjaga' => $totalPenjaga,
        ];

        return Inertia::render('Penjaga/Ruangan/Index', [
            'ruanganDijaga' => $ruanganDijaga,
            'statistics' => $statistics,
        ]);
    }

    public function edit(Ruangan $ruangan)
    {
        $user = auth()->user();
        $this->authorizeAccess($ruangan, $user);

        $mahasiswas = Mahasiswa::with('user')
            ->where('ket', 'dsn')
            ->get()
            ->map(function ($mahasiswa) {
                return [
                    'value' => $mahasiswa->id,
                    'label' => $mahasiswa->nama.' ('.$mahasiswa->nim.')',
                ];
            });

        return Inertia::render('Penjaga/Ruangan/Edit', [
            'ruangan' => $ruangan,
            'mahasiswas' => $mahasiswas,
        ]);
    }

    public function update(Request $request, Ruangan $ruangan)
    {
        $user = auth()->user();
        $this->authorizeAccess($ruangan, $user);

        $validated = $request->validate([
            'nama_ruangan' => 'required|string|max:255',
            'jam_buka' => 'required|date_format:H:i',
            'jam_tutup' => 'required|date_format:H:i|after:jam_buka',
            'max_register' => 'required|integer|min:1',
            'pin' => 'nullable|string|max:255',
            'pin_active' => 'boolean',
            'open_api' => 'boolean',
            'penanggung_jawab' => 'nullable|array',
        ]);

        $ruangan->update($validated);

        return redirect()->route('penjaga.ruangan.index')
            ->with('success', 'Data ruangan berhasil diperbarui.');
    }

    public function show(Ruangan $ruangan)
    {
        $user = auth()->user();
        $this->authorizeAccess($ruangan, $user);

        $ruangan->load([
            'scanerStatuses',
            'hakAkses' => function ($query) {
                $query->whereDate('tanggal', today())
                    ->where('is_approve', true);
            },
            'scanerStatuses' => function ($query) {
                $query->withCount('histories');
            },
            'scanerStatuses.histories' => function ($query) {
                $query->latest()->take(100);
            },
            // load absensi hari ini
            'absensis' => function ($query) {
                $query->whereDate('waktu_masuk', today());
            },
        ]);

        $statistics = [
            'absensi_hari_ini' => $ruangan->absensis()
                ->whereDate('waktu_masuk', today())
                ->count(),
            'sedang_akses' => $ruangan->absensis()
                ->whereDate('waktu_masuk', today())
                ->whereNull('waktu_keluar')
                ->count(),
            'hak_akses_hari_ini' => $ruangan->hakAkses()
                ->whereDate('tanggal', today())
                ->where('is_approve', true)
                ->count(),
            'total_scanner' => $ruangan->scanerStatuses()->count(),
        ];

        // ambil jadwal hari ini
        $jadwalHariIni = $ruangan->hakAkses()
            ->whereDate('tanggal', today())
            ->get();

        // ambil aktivitas absensi hari ini
        $aktivitasHariIni = $ruangan->absensis()
            ->whereDate('waktu_masuk', today())
            ->latest('waktu_masuk')
            ->take(10) // misalnya tampilkan 10 terakhir
            ->get();

        return Inertia::render('Penjaga/Ruangan/Show', [
            'ruangan' => $ruangan,
            'statistics' => $statistics,
            'jadwalHariIni' => $jadwalHariIni,
            'aktivitasTerkini' => $aktivitasHariIni,
        ]);
    }

    private function authorizeAccess(Ruangan $ruangan, $user)
    {
        if (! $user->ruangans->contains($ruangan->id)) {
            abort(403, 'Anda tidak memiliki akses ke ruangan ini.');
        }
    }
}
