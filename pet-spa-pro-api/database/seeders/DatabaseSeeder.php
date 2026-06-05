<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
   public function run()
{
    $this->call([
        AdminUserSeeder::class,
        ServicesTableSeeder::class,
        HorariosTableSeeder::class,

          CategoriaSeeder::class,   // 👈 nuevo
        ProductoSeeder::class,
    ]);
}
}