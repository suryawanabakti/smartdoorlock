<h1>Halo {{ $data['mahasiswa']['nama'] }}</h1>

<p>Terima kasih telah mendaftar di ruangan kami. Berikut adalah informasi pendaftaran jadwal anda:</p>

<p>
    <strong>Nama:</strong> {{ $data['mahasiswa']['nama'] }}<br>
    <strong>NIM:</strong> {{ $data['mahasiswa']['nim'] }}<br>
    <strong>Ruangan:</strong> {{ $data['hak_akses']['ruangan']['nama_ruangan'] }}<br>
    <strong>Tanggal:</strong> {{ $data['hak_akses']['tanggal'] }}<br>
    <strong>Jadwal:</strong> {{ $data['hak_akses']['jam_masuk'] }} ~ {{ $data['hak_akses']['jam_keluar'] }} <br>
</p>

<p>
    Terima kasih.
</p>
