@php
    $nama = $data['mahasiswa']['nama'] ?? null;
    $namaRuangan = $data['hak_akses']['ruangan']['nama_ruangan'] ?? null;
    $jamPulang = $data['hak_akses']['jam_pulang'] ?? null;
@endphp

<h1>Hi {{ $nama ?? null }} , Akses Ke Ruangan
    {{ $namaRuangan ?? null }} Tersisa sekitar 10 menit lagi</h1>
<p>Terima Kasih.</p>
