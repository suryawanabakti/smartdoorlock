<?php

namespace App\Http\Controllers;

use App\Models\Mahasiswa;
use App\Models\Ruangan;
use App\Models\User;
use Illuminate\Http\Request;
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
        ]);
    }

    // Show edit form for dosen (delegates to MahasiswaController)
    public function edit(Mahasiswa $mahasiswa)
    {
        $ruangans = Ruangan::where('type', 'kelas')->get();
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

        $mahasiswas = $query->paginate(10);

        return Inertia::render('Dosen/Index', [
            'mahasiswas' => $mahasiswas,
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
}
