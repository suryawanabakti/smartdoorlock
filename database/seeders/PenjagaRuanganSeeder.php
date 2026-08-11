<?php

namespace Database\Seeders;

use App\Models\PenjagaRuangan;
use App\Models\Ruangan;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PenjagaRuanganSeeder extends Seeder
{
    /**
     * Seed penjaga untuk setiap ruangan (1 penjaga per ruangan).
     * Idempotent: updateOrCreate berdasarkan email penjaga.
     */
    public function run(): void
    {
        foreach (Ruangan::all() as $ruangan) {
            $slug = Str::slug($ruangan->nama_ruangan);
            $email = 'penjaga.'.$slug.'@megabuana';

            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => 'Penjaga '.$ruangan->nama_ruangan,
                    'password' => Hash::make('password'),
                    'role' => 'penjaga',
                    'email_verified_at' => now(),
                ]
            );

            PenjagaRuangan::firstOrCreate(
                ['user_id' => $user->id, 'ruangan_id' => $ruangan->id]
            );
        }
    }
}
