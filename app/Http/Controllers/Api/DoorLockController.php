<?php

namespace App\Http\Controllers\Api;

use App\Events\StoreHistoryEvent;
use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\DosenRuangan;
use App\Models\HakAksesMahasiswa;
use App\Models\Histori;
use App\Models\Mahasiswa;
use App\Models\Ruangan;
use App\Models\ScanerStatus;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DoorLockController extends Controller
{
    public function index(Request $request)
    {
        $now = Carbon::now('Asia/Makassar');
        $currentTime = $now->format('H:i:s');
        $currentDate = $now->format('Y-m-d');

        // Ambil data mahasiswa dan status default
        $mahasiswa = Mahasiswa::where('id_tag', $request->id)->first();

        if (! $mahasiswa) {
            echo json_encode(['noid'], JSON_UNESCAPED_UNICODE);

            return;
        }
        $status = $mahasiswa->status ?? 2;

        // Validasi ruangan dan waktu operasional
        $ruangan = Ruangan::with('scanerStatuses')
            ->whereHas('scanerStatuses', fn ($query) => $query->where('kode', $request->kode))
            ->first();

        if (! $ruangan || $currentTime < $ruangan->jam_buka || $currentTime > $ruangan->jam_tutup) {
            echo json_encode(['noid'], JSON_UNESCAPED_UNICODE);

            return;
        }

        // Validasi akses mahasiswa
        // $scanner = ScanerStatus::where('kode', $request->kode)->first();
        // $scanner->type == 'luar' &&

        if ($mahasiswa && $mahasiswa->ket === 'mhs' && $ruangan->type !== 'umum') {
            if (! $this->hasAccess($mahasiswa, $ruangan, $currentTime, $currentDate)) {
                $this->createHistoriAndBroadcast($mahasiswa, $request->id, $request->kode, 3, $ruangan);
                echo json_encode(['noid'], JSON_UNESCAPED_UNICODE);

                return;
            }
        }

        // Validasi akses dosen
        if ($mahasiswa && $mahasiswa->ket === 'dsn' && $ruangan->type !== 'umum') {
            // $ruanganAkses = DosenRuangan::where('mahasiswa_id', $mahasiswa->id)->where('ruangan_id', $ruangan->id)->latest()->first();

            // if (!$ruanganAkses) {
            //     $this->createHistoriAndBroadcast($mahasiswa, $mahasiswa->id_tag, $request->kode, 3, $ruangan);
            //     echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
            //     return;
            // }
        }

        // Simpan histori akses
        $histori = Histori::create([
            'nim' => $mahasiswa->nim ?? null,
            'nama' => $mahasiswa->nama ?? null,
            'id_tag' => $mahasiswa->id_tag,
            'kode' => $request->kode,
            'waktu' => $now,
            'status' => $status,
        ]);

        // Proses absensi mahasiswa
        if ($mahasiswa) {
            ScanerStatus::where('kode', $request->kode)->update(['last' => $now->format('Y-m-d H:i:s')]);

            if ($mahasiswa->status == 0) {
                echo json_encode(['noid'], JSON_UNESCAPED_UNICODE);

                return;
            }

            if ($mahasiswa->status == 1) {
                $this->handleAbsensi($mahasiswa, $ruangan, $request->id, $request->kode, $now);
                // if (env('APP_REALTIME') == 'true') {
                //     broadcast(new StoreHistoryEvent($histori->load('user', 'scanner.ruangan'), $ruangan));
                // }
                echo json_encode([$mahasiswa->id_tag], JSON_UNESCAPED_UNICODE);

                return;
            }
        } else {
            ScanerStatus::where('kode', $request->kode)->update(['last' => $now->format('Y-m-d H:i:s')]);
            echo json_encode(['noid'], JSON_UNESCAPED_UNICODE);

            return;
        }

        // if (env('APP_REALTIME') == 'true') {
        //     broadcast(new StoreHistoryEvent($histori->load('user', 'scanner.ruangan'), $ruangan));
        // }
    }

    private function hasAccess($mahasiswa, $ruangan, $currentTime, $currentDate)
    {
        $ruanganAkses = HakAksesMahasiswa::where('mahasiswa_id', $mahasiswa->id)
            ->whereHas('hakAkses', function ($query) use ($ruangan, $currentTime, $currentDate) {
                $query->where('tanggal', $currentDate)
                    ->where('ruangan_id', $ruangan->id)
                    ->where('is_approve', 1)
                    ->where('jam_masuk', '<', $currentTime)
                    ->where('jam_keluar', '>', $currentTime);
            })
            ->latest()
            ->first();

        if (! $ruanganAkses) {
            $ruanganAkses = Ruangan::where('parent_id', $ruangan->id)
                ->with('hakAksesOne.hakAksesMahasiswaOne')
                ->whereHas('hakAksesOne.hakAksesMahasiswaOne', fn ($query) => $query->where('mahasiswa_id', $mahasiswa->id))
                ->whereHas('hakAksesOne', function ($query) use ($currentTime, $currentDate) {
                    $query->where('tanggal', $currentDate)
                        ->where('is_approve', 1)
                        ->where('jam_masuk', '<', $currentTime)
                        ->where('jam_keluar', '>', $currentTime);
                })
                ->first();
        }

        return $ruanganAkses !== null;
    }

    private function handleAbsensi($mahasiswa, $ruangan, $idTag, $kode, $now)
    {
        $absenToday = Absensi::where('id_tag', $mahasiswa->id_tag)
            ->where('ruangan_id', $ruangan->id)
            ->whereDate('waktu_masuk', $now)
            ->first();

        if (! $absenToday) {
            Absensi::create([
                'id_tag' => $mahasiswa->id_tag,
                'ruangan_id' => $ruangan->id,
                'waktu_masuk' => $now,
            ]);
        } else {
            $scannerStatus = ScanerStatus::where('kode', $kode)->first();
            if ($scannerStatus && $scannerStatus->type === 'dalam') {
                $absenToday->update(['waktu_keluar' => $now]);
            }
        }
    }

    private function createHistoriAndBroadcast($mahasiswa, $id_tag, $kode, $status, $ruangan)
    {
        $histori = Histori::create([
            'nim' => $mahasiswa->nim,
            'nama' => $mahasiswa->nama,
            'id_tag' => $mahasiswa->id_tag,
            'kode' => $kode,
            'waktu' => Carbon::now('Asia/Makassar'),
            'status' => $status,
        ]);

        // if (env('APP_REALTIME') == 'true') {
        //     broadcast(new StoreHistoryEvent($histori->load('user', 'scanner.ruangan'), $ruangan));
        // }
    }

    // echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
    public function index2(Request $request)
    {
        $now = Carbon::now('Asia/Makassar');
        $currentTime = $now->format('H:i:s');
        $currentDate = $now->format('Y-m-d');
        // Cek apakah PIN ada dalam permintaan
        if (! $request->pin) {
            echo json_encode(['noid'], JSON_UNESCAPED_UNICODE);

            return;
        }

        // Ambil data mahasiswa berdasarkan PIN
        $mahasiswa = Mahasiswa::where('pin', $request->pin)->first();
        if (! $mahasiswa) {
            echo json_encode(['noid'], JSON_UNESCAPED_UNICODE);

            return;
        }
        $status = $mahasiswa->status ?? 2;

        // Validasi ruangan dan waktu operasional
        $ruangan = Ruangan::with('scanerStatuses')
            ->whereHas('scanerStatuses', fn ($query) => $query->where('kode', $request->kode))
            ->first();

        // if (! $ruangan || $currentTime < $ruangan->jam_buka || $currentTime > $ruangan->jam_tutup) {
        //     echo json_encode(['noid'], JSON_UNESCAPED_UNICODE);

        //     return;
        // }

        $scanner = ScanerStatus::where('kode', $request->kode)->first();

        // Validasi akses mahasiswa
        // if ($mahasiswa && $mahasiswa->ket === 'mhs' && $scanner->type == 'luar' && $ruangan->type !== 'umum') {
        //     if (! $this->hasAccess($mahasiswa, $ruangan, $currentTime, $currentDate)) {
        //         $this->createHistoriAndBroadcast($mahasiswa, $request->id, $request->kode, 3, $ruangan);
        //         echo json_encode(['noid'], JSON_UNESCAPED_UNICODE);

        //         return;
        //     }
        // }

        // Validasi akses dosen
        if ($mahasiswa && $mahasiswa->ket === 'dsn' && $scanner->type == 'luar' && $ruangan->type !== 'umum') {
            // $ruanganAkses = DosenRuangan::where('mahasiswa_id', $mahasiswa->id)->where('ruangan_id', $ruangan->id)->latest()->first();

            // if (!$ruanganAkses) {
            //     $this->createHistoriAndBroadcast($mahasiswa, $mahasiswa->id_tag, $request->kode, 3, $ruangan);
            //     echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
            //     return;
            // }
        }

        // Simpan histori akses
        $histori = Histori::create([
            'nim' => $mahasiswa->nim ?? null,
            'nama' => $mahasiswa->nama ?? null,
            'id_tag' => $mahasiswa->id_tag,
            'kode' => $request->kode,
            'waktu' => $now,
            'status' => $status,
        ]);

        // Proses absensi mahasiswa
        if ($mahasiswa) {
            ScanerStatus::where('kode', $request->kode)->update(['last' => $now->format('Y-m-d H:i:s')]);

            // if ($mahasiswa->status == 0) {
            //     echo json_encode(['noid'], JSON_UNESCAPED_UNICODE);

            //     return;
            // }

            if ($mahasiswa->status == 1) {
                $this->handleAbsensi($mahasiswa, $ruangan, $request->id, $request->kode, $now);

                echo json_encode([$mahasiswa->pin], JSON_UNESCAPED_UNICODE);

                return;
            }
        } else {
            ScanerStatus::where('kode', $request->kode)->update(['last' => $now->format('Y-m-d H:i:s')]);
            echo json_encode(['noid'], JSON_UNESCAPED_UNICODE);

            return;
        }

        // if (env('APP_REALTIME') == 'true') {
        //     broadcast(new StoreHistoryEvent($histori->load('user', 'scanner.ruangan'), $ruangan));
        // }
    }
}
