<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChecklistCita extends Model
{
    use HasFactory;

    protected $table = 'checklist_cita';

    protected $fillable = [
        'cita_id',
        'tarea',
        'completada',
        'completada_en',
    ];

    protected $casts = [
        'completada' => 'boolean',
        'completada_en' => 'datetime',
    ];

    public function cita()
    {
        return $this->belongsTo(Cita::class);
    }
}