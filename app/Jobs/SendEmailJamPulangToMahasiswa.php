<?php

namespace App\Jobs;

use App\Mail\NotificationJamPulangToMahasiswa;
use App\Services\WawebService;
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
            $dataPayload = [
                'mahasiswa' => $this->mahasiswa->toArray(),
                'hak_akses' => $this->hakAkses->load('ruangan')->toArray(),
            ];

            $namaRuangan = $this->hakAkses->ruangan->nama_ruangan ?? null;
            $message = "⚠️ *Peringatan Jam Pulang*\n\nHalo, waktu penggunaan ruangan *{$namaRuangan}* tersisa *10 menit lagi*.\n\nMohon bersiap-siap dan harap keluar sebelum pintu terkunci otomatis. Terima kasih! 🙏";
            WawebService::sendWa($this->mahasiswa->user->nowa, $message);
            Mail::to($this->mahasiswa->user->email_notifikasi)
                ->send(new NotificationJamPulangToMahasiswa($dataPayload));
        }

        $this->mahasiswa->user->notify(new \App\Notifications\JamPulangToMahasiswaNotification($this->hakAkses));
    }
}
