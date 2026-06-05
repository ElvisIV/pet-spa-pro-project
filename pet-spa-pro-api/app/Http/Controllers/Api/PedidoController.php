<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pedido;
use App\Models\Producto;
use Illuminate\Http\Request;

class PedidoController extends Controller
{
    /**
     * Listar pedidos (cliente ve los suyos, admin/recepción todos).
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Pedido::with(['cliente', 'productos']);

        if ($user->rol === 'cliente') {
            $query->where('user_id', $user->id);
        } elseif (in_array($user->rol, ['admin', 'recepcion'])) {
            if ($request->filled('estado')) {
                $query->where('estado', $request->estado);
            }
            if ($request->filled('user_id')) {
                $query->where('user_id', $request->user_id);
            }
        }

        $pedidos = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($pedidos);
    }

    /**
     * Crear un pedido (cliente/admin).
     */
    public function store(Request $request)
    {
        $request->validate([
            'productos'            => 'required|array|min:1',
            'productos.*.id'       => 'required|exists:productos,id',
            'productos.*.cantidad' => 'required|integer|min:1',
            'notas'                => 'nullable|string',
        ]);

        $total = 0;
        $items = [];

        foreach ($request->productos as $item) {
            $producto = Producto::findOrFail($item['id']);

            if (!$producto->activo) {
                return response()->json(['message' => "El producto {$producto->nombre} no está disponible."], 400);
            }

            if ($producto->stock < $item['cantidad']) {
                return response()->json([
                    'message' => "Stock insuficiente para {$producto->nombre}. Disponible: {$producto->stock}",
                ], 400);
            }

            $precio = $producto->precio_promocional ?? $producto->precio;
            $subtotal = $precio * $item['cantidad'];
            $total += $subtotal;

            $items[] = [
                'producto' => $producto,
                'cantidad' => $item['cantidad'],
                'precio'   => $precio,
            ];
        }

        $pedido = Pedido::create([
            'user_id' => auth()->id(),
            'total'   => $total,
            'estado'  => 'pendiente',
            'notas'   => $request->notas,
        ]);

        foreach ($items as $it) {
            $pedido->productos()->attach($it['producto']->id, [
                'cantidad'        => $it['cantidad'],
                'precio_unitario' => $it['precio'],
            ]);

            // Descontar stock
            $it['producto']->decrement('stock', $it['cantidad']);
        }

        return response()->json($pedido->load('productos', 'cliente'), 201);
    }

    /**
     * Ver un pedido.
     */
    public function show(Pedido $pedido)
    {
        $user = auth()->user();

        if ($user->rol === 'cliente' && $pedido->user_id !== $user->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return response()->json($pedido->load('productos', 'cliente'));
    }

    /**
     * Actualizar estado del pedido (admin/recepción).
     */
    public function updateEstado(Request $request, Pedido $pedido)
    {
        $request->validate([
            'estado' => 'required|in:pendiente,pagado,entregado,cancelado',
        ]);

        // Si cancela un pedido que no estaba cancelado, reponer stock
        if ($request->estado === 'cancelado' && $pedido->estado !== 'cancelado') {
            foreach ($pedido->productos as $producto) {
                $producto->increment('stock', $producto->pivot->cantidad);
            }
        }

        $pedido->update(['estado' => $request->estado]);

        return response()->json($pedido);
    }
}