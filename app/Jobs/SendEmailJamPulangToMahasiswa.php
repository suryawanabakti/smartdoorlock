<?php

namespace App\Jobs;

use App\Mail\NotificationJamPulangToMahasiswa;
use App\Services\FonnteService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendEmailJamPulangToMahasiswa implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $mahasiswa;

    public $hakAkses;

    /**
     * Create a new job instance.
     */
    public function __construct($mahasiswa, $hakAkses)
    {
        $this->mahasiswa = $mahasiswa;
        $this->hakAkses = $hakAkses;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        if ($this->mahasiswa->user->email_notifikasi) {
            $namaRuangan = $this->hakAkses->ruangan->nama_ruangan ?? null;
            FonnteService::sendWa($this->mahasiswa->user->nowa, "Jam pulang $namaRuangan  sisa 10 menit lagi\nHarap keluar sebelum pintu terkunci");
            Mail::to($this->mahasiswa->user->email_notifikasi)
                ->send(new NotificationJamPulangToMahasiswa($this->hakAkses));
        }
    }
}
