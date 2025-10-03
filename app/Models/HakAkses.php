<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class HakAkses extends Model
{
    use HasFactory;

    protected $table = 'hak_akses';

    protected $fillable = [
        'ruangan_id',
        'tanggal',
        'jam_masuk',
        'jam_keluar',
        'is_approve',
        'is_by_admin',
        'tujuan',
        'skill',
        'additional_participant',
        'max_register',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'jam_masuk' => 'datetime:H:i',
        'jam_keluar' => 'datetime:H:i',
        'is_approve' => 'boolean',
        'is_by_admin' => 'boolean',
    ];

    // Relationships
    public function ruangan(): BelongsTo
    {
        return $this->belongsTo(Ruangan::class);
    }

    public function mahasiswas(): BelongsToMany
    {
        return $this->belongsToMany(Mahasiswa::class, 'hak_akses_mahasiswas')
            ->withTimestamps();
    }

    public function hakAksesMahasiswas()
    {
        return $this->hasMany(HakAksesMahasiswa::class);
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('is_approve', true);
    }

    public function scopePending($query)
    {
        return $query->where('is_approve', false);
    }

    public function scopeByAdmin($query)
    {
        return $query->where('is_by_admin', true);
    }

    public function scopeByDate($query, $date)
    {
        return $query->where('tanggal', $date);
    }

    public function scopeByRuangan($query, $ruanganId)
    {
        return $query->where('ruangan_id', $ruanganId);
    }

    public function scopeFuture($query)
    {
        return $query->where('tanggal', '>=', now()->format('Y-m-d'));
    }

    public function scopePast($query)
    {
        return $query->where('tanggal', '<', now()->format('Y-m-d'));
    }

    // Accessors
    public function getStatusAttribute(): string
    {
        if ($this->is_approve) {
            return 'Disetujui';
        }

        return $this->is_by_admin ? 'Dibuat Admin' : 'Menunggu Persetujuan';
    }

    public function getStatusBadgeAttribute(): string
    {
        if ($this->is_approve) {
            return '<span class="badge badge-success">Disetujui</span>';
        }

        return $this->is_by_admin
            ? '<span class="badge badge-info">Dibuat Admin</span>'
            : '<span class="badge badge-warning">Menunggu</span>';
    }

    public function getJadwalAttribute(): string
    {
        return $this->tanggal->format('d/m/Y').' '.$this->jam_masuk.' - '.$this->jam_keluar;
    }

    public function getTotalPesertaAttribute(): int
    {
        return $this->mahasiswas()->count();
    }

    public function getKuotaTersediaAttribute(): int
    {
        return max(0, $this->max_register - $this->total_peserta);
    }

    // Methods
    public function isFull(): bool
    {
        return $this->total_peserta >= $this->max_register;
    }

    public function canRegister(): bool
    {
        return ! $this->isFull() && $this->is_approve && $this->tanggal >= now()->format('Y-m-d');
    }

    public function approve(): void
    {
        $this->update(['is_approve' => true]);
    }

    public function reject(): void
    {
        $this->update(['is_approve' => false]);
    }

    public function hakAksesMahasiswaOne()
    {
        return $this->hasOne(HakAksesMahasiswa::class);
    }
}
