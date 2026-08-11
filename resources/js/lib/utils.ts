import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Cek apakah hak akses sudah berakhir.
 * Bandingkan gabungan tanggal + jam_keluar dengan waktu sekarang,
 * bukan hanya tanggalnya saja (agar hari ini yang masih berlangsung tidak dianggap lewat).
 */
export function isHakAksesPast(tanggal: string, jamKeluar: string): boolean {
    const [hours, minutes] = jamKeluar.split(':').map(Number);
    const end = new Date(tanggal);
    end.setHours(hours, minutes, 0, 0);

    return end < new Date();
}
