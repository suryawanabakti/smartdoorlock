<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ruangan extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_ruangan',
        'type',
        'open_api',
        'pin',
        'pin_active',
        'parent_id',
        'jam_buka',
        'jam_tutup',
        'max_register',
        'mahasiswa_id',
        'penanggung_jawab',
    ];

    protected $casts = [
        'open_api' => 'boolean',
        'pin_active' => 'boolean',
        'jam_buka' => 'datetime:H:i',
        'jam_tutup' => 'datetime:H:i',
        'penanggung_jawab' => 'array',
    ];

    protected $appends = ['kode'];


    public function scanner()
    {
        return $this->hasMany(ScanerStatus::class);
    }

    public function scanerStatuses()
    {
        return $this->hasMany(ScanerStatus::class);
    }

    public function penjagaRuangans()
    {
        return $this->hasMany(PenjagaRuangan::class);
    }

    public function mahasiswas()
    {
        return $this->hasMany(Mahasiswa::class);
    }

    public function mahasiswaPenanggungJawab()
    {
        return $this->belongsTo(Mahasiswa::class, 'mahasiswa_id');
    }

    // Relationships
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Ruangan::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Ruangan::class, 'parent_id');
    }

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    // Scopes
    public function scopeUmum($query)
    {
        return $query->where('type', 'umum');
    }

    public function scopeKelas($query)
    {
        return $query->where('type', 'kelas');
    }

    public function scopeLab($query)
    {
        return $query->where('type', 'lab');
    }

    public function scopeActive($query)
    {
        return $query->where('open_api', true);
    }

    public function hakAkses()
    {
        return $this->hasMany(HakAkses::class);
    }

    public function getKodeAttribute()
    {
        $scanner = $this->scanerStatuses->first();

        return $scanner ? substr($scanner->kode, 0, 3) : null;
    }

    public function absensis()
    {
        return $this->hasMany(Absensi::class);
    }

    // ANEH
    public function hakAksesOne()
    {
        return $this->hasOne(HakAkses::class);
    }
}
