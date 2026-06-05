<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use App\Notifications\VerifyEmailNotification;

class User extends Authenticatable implements MustVerifyEmail  // 👈 AGREGAR implements
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
    'name',
    'email',
    'password',
    'rol',
    'estado',
    'must_change_password',
    'telefono',
    'ci',
    'direccion',
    'especialidad',
    'turno',
    'verification_code',
    'verification_code_expires_at',
];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'must_change_password' => 'boolean',  // 👈 AGREGAR
        'login_attempts' => 'integer',
        'locked_until' => 'datetime',
        'verification_code_expires_at' => 'datetime'

    ];
    public function generateVerificationCode(): void
{
    $this->update([
        'verification_code' => str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT),
        'verification_code_expires_at' => now()->addMinutes(60),
    ]);
}
public function verifyCode(string $code): bool
{
    return $this->verification_code &&
           $this->verification_code_expires_at &&
           $this->verification_code_expires_at->isFuture() &&
           hash_equals($this->verification_code, $code);
}
public function markEmailAsVerifiedWithCode(): void
{
    $this->forceFill([
        'email_verified_at' => now(),
        'verification_code' => null,
        'verification_code_expires_at' => null,
    ])->save();
}
    // Relaciones
    public function citasComoCliente()
    {
        return $this->hasMany(Cita::class, 'user_id');
    }
    public function isLocked(): bool
    {
        return $this->locked_until && $this->locked_until->isFuture();
    }

    /**
     * Incrementa los intentos fallidos y bloquea si alcanza el límite.
     */
    public function incrementLoginAttempts(): void
    {
        $this->login_attempts++;
        if ($this->login_attempts >= 5) {
            $this->locked_until = now()->addMinutes(15);
            $this->login_attempts = 0; // Reiniciar contador tras bloqueo
        }
        $this->save();
    }
        public function resetLoginAttempts(): void
    {
        $this->update([
            'login_attempts' => 0,
            'locked_until' => null,
        ]);
    }
    public function citasComoStaff()
    {
        return $this->hasMany(Cita::class, 'staff_id');
    }
    public function mascotas()
    {
        return $this->hasMany(Mascota::class);
    }

    public function disponibilidades()
    {
        return $this->hasMany(DisponibilidadGroomer::class);
    }

    public function pagosRegistrados()
    {
        return $this->hasMany(Pago::class, 'registrado_por');
    }
    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    // Scopes
    public function scopeActivo($query)
    {
        return $query->where('estado', 'activo');
    }

    public function scopePorRol($query, $rol)
    {
        return $query->where('rol', $rol);
    }

    // Verificar si debe cambiar contraseña
    public function mustChangePassword()
    {
        return $this->must_change_password;
    }

    // Sobrescribir método de verificación
  public function sendEmailVerificationNotification()
{
    $this->notify(new VerifyEmailNotification());
}
}