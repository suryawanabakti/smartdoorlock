<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mahasiswa extends Model
{
    use HasFactory;

    public $table = 'mahasiswa';

    protected $fillable = [
        'user_id',
        'id_tag',
        'nama',
        'nim',
        'pin',
        'ruangan_id',
        'ket',
        'status',
        'tahun_masuk',
    ];

    protected $casts = [
        'status' => 'integer',
        'tahun_masuk' => 'integer',
    ];

    // Constants
    const STATUS_AKTIF = 1;

    const STATUS_NONAKTIF = 0;

    const KET_MAHASISWA = 'mhs';

    const KET_DOSEN = 'dsn';

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ruangan(): BelongsTo
    {
        return $this->belongsTo(Ruangan::class);
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('status', self::STATUS_AKTIF);
    }

    public function scopeNonaktif($query)
    {
        return $query->where('status', self::STATUS_NONAKTIF);
    }

    public function scopeMahasiswa($query)
    {
        return $query->where('ket', self::KET_MAHASISWA);
    }

    public function scopeDosen($query)
    {
        return $query->where('ket', self::KET_DOSEN);
    }

    public function scopeByTahun($query, $tahun)
    {
        return $query->where('tahun_masuk', $tahun);
    }

    // Accessors
    public function getStatusTextAttribute(): string
    {
        return $this->status == self::STATUS_AKTIF ? 'Aktif' : 'Nonaktif';
    }

    public function getStatusBadgeAttribute(): string
    {
        return $this->status == self::STATUS_AKTIF
            ? '<span class="badge badge-success">Aktif</span>'
            : '<span class="badge badge-secondary">Nonaktif</span>';
    }

    public function getKetTextAttribute(): string
    {
        return $this->ket == self::KET_DOSEN ? 'Dosen' : 'Mahasiswa';
    }

    // Methods
    public function isAktif(): bool
    {
        return $this->status == self::STATUS_AKTIF;
    }

    public function isDosen(): bool
    {
        return $this->ket == self::KET_DOSEN;
    }

    public function isMahasiswa(): bool
    {
        return $this->ket == self::KET_MAHASISWA;
    }

    public function hakAkses()
    {
        return $this->belongsToMany(HakAkses::class, 'hak_akses_mahasiswas')
            ->withTimestamps();
    }

    public function hakAksesMahasiswas()
    {
        return $this->hasMany(HakAksesMahasiswa::class);
    }
}
