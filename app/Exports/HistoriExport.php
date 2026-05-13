<?php

namespace App\Exports;

use App\Models\Histori;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class HistoriExport implements FromQuery, WithHeadings, WithMapping, WithTitle, ShouldAutoSize, WithStyles
{
    protected $filters;

    public function __construct($filters)
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = Histori::with(['scanner.ruangan'])->latest('waktu');

        $filters = $this->filters;

        // Search filter
        if (isset($filters['search']) && $filters['search'] !== '' && $filters['search'] !== 'all') {
            $query->where(function ($q) use ($filters) {
                $q->where('id_tag', 'like', "%{$filters['search']}%")
                    ->orWhere('nama', 'like', "%{$filters['search']}%")
                    ->orWhere('nim', 'like', "%{$filters['search']}%")
                    ->orWhere('kode', 'like', "%{$filters['search']}%");
            });
        }

        // Status filter
        if (isset($filters['status']) && $filters['status'] !== '' && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        // Ruangan filter
        if (isset($filters['ruangan_id']) && $filters['ruangan_id'] !== '' && $filters['ruangan_id'] !== 'all') {
            $query->whereHas('scanner', function ($q) use ($filters) {
                $q->where('ruangan_id', $filters['ruangan_id']);
            });
        }

        // Scanner type filter
        if (isset($filters['type']) && $filters['type'] !== '' && $filters['type'] !== 'all') {
            $query->whereHas('scanner', function ($q) use ($filters) {
                $q->where('type', $filters['type']);
            });
        }

        // Date range filter
        if (isset($filters['tanggal_mulai']) && $filters['tanggal_mulai']) {
            $query->whereDate('waktu', '>=', $filters['tanggal_mulai']);
        }

        if (isset($filters['tanggal_selesai']) && $filters['tanggal_selesai']) {
            $query->whereDate('waktu', '<=', $filters['tanggal_selesai']);
        }

        // Time range filter
        if (isset($filters['jam_mulai']) && $filters['jam_mulai']) {
            $query->whereTime('waktu', '>=', $filters['jam_mulai']);
        }

        if (isset($filters['jam_selesai']) && $filters['jam_selesai']) {
            $query->whereTime('waktu', '<=', $filters['jam_selesai']);
        }

        // Kelas/Mahasiswa filter
        if (isset($filters['kelas']) && $filters['kelas'] !== '' && $filters['kelas'] !== 'all') {
            $query->whereHas('scanner.ruangan.mahasiswas', function ($q) use ($filters) {
                $q->where('ruangan_id', $filters['kelas']);
            });
        }

        // Tahun masuk filter
        if (isset($filters['tahun_masuk']) && $filters['tahun_masuk'] !== '' && $filters['tahun_masuk'] !== 'all') {
            $query->whereHas('scanner.ruangan.mahasiswas', function ($q) use ($filters) {
                $q->where('tahun_masuk', $filters['tahun_masuk']);
            });
        }

        return $query;
    }

    public function headings(): array
    {
        return [
            'Waktu Scan',
            'Scanner',
            'Ruangan',
            'ID Tag',
            'Nama Mahasiswa',
            'NIM',
            'Status',
        ];
    }

    public function map($histori): array
    {
        return [
            $histori->waktu->format('d/m/Y H:i:s'),
            $histori->kode,
            $histori->scanner?->ruangan?->nama_ruangan ?? '-',
            $histori->id_tag,
            $histori->nama ?? '-',
            $histori->nim ?? '-',
            $histori->status_label,
        ];
    }

    public function title(): string
    {
        return 'Riwayat Scan';
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
