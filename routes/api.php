<?php

use App\Http\Controllers\Api\DoorLockController;
use App\Http\Controllers\ScanerStatusController;
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
