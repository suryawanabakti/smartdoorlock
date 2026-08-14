<?php

use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DosenController;
use App\Http\Controllers\HakAksesController;
use App\Http\Controllers\HistoriController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\Mahasiswa\DashboardController as MahasiswaDashboardController;
use App\Http\Controllers\Mahasiswa\HakAksesMahasiswaController;
use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\Penjaga\AbsensiPenjagaController;
use App\Http\Controllers\Penjaga\DashboardController as PenjagaDashboardController;
use App\Http\Controllers\Penjaga\HakAksesPenjagaController;
use App\Http\Controllers\Penjaga\HistoriController as PenjagaHistoriController;
use App\Http\Controllers\Penjaga\RuanganPenjagaController;
use App\Http\Controllers\RuanganController;
use App\Http\Controllers\ScanerStatusController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingPageController::class, 'index'])->name('home');

Route::get('/calendar', [CalendarController::class, 'index'])->name('calendar.index');
Route::get('/hak-akses/{hakAkses}', [HakAksesController::class, 'show'])->name('hak-akses.show');
Route::delete('/hak-akses/destroy-by-date', [HakAksesController::class, 'destroyByDate'])->name('hak-akses.destroy-by-date');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/notifications/{id}/mark-as-read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');

    Route::get('/ruangans/reset-api', [RuanganController::class, 'resetApi']);
    Route::resource('ruangans', RuanganController::class);

    Route::post('users/{user}', [UserController::class, 'update']);
    Route::resource('users', UserController::class);
    Route::post('/users/{user}/toggle-status', [UserController::class, 'toggleStatus'])
        ->name('users.toggle-status');

    Route::resource('mahasiswas', MahasiswaController::class);
    Route::get('/mahasiswa-list', [MahasiswaController::class, 'index'])->name('mahasiswa.list');
    Route::get('/dosen-list', [DosenController::class, 'index'])->name('dosen.list');

    // Routes for creating/editing specific jenis (mahasiswa/dosen) that render forms with ket hidden
    Route::get('/mahasiswa/create', [MahasiswaController::class, 'createMahasiswa'])->name('mahasiswa.create');
    Route::get('/dosen/create', [DosenController::class, 'create'])->name('dosen.create');

    Route::get('/mahasiswa/{mahasiswa}/edit', [MahasiswaController::class, 'editMahasiswa'])->name('mahasiswa.edit');
    Route::get('/dosen/{mahasiswa}/edit', [DosenController::class, 'edit'])->name('dosen.edit');

    Route::post('/mahasiswas/{mahasiswa}/toggle-status', [MahasiswaController::class, 'toggleStatus'])
        ->name('mahasiswas.toggle-status');
    Route::post('/mahasiswas/import', [MahasiswaController::class, 'import'])->name('mahasiswas.import');
    Route::get('/mahasiswas/lowercase-id-tag', [MahasiswaController::class, 'lowercaseIdTag'])->name('mahasiswas.lowercase-id-tag');

    Route::resource('scaner-status', ScanerStatusController::class);

    Route::prefix('api')->group(function () {
        Route::get('/scaner-status/{kode}', [ScanerStatusController::class, 'getByKode']);
        Route::post('/scaner-status/{scanerStatus}/update-last-scan', [ScanerStatusController::class, 'updateLastScan']);
    });

    Route::resource('hak-akses', HakAksesController::class)->parameters([
        'hak-akses' => 'hakAkses',
    ]);
    Route::post('/hak-akses/{hakAkses}/approve', [HakAksesController::class, 'approve'])->name('hak-akses.approve');
    Route::post('/hak-akses/{hakAkses}/reject', [HakAksesController::class, 'reject'])->name('hak-akses.reject');
    Route::post('/hak-akses/{hakAkses}/toggle-admin', [HakAksesController::class, 'toggleAdmin'])->name('hak-akses.toggle-admin');

    Route::get('/histori', [HistoriController::class, 'index'])->name('histori.index');
    Route::get('/histori/export', [HistoriController::class, 'export'])->name('histori.export');
    Route::get('/histori/statistics', [HistoriController::class, 'statistics'])->name('histori.statistics');

    Route::get('/absensi', [AbsensiController::class, 'index'])->name('absensi.index');
    Route::get('/absensi/{absensi}', [AbsensiController::class, 'show'])->name('absensi.show');
    Route::delete('/absensi/{absensi}', [AbsensiController::class, 'destroy'])->name('absensi.destroy');
    Route::get('/absensi/export', [AbsensiController::class, 'export'])->name('absensi.export');

    Route::get('/absensi/export/excel', [AbsensiController::class, 'exportExcel'])->name('absensi.export.excel');

    // Routes untuk Penjaga
    Route::prefix('penjaga')->middleware(['auth', 'verified', 'penjaga'])->group(function () {
        // Hak Akses Routes
        Route::get('/dashboard', [PenjagaDashboardController::class, 'index'])->name('penjaga.dashboard');

        Route::get('/hak-akses', [HakAksesPenjagaController::class, 'index'])->name('penjaga.hak-akses.index');
        Route::get('/hak-akses/create', [HakAksesPenjagaController::class, 'create'])->name('penjaga.hak-akses.create');
        Route::post('/hak-akses', [HakAksesPenjagaController::class, 'store'])->name('penjaga.hak-akses.store');
        Route::get('/hak-akses/{hakAkses}', [HakAksesPenjagaController::class, 'show'])->name('penjaga.hak-akses.show');
        Route::get('/hak-akses/{hakAkses}/edit', [HakAksesPenjagaController::class, 'edit'])->name('penjaga.hak-akses.edit');
        Route::put('/hak-akses/{hakAkses}', [HakAksesPenjagaController::class, 'update'])->name('penjaga.hak-akses.update');
        Route::delete('/hak-akses/{hakAkses}', [HakAksesPenjagaController::class, 'destroy'])->name('penjaga.hak-akses.destroy');
        Route::post('/hak-akses/{hakAkses}/approve', [HakAksesPenjagaController::class, 'approve'])->name('penjaga.hak-akses.approve');
        Route::post('/hak-akses/{hakAkses}/reject', [HakAksesPenjagaController::class, 'reject'])->name('penjaga.hak-akses.reject');

        // Absensi Routes
        Route::get('/absensi', [AbsensiPenjagaController::class, 'index'])->name('penjaga.absensi.index');
        Route::get('/absensi/{absensi}', [AbsensiPenjagaController::class, 'show'])->name('penjaga.absensi.show');

        // Ruangan Routes
        Route::get('/ruangan', [RuanganPenjagaController::class, 'index'])->name('penjaga.ruangan.index');
        Route::get('/ruangan/{ruangan}', [RuanganPenjagaController::class, 'show'])->name('penjaga.ruangan.show');
        Route::get('/ruangan/{ruangan}/edit', [RuanganPenjagaController::class, 'edit'])->name('penjaga.ruangan.edit');
        Route::put('/ruangan/{ruangan}', [RuanganPenjagaController::class, 'update'])->name('penjaga.ruangan.update');

        Route::get('/histori', [PenjagaHistoriController::class, 'index'])->name('penjaga.histori.index');
        Route::get('/histori/export', [PenjagaHistoriController::class, 'export'])->name('penjaga.histori.export');
        Route::get('/histori/statistics', [PenjagaHistoriController::class, 'statistics'])->name('penjaga.histori.statistics');
    });

    // Routes untuk Mahasiswa
    Route::prefix('mahasiswa')->middleware(['auth', 'verified', 'mahasiswa'])->group(function () {
        Route::get('/dashboard', [MahasiswaDashboardController::class, 'index'])->name('mahasiswa.dashboard');

        Route::get('/hak-akses/available', [HakAksesMahasiswaController::class, 'availableHakAkses'])->name('mahasiswa.hak-akses.available');
        Route::post('/hak-akses/{hakAkses}/join', [HakAksesMahasiswaController::class, 'join'])->name('mahasiswa.hak-akses.join');
        Route::post('/hak-akses/{hakAkses}/leave', [HakAksesMahasiswaController::class, 'leave'])->name('mahasiswa.hak-akses.leave');
        // Hak Akses Routes
        Route::get('/hak-akses', [HakAksesMahasiswaController::class, 'index'])->name('mahasiswa.hak-akses.index');
        Route::get('/hak-akses/create', [HakAksesMahasiswaController::class, 'create'])->name('mahasiswa.hak-akses.create');
        Route::post('/hak-akses', [HakAksesMahasiswaController::class, 'store'])->name('mahasiswa.hak-akses.store');
        Route::get('/hak-akses/{hakAkses}', [HakAksesMahasiswaController::class, 'show'])->name('mahasiswa.hak-akses.show');
        Route::get('/hak-akses/{hakAkses}/edit', [HakAksesMahasiswaController::class, 'edit'])->name('mahasiswa.hak-akses.edit');
        Route::put('/hak-akses/{hakAkses}', [HakAksesMahasiswaController::class, 'update'])->name('mahasiswa.hak-akses.update');
        Route::delete('/hak-akses/{hakAkses}', [HakAksesMahasiswaController::class, 'destroy'])->name('mahasiswa.hak-akses.destroy');

        // Available Hak Akses

    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
