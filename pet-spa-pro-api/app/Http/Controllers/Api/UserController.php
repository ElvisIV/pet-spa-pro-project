<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('created_at', 'desc')->get();
        return response()->json($users);
    }

    public function toggleEstado($id)
    {
        $user = User::findOrFail($id);
        
        // No permitir desactivarse a sí mismo
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'No puedes cambiar tu propio estado'
            ], 403);
        }
        
        $nuevoEstado = $user->estado === 'activo' ? 'inactivo' : 'activo';
        $user->update(['estado' => $nuevoEstado]);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'user_status_changed',
            'details' => json_encode([
                'target_user_id' => $user->id,
                'new_status' => $nuevoEstado
            ]),
            'ip_address' => request()->ip()
        ]);

        return response()->json([
            'message' => "Usuario " . ($nuevoEstado === 'activo' ? 'activado' : 'desactivado'),
            'estado' => $nuevoEstado
        ]);
    }
}