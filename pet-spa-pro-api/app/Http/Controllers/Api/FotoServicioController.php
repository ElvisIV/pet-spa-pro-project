<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FotoServicio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FotoServicioController extends Controller
{
    public function index(Request $request)
    {
        $fotos = FotoServicio::with('subidoPor')
                    ->when($request->cita_id, fn($q) => $q->where('cita_id', $request->cita_id))
                    ->orderBy('created_at', 'desc')
                    ->get();
        return response()->json($fotos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'cita_id' => 'required|exists:citas,id',
            'imagen' => 'required|image|max:2048',
            'tipo' => 'required|in:antes,despues',
        ]);

        $path = $request->file('imagen')->store('fotos_servicio', 'public');

        $foto = FotoServicio::create([
            'cita_id' => $request->cita_id,
            'url' => Storage::url($path),
            'tipo' => $request->tipo,
            'subido_por' => auth()->id(),
        ]);

        return response()->json($foto->load('subidoPor'), 201);
    }
}