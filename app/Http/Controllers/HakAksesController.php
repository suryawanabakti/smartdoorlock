<?php

namespace App\Http\Controllers;

use App\Models\HakAkses;
use App\Models\Mahasiswa;
use App\Models\Ruangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HakAksesController extends Controller
{
    public function destroyByDate(Request $request)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'confirm_text' => 'required|string|in:HAPUS SEMUA HAK AKSES',
        ]);

        $tanggal = $request->tanggal;
        $hakAksesCount = HakAkses::where('tanggal', $tanggal)->count();

        if ($hakAksesCount === 0) {
            return redirect()->back()
                ->with('error', 'Tidak ada hak akses pada tanggal tersebut.');
        }

        DB::transaction(function () use ($tanggal) {
            // Hapus semua hak akses pada tanggal tersebut
            HakAkses::where('tanggal', $tanggal)->delete();
        });

        return redirect()->route('calendar.index')
            ->with('success', "Semua $hakAksesCount hak akses pada tanggal $tanggal berhasil dihapus.");
    }

    public function index(Request $request)
    {
        $query = HakAkses::with(['ruangan', 'mahasiswas'])
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
        if ($request->has('status') && $request->status !== '') {
            if ($request->status === 'approved') {
                $query->where('is_approve', true);
            } elseif ($request->status === 'pending') {
                $query->where('is_approve', false)->where('is_by_admin', false);
            } elseif ($request->status === 'admin') {
                $query->where('is_by_admin', true);
            }
        }

        // Ruangan filter
        if ($request->has('ruangan_id') && $request->ruangan_id) {
            $query->where('ruangan_id', $request->ruangan_id);
        }

        // Date filter
        if ($request->has('tanggal') && $request->tanggal) {
            $query->where('tanggal', $request->tanggal);
        }

        // Tahun filter untuk mahasiswa
        if ($request->has('tahun') && $request->tahun) {
            $query->whereYear('tanggal', $request->tahun);
        }

        $hakAkses = $query->paginate(10);

        return Inertia::render('HakAkses/Index', [
            'hakAkses' => $hakAkses,
            'filters' => $request->only(['search', 'status', 'ruangan_id', 'tanggal', 'tahun']),
            'statusOptions' => [
                ['value' => 'all', 'label' => 'Semua Status'],
                ['value' => 'approved', 'label' => 'Disetujui'],
                ['value' => 'pending', 'label' => 'Menunggu'],
                ['value' => 'admin', 'label' => 'Dibuat Admin'],
            ],
            'ruangans' => Ruangan::all(),
            'tahunOptions' => range(date('Y'), date('Y') + 1),
        ]);
    }

    public function create()
    {
        $ruangans = Ruangan::all();
        $mahasiswas = Mahasiswa::aktif()->with('user')->get();

        return Inertia::render('HakAkses/Create', [
            'ruangans' => $ruangans,
            'mahasiswas' => $mahasiswas,
            'currentYear' => date('Y'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ruangan_id' => 'required|exists:ruangans,id',
            'tanggal' => 'required|date|after_or_equal:today',
            'jam_masuk' => 'required|date_format:H:i',
            'jam_keluar' => 'required|date_format:H:i|after:jam_masuk',
            'is_approve' => 'boolean',
            'is_by_admin' => 'boolean',
            'tujuan' => 'required|string|max:1000',
            'skill' => 'nullable|string|max:1000',
            'additional_participant' => 'nullable|string|max:1000',
            'max_register' => 'required|integer|min:1|max:100',
            'mahasiswa_ids' => 'nullable|array',
            'mahasiswa_ids.*' => 'exists:mahasiswas,id',
        ]);

        DB::transaction(function () use ($validated) {
            $hakAkses = HakAkses::create($validated);

            // Assign mahasiswas jika ada
            if (! empty($validated['mahasiswa_ids'])) {
                $hakAkses->mahasiswas()->sync($validated['mahasiswa_ids']);
            }
        });

        return redirect()->route('hak-akses.index')
            ->with('success', 'Hak akses berhasil dibuat.');
    }

    public function show(HakAkses $hakAkses)
    {
        $hakAkses->load(['ruangan', 'mahasiswas.user', 'hakAksesMahasiswas.mahasiswa']);

        return Inertia::render('HakAkses/Show', [
            'hakAkses' => $hakAkses,
        ]);
    }

    public function edit(HakAkses $hakAkses)
    {
        $ruangans = Ruangan::all();
        $mahasiswas = Mahasiswa::aktif()->with('user')->get();
        $hakAkses->load('mahasiswas');

        return Inertia::render('HakAkses/Edit', [
            'hakAkses' => $hakAkses,
            'ruangans' => $ruangans,
            'mahasiswas' => $mahasiswas,
            'selectedMahasiswaIds' => $hakAkses->mahasiswas->pluck('id')->toArray(),
        ]);
    }

    public function update(Request $request, HakAkses $hakAkses)
    {
        $validated = $request->validate([
            'ruangan_id' => 'required|exists:ruangans,id',
            'tanggal' => 'required|date|after_or_equal:today',
            'jam_masuk' => 'required|date_format:H:i',
            'jam_keluar' => 'required|date_format:H:i|after:jam_masuk',
            'is_approve' => 'boolean',
            'is_by_admin' => 'boolean',
            'tujuan' => 'required|string|max:1000',
            'skill' => 'nullable|string|max:1000',
            'additional_participant' => 'nullable|string|max:1000',
            'max_register' => 'required|integer|min:1|max:100',
            'mahasiswa_ids' => 'nullable|array',
            'mahasiswa_ids.*' => 'exists:mahasiswas,id',
        ]);

        DB::transaction(function () use ($hakAkses, $validated) {
            $hakAkses->update($validated);

            // Update mahasiswas assignment
            $hakAkses->mahasiswas()->sync($validated['mahasiswa_ids'] ?? []);
        });

        return redirect()->route('hak-akses.index')
            ->with('success', 'Hak akses berhasil diperbarui.');
    }

    public function destroy(HakAkses $hakAkses)
    {
        $hakAkses->delete();

        return redirect()->route('hak-akses.index')
            ->with('success', 'Hak akses berhasil dihapus.');
    }

    public function approve(HakAkses $hakAkses)
    {

        $hakAkses->update(['is_approve' => true]);

        return redirect()->back()
            ->with('success', 'Hak akses berhasil disetujui.');
    }

    public function reject(HakAkses $hakAkses)
    {
        $hakAkses->update(['is_approve' => false]);

        return redirect()->back()
            ->with('success', 'Hak akses berhasil ditolak.');
    }

    public function toggleAdmin(HakAkses $hakAkses)
    {
        $hakAkses->update(['is_by_admin' => ! $hakAkses->is_by_admin]);

        $status = $hakAkses->is_by_admin ? 'ditandai sebagai buatan admin' : 'dihapus dari buatan admin';

        return redirect()->back()
            ->with('success', "Hak akses berhasil {$status}.");
    }
}
