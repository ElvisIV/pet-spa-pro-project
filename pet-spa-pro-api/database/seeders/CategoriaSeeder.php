<?php

namespace Database\Seeders;

use App\Models\Categoria;
use Illuminate\Database\Seeder;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = [
            ['nombre' => 'Alimentos', 'icono' => '🍖'],
            ['nombre' => 'Accesorios', 'icono' => '🎀'],
            ['nombre' => 'Higiene', 'icono' => '🧼'],
            ['nombre' => 'Juguetes', 'icono' => '🧸'],
            ['nombre' => 'Salud', 'icono' => '💊'],
        ];

        foreach ($categorias as $cat) {
            Categoria::create($cat);
        }

        echo "✅ Categorías creadas: " . Categoria::count() . "\n";
    }
}