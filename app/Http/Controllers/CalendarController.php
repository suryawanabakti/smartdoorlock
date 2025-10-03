<?php

namespace App\Http\Controllers;

use App\Models\HakAkses;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CalendarController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->input('year', now()->year);
        $month = $request->input('month', now()->month);

        // Tanggal awal dan akhir bulan yang dipilih
        $currentMonthStart = Carbon::create($year, $month, 1)->startOfMonth();
        $currentMonthEnd = $currentMonthStart->copy()->endOfMonth();

        // Load hak akses data untuk bulan yang dipilih
        $hakAksesData = HakAkses::with('ruangan')
            ->whereBetween('tanggal', [$currentMonthStart, $currentMonthEnd]);
        if (auth()->user()->role == 'penjaga') {
            $user = auth()->user();
            $ruanganIds = $user->ruangans->pluck('id');
            $hakAksesData->whereIn('ruangan_id', $ruanganIds);
        }
        $hakAksesData = $hakAksesData->get()
            ->groupBy(function ($item) {
                // Normalisasi format tanggal ke Y-m-d
                return Carbon::parse($item->tanggal)->format('Y-m-d');
            })
            ->map(function ($items) {
                return [
                    'count' => $items->count(),
                    'approved' => $items->where('is_approve', true)->count(),
                    'pending' => $items->where('is_approve', false)->count(),
                    'items' => $items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'ruangan_id' => $item->ruangan_id,
                            'ruangan' => [
                                'id' => $item->ruangan->id,
                                'nama' => $item->ruangan->nama_ruangan ?? 'Ruangan Tidak Diketahui',
                            ],
                            'tanggal' => $item->tanggal,
                            'jam_masuk' => $item->jam_masuk,
                            'jam_keluar' => $item->jam_keluar,
                            'is_approve' => $item->is_approve,
                            'is_by_admin' => $item->is_by_admin,
                            'tujuan' => $item->tujuan,
                            'skill' => $item->skill,
                            'additional_participant' => $item->additional_participant,
                            'max_register' => $item->max_register,
                            'created_at' => $item->created_at,
                            'updated_at' => $item->updated_at,
                        ];
                    }),
                ];
            });

        // Build calendar weeks - mulai dari hari Minggu minggu pertama
        $firstDayOfMonth = $currentMonthStart->copy();
        $lastDayOfMonth = $currentMonthEnd->copy();

        // Mulai dari hari Minggu di minggu pertama bulan
        $startDate = $firstDayOfMonth->copy()->startOfWeek(Carbon::SUNDAY);
        // Sampai hari Sabtu di minggu terakhir bulan
        $endDate = $lastDayOfMonth->copy()->endOfWeek(Carbon::SATURDAY);

        $weeks = [];
        $currentDate = $startDate->copy();

        // Loop melalui setiap minggu
        while ($currentDate <= $endDate) {
            $week = [];

            // Loop melalui 7 hari dalam seminggu
            for ($i = 0; $i < 7; $i++) {
                $dateString = $currentDate->format('Y-m-d');
                $isCurrentMonth = $currentDate->month == $month;

                // Cari hak akses untuk tanggal ini
                $hakAkses = $hakAksesData->get($dateString, [
                    'count' => 0,
                    'approved' => 0,
                    'pending' => 0,
                    'items' => [],
                ]);

                $week[] = [
                    'date' => $dateString,
                    'is_current_month' => $isCurrentMonth,
                    'is_today' => $currentDate->isToday(),
                    'hak_akses' => $hakAkses,
                ];

                $currentDate->addDay();
            }

            $weeks[] = $week;
        }

        $previousMonth = Carbon::create($year, $month, 1)->subMonth();
        $nextMonth = Carbon::create($year, $month, 1)->addMonth();

        return Inertia::render('Calendar/Index', [
            'calendar' => [
                'year' => (int) $year,
                'month' => (int) $month,
                'weeks' => $weeks,
                'monthName' => Carbon::create($year, $month, 1)->translatedFormat('F Y'),
                'previousMonth' => [
                    'year' => $previousMonth->year,
                    'month' => $previousMonth->month,
                ],
                'nextMonth' => [
                    'year' => $nextMonth->year,
                    'month' => $nextMonth->month,
                ],
            ],
        ]);
    }
}
