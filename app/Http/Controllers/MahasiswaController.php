<?php

namespace App\Http\Controllers;

use App\Models\Mahasiswa;
use App\Models\Ruangan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Imports\MahasiswaImport;
use Maatwebsite\Excel\Facades\Excel;


class MahasiswaController extends Controller
{
    public function index(Request $request)
    {
        // Detect ket from route if not explicitly provided
        $ket = $request->get('ket');
        if (!$ket) {
            if ($request->routeIs('mahasiswa.list')) {
                $ket = 'mhs';
            } elseif ($request->routeIs('dosen.list')) {
                $ket = 'dsn';
            } else {
                $ket = 'mhs';
            }
        }

        $query = Mahasiswa::with(['user', 'ruangan'])
            ->where('ket', $ket)
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

    // Create page specifically for Mahasiswa (hide ket field)
    public function createMahasiswa(Request $request)
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
            'filters' => ['ket' => 'mhs'],
            'defaultKet' => 'mhs',
            'hideKet' => true,
        ]);
    }

    // Create page specifically for Dosen (hide ket field)
    public function createDosen(Request $request)
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'create_user' => 'nullable|boolean',
            'email' => 'required_if:create_user,true|nullable|string|unique:users,email',
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

        $route = $validated['ket'] === 'dsn' ? 'dosen.list' : 'mahasiswa.list';

        Ruangan::query()->update(['open_api' => true]);
        return redirect()->route($route)
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

    // Edit page for Mahasiswa (hide ket field)
    public function editMahasiswa(Mahasiswa $mahasiswa)
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
            'defaultKet' => 'mhs',
            'hideKet' => true,
        ]);
    }

    // Edit page for Dosen (hide ket field)
    public function editDosen(Mahasiswa $mahasiswa)
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

    public function update(Request $request, Mahasiswa $mahasiswa)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'create_user' => 'nullable|boolean',
            'email' => 'required_if:create_user,true|nullable|string|unique:users,email',
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

        $route = $validated['ket'] === 'dsn' ? 'dosen.list' : 'mahasiswa.list';

        Ruangan::query()->update(['open_api' => true]);
        return redirect()->route($route)
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

        $route = $mahasiswa->ket === 'dsn' ? 'dosen.list' : 'mahasiswa.list';
        return redirect()->route($route)
            ->with('success', 'Data mahasiswa/dosen berhasil dihapus.');
    }

    public function toggleStatus(Mahasiswa $mahasiswa)
    {
        $mahasiswa->update(['status' => ! $mahasiswa->status]);

        $status = $mahasiswa->status ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()->back()
            ->with('success', "Data berhasil {$status}.");
    }

    public function lowercaseIdTag()
    {
        $count = Mahasiswa::whereNotNull('id_tag')
            ->whereRaw('BINARY id_tag <> LOWER(id_tag)')
            ->get()
            ->each(function ($mahasiswa) {
                $mahasiswa->update(['id_tag' => strtolower($mahasiswa->id_tag)]);
            })
            ->count();

        return redirect()->back()->with('success', "{$count} id_tag berhasil diubah menjadi huruf kecil.");
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240',
            'ket' => 'nullable|in:mhs,dsn',
        ]);

        $ket = $request->get('ket', 'mhs');

        try {
            Excel::import(new MahasiswaImport($ket), $request->file('file'));
            return redirect()->back()->with('success', 'Data ' . ($ket === 'dsn' ? 'dosen' : 'mahasiswa') . ' berhasil diimport.');
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {

            $failures = $e->failures();
            $errors = [];
            foreach ($failures as $failure) {
                $errors[] = "Baris {$failure->row()}: " . implode(', ', $failure->errors());
            }
            return redirect()->back()->with('error', 'Import gagal: ' . implode(' | ', array_slice($errors, 0, 3)));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat import: ' . $e->getMessage());
        }
    }
}
