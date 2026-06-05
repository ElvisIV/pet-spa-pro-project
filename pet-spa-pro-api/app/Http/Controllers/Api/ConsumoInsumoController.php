<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConsumoInsumo;
use App\Models\Cita;
use App\Models\Inventario;
use Illuminate\Http\Request;

class ConsumoInsumoController extends Controller
{
    public function index(Request $request)
    {
        $consumos = ConsumoInsumo::with('cita', 'inventario', 'registradoPor')
                    ->when($request->cita_id, fn($q) => $q->where('cita_id', $request->cita_id))
                    ->orderBy('created_at', 'desc')
                    ->get();
        return response()->json($consumos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'cita_id' => 'required|exists:citas,id',
            'inventario_id' => 'required|exists:inventario,id',
            'cantidad' => 'required|numeric|min:0.01',
        ]);

        $cita = Cita::findOrFail($request->cita_id);
        if (in_array($cita->estado, ['cancelada', 'completada'])) {
            return response()->json(['message' => 'No se puede registrar consumo en una cita cancelada o completada'], 400);
        }

        $inventario = Inventario::findOrFail($request->inventario_id);
        if ($inventario->cantidad_disponible < $request->cantidad) {
            return response()->json(['message' => 'No hay suficiente stock'], 400);
        }

        $inventario->decrement('cantidad_disponible', $request->cantidad);

        $consumo = ConsumoInsumo::create([
            'cita_id' => $request->cita_id,
            'inventario_id' => $request->inventario_id,
            'cantidad' => $request->cantidad,
            'registrado_por' => auth()->id(),
        ]);

        return response()->json($consumo->load('inventario', 'registradoPor'), 201);
    }
}