<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Notifikasi Pendaftaran Mahasiswa</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">

    <h1 style="color: #2c3e50;">Halo Admin Ruangan {{ $data->ruangan->nama_ruangan }}</h1>

    <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid #3498db;">
        <p><strong>Ada mahasiswa yang mendaftar di ruangan Anda.</strong></p>
        <p><strong>Ruangan:</strong> {{ $data->ruangan->nama_ruangan ?? '-' }}</p>
        <p><strong>Jam Masuk:</strong> {{ $data->jam_masuk }}</p>
        <p><strong>Jam Keluar:</strong> {{ $data->jam_keluar }}</p>
    </div>

    <h2 style="color: #2c3e50;">Daftar Mahasiswa</h2>
    <table width="100%" cellpadding="8" cellspacing="0" border="1" style="border-collapse: collapse; margin-top: 15px;">
        <thead>
            <tr style="background: #3498db; color: #fff; text-align: left;">
                <th>No</th>
                <th>Nama</th>
                <th>NIM</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data->mahasiswas as $index => $mhs)
                <tr style="background: {{ $index % 2 == 0 ? '#f9f9f9' : '#ffffff' }};">
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $mhs->nama }}</td>
                    <td>{{ $mhs->nim }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>
