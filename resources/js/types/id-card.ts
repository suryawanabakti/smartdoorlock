export interface IdCard {
    id: number;
    id_tag: string;
    nama: string;
    nim: string;
    ket: 'mhs' | 'dsn';
    status: number;
    tahun_masuk: number;
    ruangan_nama: string | null;
    total_scan: number;
    total_absensi: number;
    last_scan: string | null;
    last_absensi: string | null;
    hari_sejak_scan: number | null;
    hari_sejak_absensi: number | null;
    kategori_penggunaan: 'aktif' | 'jarang' | 'tidak_aktif' | 'belum_pernah';
}

export interface IdCardStatistics {
    total_cards: number;
    cards_with_tag: number;
    cards_without_tag: number;
    aktif: number;
    jarang: number;
    tidak_aktif: number;
    belum_pernah: number;
}
