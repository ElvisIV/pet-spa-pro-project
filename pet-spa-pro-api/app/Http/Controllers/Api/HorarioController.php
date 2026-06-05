<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Horario;
use Illuminate\Http\Request;

class HorarioController extends Controller
{
    public function index()
    {
        return response()->json(Horario::orderBy('dia')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'dia' => 'required|in:lunes,martes,miércoles,jueves,viernes,sábado,domingo',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
            'activo' => 'boolean',
        ]);

        $horario = Horario::create($request->all());
        return response()->json($horario, 201);
    }

    public function update(Request $request, Horario $horario)
    {
        $request->validate([
            'hora_inicio' => 'sometimes|date_format:H:i',
            'hora_fin' => 'sometimes|date_format:H:i|after:hora_inicio',
            'activo' => 'sometimes|boolean',
        ]);

        $horario->update($request->all());
        return response()->json($horario);
    }

    public function destroy(Horario $horario)
    {
        $horario->delete();
        return response()->json(null, 204);
    }
}