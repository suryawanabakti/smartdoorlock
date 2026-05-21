<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RegisterToMahasiswaNotification extends Notification
{
    use Queueable;

    public $hakAkses;
    public $status;

    public function __construct($hakAkses, $status)
    {
        $this->hakAkses = $hakAkses;
        $this->status = $status;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $statusText = $this->status == 'approve' ? 'disetujui' : 'ditolak';
        return [
            'type' => 'register_mahasiswa',
            'title' => 'Status Pendaftaran Ruangan',
            'message' => 'Pendaftaran ruangan ' . ($this->hakAkses->ruangan->nama_ruangan ?? '') . ' telah ' . $statusText . '.',
            'url' => '/mahasiswa/dashboard',
        ];
    }
}
