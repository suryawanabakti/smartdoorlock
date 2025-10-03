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
        Schema::create('scaner_status', function (Blueprint $table) {
            $table->id();
            $table->string('kode')->unique();
            $table->unsignedBigInteger('ruangan_id')->nullable();
            $table->foreign('ruangan_id')->references('id')->on('ruangans');
            $table->enum('type', ['dalam', 'luar']);
            $table->timestamp('last')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scaner_statuses');
    }
};
