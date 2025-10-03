<?php

use App\Http\Controllers\Api\DoorLockController;
use App\Http\Controllers\ReferenceController;
use App\Http\Controllers\ScanerStatusController;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/v1/ambilpost', [DoorLockController::class, 'index']);
Route::get('/v1/ambilpostpin', [DoorLockController::class, 'index2']);

Route::prefix('v1')->group(function () {
    Route::get('/scanners/{kode}', [ScanerStatusController::class, 'getByKode']);
    Route::post('/scanners/{kode}/last-scan', [ScanerStatusController::class, 'updateLastScan']);
});

Route::get('/v1/get-data-mahasiswa-by-scanner', [ReferenceController::class, 'getMahasiswaByScanner']);
Route::get('/v1/get-data-users', [ReferenceController::class, 'getUsers']);

Route::get('/v1/search-mahasiswa', function (Request $request) {
    return Mahasiswa::with('user')
        ->where('ket', 'mhs')
        ->where(function ($query) use ($request) {
            $query->where('nama', 'LIKE', "%{$request->search}%")
                ->orWhere('nim', 'LIKE', "%{$request->search}%");
        })
        ->get();
});

Route::get('/v1/search-dosen', function (Request $request) {
    return Mahasiswa::where('ket', 'dsn')->where('nama', 'LIKE', "%{$request->search}%")
        ->get()->map(function ($data) {
            return [
                'name' => $data->nama,
                'id' => $data->id,
            ];
        });
});
