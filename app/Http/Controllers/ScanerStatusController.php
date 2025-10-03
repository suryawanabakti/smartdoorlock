<?php

namespace App\Http\Controllers;

use App\Models\Ruangan;
use App\Models\ScanerStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScanerStatusController extends Controller
{
    public function index(Request $request)
    {
        $query = ScanerStatus::with(['ruangan'])->latest();

        // Search filter
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('kode', 'like', "%{$request->search}%")
                    ->orWhereHas('ruangan', function ($q) use ($request) {
                        $q->where('nama_ruangan', 'like', "%{$request->search}%");
                    });
            });
        }

        // Type filter – abaikan kalau value = "all"
        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // Ruangan filter – abaikan kalau value = "all"
        if ($request->filled('ruangan_id') && $request->ruangan_id !== 'all') {
            $query->where('ruangan_id', $request->ruangan_id);
        }

        $scanerStatuses = $query->paginate(10);

        return Inertia::render('ScanerStatus/Index', [
            'scanerStatuses' => $scanerStatuses,
            'filters' => $request->only(['search', 'type', 'ruangan_id']),
            'typeOptions' => [
                ['value' => 'all',   'label' => 'Semua Type'],
                ['value' => 'dalam', 'label' => 'Scanner Dalam'],
                ['value' => 'luar',  'label' => 'Scanner Luar'],
            ],
            'ruangans' => Ruangan::all(),
        ]);
    }

    public function create()
    {
        $ruangans = Ruangan::all();

        return Inertia::render('ScanerStatus/Create', [
            'ruangans' => $ruangans,
            'typeOptions' => [
                ['value' => 'dalam', 'label' => 'Scanner Dalam'],
                ['value' => 'luar', 'label' => 'Scanner Luar'],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode' => 'required|string|max:100|unique:scaner_status,kode',
            'ruangan_id' => 'nullable|exists:ruangans,id',
            'type' => 'required|in:dalam,luar',
            'last' => 'nullable|date',
        ]);

        ScanerStatus::create($validated);

        return redirect()->route('scaner-status.index')
            ->with('success', 'Data scanner status berhasil dibuat.');
    }

    public function show(ScanerStatus $scanerStatus)
    {
        $scanerStatus->load(['ruangan', 'histories' => function ($query) {
            $query->latest()->take(50);
        }]);

        return Inertia::render('ScanerStatus/Show', [
            'scanerStatus' => $scanerStatus,
            'histories' => $scanerStatus->histories,
        ]);
    }

    public function edit(ScanerStatus $scanerStatus)
    {
        $ruangans = Ruangan::all();

        return Inertia::render('ScanerStatus/Edit', [
            'scanerStatus' => $scanerStatus,
            'ruangans' => $ruangans,
            'typeOptions' => [
                ['value' => 'dalam', 'label' => 'Scanner Dalam'],
                ['value' => 'luar', 'label' => 'Scanner Luar'],
            ],
        ]);
    }

    public function update(Request $request, ScanerStatus $scanerStatus)
    {
        $validated = $request->validate([
            'kode' => 'required|string|max:100|unique:scaner_status,kode,'.$scanerStatus->id,
            'ruangan_id' => 'nullable|exists:ruangans,id',
            'type' => 'required|in:dalam,luar',
            'last' => 'nullable|date',
        ]);

        $scanerStatus->update($validated);

        return redirect()->route('scaner-status.index')
            ->with('success', 'Data scanner status berhasil diperbarui.');
    }

    public function destroy(ScanerStatus $scanerStatus)
    {
        // Prevent deletion if there are histories
        if ($scanerStatus->histories()->exists()) {
            return redirect()->back()
                ->with('error', 'Tidak dapat menghapus scanner status yang memiliki riwayat scan.');
        }

        $scanerStatus->delete();

        return redirect()->route('scaner-status.index')
            ->with('success', 'Data scanner status berhasil dihapus.');
    }

    public function updateLastScan(Request $request, ScanerStatus $scanerStatus)
    {
        $validated = $request->validate([
            'last' => 'required|date',
        ]);

        $scanerStatus->update(['last' => $validated['last']]);

        return response()->json([
            'success' => true,
            'message' => 'Last scan time updated successfully',
            'data' => $scanerStatus,
        ]);
    }

    public function getByKode($kode)
    {
        $scanerStatus = ScanerStatus::with('ruangan')->where('kode', $kode)->first();

        if (! $scanerStatus) {
            return response()->json([
                'success' => false,
                'message' => 'Scanner not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $scanerStatus,
        ]);
    }
}
