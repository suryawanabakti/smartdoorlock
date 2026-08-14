<?php

namespace App\Jobs;

use App\Mail\NotificationDisapproveToMahasiswa;
use App\Mail\NotificationRegisterToMahasiswa;
use App\Services\WawebService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendEmailToMahasiswa implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $mahasiswa;

    public $hakAkses;

    public $status;

    /**
     * Create a new job instance.
     */
    public function __construct($mahasiswa, $hakAkses, $status)
    {
        $this->mahasiswa = $mahasiswa;
        $this->hakAkses = $hakAkses;
        $this->status = $status;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        if ($this->mahasiswa->user->email_notifikasi) {
            $dataPayload = [
                'mahasiswa' => $this->mahasiswa->toArray(),
                'hak_akses' => $this->hakAkses->load('ruangan')->toArray(),
            ];

            if ($this->status == 'approve') {
                $message = "Halo *{$this->mahasiswa->user->name}* 👋\n\nTerima kasih telah mendaftar di ruangan *{$this->hakAkses->ruangan->nama_ruangan}*.\n\nBerikut detail pendaftaran Anda:\n📅 *Tanggal:* {$this->hakAkses->tanggal}\n🕒 *Jadwal:* {$this->hakAkses->jam_masuk} - {$this->hakAkses->jam_keluar}\n\nSelamat beraktivitas! 🚀";
                WawebService::sendWa($this->mahasiswa->user->nowa, $message);

                Mail::to($this->mahasiswa->user->email_notifikasi)
                    ->send(new NotificationRegisterToMahasiswa($dataPayload));
            } else {
                Mail::to($this->mahasiswa->user->email_notifikasi)
                    ->send(new NotificationDisapproveToMahasiswa($dataPayload));
            }
        }

        $this->mahasiswa->user->notify(new \App\Notifications\RegisterToMahasiswaNotification($this->hakAkses, $this->status));
    }
}
