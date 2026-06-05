<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categoria;

class CategoriaController extends Controller
{
    public function index()
    {
        return response()->json(Categoria::where('activo', true)->orderBy('nombre')->get());
    }

    public function store(Request $request)
    {
        $request->validate(['nombre' => 'required|string|max:50']);
        $categoria = Categoria::create($request->only('nombre', 'icono'));
        return response()->json($categoria, 201);
    }
}