@component('mail::message')
# Verificación de correo electrónico

Tu código de verificación es:

@component('mail::panel')
# {{ $code }}
@endcomponent

Este código expirará en 60 minutos.

Si no creaste esta cuenta, ignora este mensaje.
@endcomponent