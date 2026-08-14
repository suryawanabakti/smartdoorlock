<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WawebService
{
    public static function sendWa($noWa, $message)
    {
        $response = Http::withToken(config('waweb.token'))
            ->post(config('waweb.url') . '/api/send', [
                'phone' => $noWa,
                'message' => $message,
            ]);

        if ($response->failed()) {
            Log::error('WawebService gagal mengirim pesan', [
                'phone' => $noWa,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
        }
    }
}
