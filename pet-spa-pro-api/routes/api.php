<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CitaController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\MascotaController;
use App\Http\Controllers\Api\ServicioController;
use App\Http\Controllers\Api\PagoController;
use App\Http\Controllers\Api\InventarioController;
use App\Http\Controllers\Api\ConsumoInsumoController;
use App\Http\Controllers\Api\HorarioController;
use App\Http\Controllers\Api\BloqueoController;
use App\Http\Controllers\Api\DisponibilidadGroomerController;
use App\Http\Controllers\Api\FotoServicioController;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\PedidoController;
use App\Http\Controllers\Api\FichaTecnicaController;      // 👈 nueva
use App\Http\Controllers\Api\ChecklistCitaController;    // 👈 nueva
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoriaController;

/*
|--------------------------------------------------------------------------
| API Routes - Pet Spa Pro
|--------------------------------------------------------------------------
*/

// ================================
// 🔓 RUTAS PÚBLICAS (sin token)
// ================================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-code', [AuthController::class, 'verifyCode']);
Route::post('/resend-verification', [AuthController::class, 'resendVerification']);

// Catálogo de productos visible sin autenticación
Route::get('productos', [ProductoController::class, 'index']);
Route::get('productos/{producto}', [ProductoController::class, 'show']);

// ================================
// 🔒 RUTAS PROTEGIDAS (token obligatorio)
// ================================
Route::middleware('auth:sanctum')->group(function () {

    // --- Perfil / Auth ---
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
Route::get('categorias', [CategoriaController::class, 'index']);

    // --- Mascotas ---
    Route::apiResource('mascotas', MascotaController::class);

    // --- Citas ---
    Route::get('citas', [CitaController::class, 'index']);
    Route::post('citas', [CitaController::class, 'store']);
    Route::get('citas/{cita}', [CitaController::class, 'show']);
    Route::put('citas/{cita}', [CitaController::class, 'update'])
        ->middleware('role:admin,recepcion,groomer');

    // --- Ficha técnica ---
    Route::post('fichas-tecnicas', [FichaTecnicaController::class, 'store'])
        ->middleware('role:admin,groomer');
    Route::get('fichas-tecnicas/{citaId}', [FichaTecnicaController::class, 'show']);

    // --- Checklist ---
    Route::get('citas/{citaId}/checklist', [ChecklistCitaController::class, 'index']);
    Route::post('checklist', [ChecklistCitaController::class, 'store'])
        ->middleware('role:admin,groomer');
    Route::put('checklist/{id}/toggle', [ChecklistCitaController::class, 'toggle'])
        ->middleware('role:admin,groomer');
    Route::delete('checklist/{id}', [ChecklistCitaController::class, 'destroy'])
        ->middleware('role:admin,groomer');

    // --- Servicios ---
    Route::get('servicios', [ServicioController::class, 'index']);

    // --- Pagos ---
    Route::get('pagos', [PagoController::class, 'index']);
    Route::post('pagos', [PagoController::class, 'store']);
    Route::get('pagos/{pago}', [PagoController::class, 'show']);

    // --- Inventario ---
    Route::get('inventario', [InventarioController::class, 'index']);
    Route::middleware('role:admin')->group(function () {
        Route::post('inventario', [InventarioController::class, 'store']);
        Route::put('inventario/{inventario}', [InventarioController::class, 'update']);
        Route::delete('inventario/{inventario}', [InventarioController::class, 'destroy']);
    });

    // --- Consumo de insumos ---
    Route::get('consumo-insumos', [ConsumoInsumoController::class, 'index']);
    Route::post('consumo-insumos', [ConsumoInsumoController::class, 'store'])
        ->middleware('role:admin,groomer');

    // --- Horarios ---
    Route::apiResource('horarios', HorarioController::class)
        ->middleware('role:admin,recepcion');

    // --- Bloqueos ---
    Route::apiResource('bloqueos', BloqueoController::class)
        ->middleware('role:admin,recepcion');

    // --- Disponibilidad de groomers ---
    Route::apiResource('disponibilidad-groomers', DisponibilidadGroomerController::class)
        ->middleware('role:admin');

    // --- Fotos de servicio ---
    Route::get('fotos-servicio', [FotoServicioController::class, 'index']);
    Route::post('fotos-servicio', [FotoServicioController::class, 'store'])
        ->middleware('role:admin,groomer');

    // --- 📦 Productos (gestión admin/recepción) ---
    Route::middleware('role:admin,recepcion')->group(function () {
        Route::post('productos', [ProductoController::class, 'store']);
        Route::put('productos/{producto}', [ProductoController::class, 'update']);
        Route::delete('productos/{producto}', [ProductoController::class, 'destroy']);
    });

    // --- 🛒 Pedidos ---
    Route::get('pedidos', [PedidoController::class, 'index']);
    Route::post('pedidos', [PedidoController::class, 'store']); // 👈 ahora está protegido
    Route::get('pedidos/{pedido}', [PedidoController::class, 'show']);
    Route::put('pedidos/{pedido}/estado', [PedidoController::class, 'updateEstado'])
        ->middleware('role:admin,recepcion');

    // --- 👑 Solo Admin ---
    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users/staff', [AuthController::class, 'registrarPersonal']);
        Route::put('/users/{user}/estado', [UserController::class, 'toggleEstado']);

        Route::post('servicios', [ServicioController::class, 'store']);
        Route::put('servicios/{servicio}', [ServicioController::class, 'update']);
        Route::delete('servicios/{servicio}', [ServicioController::class, 'destroy']);

        Route::get('/audit-logs', [AuditLogController::class, 'index']);
        Route::get('/audit-logs/recent', [AuditLogController::class, 'recentLines']);
    });
});