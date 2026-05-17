<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class StaffCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $password;
    public $code;

    public function __construct($user, $password, $code)
    {
        $this->user = $user;
        $this->password = $password;
        $this->code = $code;
    }

    public function build()
    {
        return $this->subject('Bienvenido a Pet Spa Pro - Credenciales y verificación')
                    ->markdown('emails.staff-created', [
                        'user' => $this->user,
                        'password' => $this->password,
                        'code' => $this->code,
                    ]);
    }
}