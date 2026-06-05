<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bloqueo extends Model
{
    use HasFactory;

    protected $table = 'bloqueos';

    protected $fillable = [
        'fecha',
        'hora_inicio',
        'hora_fin',
        'motivo',
        'aplica_todo_dia',
        'creado_por',
    ];

    protected $casts = [
        'fecha' => 'date',
        'aplica_todo_dia' => 'boolean',
    ];

    public function creadoPor()
    {
        return $this->belongsTo(User::class, 'creado_por');
    }
}