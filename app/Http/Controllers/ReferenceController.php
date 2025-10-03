<?php

namespace App\Http\Controllers;

use App\Models\Mahasiswa;
use App\Models\Ruangan;
use App\Models\ScanerStatus;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ReferenceController extends Controller
{
    public function getDosen()
    {
        return Mahasiswa::where('ket', 'dsn')->get()->map(fn ($data) => [$data->id_tag]);
    }

    public function getMahasiswaByScanner(Request $request)
    {
        $scanner = ScanerStatus::with('ruangan')->where('kode', $request->kode)->first();

        if (empty($scanner)) {
            echo json_encode(['noid'], JSON_UNESCAPED_UNICODE);

            return;
        }

        ScanerStatus::where('ruangan_id', $scanner->ruangan_id)->update(['last' => Carbon::now('Asia/Makassar')->format('Y-m-d H:i:s')]);

        if ($scanner->ruangan->open_api == 1) {
            $allData = json_encode(Mahasiswa::query()->get()->map(fn ($data) => $data->id_tag), JSON_UNESCAPED_UNICODE);
            Ruangan::find($scanner->ruangan_id)->update(['open_api' => 0]);

            return $allData;
        }

        echo json_encode(['noid'], JSON_UNESCAPED_UNICODE);

    }

    public function getUsers()
    {
        return json_encode(Mahasiswa::where('status', 1)->get()->map(fn ($data) => [$data->id_tag]), JSON_UNESCAPED_UNICODE);
    }
}
