<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FotoServicio extends Model
{
    use HasFactory;

    protected $table = 'foto_servicios';

    protected $fillable = [
        'cita_id',
        'url',
        'tipo',
        'subido_por',
    ];

    public function cita()
    {
        return $this->belongsTo(Cita::class);
    }

    public function subidoPor()
    {
        return $this->belongsTo(User::class, 'subido_por');
    }
}