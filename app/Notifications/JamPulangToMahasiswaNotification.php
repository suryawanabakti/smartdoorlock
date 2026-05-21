<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class JamPulangToMahasiswaNotification extends Notification
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
            'type' => 'jam_pulang',
            'title' => 'Peringatan Jam Pulang',
            'message' => 'Waktu penggunaan ruangan ' . ($this->hakAkses->ruangan->nama_ruangan ?? '') . ' sisa 10 menit lagi.',
            'url' => '/mahasiswa/dashboard',
        ];
    }
}
