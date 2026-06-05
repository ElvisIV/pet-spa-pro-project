<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DisponibilidadGroomer extends Model
{
    use HasFactory;

    protected $table = 'disponibilidad_groomer'; // o 'disponibilidad_groomers' según tu migración

    protected $fillable = [
        'user_id',
        'dia',
        'hora_inicio',
        'hora_fin',
    ];

    public function groomer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}