<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuditLogController;   // 👈 Agregar esta línea
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/resend-verification', [AuthController::class, 'resendVerification']);
Route::post('/verify-code', [AuthController::class, 'verifyCode']);
// Verificación de email (ruta pública con firma)

Route::post('/verify-code', [AuthController::class, 'verifyCode']);
// Rutas protegidas (requieren token)
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth general
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    
    // Solo Admin
    Route::middleware('role:admin')->group(function () {
        // Usuarios
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users/staff', [AuthController::class, 'registrarPersonal']);
        Route::put('/users/{user}/estado', [UserController::class, 'toggleEstado']);
        
        // Auditoría
        Route::get('/audit-logs', [AuditLogController::class, 'index']);
        Route::get('/audit-logs/recent', [AuditLogController::class, 'recentLines']);
    });
});