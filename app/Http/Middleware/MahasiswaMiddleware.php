<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MahasiswaMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! auth()->check() || ! auth()->user()->isMahasiswa()) {
            abort(403, 'Akses ditolak. Hanya untuk mahasiswa.');
        }

        return $next($request);
    }
}
