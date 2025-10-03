<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScanerStatus extends Model
{
    use HasFactory;

    public $table = 'scaner_status';

    protected $fillable = ['kode', 'ruangan_id', 'type', 'last'];

    public function ruangan()
    {
        return $this->belongsTo(Ruangan::class);
    }

    public function histories()
    {
        return $this->hasMany(Histori::class, 'kode', 'kode');
    }

    public function histori()
    {
        return $this->hasMany(Histori::class, 'kode', 'kode');
    }
}
