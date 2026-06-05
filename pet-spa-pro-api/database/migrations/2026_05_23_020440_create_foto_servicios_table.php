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
       Schema::create('fotos_servicio', function (Blueprint $table) {
    $table->id();
    $table->foreignId('cita_id')->constrained('citas')->onDelete('cascade');
    $table->string('url');
    $table->string('tipo')->comment('antes, despues');
    $table->foreignId('subido_por')->constrained('users');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('foto_servicios');
    }
};
