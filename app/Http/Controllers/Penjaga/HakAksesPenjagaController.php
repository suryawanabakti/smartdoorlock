<?php

namespace App\Http\Controllers\Penjaga;

use App\Http\Controllers\Controller;
use App\Jobs\SendEmailJamPulangToMahasiswa;
use App\Jobs\SendEmailToMahasiswa;
use App\Models\HakAkses;
use App\Models\Mahasiswa;
use App\Models\Ruangan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HakAksesPenjagaController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        // Get ruangan yang dijaga oleh penjaga
        $ruanganIds = $user->ruangans->pluck('id');

        $query = HakAkses::with(['ruangan', 'mahasiswas'])
            ->whereIn('ruangan_id', $ruanganIds)
            ->latest();

        // Search filter
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('tujuan', 'like', "%{$request->search}%")
                    ->orWhereHas('mahasiswas', function ($q) use ($request) {
                        $q->where('nama', 'like', "%{$request->search}%")
                            ->orWhere('nim', 'like', "%{$request->search}%");
                    });
            });
        }

        // Status filter
        if ($request->has('status') && $request->status) {
            if ($request->status === 'approved') {
                $query->where('is_approve', true);
            } elseif ($request->status === 'pending') {
                $query->where('is_approve', false);
            }
        }

        // Date filter
        if ($request->has('tanggal') && $request->tanggal) {
            $query->where('tanggal', $request->tanggal);
        }

        $hakAkses = $query->paginate(15);

        return Inertia::render('Penjaga/HakAkses/Index', [
            'hakAkses' => $hakAkses,
            'filters' => $request->only(['search', 'status', 'tanggal']),
            'ruanganDijaga' => $user->ruangans,
            'statistics' => [
                'total' => HakAkses::whereIn('ruangan_id', $ruanganIds)->count(),
                'approved' => HakAkses::whereIn('ruangan_id', $ruanganIds)->where('is_approve', true)->count(),
                'pending' => HakAkses::whereIn('ruangan_id', $ruanganIds)->where('is_approve', false)->count(),
                'today' => HakAkses::whereIn('ruangan_id', $ruanganIds)->whereDate('tanggal', today())->count(),
            ],
        ]);
    }

    public function create()
    {
        $user = auth()->user();
        $ruanganDijaga = $user->ruangans;
        $mahasiswas = Mahasiswa::aktif()->with('user')->get();

        return Inertia::render('Penjaga/HakAkses/Create', [
            'ruanganDijaga' => $ruanganDijaga,
            'mahasiswas' => $mahasiswas,
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $ruanganIds = $user->ruangans->pluck('id');

        $validated = $request->validate([
            'ruangan_id' => ['required', 'exists:ruangans,id', function ($attribute, $value, $fail) use ($ruanganIds) {
                if (! $ruanganIds->contains($value)) {
                    $fail('Ruangan tidak termasuk dalam ruangan yang Anda jaga.');
                }
            }],
            'tanggal' => 'required|date|after_or_equal:today',
            'jam_masuk' => 'required|date_format:H:i',
            'jam_keluar' => 'required|date_format:H:i|after:jam_masuk',
            'tujuan' => 'required|string|max:1000',
            'skill' => 'nullable|string|max:1000',
            'additional_participant' => 'nullable|string|max:1000',
            'max_register' => 'required|integer|min:1|max:50',
            'mahasiswa_ids' => 'nullable|array',
            'mahasiswa_ids.*' => 'exists:mahasiswa,id',
        ]);

        // Penjaga otomatis approve hak akses yang mereka buat
        $validated['is_approve'] = true;
        $validated['is_by_admin'] = false;

        DB::transaction(function () use ($validated) {
            $hakAkses = HakAkses::create($validated);

            if (! empty($validated['mahasiswa_ids'])) {
                $hakAkses->mahasiswas()->sync($validated['mahasiswa_ids']);
            }
        });

        return redirect()->route('penjaga.hak-akses.index')
            ->with('success', 'Hak akses berhasil dibuat dan disetujui.');
    }

    public function show(HakAkses $hakAkses)
    {
        $user = auth()->user();
        $this->authorizeAccess($hakAkses, $user);

        $hakAkses->load(['ruangan', 'mahasiswas.user', 'hakAksesMahasiswas.mahasiswa']);

        return Inertia::render('Penjaga/HakAkses/Show', [
            'hakAkses' => $hakAkses,
        ]);
    }

    public function edit(HakAkses $hakAkses)
    {
        $user = auth()->user();
        $this->authorizeAccess($hakAkses, $user);

        if ($hakAkses->is_approve) {
            abort(403, 'Tidak dapat mengedit hak akses yang sudah disetujui.');
        }

        $ruanganDijaga = $user->ruangans;
        $mahasiswas = Mahasiswa::aktif()->with('user')->get();
        $hakAkses->load('mahasiswas');

        return Inertia::render('Penjaga/HakAkses/Edit', [
            'hakAkses' => $hakAkses,
            'ruanganDijaga' => $ruanganDijaga,
            'mahasiswas' => $mahasiswas,
            'selectedMahasiswaIds' => $hakAkses->mahasiswas->pluck('id')->toArray(),
        ]);
    }

    public function update(Request $request, HakAkses $hakAkses)
    {
        $user = auth()->user();
        $this->authorizeAccess($hakAkses, $user);

        if ($hakAkses->is_approve) {
            abort(403, 'Tidak dapat mengedit hak akses yang sudah disetujui.');
        }

        $ruanganIds = $user->ruangans->pluck('id');

        $validated = $request->validate([
            'ruangan_id' => ['required', 'exists:ruangans,id', function ($attribute, $value, $fail) use ($ruanganIds) {
                if (! $ruanganIds->contains($value)) {
                    $fail('Ruangan tidak termasuk dalam ruangan yang Anda jaga.');
                }
            }],
            'tanggal' => 'required|date|after_or_equal:today',
            'jam_masuk' => 'required|date_format:H:i',
            'jam_keluar' => 'required|date_format:H:i|after:jam_masuk',
            'tujuan' => 'required|string|max:1000',
            'skill' => 'nullable|string|max:1000',
            'additional_participant' => 'nullable|string|max:1000',
            'max_register' => 'required|integer|min:1|max:50',
            'mahasiswa_ids' => 'nullable|array',
            'mahasiswa_ids.*' => 'exists:mahasiswa,id',
        ]);

        DB::transaction(function () use ($hakAkses, $validated) {
            $hakAkses->update($validated);
            $hakAkses->mahasiswas()->sync($validated['mahasiswa_ids'] ?? []);
        });

        return redirect()->route('penjaga.hak-akses.index')
            ->with('success', 'Hak akses berhasil diperbarui.');
    }

    public function destroy(HakAkses $hakAkses)
    {
        $user = auth()->user();
        $this->authorizeAccess($hakAkses, $user);

        $hakAkses->delete();

        return redirect()->route('penjaga.hak-akses.index')
            ->with('success', 'Hak akses berhasil dihapus.');
    }

    public function approve(HakAkses $hakAkses)
    {
        $user = auth()->user();
        $this->authorizeAccess($hakAkses, $user);

        $timezone = 'Asia/Makassar';

        // Gabungkan tanggal & jam keluar menjadi Carbon
        $tanggal = $hakAkses->tanggal->format('Y-m-d');

        $jamPulangCarbon = Carbon::createFromFormat(
            'Y-m-d H:i:s',
            "{$tanggal} {$hakAkses->jam_keluar}",
            $timezone
        );

        // Hitung delay (detik dari sekarang ke jam pulang)
        $delay = now($timezone)->diffInSeconds($jamPulangCarbon, false);
        $hakAkses->mahasiswas->each(function ($mahasiswa) use ($hakAkses, $delay, $timezone) {

            SendEmailToMahasiswa::dispatch($mahasiswa, $hakAkses, 'approve');

            if ($delay > 0) {
                SendEmailJamPulangToMahasiswa::dispatch($mahasiswa, $hakAkses)
                    ->delay(now($timezone)->addSeconds($delay)->subMinutes(10));
            }
        });
        // Tandai approve terlebih dahulu
        $hakAkses->update(['is_approve' => true]);

        // Kirim email ke setiap mahasiswa terkait

        return back()->with('success', 'Hak akses berhasil disetujui.');
    }

    public function reject(HakAkses $hakAkses)
    {
        $user = auth()->user();
        $this->authorizeAccess($hakAkses, $user);

        $hakAkses->update(['is_approve' => false]);

        return redirect()->back()
            ->with('success', 'Hak akses berhasil ditolak.');
    }

    // Authorization method
    private function authorizeAccess(HakAkses $hakAkses, $user)
    {
        $ruanganIds = $user->ruangans->pluck('id');

        if (! $ruanganIds->contains($hakAkses->ruangan_id)) {
            abort(403, 'Anda tidak memiliki akses ke hak akses ini.');
        }
    }
}
