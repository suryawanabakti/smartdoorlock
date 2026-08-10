<?php

namespace Database\Seeders;

use App\Models\Ruangan;
use App\Models\ScanerStatus;
use Illuminate\Database\Seeder;

class ScanerStatusSeeder extends Seeder
{
    /**
     * Seed scanner (scaner_status) untuk setiap ruangan.
     * Setiap ruangan mendapat 2 scanner: dalam (masuk) dan luar (keluar).
     * Kode scanner: 5 karakter huruf kecil + angka, unik.
     * Idempotent: satu ruangan + type hanya memiliki satu scanner.
     */
    public function run(): void
    {
        foreach (Ruangan::all() as $ruangan) {
            foreach (['dalam', 'luar'] as $type) {
                $scanner = ScanerStatus::firstOrNew([
                    'ruangan_id' => $ruangan->id,
                    'type' => $type,
                ]);

                if (! preg_match('/^[a-z0-9]{5}$/', (string) $scanner->kode)) {
                    $scanner->kode = $this->generateKode();
                }

                $scanner->save();
            }
        }
    }

    /**
     * Generate kode scanner acak: 5 karakter huruf kecil + angka, dijamin unik.
     */
    private function generateKode(): string
    {
        $chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

        do {
            $kode = '';
            for ($i = 0; $i < 5; $i++) {
                $kode .= $chars[random_int(0, strlen($chars) - 1)];
            }
        } while (ScanerStatus::where('kode', $kode)->exists());

        return $kode;
    }
}