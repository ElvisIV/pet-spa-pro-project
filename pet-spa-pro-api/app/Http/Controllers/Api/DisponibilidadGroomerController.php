<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DisponibilidadGroomer;
use Illuminate\Http\Request;

class DisponibilidadGroomerController extends Controller
{
    public function index(Request $request)
    {
        $query = DisponibilidadGroomer::with('groomer');
        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'dia' => 'required|in:lunes,martes,miércoles,jueves,viernes,sábado,domingo',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
        ]);

        $disponibilidad = DisponibilidadGroomer::create($request->all());
        return response()->json($disponibilidad->load('groomer'), 201);
    }

    public function update(Request $request, DisponibilidadGroomer $disponibilidadGroomer)
    {
        $request->validate([
            'hora_inicio' => 'sometimes|date_format:H:i',
            'hora_fin' => 'sometimes|date_format:H:i|after:hora_inicio',
        ]);

        $disponibilidadGroomer->update($request->all());
        return response()->json($disponibilidadGroomer);
    }

    public function destroy(DisponibilidadGroomer $disponibilidadGroomer)
    {
        $disponibilidadGroomer->delete();
        return response()->json(null, 204);
    }
}