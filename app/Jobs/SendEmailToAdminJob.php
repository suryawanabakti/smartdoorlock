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
        //         <H1>Halo Admin Ruangan {{ $data->hakAkses->ruangan->nama_ruangan }}</H1>
        // <p>Ada mahasiswa yang mendaftar di ruangan anda</p>

        // <p>Nama : {{ $data->mahasiswa->nama }}</p>
        // <p>NIM : {{ $data->mahasiswa->nim }}</p>
        // <p>Ruangan : {{ $data->hakAkses->ruangan->nama_ruangan ?? null }} </p>
        // <p>Jam Masuk : {{ $data->hakAkses->jam_masuk }}</p>
        // <p>Jam Keluar : {{ $data->hakAkses->jam_keluar }} </p>
        Log::info($this->hakAkses);

        $mahasiswaList = $this->hakAkses->mahasiswas->map(function ($mhs) {
            return "Nama: {$mhs->nama}\nNim: {$mhs->nim}";
        })->implode("\n\n");

        $message = "Halo Admin {$this->hakAkses->ruangan->nama_ruangan} Mahasiswa baru saja mendaftar\n\n{$mahasiswaList}";
        FonnteService::sendWa($this->user->nowa, $message);

        Mail::to($this->user->email_notifikasi)->send(
            new NotificationRegisterToAdmin(
                $this->hakAkses
            )
        );
    }
}
