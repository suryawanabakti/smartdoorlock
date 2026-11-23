<?php

namespace App\Http\Controllers;

use App\Models\Mahasiswa;
use App\Models\Ruangan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DosenController extends Controller
{
    // Show create form for dosen (delegates to MahasiswaController)
    public function create(Request $request)
    {
        $ruangans = Ruangan::all();
        $users = User::where('role', 'mahasiswa')->orWhere('role', 'dosen')->get();

        return Inertia::render('Mahasiswa/Create', [
            'ruangans' => $ruangans,
            'users' => $users,
            'ketOptions' => [
                ['value' => 'mhs', 'label' => 'Mahasiswa'],
                ['value' => 'dsn', 'label' => 'Dosen'],
            ],
            'tahunOptions' => range(date('Y'), date('Y') - 10, -1),
            'filters' => ['ket' => 'dsn'],
            'defaultKet' => 'dsn',
            'hideKet' => true,
            'assignedRuanganPjIds' => [],
        ]);
    }

    // Show edit form for dosen (delegates to MahasiswaController)
    public function edit(Mahasiswa $mahasiswa)
    {
        $ruangans = Ruangan::all();
        $users = User::where('role', 'mahasiswa')->orWhere('role', 'dosen')->get();

        return Inertia::render('Mahasiswa/Edit', [
            'mahasiswa' => $mahasiswa->load(['user', 'ruangan']),
            'ruangans' => $ruangans,
            'users' => $users,
            'ketOptions' => [
                ['value' => 'mhs', 'label' => 'Mahasiswa'],
                ['value' => 'dsn', 'label' => 'Dosen'],
            ],
            'tahunOptions' => range(date('Y'), date('Y') - 10, -1),
            'defaultKet' => 'dsn',
            'hideKet' => true,
            'assignedRuanganPjIds' => $mahasiswa->getPenanggungJawabRuanganIds(),
        ]);
    }

    public function index(Request $request)
    {
        $ket = 'dsn';

        $query = Mahasiswa::with(['user', 'ruangan'])
            ->where('ket', $ket)
            ->latest();

        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nama', 'like', "%{$request->search}%")
                    ->orWhere('nim', 'like', "%{$request->search}%")
                    ->orWhere('id_tag', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('tahun_masuk') && $request->tahun_masuk !== 'all') {
            $query->where('tahun_masuk', $request->tahun_masuk);
        }

        $ruangans = Ruangan::select('id', 'nama_ruangan', 'type', 'penanggung_jawab', 'mahasiswa_id')->get();

        $mahasiswas = $query->paginate(10);
        $mahasiswas->getCollection()->transform(function ($dosen) use ($ruangans) {
            $assignedRooms = $ruangans->filter(function ($r) use ($dosen) {
                return $r->isPenanggungJawab($dosen);
            })->map(function ($r) {
                return [
                    'id' => $r->id,
                    'nama_ruangan' => $r->nama_ruangan,
                    'type' => $r->type,
                ];
            })->values();

            $dosen->penanggung_jawab_ruangans = $assignedRooms;

            return $dosen;
        });

        return Inertia::render('Dosen/Index', [
            'mahasiswas' => $mahasiswas,
            'ruangans' => $ruangans->map(function ($r) {
                return [
                    'id' => $r->id,
                    'nama_ruangan' => $r->nama_ruangan,
                    'type' => $r->type,
                ];
            }),
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'ket' => $ket,
                'tahun_masuk' => $request->tahun_masuk,
            ],
            'statusOptions' => [
                ['value' => 'all', 'label' => 'Semua Status'],
                ['value' => '1', 'label' => 'Aktif'],
                ['value' => '0', 'label' => 'Nonaktif'],
            ],
            'ketOptions' => [
                ['value' => 'all', 'label' => 'Semua Jenis'],
                ['value' => 'mhs', 'label' => 'Mahasiswa'],
                ['value' => 'dsn', 'label' => 'Dosen'],
            ],
            'tahunOptions' => range(date('Y'), date('Y') - 10, -1),
        ]);
    }

    /**
     * Bulk update penanggung jawab ruangan untuk beberapa dosen sekaligus.
     */
    public function bulkPenanggungJawab(Request $request)
    {
        $validated = $request->validate([
            'dosen_ids' => 'required|array|min:1',
            'dosen_ids.*' => 'exists:mahasiswa,id',
            'ruangan_ids' => 'required|array|min:1',
            'ruangan_ids.*' => 'exists:ruangans,id',
            'mode' => 'nullable|in:add,set,remove',
        ]);

        $dosenIds = array_map('intval', $validated['dosen_ids']);
        $targetRuanganIds = array_map('intval', $validated['ruangan_ids']);
        $mode = $validated['mode'] ?? 'add';

        DB::transaction(function () use ($dosenIds, $targetRuanganIds, $mode) {
            $allRuangans = Ruangan::all();

            foreach ($allRuangans as $ruangan) {
                $pj = $ruangan->penanggung_jawab;
                if (is_string($pj)) {
                    $pj = json_decode($pj, true);
                }
                if (! is_array($pj)) {
                    $pj = [];
                }

                $currentIds = [];
                foreach ($pj as $item) {
                    if (is_array($item) && isset($item['value'])) {
                        $currentIds[] = (int) $item['value'];
                    } elseif (is_numeric($item)) {
                        $currentIds[] = (int) $item;
                    }
                }
                $currentIds = array_values(array_unique(array_filter($currentIds)));
                $isTargetRuangan = in_array((int) $ruangan->id, $targetRuanganIds, true);

                if ($mode === 'add') {
                    if ($isTargetRuangan) {
                        $currentIds = array_values(array_unique(array_merge($currentIds, $dosenIds)));
                        $ruangan->update([
                            'penanggung_jawab' => $currentIds,
                        ]);
                    }
                } elseif ($mode === 'remove') {
                    if ($isTargetRuangan) {
                        $currentIds = array_values(array_diff($currentIds, $dosenIds));
                        $updateData = [
                            'penanggung_jawab' => count($currentIds) > 0 ? $currentIds : null,
                        ];
                        if (in_array((int) $ruangan->mahasiswa_id, $dosenIds, true)) {
                            $updateData['mahasiswa_id'] = null;
                        }
                        $ruangan->update($updateData);
                    }
                } elseif ($mode === 'set') {
                    if ($isTargetRuangan) {
                        $currentIds = array_values(array_unique(array_merge($currentIds, $dosenIds)));
                        $ruangan->update([
                            'penanggung_jawab' => $currentIds,
                        ]);
                    } else {
                        $currentIds = array_values(array_diff($currentIds, $dosenIds));
                        $updateData = [
                            'penanggung_jawab' => count($currentIds) > 0 ? $currentIds : null,
                        ];
                        if (in_array((int) $ruangan->mahasiswa_id, $dosenIds, true)) {
                            $updateData['mahasiswa_id'] = null;
                        }
                        $ruangan->update($updateData);
                    }
                }
            }
        });

        Ruangan::query()->update(['open_api' => true]);

        return redirect()->back()->with('success', 'Berhasil memperbarui penanggung jawab ruangan untuk ' . count($dosenIds) . ' dosen.');
    }
}
