<?php

namespace App\Http\Controllers;

use App\Models\Mahasiswa;
use App\Models\Ruangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RuanganController extends Controller
{
    public function resetApi()
    {
        Ruangan::query()->update(['open_api' => true]);

        return back();
    }

    public function index(Request $request)
    {
        $query = Ruangan::with(['parent', 'mahasiswa'])
            ->latest();

        // Search filter
        if ($request->has('search') && $request->search) {
            $query->where('nama_ruangan', 'like', "%{$request->search}%");
        }

        // Type filter - handle 'all' value
        if ($request->has('type') && $request->type && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        $ruangans = $query->paginate(10);

        return Inertia::render('Ruangan/Index', [
            'ruangans' => $ruangans,
            'filters' => $request->only(['search', 'type']),
        ]);
    }

    public function show(Ruangan $ruangan)
    {
        $ruangan->load([
            'parent',
            'mahasiswaPenanggungJawab',
            'scanerStatuses' => function ($query) {
                $query->withCount('histories');
            },
            'scanerStatuses.histories' => function ($query) {
                $query->latest()->take(100);
            },
            'mahasiswas' => function ($query) {
                $query->with('user')->aktif()->latest();
            },
            'penjagaRuangans' => function ($query) {
                $query->with('user')->latest();
            },
        ]);

        // Get statistics
        $statistics = [
            'total_scanners' => $ruangan->scanerStatuses->count(),
            'scanners_dalam' => $ruangan->scanerStatuses->where('type', 'dalam')->count(),
            'scanners_luar' => $ruangan->scanerStatuses->where('type', 'luar')->count(),
            'total_mahasiswa' => $ruangan->mahasiswas->count(),
            'total_penjaga' => $ruangan->penjagaRuangans->count(),
            'total_scan_24jam' => DB::table('histori')
                ->whereIn('kode', $ruangan->scanerStatuses->pluck('kode'))
                ->where('waktu', '>=', now()->subDay())
                ->count(),
        ];

        return Inertia::render('Ruangan/Show', [
            'ruangan' => $ruangan,
            'statistics' => $statistics,
        ]);
    }

    public function create()
    {
        $parentRuangans = Ruangan::whereNull('parent_id')->get();
        $mahasiswas = Mahasiswa::with('user')
            ->where('ket', 'dsn')
            ->get()
            ->map(function ($mahasiswa) {
                return [
                    'value' => $mahasiswa->id,
                    'label' => $mahasiswa->nama.' ('.$mahasiswa->nim.')',
                ];
            });

        return Inertia::render('Ruangan/Create', [
            'parentRuangans' => $parentRuangans,
            'types' => ['umum', 'kelas', 'lab'],
            'mahasiswas' => $mahasiswas,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_ruangan' => 'required|string|max:255',
            'type' => 'required|in:umum,kelas,lab',
            'open_api' => 'boolean',
            'pin' => 'nullable|string|max:255',
            'pin_active' => 'boolean',
            'parent_id' => 'nullable|exists:ruangans,id',
            'jam_buka' => 'required|date_format:H:i',
            'jam_tutup' => 'required|date_format:H:i',
            'max_register' => 'required|integer|min:1',
            'mahasiswa_id' => 'nullable|exists:mahasiswas,id',
            'penanggung_jawab' => 'nullable|array',
        ]);
        
        Ruangan::create($validated);

        return redirect()->route('ruangans.index')
            ->with('success', 'Ruangan berhasil dibuat.');
    }

    public function edit(Ruangan $ruangan)
    {
        $parentRuangans = Ruangan::whereNull('parent_id')
            ->where('id', '!=', $ruangan->id)
            ->get();

        $mahasiswas = Mahasiswa::with('user')
            ->where('ket', 'dsn')
            ->get()
            ->map(function ($mahasiswa) {
                return [
                    'value' => $mahasiswa->id,
                    'label' => $mahasiswa->nama.' ('.$mahasiswa->nim.')',
                ];
            });

        return Inertia::render('Ruangan/Edit', [
            'ruangan' => $ruangan->load(['parent', 'mahasiswa']),
            'parentRuangans' => $parentRuangans,
            'types' => ['umum', 'kelas', 'lab'],
            'mahasiswas' => $mahasiswas,
        ]);
    }

    public function update(Request $request, Ruangan $ruangan)
    {

        $validated = $request->validate([
            'nama_ruangan' => 'required|string|max:255',
            'type' => 'required|in:umum,kelas,lab',
            'open_api' => 'boolean',
            'pin' => 'nullable|string|max:255',
            'pin_active' => 'boolean',
            'parent_id' => 'nullable|exists:ruangans,id',
            'jam_buka' => 'required|date_format:H:i',
            'jam_tutup' => 'required|date_format:H:i',
            'max_register' => 'required|integer|min:1',
            'mahasiswa_id' => 'nullable|exists:mahasiswas,id',
            'penanggung_jawab' => 'nullable|array',
        ]);

        $ruangan->update($validated);

        return redirect()->route('ruangans.index')
            ->with('success', 'Ruangan berhasil diperbarui.');
    }

    public function destroy(Ruangan $ruangan)
    {
        // Check if ruangan has children
        if ($ruangan->children()->exists()) {
            return redirect()->back()
                ->with('error', 'Tidak dapat menghapus ruangan yang memiliki sub-ruangan.');
        }

        $ruangan->delete();

        return redirect()->route('ruangans.index')
            ->with('success', 'Ruangan berhasil dihapus.');
    }
}
