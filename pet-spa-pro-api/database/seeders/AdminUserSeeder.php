<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@petspapro.com',
            'password' => Hash::make('Admin123!@#'),
            'rol' => 'admin',
            'estado' => 'activo',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'María Recepción',
            'email' => 'recepcion@petspapro.com',
            'password' => Hash::make('Recep123!@#'),
            'rol' => 'recepcion',
            'estado' => 'activo',
            'email_verified_at' => now(),
        ]);

        echo "✅ Usuarios creados:\n";
        echo "   Admin: admin@petspapro.com / Admin123!@#\n";
        echo "   Recepción: recepcion@petspapro.com / Recep123!@#\n";
    }
}