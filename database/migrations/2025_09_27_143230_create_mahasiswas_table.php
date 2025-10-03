<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mahasiswas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->string('id_tag')->unique()->nullable();
            $table->string('nama');
            $table->string('nim')->unique();
            $table->string('pin')->nullable()->unique();
            $table->unsignedBigInteger('ruangan_id')->nullable();
            $table->foreign('ruangan_id')->references('id')->on('ruangans')->onDelete('set null'); // kelas
            $table->string('ket'); // pilihan dosen, mahasiswa
            $table->tinyInteger('status')->default(1);
            $table->integer('tahun_masuk')->default(2024);
            $table->timestamps();

            // Indexes
            $table->index('user_id');
            $table->index('ruangan_id');
            $table->index('nim');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mahasiswas');
    }
};
