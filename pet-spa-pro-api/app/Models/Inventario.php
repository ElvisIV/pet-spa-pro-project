<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventario extends Model
{
    use HasFactory;

    protected $table = 'inventario'; // revisa que coincida con tu migración (singular/plural)

    protected $fillable = [
        'nombre',
        'unidad',
        'cantidad_disponible',
        'cantidad_minima',
        'precio_unitario',
    ];

    public function consumos()
    {
        return $this->hasMany(ConsumoInsumo::class, 'inventario_id');
    }
}