<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hak_akses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ruangan_id')->constrained('ruangans')->cascadeOnDelete();
            $table->date('tanggal');
            $table->time('jam_masuk');
            $table->time('jam_keluar');
            $table->boolean('is_approve')->default(false);
            $table->boolean('is_by_admin')->default(false);
            $table->text('tujuan')->nullable();
            $table->text('skill')->nullable();
            $table->text('additional_participant')->nullable();
            $table->integer('max_register')->default(10);
            $table->timestamps();

            // Indexes
            $table->index('ruangan_id');
            $table->index('tanggal');
            $table->index('is_approve');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hak_akses');
    }
};
