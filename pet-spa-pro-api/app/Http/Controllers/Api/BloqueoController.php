<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bloqueo;
use Illuminate\Http\Request;

class BloqueoController extends Controller
{
    public function index(Request $request)
    {
        $bloqueos = Bloqueo::with('creadoPor')
                    ->when($request->fecha, fn($q) => $q->whereDate('fecha', $request->fecha))
                    ->orderBy('fecha', 'desc')
                    ->get();
        return response()->json($bloqueos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'fecha' => 'required|date',
            'hora_inicio' => 'nullable|date_format:H:i',
            'hora_fin' => 'nullable|date_format:H:i|after:hora_inicio',
            'motivo' => 'required|string|max:255',
            'aplica_todo_dia' => 'boolean',
        ]);

        $bloqueo = Bloqueo::create([
            'fecha' => $request->fecha,
            'hora_inicio' => $request->hora_inicio,
            'hora_fin' => $request->hora_fin,
            'motivo' => $request->motivo,
            'aplica_todo_dia' => $request->aplica_todo_dia ?? false,
            'creado_por' => auth()->id(),
        ]);

        return response()->json($bloqueo->load('creadoPor'), 201);
    }

    public function destroy(Bloqueo $bloqueo)
    {
        $bloqueo->delete();
        return response()->json(null, 204);
    }
}