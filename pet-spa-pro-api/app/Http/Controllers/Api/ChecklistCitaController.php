<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChecklistCita;
use Illuminate\Http\Request;

class ChecklistCitaController extends Controller
{
    public function index($citaId)
    {
        return response()->json(ChecklistCita::where('cita_id', $citaId)->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'cita_id' => 'required|exists:citas,id',
            'tarea' => 'required|string',
        ]);

        $cita = \App\Models\Cita::findOrFail($request->cita_id);
        if ($cita->estado !== 'en_proceso') {
            return response()->json(['message' => 'Solo se pueden agregar tareas en citas en proceso'], 400);
        }

        $tarea = ChecklistCita::create($request->all());
        return response()->json($tarea, 201);
    }

    public function toggle($id)
    {
        $tarea = ChecklistCita::findOrFail($id);
        $tarea->update([
            'completada' => !$tarea->completada,
            'completada_en' => $tarea->completada ? null : now(),
        ]);
        return response()->json($tarea);
    }

    public function destroy($id)
    {
        ChecklistCita::destroy($id);
        return response()->json(null, 204);
    }
}