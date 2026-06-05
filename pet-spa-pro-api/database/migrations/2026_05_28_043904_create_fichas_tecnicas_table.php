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
       Schema::create('fichas_tecnicas', function (Blueprint $table) {
    $table->id();
    $table->foreignId('cita_id')->constrained('citas')->onDelete('cascade');
    $table->string('condicion_piel')->nullable();
    $table->string('condicion_pelaje')->nullable();
    $table->string('estado_orejas')->nullable();
    $table->string('estado_ojos')->nullable();
    $table->string('estado_dientes')->nullable();
    $table->text('observaciones')->nullable();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fichas_tecnicas');
    }
};
