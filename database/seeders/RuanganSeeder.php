<?php

namespace Database\Seeders;

use App\Models\Mahasiswa;
use App\Models\Ruangan;
use Illuminate\Database\Seeder;

class RuanganSeeder extends Seeder
{
    /**
     * Seed data ruangan kampus Fakultas Kedokteran & Kesehatan (FKUH).
     * Idempotent: updateOrCreate berdasarkan nama_ruangan.
     */
    public function run(): void
    {
        $penanggungJawab = $this->penanggungJawabOptions();

        $rooms = [
            // ===================== RUANG KULIAH (kelas) =====================
            ['nama_ruangan' => 'Ruang Kuliah A', 'type' => 'kelas', 'open_api' => true, 'max_register' => 40, 'jam_buka' => '07:00:00', 'jam_tutup' => '21:00:00'],
            ['nama_ruangan' => 'Ruang Kuliah B', 'type' => 'kelas', 'open_api' => true, 'max_register' => 40, 'jam_buka' => '07:00:00', 'jam_tutup' => '21:00:00'],
            ['nama_ruangan' => 'Ruang Kuliah C', 'type' => 'kelas', 'open_api' => true, 'max_register' => 40, 'jam_buka' => '07:00:00', 'jam_tutup' => '21:00:00'],
            ['nama_ruangan' => 'Ruang Seminar', 'type' => 'kelas', 'open_api' => true, 'max_register' => 60, 'jam_buka' => '08:00:00', 'jam_tutup' => '22:00:00'],

            // ===================== LABORATORIUM (lab) =====================
            ['nama_ruangan' => 'Lab Anatomi', 'type' => 'lab', 'open_api' => true, 'max_register' => 30, 'jam_buka' => '08:00:00', 'jam_tutup' => '17:00:00'],
            ['nama_ruangan' => 'Lab Fisiologi', 'type' => 'lab', 'open_api' => true, 'max_register' => 30, 'jam_buka' => '08:00:00', 'jam_tutup' => '17:00:00'],
            ['nama_ruangan' => 'Lab Keperawatan', 'type' => 'lab', 'open_api' => true, 'max_register' => 30, 'jam_buka' => '08:00:00', 'jam_tutup' => '17:00:00'],
            ['nama_ruangan' => 'Lab Komputer', 'type' => 'lab', 'open_api' => true, 'max_register' => 40, 'jam_buka' => '08:00:00', 'jam_tutup' => '20:00:00'],
            ['nama_ruangan' => 'Lab Kesehatan Masyarakat', 'type' => 'lab', 'open_api' => true, 'max_register' => 30, 'jam_buka' => '08:00:00', 'jam_tutup' => '17:00:00'],

            // ===================== FASILITAS UMUM (umum) =====================
            ['nama_ruangan' => 'Perpustakaan', 'type' => 'umum', 'open_api' => true, 'max_register' => 100, 'jam_buka' => '08:00:00', 'jam_tutup' => '21:00:00'],
            ['nama_ruangan' => 'Aula Utama', 'type' => 'umum', 'open_api' => false, 'max_register' => 250, 'jam_buka' => '08:00:00', 'jam_tutup' => '22:00:00'],
            ['nama_ruangan' => 'Ruang Dosen', 'type' => 'umum', 'open_api' => true, 'max_register' => 20, 'jam_buka' => '07:00:00', 'jam_tutup' => '18:00:00'],
            ['nama_ruangan' => 'Ruang Rapat', 'type' => 'umum', 'open_api' => false, 'max_register' => 20, 'jam_buka' => '08:00:00', 'jam_tutup' => '18:00:00'],
        ];

        foreach ($rooms as $room) {
            $penanggungJawabId = null;

            if ($room['type'] === 'lab' || $room['nama_ruangan'] === 'Ruang Dosen') {
                $penanggungJawabId = $penanggungJawab[array_rand($penanggungJawab)];
            }

            Ruangan::updateOrCreate(
                ['nama_ruangan' => $room['nama_ruangan']],
                [
                    'type' => $room['type'],
                    'open_api' => $room['open_api'],
                    'pin' => null,
                    'pin_active' => false,
                    'parent_id' => null,
                    'jam_buka' => $room['jam_buka'],
                    'jam_tutup' => $room['jam_tutup'],
                    'max_register' => $room['max_register'],
                    'mahasiswa_id' => $penanggungJawabId,
                    'penanggung_jawab' => $penanggungJawabId ? [$penanggungJawabId] : null,
                ]
            );
        }
    }

    /**
     * Ambil daftar ID dosen/staff (ket: dsn) sebagai kandidat penanggung jawab.
     */
    private function penanggungJawabOptions(): array
    {
        return Mahasiswa::where('ket', 'dsn')->pluck('id')->all();
    }
}
