<?php
namespace Database\Seeders;

use App\Models\Servicio;
use Illuminate\Database\Seeder;

class ServicesTableSeeder extends Seeder
{
    public function run()
    {
        $servicios = [
            ['nombre' => 'Baño básico', 'precio' => 25.00, 'duracion' => 30, 'categoria' => 'baño'],
            ['nombre' => 'Baño medicado', 'precio' => 35.00, 'duracion' => 45, 'categoria' => 'baño'],
            ['nombre' => 'Corte de pelo', 'precio' => 30.00, 'duracion' => 60, 'categoria' => 'corte'],
            ['nombre' => 'Corte de uñas', 'precio' => 10.00, 'duracion' => 15, 'categoria' => 'extra'],
            ['nombre' => 'Spa premium', 'precio' => 50.00, 'duracion' => 90, 'categoria' => 'spa'],
        ];

        foreach ($servicios as $s) {
            Servicio::create($s);
        }
    }
}