<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FichaTecnica extends Model
{
    use HasFactory;

    protected $fillable = [
        'cita_id',
        'condicion_piel',
        'condicion_pelaje',
        'estado_orejas',
        'estado_ojos',
        'estado_dientes',
        'observaciones',
    ];

    public function cita()
    {
        return $this->belongsTo(Cita::class);
    }
}