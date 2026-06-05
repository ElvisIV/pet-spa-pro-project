<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pago;
use App\Models\Cita;
use Illuminate\Http\Request;

class PagoController extends Controller
{
    public function index(Request $request)
    {
        $pagos = Pago::with('cita.cliente', 'cita.mascota', 'registradoPor')
                    ->when($request->cita_id, fn($q) => $q->where('cita_id', $request->cita_id))
                    ->orderBy('created_at', 'desc')
                    ->get();
        return response()->json($pagos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'cita_id' => 'required|exists:citas,id',
            'monto' => 'required|numeric|min:0',
            'metodo' => 'required|in:efectivo,tarjeta,transferencia,qr',
            'referencia' => 'nullable|string',
        ]);

        $cita = Cita::findOrFail($request->cita_id);
        if ($cita->estado === 'cancelada') {
            return response()->json(['message' => 'No se puede pagar una cita cancelada'], 400);
        }

        $pago = Pago::create([
            'cita_id' => $request->cita_id,
            'monto' => $request->monto,
            'metodo' => $request->metodo,
            'referencia' => $request->referencia,
            'registrado_por' => auth()->id(),
        ]);

        // Si el total pagado cubre el total de servicios, completar la cita
        $totalServicios = $cita->servicios()->sum('cita_servicio.precio');
        $totalPagado = $cita->pagos()->sum('monto');
        if ($totalPagado >= $totalServicios && $cita->estado !== 'completada') {
            $cita->update(['estado' => 'completada']);
        }

        return response()->json($pago->load('cita', 'registradoPor'), 201);
    }

    public function show(Pago $pago)
    {
        return response()->json($pago->load('cita.cliente', 'cita.mascota', 'registradoPor'));
    }
}