<?php

namespace App\Jobs;

use App\Mail\NotificationDisapproveToMahasiswa;
use App\Mail\NotificationRegisterToMahasiswa;
use App\Services\Fonnte;
use App\Services\FonnteService;
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
            if ($this->status == 'approve') {

                // Fonnte::sendWa("081244067445", "TESTTTER");

                FonnteService::sendWa($this->mahasiswa->user->nowa, 'Halo '.$this->mahasiswa->user->name.' Terima kasih telah mendaftar di ruangan'.$this->hakAkses->ruangan->nama_ruangan."\n\nTanggal: ".$this->hakAkses->tanggal."\nJadwal : ".$this->hakAkses->jam_masuk.'~'.$this->hakAkses->jam_keluar);

                Mail::to($this->mahasiswa->user->email_notifikasi)
                    ->send(new NotificationRegisterToMahasiswa($this->hakAkses));
            } else {
                Mail::to($this->mahasiswa->user->email_notifikasi)
                    ->send(new NotificationDisapproveToMahasiswa($this->hakAkses));
            }
        }
    }
}
