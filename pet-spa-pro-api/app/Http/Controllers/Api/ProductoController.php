<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductoController extends Controller
{
    /**
     * Listar productos (filtros: categoría, búsqueda, solo activos).
     */
    public function index(Request $request)
    {
        $query = Producto::with('categoria')->where('activo', true);

        if ($request->filled('categoria_id')) {
            $query->where('categoria_id', $request->categoria_id);
        }

        if ($request->filled('search')) {
            $query->where('nombre', 'like', "%{$request->search}%");
        }

        // Si es admin/recepción, pueden ver también los inactivos
        if (in_array(auth()->user()->rol ?? '', ['admin', 'recepcion'])) {
            $query = Producto::with('categoria');
            if ($request->filled('categoria_id')) {
                $query->where('categoria_id', $request->categoria_id);
            }
            if ($request->filled('search')) {
                $query->where('nombre', 'like', "%{$request->search}%");
            }
        }

        $productos = $query->orderBy('nombre')->paginate(20);

        return response()->json($productos);
    }

    /**
     * Crear un producto (admin/recepción).
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre'             => 'required|string|max:100',
            'descripcion'        => 'nullable|string',
            'categoria_id'       => 'required|exists:categorias,id',
            'precio'             => 'required|numeric|min:0',
            'precio_promocional' => 'nullable|numeric|min:0',
            'stock'              => 'required|integer|min:0',
            'stock_minimo'       => 'nullable|integer|min:0',
            'variante'           => 'nullable|string|max:50',
            'imagen'             => 'nullable|image|max:2048',
            'activo'             => 'boolean',
        ]);

        $data = $request->except('imagen');

        if ($request->hasFile('imagen')) {
            $data['imagen'] = $request->file('imagen')->store('productos', 'public');
        }

        $producto = Producto::create($data);

        return response()->json($producto->load('categoria'), 201);
    }

    /**
     * Ver un producto.
     */
    public function show(Producto $producto)
    {
        return response()->json($producto->load('categoria'));
    }

    /**
     * Actualizar un producto (admin/recepción).
     */
    public function update(Request $request, Producto $producto)
    {
        $request->validate([
            'nombre'             => 'sometimes|string|max:100',
            'descripcion'        => 'nullable|string',
            'categoria_id'       => 'sometimes|exists:categorias,id',
            'precio'             => 'sometimes|numeric|min:0',
            'precio_promocional' => 'nullable|numeric|min:0',
            'stock'              => 'sometimes|integer|min:0',
            'stock_minimo'       => 'nullable|integer|min:0',
            'variante'           => 'nullable|string|max:50',
            'imagen'             => 'nullable|image|max:2048',
            'activo'             => 'boolean',
        ]);

        $data = $request->except('imagen');

        if ($request->hasFile('imagen')) {
            // Eliminar imagen anterior si existe
            if ($producto->imagen) {
                Storage::disk('public')->delete($producto->imagen);
            }
            $data['imagen'] = $request->file('imagen')->store('productos', 'public');
        }

        $producto->update($data);

        return response()->json($producto->fresh('categoria'));
    }

    /**
     * Eliminar un producto (admin).
     */
    public function destroy(Producto $producto)
    {
        if ($producto->imagen) {
            Storage::disk('public')->delete($producto->imagen);
        }
        $producto->delete();

        return response()->json(null, 204);
    }
}