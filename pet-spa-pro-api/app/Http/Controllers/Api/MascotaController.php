<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mascota;
use Illuminate\Http\Request;

class MascotaController extends Controller
{
    // Listar mascotas del cliente autenticado o todas si es admin/recepción
    public function index(Request $request)
    {
        if (in_array($request->user()->rol, ['admin', 'recepcion'])) {
            $mascotas = Mascota::with('dueno')->get();
        } else {
            $mascotas = $request->user()->mascotas;
        }
        return response()->json($mascotas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'especie' => 'required|in:perro,gato,otro',
            'raza' => 'nullable|string|max:100',
            'edad' => 'nullable|integer|min:0',
            'peso' => 'nullable|numeric',
            'observaciones' => 'nullable|string',
        ]);

        $mascota = $request->user()->mascotas()->create($request->all());

        return response()->json($mascota, 201);
    }

    public function show(Mascota $mascota)
    {
        // Verificar propiedad o rol
        if ($mascota->user_id !== auth()->id() && !in_array(auth()->user()->rol, ['admin', 'recepcion'])) {
            return response()->json(['message' => 'No autorizado'], 403);
        }
        return response()->json($mascota->load('dueno'));
    }

    public function update(Request $request, Mascota $mascota)
    {
        if ($mascota->user_id !== auth()->id() && !in_array(auth()->user()->rol, ['admin', 'recepcion'])) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $mascota->update($request->only('nombre', 'especie', 'raza', 'edad', 'peso', 'observaciones'));

        return response()->json($mascota);
    }

    public function destroy(Mascota $mascota)
    {
        if ($mascota->user_id !== auth()->id() && !in_array(auth()->user()->rol, ['admin'])) {
            return response()->json(['message' => 'No autorizado'], 403);
        }
        $mascota->delete();
        return response()->json(null, 204);
    }
}