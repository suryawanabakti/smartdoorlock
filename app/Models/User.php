<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $appends = ['image_url'];

    protected $fillable = [
        'name',
        'email',
        'password',
        'nowa',
        'email_notifikasi',
        'role',
        'image',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Constants for roles
    const ROLE_SUPER = 'super';

    const ROLE_ADMIN = 'admin';

    const ROLE_PENJAGA = 'penjaga';

    const ROLE_MAHASISWA = 'mahasiswa';

    // Relationships
    public function ruangans(): BelongsToMany
    {
        return $this->belongsToMany(Ruangan::class, 'penjaga_ruangans', 'user_id', 'ruangan_id')
            ->withTimestamps()
            ->using(PenjagaRuangan::class);
    }

    public function penjagaRuangans()
    {
        return $this->hasMany(PenjagaRuangan::class);
    }

    // Scopes
    public function scopePenjaga($query)
    {
        return $query->where('role', self::ROLE_PENJAGA);
    }

    public function scopeAdmin($query)
    {
        return $query->where('role', self::ROLE_ADMIN);
    }

    public function scopeSuper($query)
    {
        return $query->where('role', self::ROLE_SUPER);
    }

    public function scopeMahasiswa($query)
    {
        return $query->where('role', self::ROLE_MAHASISWA);
    }

    // Helper methods
    public function isSuper(): bool
    {
        return $this->role === self::ROLE_SUPER;
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isPenjaga(): bool
    {
        return $this->role === self::ROLE_PENJAGA;
    }

    public function isMahasiswa(): bool
    {
        return $this->role === self::ROLE_MAHASISWA;
    }

    public function getRuangansAttribute()
    {
        if (! $this->isPenjaga()) {
            return collect();
        }

        return $this->ruangans()->get();
    }

    // Accessors
    public function getImageUrlAttribute()
    {
        if ($this->image) {
            return asset('storage/'.$this->image);
        }

        return asset('images/default-avatar.png');
    }

    public function mahasiswa()
    {
        return $this->hasOne(Mahasiswa::class);
    }
}
