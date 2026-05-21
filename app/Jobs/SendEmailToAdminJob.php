<?php

namespace App\Jobs;

use App\Mail\NotificationRegisterToAdmin;
use App\Services\FonnteService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendEmailToAdminJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $mahasiswa;

    public $customer;

    /**
     * Create a new job instance.
     *
     * @param  $mahasiswa
     * @param  $customer
     */
    public function __construct(public $user, public $hakAkses) {}

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {

        $mahasiswaList = $this->hakAkses->mahasiswas->map(function ($mhs) {
            return "👤 *Nama:* {$mhs->nama}\n🎓 *NIM:* {$mhs->nim}";
        })->implode("\n\n");

        $message = "Halo Admin *{$this->hakAkses->ruangan->nama_ruangan}* 👋\n\nAda mahasiswa yang baru saja mendaftar:\n\n{$mahasiswaList}\n\nSilakan periksa dashboard untuk info lebih lanjut.";
        FonnteService::sendWa($this->user->nowa, $message);

        Mail::to($this->user->email_notifikasi)->send(
            new NotificationRegisterToAdmin(
                $this->hakAkses
            )
        );

        $this->user->notify(new \App\Notifications\RegisterToAdminNotification($this->hakAkses));
    }
}
