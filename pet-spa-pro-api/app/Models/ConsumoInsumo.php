<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsumoInsumo extends Model
{
    use HasFactory;

    protected $table = 'consumo_insumos';

    protected $fillable = [
        'cita_id',
        'inventario_id',
        'cantidad',
        'registrado_por',
    ];

    public function cita()
    {
        return $this->belongsTo(Cita::class);
    }

    public function inventario()
    {
        return $this->belongsTo(Inventario::class, 'inventario_id');
    }

    public function registradoPor()
    {
        return $this->belongsTo(User::class, 'registrado_por');
    }
}