import type { Mahasiswa } from './mahasiswa';
import type { Ruangan } from './ruangan';

export interface Absensi {
    id: number;
    id_tag: string;
    nama: string | null;
    nim: string | null;
    tahun: string | null;
    ruangan_id: number | null;
    waktu_masuk: string | null;
    waktu_keluar: string | null;
    created_at: string;
    updated_at: string;
    ruangan?: Ruangan;
    user?: Mahasiswa;
    status?: string;
    durasi?: string;
    lama_akses_menit?: number;
}

export interface AbsensiFilters {
    search?: string;
    ruangan_id?: string;
    tahun?: string;
    status?: string;
    tanggal_mulai?: string;
    tanggal_selesai?: string;
    hari_ini?: boolean;
}