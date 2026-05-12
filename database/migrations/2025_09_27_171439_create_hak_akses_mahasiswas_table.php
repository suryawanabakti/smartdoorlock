<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hak_akses_mahasiswas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswa')->cascadeOnDelete();
            $table->foreignId('hak_akses_id')->constrained('hak_akses')->cascadeOnDelete();
            $table->timestamps();

            // Unique constraint to prevent duplicate assignments
            $table->unique(['mahasiswa_id', 'hak_akses_id']);

            // Indexes
            $table->index('mahasiswa_id');
            $table->index('hak_akses_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hak_akses_mahasiswas');
    }
};
