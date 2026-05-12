<?php

namespace App\Http\Controllers;

use App\Models\Mahasiswa;
use App\Models\Ruangan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class MahasiswaController extends Controller
{
    public function index(Request $request)
    {
        $query = Mahasiswa::with(['user', 'ruangan'])
            ->latest();

        // Search filter
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nama', 'like', "%{$request->search}%")
                    ->orWhere('nim', 'like', "%{$request->search}%")
                    ->orWhere('id_tag', 'like', "%{$request->search}%");
            });
        }

        // Status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Ket filter
        if ($request->filled('ket') && $request->ket !== 'all') {
            $query->where('ket', $request->ket);
        }

        // Tahun filter
        if ($request->filled('tahun_masuk') && $request->tahun_masuk !== 'all') {
            $query->where('tahun_masuk', $request->tahun_masuk);
        }

        $mahasiswas = $query->paginate(10);

        return Inertia::render('Mahasiswa/Index', [
            'mahasiswas' => $mahasiswas,
            'filters' => $request->only(['search', 'status', 'ket', 'tahun_masuk']),
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
            'filters' => $request->only(['ket']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'create_user' => 'nullable|boolean',
            'email' => 'required_if:create_user,true|nullable|email|unique:users,email',
            'password' => 'required_if:create_user,true|nullable|string|min:8',
            'id_tag' => 'nullable|string|unique:mahasiswa,id_tag',
            'nama' => 'required|string|max:255',
            'nim' => 'required|string|unique:mahasiswa,nim',
            'pin' => 'nullable|string|unique:mahasiswa,pin',
            'ruangan_id' => 'nullable|exists:ruangans,id',
            'ket' => 'required|in:mhs,dsn',
            'status' => 'required|boolean',
            'tahun_masuk' => 'required|integer|min:2000|max:' . (date('Y') + 1),
        ]);

        DB::transaction(function () use ($validated) {
            if (!empty($validated['create_user']) && $validated['create_user']) {
                $user = User::create([
                    'name' => $validated['nama'],
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password']),
                    'role' => 'mahasiswa',
                ]);
                $validated['user_id'] = $user->id;
            }

            $mahasiswa = Mahasiswa::create($validated);

            // Jika ada user_id, update role user sesuai dengan ket
            if ($validated['user_id']) {
                $user = User::find($validated['user_id']);
                if ($user) {
                    $user->update(['role' => 'mahasiswa']);
                }
            }
        });

        return redirect()->route('mahasiswas.index')
            ->with('success', 'Data mahasiswa/dosen berhasil dibuat.');
    }

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
        ]);
    }

    public function update(Request $request, Mahasiswa $mahasiswa)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'create_user' => 'nullable|boolean',
            'email' => 'required_if:create_user,true|nullable|email|unique:users,email',
            'password' => 'required_if:create_user,true|nullable|string|min:8',
            'id_tag' => 'nullable|string|unique:mahasiswa,id_tag,' . $mahasiswa->id,
            'nama' => 'required|string|max:255',
            'nim' => 'required|string|unique:mahasiswa,nim,' . $mahasiswa->id,
            'pin' => 'nullable|string|unique:mahasiswa,pin,' . $mahasiswa->id,
            'ruangan_id' => 'nullable|exists:ruangans,id',
            'ket' => 'required|in:mhs,dsn',
            'status' => 'required|boolean',
            'tahun_masuk' => 'required|integer|min:2000|max:' . (date('Y') + 1),
        ]);

        DB::transaction(function () use ($mahasiswa, $validated) {
            if (!empty($validated['create_user']) && $validated['create_user']) {
                $user = User::create([
                    'name' => $validated['nama'],
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password']),
                    'role' => 'mahasiswa',
                ]);
                $validated['user_id'] = $user->id;
            }

            $oldUserId = $mahasiswa->user_id;
            $oldKet = $mahasiswa->ket;

            $mahasiswa->update($validated);

            // Update user role jika ket berubah atau user_id berubah
            if ($validated['user_id']) {
                $user = User::find($validated['user_id']);
                if ($user) {
                    $user->update(['role' => 'mahasiswa']);
                }
            }

            // Reset role user lama jika user_id berubah
            if ($oldUserId && $oldUserId !== $validated['user_id']) {
                $oldUser = User::find($oldUserId);
                if ($oldUser && ($oldUser->role === 'dosen' || $oldUser->role === 'mahasiswa')) {
                    $oldUser->update(['role' => 'mahasiswa']); // Default role or maybe handle better
                }
            }
        });

        return redirect()->route('mahasiswas.index')
            ->with('success', 'Data mahasiswa/dosen berhasil diperbarui.');
    }

    public function destroy(Mahasiswa $mahasiswa)
    {
        DB::transaction(function () use ($mahasiswa) {
            // Reset user role sebelum menghapus
            if ($mahasiswa->user_id) {
                $user = User::find($mahasiswa->user_id);
                if ($user && $user->role === $mahasiswa->ket) {
                    $user->update(['role' => 'mahasiswa']);
                }
            }

            $mahasiswa->delete();
        });

        return redirect()->route('mahasiswas.index')
            ->with('success', 'Data mahasiswa/dosen berhasil dihapus.');
    }

    public function toggleStatus(Mahasiswa $mahasiswa)
    {
        $mahasiswa->update(['status' => ! $mahasiswa->status]);

        $status = $mahasiswa->status ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()->back()
            ->with('success', "Data berhasil {$status}.");
    }
}
