<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Mail;
use App\Mail\StaffCreatedMail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;

class AuthController extends Controller
{
    public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    // 1. Verificar bloqueo de cuenta
    if ($user && $user->isLocked()) {
        $remaining = $user->locked_until->diffForHumans(null, true);
        return response()->json([
            'message' => "Cuenta bloqueada por demasiados intentos. Podrás intentarlo de nuevo en {$remaining}.",
            'locked_until' => $user->locked_until->toDateTimeString(),
        ], 423);
    }

    // 2. Credenciales incorrectas
    if (!$user || !Hash::check($request->password, $user->password)) {
        if ($user) {
            $user->incrementLoginAttempts();
            AuditLog::create([
                'user_id'   => $user->id,
                'action'    => 'login_failed',
                'details'   => json_encode(['email' => $request->email, 'attempts' => $user->login_attempts]),
                'ip_address'=> $request->ip()
            ]);
        }
        return response()->json(['message' => 'Credenciales incorrectas'], 401);
    }

    // 3. Usuario inactivo
    if ($user->estado === 'inactivo') {
        return response()->json(['message' => 'Cuenta desactivada.'], 403);
    }

    // 4. Email no verificado
  // Verificar si el email está verificado
    if (!$user->email_verified_at) {
        return response()->json([
            'message' => 'Debes verificar tu correo electrónico.',
            'must_verify_code' => true,   // 👈 esto activa la pantalla de código
            'email' => $user->email,
        ], 403);
    }

    // 5. Login exitoso
    $user->resetLoginAttempts();
    $token = $user->createToken('auth-token')->plainTextToken;

    AuditLog::create([
        'user_id'   => $user->id,
        'action'    => 'login_success',
        'ip_address'=> $request->ip()
    ]);

    return response()->json([
        'user'  => $user,
        'token' => $token,
        'must_change_password' => $user->must_change_password,
    ]);
}
    public function register(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()->symbols()],
        'telefono' => 'required|string|max:20',
        'ci' => 'required|string|max:20|unique:users',
        'direccion' => 'required|string|max:255',
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'rol' => 'cliente',
        'estado' => 'activo',
        'telefono' => $request->telefono,
        'ci' => $request->ci,
        'direccion' => $request->direccion,
    ]);

    $user->generateVerificationCode();

    // Enviar correo con el código
    Mail::to($user->email)->send(new \App\Mail\VerificationCodeMail($user->verification_code));

    AuditLog::create([
        'user_id' => $user->id,
        'action' => 'user_registered',
        'ip_address' => $request->ip(),
    ]);

    return response()->json([
        'message' => 'Registro exitoso. Revisa tu correo para obtener el código de verificación.',
        'email' => $user->email,
    ], 201);
}
    public function registrarPersonal(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'rol' => 'required|in:groomer,recepcion',
        'telefono' => 'required|string|max:20',
        'especialidad' => 'required_if:rol,groomer|string|max:100',
        'turno' => 'required|in:mañana,tarde,noche',
    ]);

    $temporaryPassword = Str::random(10) . '!1A';

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($temporaryPassword),
        'rol' => $request->rol,
        'estado' => 'activo',
        'must_change_password' => true,
        'telefono' => $request->telefono,
        'especialidad' => $request->rol === 'groomer' ? $request->especialidad : null,
        'turno' => $request->turno,
    ]);

    $user->generateVerificationCode();

    // Enviar correo con contraseña temporal y código de verificación
    Mail::to($user->email)->send(new \App\Mail\StaffCreatedMail($user, $temporaryPassword, $user->verification_code));

    AuditLog::create([
        'user_id' => auth()->id(),
        'action' => 'staff_created',
        'details' => json_encode(['created_user_id' => $user->id, 'rol' => $user->rol]),
        'ip_address' => $request->ip(),
    ]);

    return response()->json([
        'message' => 'Personal registrado exitosamente.',
        'user' => $user,
    ], 201);
}
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'logout',
            'ip_address' => $request->ip()
        ]);

        return response()->json(['message' => 'Sesión cerrada exitosamente']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // 👈 NUEVO: Cambiar contraseña
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => [
                'required',
                'confirmed',
                Password::min(8)->mixedCase()->numbers()->symbols()
            ],
        ]);

        $user = $request->user();

        // Verificar contraseña actual
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'La contraseña actual es incorrecta.'
            ], 400);
        }

        // Verificar que la nueva sea diferente
        if (Hash::check($request->new_password, $user->password)) {
            return response()->json([
                'message' => 'La nueva contraseña debe ser diferente a la actual.'
            ], 400);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
            'must_change_password' => false,  // Ya cambió su contraseña
        ]);

        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'password_changed',
            'ip_address' => $request->ip()
        ]);

        return response()->json([
            'message' => 'Contraseña actualizada exitosamente.'
        ]);
    }

    // 👈 NUEVO: Reenviar verificación
    public function resendVerification(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'No se encontró un usuario con ese email.'
            ], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Este email ya está verificado.'
            ], 400);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Email de verificación reenviado.'
        ]);
    }public function verifyCode(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'code'  => 'required|string|size:6',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json(['message' => 'Usuario no encontrado.'], 404);
    }

    if ($user->verifyCode($request->code)) {
        $user->markEmailAsVerifiedWithCode();

        // Opcional: iniciar sesión automáticamente después de verificar
        $token = $user->createToken('auth-token')->plainTextToken;

        AuditLog::create([
            'user_id'      => $user->id,
            'action'       => 'email_verified',
            'ip_address'   => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Código verificado exitosamente.',
            'user'    => $user,
            'token'   => $token,
            'must_change_password' => $user->must_change_password,
        ]);
    }

    return response()->json(['message' => 'Código inválido o expirado.'], 400);
}
}