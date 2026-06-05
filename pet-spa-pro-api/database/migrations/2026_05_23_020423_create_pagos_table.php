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
        Schema::create('pagos', function (Blueprint $table) {
    $table->id();
    $table->foreignId('cita_id')->constrained('citas')->onDelete('cascade');
    $table->decimal('monto', 10, 2);
    $table->enum('metodo', ['efectivo', 'tarjeta', 'transferencia']);
    $table->string('referencia')->nullable();
    $table->foreignId('registrado_por')->constrained('users');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
