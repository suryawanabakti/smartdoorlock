<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Absensi extends Model
{
    use HasFactory;

    protected $table = 'absensis';

    protected $fillable = [
        'id_tag',
        'nama',
        'nim',
        'tahun',
        'ruangan_id',
        'waktu_masuk',
        'waktu_keluar',
    ];

    protected $casts = [
        'waktu_masuk' => 'datetime',
        'waktu_keluar' => 'datetime',
    ];

    // Relationships
    public function ruangan(): BelongsTo
    {
        return $this->belongsTo(Ruangan::class);
    }

    // Scopes
    public function scopeByRuangan($query, $ruanganId)
    {
        return $query->where('ruangan_id', $ruanganId);
    }

    public function scopeByTahun($query, $tahun)
    {
        return $query->where('tahun', $tahun);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('waktu_masuk', [$startDate, $endDate]);
    }

    public function scopeByNim($query, $nim)
    {
        return $query->where('nim', 'like', "%{$nim}%");
    }

    public function scopeByNama($query, $nama)
    {
        return $query->where('nama', 'like', "%{$nama}%");
    }

    public function scopeHariIni($query)
    {
        return $query->whereDate('waktu_masuk', today());
    }

    public function scopeMasuk($query)
    {
        return $query->whereNotNull('waktu_masuk');
    }

    public function scopeKeluar($query)
    {
        return $query->whereNotNull('waktu_keluar');
    }

    public function scopeBelumKeluar($query)
    {
        return $query->whereNotNull('waktu_masuk')->whereNull('waktu_keluar');
    }

    // Accessors
    public function getStatusAttribute(): string
    {
        if ($this->waktu_masuk && $this->waktu_keluar) {
            return 'Selesai';
        } elseif ($this->waktu_masuk) {
            return 'Masuk';
        }

        return 'Tidak Valid';
    }

    public function getDurasiAttribute(): ?string
    {
        if ($this->waktu_masuk && $this->waktu_keluar) {
            $diff = $this->waktu_masuk->diff($this->waktu_keluar);

            return sprintf('%02d:%02d:%02d', $diff->h, $diff->i, $diff->s);
        }

        return null;
    }

    public function user()
    {
        return $this->belongsTo(Mahasiswa::class, 'id_tag', 'id_tag');
    }

    public function getLamaAksesMenitAttribute(): ?int
    {
        if ($this->waktu_masuk && $this->waktu_keluar) {
            return $this->waktu_masuk->diffInMinutes($this->waktu_keluar);
        }

        return null;
    }

    // Methods
    public function isMasuk(): bool
    {
        return ! is_null($this->waktu_masuk);
    }

    public function isKeluar(): bool
    {
        return ! is_null($this->waktu_keluar);
    }

    public function isAktif(): bool
    {
        return $this->isMasuk() && ! $this->isKeluar();
    }
}
