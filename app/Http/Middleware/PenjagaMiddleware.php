<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PenjagaMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! auth()->check() || ! auth()->user()->isPenjaga()) {
            abort(403, 'Akses ditolak. Hanya untuk penjaga.');
        }

        return $next($request);
    }
}
