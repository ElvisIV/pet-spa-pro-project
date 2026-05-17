<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('telefono', 20)->nullable()->after('estado');
            $table->string('ci', 20)->nullable()->after('telefono');
            $table->string('direccion', 255)->nullable()->after('ci');
            $table->string('especialidad', 100)->nullable()->after('direccion');
            $table->enum('turno', ['mañana', 'tarde', 'noche'])->nullable()->after('especialidad');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['telefono', 'ci', 'direccion', 'especialidad', 'turno']);
        });
    }
};