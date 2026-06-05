<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cita extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'citas';

    protected $fillable = [
        'user_id',
        'mascota_id',
        'staff_id',
        'fecha',
        'hora',
        'servicio',       // campo antiguo, puede quedar como descripción o lo migramos después
        'duracion',
        'estado',
        'notas',
    ];

    protected $casts = [
        'fecha' => 'date',
        'duracion' => 'integer',
    ];

    public function cliente()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function fichaTecnica()
{
    return $this->hasOne(FichaTecnica::class);
}

public function checklist()
{
    return $this->hasMany(ChecklistCita::class);
}

    public function mascota()
    {
        return $this->belongsTo(Mascota::class);
    }

    public function groomer()
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function servicios()
    {
        return $this->belongsToMany(Servicio::class, 'cita_servicio')
                    ->withPivot('precio')
                    ->withTimestamps();
    }

    public function pagos()
    {
        return $this->hasMany(Pago::class);
    }

    public function consumos()
    {
        return $this->hasMany(ConsumoInsumo::class);
    }

    public function fotos()
    {
        return $this->hasMany(FotoServicio::class);
    }
}