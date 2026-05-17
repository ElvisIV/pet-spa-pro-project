@component('mail::message')
# ¡Bienvenido al equipo, {{ $user->name }}!

Has sido registrado como **{{ ucfirst($user->rol) }}** en Pet Spa Pro.

## Tus credenciales temporales:
- **Email:** {{ $user->email }}
- **Contraseña temporal:** {{ $password }}

## Código de verificación:
@component('mail::panel')
# {{ $code }}
@endcomponent

Deberás ingresar este código al iniciar sesión por primera vez para verificar tu correo.

Luego, el sistema te pedirá que cambies tu contraseña.

Este código expira en 60 minutos.
@endcomponent