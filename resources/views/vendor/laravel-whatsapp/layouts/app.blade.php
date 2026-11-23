<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title ?? 'WhatsApp' }} · {{ config('app.name', 'Smart Door Lock') }}</title>

    @php
        $appName = config('app.name', 'Smart Door Lock');
        $logoUrl = (str_contains(strtoupper($appName), 'MEGA BUANA')) ? '/logo-megabuana.png' : '/logo.png';
    @endphp
    <link rel="icon" href="{{ $logoUrl }}" sizes="any">
    <link rel="icon" href="{{ $logoUrl }}" type="image/png">
    <link rel="apple-touch-icon" href="{{ $logoUrl }}">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=lexend:400,500,600,700" rel="stylesheet" />

    <link rel="stylesheet" href="{{ route('whatsapp.ui.assets.css') }}">

    @foreach ((array) config('laravel-whatsapp.ui.scripts', []) as $script)
        <script src="{{ $script }}" defer></script>
    @endforeach
    @fluxAppearance
    @livewireStyles
    <style>
        body, button, input, select, textarea {
            font-family: 'Lexend', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        [x-cloak]{display:none!important}
    </style>
</head>
<body class="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-wa-canvas-dark dark:text-zinc-100 antialiased selection:bg-emerald-500 selection:text-white">

@php
    $prefix = config('laravel-whatsapp.ui.route_prefix', 'whatsapp');
@endphp

<flux:header sticky class="bg-white/95 dark:bg-wa-surface-dark/95 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 shadow-xs">
    <flux:container class="!max-w-screen-2xl flex items-center gap-3 sm:gap-6 py-0">

        {{-- Return to Main Dashboard --}}
        <a href="{{ route('dashboard') }}" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:text-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition-all shadow-xs border border-zinc-200/80 dark:border-zinc-700 shrink-0">
            <flux:icon.arrow-left class="size-3.5" />
            <span class="hidden sm:inline">Dashboard</span>
        </a>

        <div class="h-6 w-px bg-zinc-200 dark:bg-zinc-700 hidden sm:block"></div>

        {{-- Brand / Logo --}}
        <a href="{{ url($prefix) }}" class="flex items-center gap-2.5 group shrink-0">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20 group-hover:scale-105 transition-transform">
                <flux:icon.chat-bubble-oval-left variant="solid" class="size-5" />
            </div>
            <div class="flex flex-col">
                <div class="flex items-center gap-1.5">
                    <span class="font-bold text-sm sm:text-base tracking-tight text-zinc-900 dark:text-white leading-none">WhatsApp</span>
                    <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Gateway</span>
                </div>
                <span class="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Smart Door Lock</span>
            </div>
        </a>

        {{-- Primary nav --}}
        <flux:navbar class="-mb-px max-lg:hidden ml-2">
            <flux:navbar.item icon="squares-2x2"            :href="url($prefix)"             :current="request()->path() === $prefix">Overview</flux:navbar.item>
            <flux:navbar.item icon="device-phone-mobile"    :href="url($prefix.'/sessions')" :current="request()->is($prefix.'/sessions*')">Sessions</flux:navbar.item>
            <flux:navbar.item icon="pencil-square"          :href="url($prefix.'/compose')"  :current="request()->is($prefix.'/compose*')">Compose</flux:navbar.item>
            <flux:navbar.item icon="chat-bubble-left-right" :href="url($prefix.'/chats')"    :current="request()->is($prefix.'/chats*')">Conversations</flux:navbar.item>
            <flux:navbar.item icon="user-group"             :href="url($prefix.'/groups')"   :current="request()->is($prefix.'/groups*')">Groups</flux:navbar.item>
            <flux:navbar.item icon="users"                  :href="url($prefix.'/contacts')" :current="request()->is($prefix.'/contacts*')">Contacts</flux:navbar.item>
            <flux:navbar.item icon="bolt"                   :href="url($prefix.'/webhooks')" :current="request()->is($prefix.'/webhooks*')">Webhooks</flux:navbar.item>
            <flux:navbar.item icon="heart"                  :href="url($prefix.'/status')"   :current="request()->is($prefix.'/status*')">Status</flux:navbar.item>
        </flux:navbar>

        {{-- Mobile nav --}}
        <flux:dropdown class="lg:hidden ml-auto">
            <flux:button icon="bars-2" variant="ghost" size="sm" />
            <flux:navmenu>
                <flux:navmenu.item icon="squares-2x2"            :href="url($prefix)">Overview</flux:navmenu.item>
                <flux:navmenu.item icon="device-phone-mobile"    :href="url($prefix.'/sessions')">Sessions</flux:navmenu.item>
                <flux:navmenu.item icon="pencil-square"          :href="url($prefix.'/compose')">Compose</flux:navmenu.item>
                <flux:navmenu.item icon="chat-bubble-left-right" :href="url($prefix.'/chats')">Conversations</flux:navmenu.item>
                <flux:navmenu.item icon="user-group"             :href="url($prefix.'/groups')">Groups</flux:navmenu.item>
                <flux:navmenu.item icon="users"                  :href="url($prefix.'/contacts')">Contacts</flux:navmenu.item>
                <flux:navmenu.item icon="bolt"                   :href="url($prefix.'/webhooks')">Webhooks</flux:navmenu.item>
                <flux:navmenu.item icon="heart"                  :href="url($prefix.'/status')">Status</flux:navmenu.item>
            </flux:navmenu>
        </flux:dropdown>

        <flux:spacer />

        {{-- Always-visible health indicator --}}
        <livewire:whatsapp.status-indicator />

        {{-- Theme toggle --}}
        <div x-data="{ value: $flux.appearance }">
            <flux:dropdown position="bottom" align="end">
                <flux:tooltip content="Ganti Tema">
                    <flux:button variant="ghost" size="sm" aria-label="Theme" class="!px-2">
                        <flux:icon.sun              x-show="value === 'light'"  x-cloak class="size-5" />
                        <flux:icon.moon             x-show="value === 'dark'"   x-cloak class="size-5" />
                        <flux:icon.computer-desktop x-show="value === 'system'" x-cloak class="size-5" />
                    </flux:button>
                </flux:tooltip>
                <flux:menu>
                    <flux:menu.radio.group
                        x-model="value"
                        x-on:change="$flux.appearance = value">
                        <flux:menu.radio value="light"  icon="sun">Terang</flux:menu.radio>
                        <flux:menu.radio value="dark"   icon="moon">Gelap</flux:menu.radio>
                        <flux:menu.radio value="system" icon="computer-desktop">Sistem</flux:menu.radio>
                    </flux:menu.radio.group>
                </flux:menu>
            </flux:dropdown>
        </div>

        {{-- New session CTA --}}
        <flux:button :href="url($prefix.'/sessions')" variant="primary" size="sm" icon="plus" class="!bg-emerald-600 hover:!bg-emerald-700 shadow-sm hidden sm:inline-flex">
            New session
        </flux:button>

        @auth
            <div class="hidden md:flex items-center gap-2 pl-3 border-l border-zinc-200 dark:border-zinc-700 shrink-0">
                <div class="flex flex-col text-right">
                    <span class="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[120px]">{{ auth()->user()->name }}</span>
                    <span class="text-[10px] text-zinc-500 uppercase tracking-wider">{{ auth()->user()->role ?? 'Admin' }}</span>
                </div>
            </div>
        @endauth

    </flux:container>
</flux:header>

<flux:main container class="!max-w-screen-2xl py-6 sm:py-8">
    {{ $slot }}
</flux:main>

@fluxScripts
@livewireScripts
</body>
</html>
