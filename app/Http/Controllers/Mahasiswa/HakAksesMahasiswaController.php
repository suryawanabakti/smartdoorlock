<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\HakAkses;
use App\Models\Mahasiswa;
use App\Models\Ruangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HakAksesMahasiswaController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $mahasiswa = $user->mahasiswa;

        // Hak akses yang dibuat oleh mahasiswa ini
        $query = HakAkses::with(['ruangan', 'mahasiswas'])
            ->whereHas('mahasiswas', function ($query) use ($mahasiswa) {
                $query->where('mahasiswa_id', $mahasiswa->id);
            })
            ->latest();

        // Search filter
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('tujuan', 'like', "%{$request->search}%")
                    ->orWhereHas('ruangan', function ($q) use ($request) {
                        $q->where('nama_ruangan', 'like', "%{$request->search}%");
                    });
            });
        }

        // Status filter
        if ($request->has('status') && $request->status) {
            if ($request->status === 'approved') {
                $query->where('is_approve', true);
            } elseif ($request->status === 'pending') {
                $query->where('is_approve', false);
            } elseif ($request->status === 'rejected') {
                $query->where('is_approve', false)->where('is_by_admin', false);
            }
        }

        $hakAkses = $query->paginate(15);

        // Statistics
        $statistics = [
            'total' => HakAkses::whereHas('mahasiswas', function ($query) use ($mahasiswa) {
                $query->where('mahasiswa_id', $mahasiswa->id);
            })->count(),
            'approved' => HakAkses::whereHas('mahasiswas', function ($query) use ($mahasiswa) {
                $query->where('mahasiswa_id', $mahasiswa->id);
            })->where('is_approve', true)->count(),
            'pending' => HakAkses::whereHas('mahasiswas', function ($query) use ($mahasiswa) {
                $query->where('mahasiswa_id', $mahasiswa->id);
            })->where('is_approve', false)->count(),
        ];

        return Inertia::render('Mahasiswa/HakAkses/Index', [
            'hakAkses' => $hakAkses,
            'filters' => $request->only(['search', 'status']),
            'statistics' => $statistics,
            'mahasiswa' => $mahasiswa,
        ]);
    }

    public function create()
    {
        $user = auth()->user();
        $mahasiswa = $user->mahasiswa;

        // Get all ruangan yang available
        $ruangans = Ruangan::where('open_api', true)->get();

        // Get teman kelas (same ruangan_id and tahun_masuk) + semua mahasiswa
        $temanKelas = Mahasiswa::where(function ($query) use ($mahasiswa) {
            $query->where('ruangan_id', $mahasiswa->ruangan_id)
                ->where('tahun_masuk', $mahasiswa->tahun_masuk)
                ->where('id', '!=', $mahasiswa->id);
        })
            ->orWhere('tahun_masuk', $mahasiswa->tahun_masuk)
            ->with('user')
            ->aktif()
            ->get();

        return Inertia::render('Mahasiswa/HakAkses/Create', [
            'ruangans' => $ruangans,
            'temanKelas' => $temanKelas,
            'mahasiswa' => $mahasiswa,
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $mahasiswa = $user->mahasiswa;

        $validated = $request->validate([
            'ruangan_id' => 'required|exists:ruangans,id',
            'tanggal' => 'required|date|after_or_equal:today',
            'jam_masuk' => 'required|date_format:H:i',
            'jam_keluar' => 'required|date_format:H:i|after:jam_masuk',
            'tujuan' => 'required|string|max:1000',
            'skill' => 'nullable|string|max:1000',
            'additional_participant' => 'nullable|string|max:1000',
            'max_register' => 'required|integer|min:1|max:20',
            'mahasiswa_ids' => 'nullable|array',
            'mahasiswa_ids.*' => 'exists:mahasiswa,id',
        ]);

        // Mahasiswa tidak bisa auto-approve, harus menunggu persetujuan
        $validated['is_approve'] = false;
        $validated['is_by_admin'] = false;

        DB::transaction(function () use ($validated, $mahasiswa) {
            $hakAkses = HakAkses::create($validated);

            // Tambahkan mahasiswa pembuat sebagai peserta pertama
            $mahasiswaIds = [$mahasiswa->id];
            if (! empty($validated['mahasiswa_ids'])) {
                $mahasiswaIds = array_merge($mahasiswaIds, $validated['mahasiswa_ids']);
            }

            $hakAkses->mahasiswas()->sync($mahasiswaIds);
        });

        return redirect()->route('mahasiswa.hak-akses.index')
            ->with('success', 'Permohonan hak akses berhasil diajukan. Menunggu persetujuan penjaga.');
    }

    public function show(HakAkses $hakAkses)
    {
        $user = auth()->user();
        $mahasiswa = $user->mahasiswa;

        $this->authorizeAccess($hakAkses, $mahasiswa);

        $hakAkses->load(['ruangan', 'mahasiswas.user']);

        return Inertia::render('Mahasiswa/HakAkses/Show', [
            'hakAkses' => $hakAkses,
            'mahasiswa' => $mahasiswa,
        ]);
    }

    public function edit(HakAkses $hakAkses)
    {
        $user = auth()->user();
        $mahasiswa = $user->mahasiswa;

        $this->authorizeAccess($hakAkses, $mahasiswa);

        // Only allow editing if not approved yet
        if ($hakAkses->is_approve) {
            abort(403, 'Tidak dapat mengedit hak akses yang sudah disetujui.');
        }

        $ruangans = Ruangan::where('open_api', true)->get();
        $temanKelas = Mahasiswa::where(function ($query) use ($mahasiswa) {
            $query->where('ruangan_id', $mahasiswa->ruangan_id)
                ->where('tahun_masuk', $mahasiswa->tahun_masuk)
                ->where('id', '!=', $mahasiswa->id);
        })
            ->orWhere('tahun_masuk', $mahasiswa->tahun_masuk)
            ->with('user')
            ->aktif()
            ->get();

        $hakAkses->load('mahasiswas');

        return Inertia::render('Mahasiswa/HakAkses/Edit', [
            'hakAkses' => $hakAkses,
            'ruangans' => $ruangans,
            'temanKelas' => $temanKelas,
            'mahasiswa' => $mahasiswa,
            'selectedMahasiswaIds' => $hakAkses->mahasiswas->where('id', '!=', $mahasiswa->id)->pluck('id')->toArray(),
        ]);
    }

    public function update(Request $request, HakAkses $hakAkses)
    {
        $user = auth()->user();
        $mahasiswa = $user->mahasiswa;

        $this->authorizeAccess($hakAkses, $mahasiswa);

        // Only allow editing if not approved yet
        if ($hakAkses->is_approve) {
            abort(403, 'Tidak dapat mengedit hak akses yang sudah disetujui.');
        }

        $validated = $request->validate([
            'ruangan_id' => 'required|exists:ruangans,id',
            'tanggal' => 'required|date|after_or_equal:today',
            'jam_masuk' => 'required|date_format:H:i',
            'jam_keluar' => 'required|date_format:H:i|after:jam_masuk',
            'tujuan' => 'required|string|max:1000',
            'skill' => 'nullable|string|max:1000',
            'additional_participant' => 'nullable|string|max:1000',
            'max_register' => 'required|integer|min:1|max:20',
            'mahasiswa_ids' => 'nullable|array',
            'mahasiswa_ids.*' => 'exists:mahasiswas,id',
        ]);

        DB::transaction(function () use ($hakAkses, $validated, $mahasiswa) {
            $hakAkses->update($validated);

            // Selalu sertakan mahasiswa pembuat
            $mahasiswaIds = [$mahasiswa->id];
            if (! empty($validated['mahasiswa_ids'])) {
                $mahasiswaIds = array_merge($mahasiswaIds, $validated['mahasiswa_ids']);
            }

            $hakAkses->mahasiswas()->sync($mahasiswaIds);
        });

        return redirect()->route('mahasiswa.hak-akses.index')
            ->with('success', 'Permohonan hak akses berhasil diperbarui.');
    }

    public function destroy(HakAkses $hakAkses)
    {
        $user = auth()->user();
        $mahasiswa = $user->mahasiswa;

        $this->authorizeAccess($hakAkses, $mahasiswa);

        // Only allow deletion if not approved yet
        if ($hakAkses->is_approve) {
            abort(403, 'Tidak dapat menghapus hak akses yang sudah disetujui.');
        }

        $hakAkses->delete();

        return redirect()->route('mahasiswa.hak-akses.index')
            ->with('success', 'Permohonan hak akses berhasil dibatalkan.');
    }

    public function availableHakAkses(Request $request)
    {
        $user = auth()->user();
        $mahasiswa = $user->mahasiswa;

        // Hak akses yang approved dan masih available
        $query = HakAkses::with(['ruangan', 'mahasiswas'])
            ->where('is_approve', true)
            ->where('tanggal', '>=', now()->format('Y-m-d'))
            ->whereDoesntHave('mahasiswas', function ($query) use ($mahasiswa) {
                $query->where('mahasiswa_id', $mahasiswa->id);
            })
            ->whereRaw('max_register > (SELECT COUNT(*) FROM hak_akses_mahasiswas WHERE hak_akses_id = hak_akses.id)')
            ->latest();

        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('tujuan', 'like', "%{$request->search}%")
                    ->orWhereHas('ruangan', function ($q) use ($request) {
                        $q->where('nama_ruangan', 'like', "%{$request->search}%");
                    });
            });
        }

        $availableHakAkses = $query->paginate(15);

        return Inertia::render('Mahasiswa/HakAkses/Available', [
            'availableHakAkses' => $availableHakAkses,
            'filters' => $request->only(['search']),
            'mahasiswa' => $mahasiswa,
        ]);
    }

    public function join(HakAkses $hakAkses)
    {
        $user = auth()->user();
        $mahasiswa = $user->mahasiswa;

        // Check if hak akses is available
        if (! $hakAkses->is_approve) {
            abort(403, 'Hak akses belum disetujui.');
        }

        if ($hakAkses->tanggal < now()->format('Y-m-d')) {
            abort(403, 'Hak akses sudah kadaluarsa.');
        }

        if ($hakAkses->mahasiswas->contains($mahasiswa->id)) {
            abort(403, 'Anda sudah bergabung dengan hak akses ini.');
        }

        if ($hakAkses->mahasiswas->count() >= $hakAkses->max_register) {
            abort(403, 'Kuota hak akses sudah penuh.');
        }

        $hakAkses->mahasiswas()->attach($mahasiswa->id);

        return redirect()->route('mahasiswa.hak-akses.available')
            ->with('success', 'Berhasil bergabung dengan hak akses.');
    }

    public function leave(HakAkses $hakAkses)
    {
        $user = auth()->user();
        $mahasiswa = $user->mahasiswa;

        if (! $hakAkses->mahasiswas->contains($mahasiswa->id)) {
            abort(403, 'Anda tidak tergabung dengan hak akses ini.');
        }

        $hakAkses->mahasiswas()->detach($mahasiswa->id);

        return redirect()->back()
            ->with('success', 'Berhasil keluar dari hak akses.');
    }

    private function authorizeAccess(HakAkses $hakAkses, $mahasiswa)
    {
        if (! $hakAkses->mahasiswas->contains($mahasiswa->id)) {
            abort(403, 'Anda tidak memiliki akses ke hak akses ini.');
        }
    }
}
