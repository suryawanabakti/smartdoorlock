<?php

namespace App\Http\Controllers;

use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class IdCardController extends Controller
{
    public function index(Request $request)
    {
        $query = Mahasiswa::query()
            ->whereNotNull('id_tag')
            ->with(['ruangan']);

        // Search filter
        if ($request->filled('search') && $request->search !== 'all') {
            $query->where(function ($q) use ($request) {
                $q->where('nama', 'like', "%{$request->search}%")
                    ->orWhere('nim', 'like', "%{$request->search}%")
                    ->orWhere('id_tag', 'like', "%{$request->search}%");
            });
        }

        // Status filter (mahasiswa status)
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Ket filter (mhs/dsn)
        if ($request->filled('ket') && $request->ket !== 'all') {
            $query->where('ket', $request->ket);
        }

        // Usage category filter
        if ($request->filled('kategori') && $request->kategori !== 'all') {
            $kategori = $request->kategori;
            $query->where(function ($q) use ($kategori) {
                switch ($kategori) {
                    case 'aktif':
                        $q->whereRaw('(SELECT MAX(waktu) FROM histori WHERE histori.id_tag = mahasiswa.id_tag) >= DATE_SUB(NOW(), INTERVAL 7 DAY)');
                        break;
                    case 'jarang':
                        $q->whereRaw('(SELECT MAX(waktu) FROM histori WHERE histori.id_tag = mahasiswa.id_tag) >= DATE_SUB(NOW(), INTERVAL 30 DAY)')
                            ->whereRaw('(SELECT MAX(waktu) FROM histori WHERE histori.id_tag = mahasiswa.id_tag) < DATE_SUB(NOW(), INTERVAL 7 DAY)');
                        break;
                    case 'tidak_aktif':
                        $q->whereRaw('(SELECT MAX(waktu) FROM histori WHERE histori.id_tag = mahasiswa.id_tag) < DATE_SUB(NOW(), INTERVAL 30 DAY)')
                            ->orWhereRaw('(SELECT MAX(waktu) FROM histori WHERE histori.id_tag = mahasiswa.id_tag) IS NULL');
                        break;
                    case 'belum_pernah':
                        $q->whereRaw('(SELECT COUNT(*) FROM histori WHERE histori.id_tag = mahasiswa.id_tag) = 0');
                        break;
                }
            });
        }

        // Tahun masuk filter
        if ($request->filled('tahun_masuk') && $request->tahun_masuk !== 'all') {
            $query->where('tahun_masuk', $request->tahun_masuk);
        }

        $totalCards = $query->count();

        $mahasiswas = $query->get()->map(function ($m) {
            $totalScan = DB::table('histori')
                ->where('id_tag', $m->id_tag)
                ->count();

            $totalAbsensi = DB::table('absensis')
                ->where('id_tag', $m->id_tag)
                ->count();

            $lastScan = DB::table('histori')
                ->where('id_tag', $m->id_tag)
                ->orderBy('waktu', 'desc')
                ->value('waktu');

            $lastAbsensi = DB::table('absensis')
                ->where('id_tag', $m->id_tag)
                ->orderBy('waktu_masuk', 'desc')
                ->value('waktu_masuk');

            $hariSejakScan = $lastScan
                ? (int) now()->diffInDays($lastScan)
                : null;

            $hariSejakAbsensi = $lastAbsensi
                ? (int) now()->diffInDays($lastAbsensi)
                : null;

            $kategori = 'belum_pernah';
            if ($totalScan > 0 || $totalAbsensi > 0) {
                $lastActivity = $lastScan && $lastAbsensi
                    ? max(strtotime($lastScan), strtotime($lastAbsensi))
                    : strtotime($lastScan ?: $lastAbsensi);

                $hariSejakAktivitas = (int) now()->diffInDays(date('Y-m-d H:i:s', $lastActivity));

                if ($hariSejakAktivitas <= 7) {
                    $kategori = 'aktif';
                } elseif ($hariSejakAktivitas <= 30) {
                    $kategori = 'jarang';
                } else {
                    $kategori = 'tidak_aktif';
                }
            }

            return [
                'id' => $m->id,
                'id_tag' => $m->id_tag,
                'nama' => $m->nama,
                'nim' => $m->nim,
                'ket' => $m->ket,
                'status' => $m->status,
                'tahun_masuk' => $m->tahun_masuk,
                'ruangan_nama' => $m->ruangan?->nama_ruangan,
                'total_scan' => $totalScan,
                'total_absensi' => $totalAbsensi,
                'last_scan' => $lastScan,
                'last_absensi' => $lastAbsensi,
                'hari_sejak_scan' => $hariSejakScan,
                'hari_sejak_absensi' => $hariSejakAbsensi,
                'kategori_penggunaan' => $kategori,
            ];
        });

        // Apply kategori filter after collection (for sorting-based logic)
        if ($request->filled('kategori') && $request->kategori !== 'all') {
            $mahasiswas = $mahasiswas->where('kategori_penggunaan', $request->kategori);
        }

        // Sort by kategori priority
        $sortOrder = ['aktif' => 0, 'jarang' => 1, 'belum_pernah' => 2, 'tidak_aktif' => 3];
        $mahasiswas = $mahasiswas->sortBy(function ($item) use ($sortOrder) {
            return $sortOrder[$item['kategori_penggunaan']] ?? 4;
        })->values();

        // Statistics (from all cards with tag)
        $allWithTag = Mahasiswa::whereNotNull('id_tag')->get();
        $stats = [
            'total_cards' => $allWithTag->count(),
            'cards_with_tag' => $allWithTag->count(),
            'cards_without_tag' => Mahasiswa::whereNull('id_tag')->count(),
            'aktif' => 0,
            'jarang' => 0,
            'tidak_aktif' => 0,
            'belum_pernah' => 0,
        ];

        foreach ($allWithTag as $m) {
            $totalScan = DB::table('histori')->where('id_tag', $m->id_tag)->count();
            $totalAbsensi = DB::table('absensis')->where('id_tag', $m->id_tag)->count();

            if ($totalScan === 0 && $totalAbsensi === 0) {
                $stats['belum_pernah']++;
                continue;
            }

            $lastScan = DB::table('histori')->where('id_tag', $m->id_tag)->max('waktu');
            $lastAbsensi = DB::table('absensis')->where('id_tag', $m->id_tag)->max('waktu_masuk');

            $latest = $lastScan && $lastAbsensi
                ? max($lastScan, $lastAbsensi)
                : ($lastScan ?: $lastAbsensi);

            $hari = (int) now()->diffInDays($latest);

            if ($hari <= 7) {
                $stats['aktif']++;
            } elseif ($hari <= 30) {
                $stats['jarang']++;
            } else {
                $stats['tidak_aktif']++;
            }
        }

        // Paginate manually (since we collect all then map)
        $perPage = 15;
        $page = $request->get('page', 1);
        $paginated = $mahasiswas->forPage($page, $perPage);

        $lastPage = ceil($mahasiswas->count() / $perPage);
        $from = $mahasiswas->count() > 0 ? (($page - 1) * $perPage) + 1 : 0;
        $to = min($page * $perPage, $mahasiswas->count());
        $links = [];

        // Previous link
        $links[] = [
            'url' => $page > 1 ? route('id-cards.index', array_merge($request->query(), ['page' => $page - 1])) : null,
            'label' => '&laquo; Previous',
            'active' => false,
        ];

        // Page links
        for ($i = 1; $i <= $lastPage; $i++) {
            $links[] = [
                'url' => route('id-cards.index', array_merge($request->query(), ['page' => $i])),
                'label' => (string) $i,
                'active' => $i == $page,
            ];
        }

        // Next link
        $links[] = [
            'url' => $page < $lastPage ? route('id-cards.index', array_merge($request->query(), ['page' => $page + 1])) : null,
            'label' => 'Next &raquo;',
            'active' => false,
        ];

        return Inertia::render('IdCard/Index', [
            'idCards' => [
                'data' => $paginated->values()->toArray(),
                'total' => $mahasiswas->count(),
                'from' => $from,
                'to' => $to,
                'current_page' => (int) $page,
                'last_page' => (int) $lastPage,
                'links' => $links,
            ],
            'filters' => $request->only([
                'search', 'status', 'ket', 'kategori', 'tahun_masuk',
            ]),
            'statistics' => $stats,
            'statusOptions' => [
                ['value' => 'all', 'label' => 'Semua Status'],
                ['value' => '1', 'label' => 'Aktif'],
                ['value' => '0', 'label' => 'Nonaktif'],
            ],
            'ketOptions' => [
                ['value' => 'all', 'label' => 'Semua Jenis'],
                ['value' => 'mhs', 'label' => 'Mahasiswa'],
                ['value' => 'dsn', 'label' => 'Dosen / Staff'],
            ],
            'kategoriOptions' => [
                ['value' => 'all', 'label' => 'Semua Kategori'],
                ['value' => 'aktif', 'label' => 'Aktif (< 7 hari)'],
                ['value' => 'jarang', 'label' => 'Jarang (7-30 hari)'],
                ['value' => 'tidak_aktif', 'label' => 'Tidak Aktif (> 30 hari)'],
                ['value' => 'belum_pernah', 'label' => 'Belum Pernah Digunakan'],
            ],
            'tahunOptions' => range(date('Y'), date('Y') - 10, -1),
        ]);
    }
}
