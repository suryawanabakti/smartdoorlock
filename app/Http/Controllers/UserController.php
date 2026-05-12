<?php

namespace App\Http\Controllers;

use App\Models\Ruangan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with(['ruangans'])
            ->where('role', 'penjaga')
            ->latest();

        // Search filter
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%")
                    ->orWhere('nowa', 'like', "%{$request->search}%");
            });
        }

        // Role filter
        if ($request->has('role') && $request->role && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        $users = $query->paginate(10);

        return Inertia::render('User/Index', [
            'users' => $users,
            'filters' => $request->only(['search']),
            'roles' => ['penjaga'],
        ]);
    }

    public function create()
    {
        $ruangans = Ruangan::all();

        return Inertia::render('User/Create', [
            'ruangans' => $ruangans,
            'roles' => ['penjaga'], // Super/Admin dibuat manual atau di sistem lain
        ]);
    }

    public function toggleStatus(User $user)
    {
        $user->is_active = ! $user->is_active; // toggle true/false
        $user->save();

        return redirect()->back()->with('success', 'Status pengguna berhasil diperbarui.');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'email_notifikasi' => 'nullable|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed'],
            'role' => 'required|in:penjaga',
            'nowa' => 'nullable|string|max:20',
            'image' => 'nullable|image|max:2048',
            'ruangan_ids' => 'nullable|array',
            'ruangan_ids.*' => 'exists:ruangans,id',
        ]);

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('users', 'public');
        }

        // Create user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'email_notifikasi' => $validated['email_notifikasi'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'nowa' => $validated['nowa'] ?? null,
            'image' => $imagePath,
        ]);

        // Assign ruangans if user is penjaga
        if ($validated['role'] === 'penjaga' && ! empty($validated['ruangan_ids'])) {
            $user->ruangans()->sync($validated['ruangan_ids']);
        }

        return redirect()->route('users.index')
            ->with('success', 'User berhasil dibuat.');
    }

    public function edit(User $user)
    {
        $ruangans = Ruangan::all();
        $user->load('ruangans')->append('image_url');

        return Inertia::render('User/Edit', [
            'user' => $user,
            'ruangans' => $ruangans,
            'roles' => ['penjaga'],
            'userRuanganIds' => $user->ruangans->pluck('id')->toArray(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'email_notifikasi' => 'nullable|string|email|max:255|unique:users,email_notifikasi,'.$user->id,
            'password' => 'nullable|confirmed|',
            'role' => 'required|in:penjaga',
            'nowa' => 'nullable|string|max:20',
            'image' => 'nullable|image|max:2048',
            'ruangan_ids' => 'nullable|array',
            'ruangan_ids.*' => 'exists:ruangans,id',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'email_notifikasi' => $validated['email_notifikasi'] ?? null,
            'role' => $validated['role'],
            'nowa' => $validated['nowa'] ?? null,
        ];

        // Update password if provided
        if ($validated['password']) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($user->image) {
                Storage::disk('public')->delete($user->image);
            }
            $updateData['image'] = $request->file('image')->store('users', 'public');
        }

        $user->update($updateData);

        // Update ruangan assignments for penjaga
        if ($validated['role'] === 'penjaga') {
            $user->ruangans()->sync($validated['ruangan_ids'] ?? []);
        } else {
            // Remove all ruangan assignments if user is not penjaga
            $user->ruangans()->detach();
        }

        return redirect()->route('users.index')
            ->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        // Prevent self-deletion
        if ($user->id === auth()->id()) {
            return redirect()->back()
                ->with('error', 'Tidak dapat menghapus akun sendiri.');
        }

        // Delete image if exists
        if ($user->image) {
            Storage::disk('public')->delete($user->image);
        }

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'User berhasil dihapus.');
    }

    public function updateImage(Request $request, User $user)
    {
        $request->validate([
            'image' => 'required|image|max:2048',
        ]);

        // Delete old image
        if ($user->image) {
            Storage::disk('public')->delete($user->image);
        }

        // Store new image
        $imagePath = $request->file('image')->store('users', 'public');
        $user->update(['image' => $imagePath]);

        return redirect()->back()
            ->with('success', 'Foto profil berhasil diperbarui.');
    }

    public function removeImage(User $user)
    {
        if ($user->image) {
            Storage::disk('public')->delete($user->image);
            $user->update(['image' => null]);
        }

        return redirect()->back()
            ->with('success', 'Foto profil berhasil dihapus.');
    }
}
