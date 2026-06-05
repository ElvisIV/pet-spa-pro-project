<?php

namespace Database\Seeders;

use App\Models\Producto;
use Illuminate\Database\Seeder;

class ProductoSeeder extends Seeder
{
    public function run(): void
    {
        $productos = [
            // Alimentos (categoria_id = 1)
            ['nombre' => 'Croquetas Premium', 'categoria_id' => 1, 'precio' => 25.00, 'stock' => 50, 'variante' => 'Saco 5kg'],
            ['nombre' => 'Comida húmeda para perro', 'categoria_id' => 1, 'precio' => 3.50, 'stock' => 100, 'variante' => 'Lata 400g'],
            // Accesorios (categoria_id = 2)
            ['nombre' => 'Collar ajustable', 'categoria_id' => 2, 'precio' => 12.00, 'stock' => 30, 'variante' => 'Rojo'],
            ['nombre' => 'Correa extensible', 'categoria_id' => 2, 'precio' => 18.00, 'stock' => 20, 'variante' => '5m'],
            // Higiene (categoria_id = 3)
            ['nombre' => 'Shampoo para perros', 'categoria_id' => 3, 'precio' => 8.00, 'stock' => 40, 'variante' => '500ml'],
            // Juguetes (categoria_id = 4)
            ['nombre' => 'Pelota chirriante', 'categoria_id' => 4, 'precio' => 5.00, 'stock' => 60, 'variante' => null],
            // Salud (categoria_id = 5)
            ['nombre' => 'Antiparasitario', 'categoria_id' => 5, 'precio' => 15.00, 'stock' => 25, 'variante' => 'Tableta'],
        ];

        foreach ($productos as $p) {
            Producto::create($p);
        }

        echo "✅ Productos creados: " . Producto::count() . "\n";
    }
}