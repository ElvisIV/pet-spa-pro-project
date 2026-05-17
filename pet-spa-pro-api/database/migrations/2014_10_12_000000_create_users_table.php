<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // database/migrations/XXXX_create_users_table.php
public function up(): void
{
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('email')->unique();
        $table->timestamp('email_verified_at')->nullable();
        $table->string('password');
        $table->enum('rol', ['admin', 'groomer', 'recepcion', 'cliente'])->default('cliente');
        $table->enum('estado', ['activo', 'inactivo'])->default('activo');
        $table->boolean('must_change_password')->default(false); // 👈 NUEVO
        $table->rememberToken();
        $table->timestamps();
        $table->softDeletes();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};