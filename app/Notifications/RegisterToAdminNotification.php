<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RegisterToAdminNotification extends Notification
{
    use Queueable;

    public $hakAkses;

    public function __construct($hakAkses)
    {
        $this->hakAkses = $hakAkses;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'register_admin',
            'title' => 'Pendaftaran Ruangan Baru',
            'message' => 'Ada mahasiswa yang mendaftar di ruangan ' . ($this->hakAkses->ruangan->nama_ruangan ?? '') . ' untuk tanggal ' . ($this->hakAkses->tanggal ?? ''),
            'url' => '/penjaga/hak-akses',
        ];
    }
}
