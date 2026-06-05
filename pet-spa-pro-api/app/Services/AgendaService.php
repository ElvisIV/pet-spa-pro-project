<?php

namespace App\Services;

use App\Models\Cita;
use App\Models\Horario;
use App\Models\Bloqueo;
use App\Models\DisponibilidadGroomer;
use Carbon\Carbon;

class AgendaService
{
    public function verificarDisponibilidad(
        string $fecha,
        string $horaInicio,
        int $duracion,
        ?int $staffId = null
    ): array {
        $inicio = Carbon::parse("$fecha $horaInicio");
        $fin = $inicio->copy()->addMinutes($duracion);
        $diaSemana = $this->getDiaSemana($inicio);

        // 1. Horario general del spa
        $horario = Horario::where('dia', $diaSemana)->where('activo', true)->first();
        if (!$horario) {
            return ['disponible' => false, 'mensaje' => 'El spa no abre este día.'];
        }

        $horaApertura = Carbon::parse("$fecha $horario->hora_inicio");
        $horaCierre   = Carbon::parse("$fecha $horario->hora_fin");

        if ($inicio->lt($horaApertura) || $fin->gt($horaCierre)) {
            return ['disponible' => false, 'mensaje' => 'La cita debe estar dentro del horario laboral.'];
        }

        // 2. Bloqueos
        $bloqueo = Bloqueo::where('fecha', $fecha)
            ->where(function ($q) use ($inicio, $fin) {
                $q->where('aplica_todo_dia', true)
                  ->orWhere(function ($sq) use ($inicio, $fin) {
                      $sq->whereTime('hora_inicio', '<=', $fin->toTimeString())
                         ->whereTime('hora_fin', '>=', $inicio->toTimeString());
                  });
            })
            ->first();

        if ($bloqueo) {
            return ['disponible' => false, 'mensaje' => "Hay un bloqueo: {$bloqueo->motivo}"];
        }

        // 3. Disponibilidad del groomer (si se asigna)
        if ($staffId) {
            $dispGroomer = DisponibilidadGroomer::where('user_id', $staffId)
                ->where('dia', $diaSemana)
                ->whereTime('hora_inicio', '<=', $inicio->toTimeString())
                ->whereTime('hora_fin', '>=', $fin->toTimeString())
                ->first();

            if (!$dispGroomer) {
                return ['disponible' => false, 'mensaje' => 'El groomer no está disponible en ese horario.'];
            }

            // 4. Solapamiento de citas del groomer
            $solapada = Cita::where('staff_id', $staffId)
                ->where('fecha', $fecha)
                ->whereNotIn('estado', ['cancelada'])
                ->where(function ($q) use ($inicio, $fin) {
                    $q->whereBetween('hora', [
                        $inicio->toTimeString(),
                        $fin->toTimeString()
                    ])
                    ->orWhereRaw("? BETWEEN hora AND ADDTIME(hora, SEC_TO_TIME(duracion * 60))", [
                        $inicio->toTimeString()
                    ]);
                })
                ->first();

            if ($solapada) {
                return ['disponible' => false, 'mensaje' => 'El groomer ya tiene una cita en ese intervalo.'];
            }
        }

        // 5. Capacidad diaria (opcional)
        $capacidadMaxima = config('agenda.capacidad_diaria', 20);
        $citasDelDia = Cita::whereDate('fecha', $fecha)
            ->whereNotIn('estado', ['cancelada'])
            ->count();

        if ($citasDelDia >= $capacidadMaxima) {
            return ['disponible' => false, 'mensaje' => 'Se ha alcanzado la capacidad máxima de citas para este día.'];
        }

        return ['disponible' => true, 'mensaje' => 'Disponible'];
    }

    private function getDiaSemana(Carbon $fecha): string
    {
        $dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        return $dias[$fecha->dayOfWeek];
    }
}