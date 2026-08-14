<?php

namespace App\Imports;

use App\Models\Mahasiswa;
use App\Models\Ruangan;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


class MahasiswaImport implements ToModel, WithHeadingRow, WithValidation
{
    protected $ket;

    public function __construct($ket = 'mhs')
    {
        $this->ket = $ket;
    }

    public function model(array $row)
    {
        // Cari ruangan
        $ruanganName = $row['kelas'] ?? $row['ruangan'] ?? $row['tahun'] ?? $row['homebase'] ?? null;
        $ruangan = null;

        if ($ruanganName) {
            $ruangan = Ruangan::where('nama_ruangan', 'like', '%' . $ruanganName . '%')->first();
        }

        $nim = $row['nim'] ?? $row['nidn'];

        // Create / Update User
        $user = User::updateOrCreate(
            ['email' => $nim],
            [
                'name'     => $row['nama'],
                'password' => Hash::make($nim),
                'role'     => 'mahasiswa',
            ]
        );

        // Create / Update Mahasiswa
        return Mahasiswa::updateOrCreate(
            ['nim' => $nim], // pencarian
            [
                'nama'        => $row['nama'],
                'id_tag'      => $row['id_tag'] ?? null,
                'tahun_masuk' => $row['tahun_masuk']
                    ?? $row['angkatan']
                    ?? $row['tahun_gabung']
                    ?? date('Y'),
                'ruangan_id'  => $ruangan?->id,
                'user_id'     => $user->id,
                'ket'         => $this->ket,
                'status'      => 1,
            ]
        );
    }


    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:255',
            'nim'  => 'required|unique:mahasiswa,nim',
            // 'id_tag' can be null or unique
        ];
    }
}
