<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('penjaga_ruangans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete(); // penjaga
            $table->foreignId('ruangan_id')->constrained('ruangans')->cascadeOnDelete();
            $table->timestamps();

            // Unique constraint to prevent duplicate assignments
            $table->unique(['user_id', 'ruangan_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penjaga_ruangans');
    }
};
