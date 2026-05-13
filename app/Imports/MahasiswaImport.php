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
        // Cari ruangan berdasarkan nama (kolom 'kelas' atau 'ruangan' di excel)
        $ruanganName = $row['kelas'] ?? $row['ruangan'] ?? $row['tahun'] ?? $row['homebase'] ?? null;
        $ruangan = null;
        
        if ($ruanganName) {
            $ruangan = Ruangan::where('nama_ruangan', 'like', '%' . $ruanganName . '%')->first();
        }

        $nim = $row['nim'] ?? $row['nidn'];

        // Create or update user account
        $user = User::updateOrCreate(
            ['email' => $nim],
            [
                'name'     => $row['nama'],
                'password' => Hash::make($nim),
                'role'     => 'mahasiswa',
            ]
        );

        return new Mahasiswa([
            'nama'        => $row['nama'],
            'nim'         => $nim,
            'id_tag'      => $row['id_tag'] ?? $row['tag'] ?? null,
            'tahun_masuk' => $row['tahun_masuk'] ?? $row['angkatan'] ?? $row['tahun_gabung'] ?? date('Y'),
            'ruangan_id'  => $ruangan ? $ruangan->id : null,
            'user_id'     => $user->id,
            'ket'         => $this->ket,
            'status'      => 1, // Aktif by default
        ]);

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
