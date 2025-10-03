<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HistoriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('histori')->insert([
            [
                'kode' => 'SCN2',
                'waktu' => Carbon::now(),
                'id_tag' => 'TAG001',
                'nama' => 'John Doe',
                'nim' => '123456789',
                'status' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'kode' => 'SCN2',
                'waktu' => Carbon::now()->subMinutes(10),
                'id_tag' => 'TAG002',
                'nama' => 'Jane Smith',
                'nim' => '987654321',
                'status' => false,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'kode' => 'SCN1',
                'waktu' => Carbon::now(),
                'id_tag' => 'TAG001',
                'nama' => 'John Doe',
                'nim' => '123456789',
                'status' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'kode' => 'SCN1',
                'waktu' => Carbon::now()->subMinutes(10),
                'id_tag' => 'TAG002',
                'nama' => 'Jane Smith',
                'nim' => '987654321',
                'status' => false,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
