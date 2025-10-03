<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('histori', function (Blueprint $table) {
            $table->id();
            $table->string('kode');
            $table->timestamp('waktu');
            $table->string('id_tag');
            $table->string('nama')->nullable();
            $table->string('nim')->nullable();
            $table->tinyInteger('status')->default(0); // 0: Blok, 1: Terbuka, 2: Tidak Terdaftar, 3: No Akses
            $table->timestamps();

            // Indexes
            $table->index('kode');
            $table->index('waktu');
            $table->index('id_tag');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historis');
    }
};
