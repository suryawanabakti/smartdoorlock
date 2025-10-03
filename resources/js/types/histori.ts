export interface Histori {
    id: number;
    kode: string;
    waktu: string;
    id_tag: string;
    nama: string | null;
    nim: string | null;
    status: number;
    created_at: string;
    updated_at: string;
    scanner?: ScanerStatus;
    status_label?: string;
}

export interface HistoriFilters {
    search?: string;
    status?: string;
    ruangan_id?: string;
    type?: string;
    tanggal_mulai?: string;
    tanggal_selesai?: string;
    jam_mulai?: string;
    jam_selesai?: string;
    kelas?: string;
    tahun_masuk?: string;
}

export interface HistoriStatistics {
    total: number;
    terbuka: number;
    blok: number;
    tidak_terdaftar: number;
    no_akses: number;
}