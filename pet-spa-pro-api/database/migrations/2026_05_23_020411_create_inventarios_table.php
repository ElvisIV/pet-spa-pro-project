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
       Schema::create('inventario', function (Blueprint $table) {
    $table->id();
    $table->string('nombre');
    $table->string('unidad'); // ml, gramos, unidades
    $table->decimal('cantidad_disponible', 10, 2)->default(0);
    $table->decimal('cantidad_minima', 10, 2)->default(0);
    $table->decimal('precio_unitario', 10, 2)->nullable();
    $table->timestamps();
    $table->softDeletes();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventarios');
    }
};
