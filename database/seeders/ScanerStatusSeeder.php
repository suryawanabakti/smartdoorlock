<?php

namespace Database\Seeders;

use App\Models\Ruangan;
use App\Models\ScanerStatus;
use Illuminate\Database\Seeder;

class ScanerStatusSeeder extends Seeder
{
    /**
     * Seed scanner (scaner_status) untuk setiap ruangan.
     *
     * Setiap ruangan mendapat 2 scanner: dalam (masuk) dan luar (keluar).
     * Kode scanner mengikuti pola RFID + huruf (A, B, C, ...) + nomor urut:
     *   - Ruangan pertama: RFIDA1 (dalam), RFIDA2 (luar)
     *   - Ruangan kedua:   RFIDB1 (dalam), RFIDB2 (luar)
     *   - dst.
     *
     * Idempotent: scanner lama dihapus lalu dibuat ulang dengan pola kode baru.
     */
    public function run(): void
    {
        ScanerStatus::query()->delete();

        $rooms = Ruangan::orderBy('id')->get();

        foreach ($rooms as $index => $ruangan) {
            $letter = chr(65 + $index); // A, B, C, ...

            foreach (['dalam', 'luar'] as $i => $type) {
                ScanerStatus::create([
                    'kode' => 'RFID'.$letter.($i + 1),
                    'ruangan_id' => $ruangan->id,
                    'type' => $type,
                    'last' => null,
                ]);
            }
        }
    }
}
