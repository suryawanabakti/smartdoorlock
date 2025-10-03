<h1>Halo {{ $data['mahasiswa']['nama'] }}</h1>

<p>Maaf akses ruangan anda di {{ $data['hak_akses']['ruangan']['nama_ruangan'] ?? null }} di tolak oleh admin ruangan:
</p>

<p>Terima kasih.</p>
