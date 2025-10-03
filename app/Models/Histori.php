<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Histori extends Model
{
    use HasFactory;

    protected $table = 'histori';

    protected $fillable = [
        'kode',
        'waktu',
        'id_tag',
        'nama',
        'nim',
        'status',
    ];

    protected $casts = [
        'waktu' => 'datetime',
    ];

    // Status Constants
    const STATUS_BLOK = 0;

    const STATUS_TERBUKA = 1;

    const STATUS_TIDAK_TERDAFTAR = 2;

    const STATUS_NO_AKSES = 3;

    // Relationships
    public function scanner()
    {
        return $this->belongsTo(ScanerStatus::class, 'kode', 'kode');
    }

    public function scopeByUserRuangan($query, $userId)
    {
        return $query->whereHas('scanner.ruangan.penjagaRuangans', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        });
    }

    // Accessors
    public function getStatusLabelAttribute(): string
    {
        return $this->getStatusLabels()[$this->status] ?? 'Unknown';
    }

    public function getStatusBadgeAttribute(): string
    {
        $variants = [
            self::STATUS_BLOK => 'bg-red-100 text-red-800 border-red-200',
            self::STATUS_TERBUKA => 'bg-green-100 text-green-800 border-green-200',
            self::STATUS_TIDAK_TERDAFTAR => 'bg-yellow-100 text-yellow-800 border-yellow-200',
            self::STATUS_NO_AKSES => 'bg-gray-100 text-gray-800 border-gray-200',
        ];

        $variant = $variants[$this->status] ?? $variants[self::STATUS_TIDAK_TERDAFTAR];

        return sprintf(
            '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border %s">%s</span>',
            $variant,
            $this->status_label
        );
    }

    // Helper Methods
    public static function getStatusLabels(): array
    {
        return [
            self::STATUS_BLOK => 'Blok',
            self::STATUS_TERBUKA => 'Terbuka',
            self::STATUS_TIDAK_TERDAFTAR => 'Tidak Terdaftar',
            self::STATUS_NO_AKSES => 'No Akses',
        ];
    }

    public static function getStatusOptions(): array
    {
        return [
            ['value' => self::STATUS_BLOK, 'label' => 'Blok'],
            ['value' => self::STATUS_TERBUKA, 'label' => 'Terbuka'],
            ['value' => self::STATUS_TIDAK_TERDAFTAR, 'label' => 'Tidak Terdaftar'],
            ['value' => self::STATUS_NO_AKSES, 'label' => 'No Akses'],
        ];
    }

    public function isSuccess(): bool
    {
        return $this->status === self::STATUS_TERBUKA;
    }

    public function isBlocked(): bool
    {
        return $this->status === self::STATUS_BLOK;
    }

    public function isNotRegistered(): bool
    {
        return $this->status === self::STATUS_TIDAK_TERDAFTAR;
    }

    public function isNoAccess(): bool
    {
        return $this->status === self::STATUS_NO_AKSES;
    }
}
