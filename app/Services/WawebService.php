<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Kstmostofa\LaravelWhatsApp\Facades\WhatsApp;
use Throwable;

class WawebService
{
    /**
     * Kirim pesan WhatsApp menggunakan Laravel WhatsApp Facade (Web Sidecar Session)
     *
     * @param string|null $noWa Nomor tujuan (misal: 08123456789 atau 628123456789)
     * @param string $message Isi pesan yang akan dikirim
     * @param string|null $sessionId ID sesi WhatsApp (default: 'main')
     * @return array<string, mixed>|bool
     */
    public static function sendWa($noWa, $message, ?string $sessionId = null)
    {
        if (empty($noWa)) {
            Log::warning('WhatsApp tidak dikirim: nomor tujuan kosong.');
            return false;
        }

        try {
            $formattedNumber = self::formatNumber((string) $noWa);
            $session = $sessionId ?: config('laravel-whatsapp.ui.default_session', 'main');

            // Kirim pesan teks melalui WhatsApp Web sidecar
            return WhatsApp::web($session)->messages()->sendText($formattedNumber, $message);
        } catch (Throwable $e) {
            Log::error('WawebService gagal mengirim pesan via Laravel WhatsApp', [
                'phone' => $noWa,
                'session' => $sessionId ?? config('laravel-whatsapp.ui.default_session', 'main'),
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Normalisasi nomor telepon ke format Chat ID WhatsApp Web (misal: 628xxxxxxxxxx@c.us)
     *
     * @param string $number
     * @return string
     */
    public static function formatNumber(string $number): string
    {
        $phone = trim($number);

        // Jika sudah berupa ID WhatsApp (misal mengandung @c.us atau @g.us), kembalikan langsung
        if (str_contains($phone, '@')) {
            return $phone;
        }

        // Ambil hanya digit
        $digits = preg_replace('/\D+/', '', $phone);

        // Konversi format lokal Indonesia (08... atau 8...) ke 628...
        if (str_starts_with($digits, '0')) {
            $digits = '62' . substr($digits, 1);
        } elseif (str_starts_with($digits, '8')) {
            $digits = '62' . $digits;
        }

        return $digits . '@c.us';
    }
}
