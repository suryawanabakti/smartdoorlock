<?php

namespace Database\Seeders;

use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MahasiswaSeeder extends Seeder
{
    /**
     * Seed data mahasiswa (ket: mhs) dan dosen/staff (ket: dsn).
     *
     * Data mahasiswa dibuat mengikuti pola data Universitas Mega Buana Palopo
     * (prodi kedokteran, kedokteran gigi, keperawatan, kebidanan, kesehatan masyarakat).
     * Akun login dibuat mengikuti pola MahasiswaImport: email = NIM, password = NIM.
     */
    public function run(): void
    {
        $data = [
            // ===================== MAHASISWA (ket: mhs) =====================
            ['nama' => 'Ahmad Fauzan Ramadhan', 'nim' => '202011101', 'tahun_masuk' => 2020, 'ket' => 'mhs'],
            ['nama' => 'Nurul Aisyah Putri', 'nim' => '202011102', 'tahun_masuk' => 2020, 'ket' => 'mhs'],
            ['nama' => 'Muhammad Rizky Pratama', 'nim' => '202112201', 'tahun_masuk' => 2021, 'ket' => 'mhs'],
            ['nama' => 'Andi Tenri Abeng', 'nim' => '202112202', 'tahun_masuk' => 2021, 'ket' => 'mhs'],
            ['nama' => 'Muh. Alif Fikri', 'nim' => '202211101', 'tahun_masuk' => 2022, 'ket' => 'mhs'],
            ['nama' => 'Alya Syahira Ramadhani', 'nim' => '202211102', 'tahun_masuk' => 2022, 'ket' => 'mhs'],
            ['nama' => 'Siti Rahma Wulandari', 'nim' => '202211301', 'tahun_masuk' => 2022, 'ket' => 'mhs'],
            ['nama' => 'Reza Anugrah Saputra', 'nim' => '202211302', 'tahun_masuk' => 2022, 'ket' => 'mhs'],
            ['nama' => 'Yusuf Abdullah', 'nim' => '202311103', 'tahun_masuk' => 2023, 'ket' => 'mhs'],
            ['nama' => 'Nabila Azzahra', 'nim' => '202311104', 'tahun_masuk' => 2023, 'ket' => 'mhs'],
            ['nama' => 'Dewi Anggraini', 'nim' => '202311401', 'tahun_masuk' => 2023, 'ket' => 'mhs'],
            ['nama' => 'Putri Maharani', 'nim' => '202311402', 'tahun_masuk' => 2023, 'ket' => 'mhs'],
            ['nama' => 'Nur Afifah', 'nim' => '202312301', 'tahun_masuk' => 2023, 'ket' => 'mhs'],
            ['nama' => 'Andi Muhammad Fadli', 'nim' => '202312302', 'tahun_masuk' => 2023, 'ket' => 'mhs'],
            ['nama' => 'Fahrul Rozi', 'nim' => '202411105', 'tahun_masuk' => 2024, 'ket' => 'mhs'],
            ['nama' => 'Indah Permata Sari', 'nim' => '202411106', 'tahun_masuk' => 2024, 'ket' => 'mhs'],
            ['nama' => 'Bagas Pratama Yudha', 'nim' => '202411501', 'tahun_masuk' => 2024, 'ket' => 'mhs'],
            ['nama' => 'Fitri Handayani', 'nim' => '202411502', 'tahun_masuk' => 2024, 'ket' => 'mhs'],
            ['nama' => 'Rizki Amelia', 'nim' => '202412101', 'tahun_masuk' => 2024, 'ket' => 'mhs'],
            ['nama' => 'Muhammad Ilham Akbar', 'nim' => '202412102', 'tahun_masuk' => 2024, 'ket' => 'mhs'],

            // ===================== DOSEN (ket: dsn) =====================
            ['nama' => 'dr. H. Andi Baso, Sp.PD', 'nim' => '2407067701', 'tahun_masuk' => 2010, 'ket' => 'dsn'],
            ['nama' => 'dr. Muhammad Nasir, Sp.OG', 'nim' => '2407067502', 'tahun_masuk' => 2008, 'ket' => 'dsn'],
            ['nama' => 'drg. Sitti Maryam, Sp.KG', 'nim' => '2407068203', 'tahun_masuk' => 2012, 'ket' => 'dsn'],
            ['nama' => 'Ns. Sri Wahyuni, S.Kep., M.Kep.', 'nim' => '2407068804', 'tahun_masuk' => 2015, 'ket' => 'dsn'],
            ['nama' => 'Prof. Dr. Hj. Nurul Haidah, M.Kes', 'nim' => '2407066905', 'tahun_masuk' => 2005, 'ket' => 'dsn'],
            ['nama' => 'Dr. Ir. Arifin, M.Si', 'nim' => '2407067206', 'tahun_masuk' => 2010, 'ket' => 'dsn'],

            // ===================== STAFF (ket: dsn) =====================
            ['nama' => 'Andi Sukma Dewi', 'nim' => '198705202010122001', 'tahun_masuk' => 2010, 'ket' => 'dsn'],
            ['nama' => 'Muhammad Yusuf', 'nim' => '199002152014031002', 'tahun_masuk' => 2014, 'ket' => 'dsn'],
            ['nama' => 'Hasnawati', 'nim' => '198803122012122002', 'tahun_masuk' => 2012, 'ket' => 'dsn'],
            ['nama' => 'Rosnawati', 'nim' => '199101102016012003', 'tahun_masuk' => 2016, 'ket' => 'dsn'],
        ];

        foreach ($data as $index => $item) {
            $user = User::firstOrCreate(
                ['email' => $item['nim']],
                [
                    'name' => $item['nama'],
                    'password' => Hash::make($item['nim']),
                    'role' => 'mahasiswa',
                    'email_verified_at' => now(),
                ]
            );

            Mahasiswa::updateOrCreate(
                ['nim' => $item['nim']],
                [
                    'user_id' => $user->id,
                    'id_tag' => $this->generateIdTag(),
                    'nama' => $item['nama'],
                    'nim' => $item['nim'],
                    'pin' => str_pad((string) (1000 + $index), 4, '0', STR_PAD_LEFT),
                    'ruangan_id' => null,
                    'ket' => $item['ket'],
                    'status' => 1,
                    'tahun_masuk' => $item['tahun_masuk'],
                ]
            );
        }
    }

    /**
     * Generate id_tag acak: 5 karakter huruf kecil + angka, dijamin unik.
     */
    private function generateIdTag(): string
    {
        $chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

        do {
            $tag = '';
            for ($i = 0; $i < 5; $i++) {
                $tag .= $chars[random_int(0, strlen($chars) - 1)];
            }
        } while (Mahasiswa::where('id_tag', $tag)->exists());

        return $tag;
    }
}
