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
        Schema::create('consumo_insumos', function (Blueprint $table) {
    $table->id();
    $table->foreignId('cita_id')->constrained('citas')->onDelete('cascade');
    $table->foreignId('inventario_id')->constrained('inventario')->onDelete('cascade');
    $table->decimal('cantidad', 10, 2);
    $table->foreignId('registrado_por')->constrained('users');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consumo_insumos');
    }
};
