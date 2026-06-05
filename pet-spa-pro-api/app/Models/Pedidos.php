<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total',
        'estado',
        'notas',
    ];

    protected $casts = [
        'total' => 'decimal:2',
    ];

    // Estados permitidos
    const ESTADOS = ['pendiente', 'pagado', 'entregado', 'cancelado'];

    public function cliente()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function productos()
    {
        return $this->belongsToMany(Producto::class, 'pedido_producto')
                    ->withPivot('cantidad', 'precio_unitario')
                    ->withTimestamps();
    }

    // Scope para filtro por estado
    public function scopeConEstado($query, $estado)
    {
        if (in_array($estado, self::ESTADOS)) {
            return $query->where('estado', $estado);
        }
        return $query;
    }
}