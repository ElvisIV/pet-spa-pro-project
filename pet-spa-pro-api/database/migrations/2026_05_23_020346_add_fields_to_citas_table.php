<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('citas', function (Blueprint $table) {
    $table->foreignId('mascota_id')->after('user_id')->nullable()->constrained('mascotas')->onDelete('set null');
    $table->tinyInteger('duracion')->unsigned()->default(60)->after('servicio'); // en minutos
    $table->enum('estado', ['pendiente', 'confirmada', 'en_proceso', 'completada', 'cancelada'])->default('pendiente')->change();
    $table->text('notas_internas')->nullable()->after('notas');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('citas', function (Blueprint $table) {
            //
        });
    }
};
