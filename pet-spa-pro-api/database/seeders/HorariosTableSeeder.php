<?php
namespace Database\Seeders;

use App\Models\Horario;
use Illuminate\Database\Seeder;

class HorariosTableSeeder extends Seeder
{
    public function run()
    {
        $dias = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
        foreach ($dias as $dia) {
            Horario::create([
                'dia' => $dia,
                'hora_inicio' => '09:00',
                'hora_fin' => '18:00',
                'activo' => true,
            ]);
        }
    }
}