<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inventario;
use Illuminate\Http\Request;

class InventarioController extends Controller
{
    public function index()
    {
        return response()->json(Inventario::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'unidad' => 'required|string|max:50',
            'cantidad_disponible' => 'required|numeric|min:0',
            'cantidad_minima' => 'required|numeric|min:0',
            'precio_unitario' => 'nullable|numeric|min:0',
        ]);

        $inventario = Inventario::create($request->all());
        return response()->json($inventario, 201);
    }

    public function update(Request $request, Inventario $inventario)
    {
        $request->validate([
            'nombre' => 'sometimes|string|max:100',
            'unidad' => 'sometimes|string|max:50',
            'cantidad_disponible' => 'sometimes|numeric|min:0',
            'cantidad_minima' => 'sometimes|numeric|min:0',
            'precio_unitario' => 'nullable|numeric|min:0',
        ]);

        $inventario->update($request->all());
        return response()->json($inventario);
    }

    public function destroy(Inventario $inventario)
    {
        $inventario->delete();
        return response()->json(null, 204);
    }
}