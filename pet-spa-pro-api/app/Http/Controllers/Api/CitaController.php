<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\Servicio;
use App\Models\AuditLog;
use App\Services\AgendaService;
use Illuminate\Http\Request;

class CitaController extends Controller
{
    protected $agendaService;

    public function __construct(AgendaService $agendaService)
    {
        $this->agendaService = $agendaService;
    }

    /**
     * Listar citas según el rol del usuario.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Cita::with(['cliente', 'mascota', 'groomer', 'servicios', 'pagos']);

        if ($user->rol === 'cliente') {
            $query->where('user_id', $user->id);
        } elseif (in_array($user->rol, ['groomer', 'recepcion'])) {
            // Por defecto muestran citas de la fecha actual o todas
            if ($request->has('fecha')) {
                $query->whereDate('fecha', $request->fecha);
            }
        } elseif ($user->rol === 'admin') {
            // Admin puede filtrar por fecha, estado, etc.
            if ($request->has('fecha')) {
                $query->whereDate('fecha', $request->fecha);
            }
            if ($request->has('estado')) {
                $query->where('estado', $request->estado);
            }
        }

        $citas = $query->orderBy('fecha', 'desc')
                       ->orderBy('hora', 'asc')
                       ->paginate(20);

        return response()->json($citas);
    }

    /**
     * Crear una nueva cita.
     */
    public function store(Request $request)
    {
        $request->validate([
            'mascota_id' => 'required|exists:mascotas,id',
            'staff_id' => 'nullable|exists:users,id',
            'fecha' => 'required|date|after_or_equal:today',
            'hora' => 'required|date_format:H:i',
            'servicios' => 'required|array|min:1',
            'servicios.*.id' => 'required|exists:servicios,id',
            'notas' => 'nullable|string',
        ]);

        // Calcular duración total y precio total
        $serviciosData = [];
        $duracionTotal = 0;
        $precioTotal = 0;

        foreach ($request->servicios as $s) {
            $servicio = Servicio::findOrFail($s['id']);
            $duracionTotal += $servicio->duracion;
            $precioTotal += $servicio->precio;
            $serviciosData[] = ['servicio_id' => $servicio->id, 'precio' => $servicio->precio];
        }

        // Verificar disponibilidad
        $disponibilidad = $this->agendaService->verificarDisponibilidad(
            $request->fecha,
            $request->hora,
            $duracionTotal,
            $request->staff_id
        );

        if (!$disponibilidad['disponible']) {
            return response()->json(['message' => $disponibilidad['mensaje']], 409);
        }

        // Crear la cita
        $cita = Cita::create([
            'user_id' => auth()->id(),
            'mascota_id' => $request->mascota_id,
            'staff_id' => $request->staff_id,
            'fecha' => $request->fecha,
            'hora' => $request->hora,
            'servicio' => 'Múltiples servicios', // campo legado
            'duracion' => $duracionTotal,
            'estado' => 'pendiente',
            'notas' => $request->notas,
        ]);

        // Adjuntar servicios con precios
        foreach ($serviciosData as $sd) {
            $cita->servicios()->attach($sd['servicio_id'], ['precio' => $sd['precio']]);
        }

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'cita_creada',
            'details' => json_encode(['cita_id' => $cita->id, 'mascota_id' => $cita->mascota_id]),
            'ip_address' => $request->ip(),
        ]);

        return response()->json($cita->load('servicios', 'mascota', 'cliente'), 201);
    }

    /**
     * Ver una cita específica.
     */
    public function show(Cita $cita)
    {
        $user = auth()->user();
        if ($user->rol === 'cliente' && $cita->user_id !== $user->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return response()->json($cita->load(['cliente', 'mascota', 'groomer', 'servicios', 'pagos', 'fotos']));
    }

    /**
     * Actualizar estado de una cita (o asignar groomer).
     */
    public function update(Request $request, Cita $cita)
    {
        $user = auth()->user();

        // Solo admin/recepcion pueden actualizar citas, o groomer las suyas
        if ($user->rol === 'cliente') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'estado' => 'sometimes|in:pendiente,confirmada,en_proceso,completada,cancelada',
            'staff_id' => 'nullable|exists:users,id',
            'notas' => 'nullable|string',
        ]);

        if ($request->has('estado')) {
            // Validar transiciones de estado
            $transicionesValidas = [
                'pendiente' => ['confirmada', 'cancelada'],
                'confirmada' => ['en_proceso', 'cancelada'],
                'en_proceso' => ['completada', 'cancelada'],
            ];

            $actual = $cita->estado;
            $nuevo = $request->estado;

            if ($actual === 'completada' || $actual === 'cancelada') {
                return response()->json(['message' => 'No se puede cambiar una cita finalizada'], 400);
            }

            if (!isset($transicionesValidas[$actual]) || !in_array($nuevo, $transicionesValidas[$actual])) {
                return response()->json(['message' => "No se puede cambiar de '$actual' a '$nuevo'"], 400);
            }

            $cita->estado = $nuevo;
        }

                if ($request->has('staff_id')) {
            $cita->staff_id = $request->staff_id;
            // Si la cita está pendiente y se le asigna un groomer, pasa automáticamente a confirmada
            if ($cita->estado === 'pendiente') {
                $cita->estado = 'confirmada';
            }
        }

        if ($request->has('notas')) {
            $cita->notas = $request->notas;
        }

        $cita->save();

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'cita_actualizada',
            'details' => json_encode(['cita_id' => $cita->id, 'cambios' => $request->only(['estado', 'staff_id'])]),
            'ip_address' => $request->ip(),
        ]);

        return response()->json($cita->load('groomer'));
    }
}