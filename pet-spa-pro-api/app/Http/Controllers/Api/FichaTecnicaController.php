<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FichaTecnica;
use Illuminate\Http\Request;

class FichaTecnicaController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'cita_id' => 'required|exists:citas,id',
            'condicion_piel' => 'nullable|string',
            'condicion_pelaje' => 'nullable|string',
            'estado_orejas' => 'nullable|string',
            'estado_ojos' => 'nullable|string',
            'estado_dientes' => 'nullable|string',
            'observaciones' => 'nullable|string',
        ]);

        $cita = \App\Models\Cita::findOrFail($request->cita_id);
        if ($cita->estado !== 'en_proceso') {
            return response()->json(['message' => 'Solo se puede registrar ficha técnica en citas en proceso'], 400);
        }

        $ficha = FichaTecnica::updateOrCreate(
            ['cita_id' => $request->cita_id],
            $request->except('cita_id')
        );

        return response()->json($ficha, 201);
    }

    public function show($citaId)
    {
        $ficha = FichaTecnica::where('cita_id', $citaId)->first();
        return response()->json($ficha);
    }
}