<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HakAksesMahasiswa extends Model
{
    use HasFactory;

    protected $table = 'hak_akses_mahasiswas';

    protected $fillable = [
        'mahasiswa_id',
        'hak_akses_id',
    ];

    // Relationships
    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function hakAkses(): BelongsTo
    {
        return $this->belongsTo(HakAkses::class);
    }
}
