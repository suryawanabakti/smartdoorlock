<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ruangans', function (Blueprint $table) {
            $table->id();
            $table->string('nama_ruangan')->nullable();
            $table->enum('type', ['umum', 'kelas', 'lab']);
            $table->boolean('open_api')->default(false);
            $table->string('pin')->nullable();
            $table->boolean('pin_active')->default(false);
            $table->foreignId('parent_id')->nullable()->constrained('ruangans')->onDelete('set null');
            $table->time('jam_buka')->default('00:01:00');
            $table->time('jam_tutup')->default('23:59:00');
            $table->integer('max_register')->default(10);
            $table->foreignId('mahasiswa_id')->nullable()->constrained('mahasiswas')->onDelete('set null');
            $table->text('penanggung_jawab')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('type');
            $table->index('parent_id');
            $table->index('mahasiswa_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ruangans');
    }
};
