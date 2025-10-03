export interface HakAkses {
    id: number;
    ruangan_id: number;
    tanggal: string;
    jam_masuk: string;
    jam_keluar: string;
    is_approve: boolean;
    is_by_admin: boolean;
    tujuan: string;
    skill?: string;
    additional_participant?: string;
    max_register: number;
    created_at: string;
    updated_at: string;
    ruangan?: Ruangan;
    mahasiswas?: Mahasiswa[];
    status?: string;
    total_peserta?: number;
    kuota_tersedia?: number;
}

export interface HakAksesFormData {
    ruangan_id: number;
    tanggal: string;
    jam_masuk: string;
    jam_keluar: string;
    is_approve: boolean;
    is_by_admin: boolean;
    tujuan: string;
    skill?: string;
    additional_participant?: string;
    max_register: number;
    mahasiswa_ids?: number[];
}

export interface HakAksesMahasiswa {
    id: number;
    mahasiswa_id: number;
    hak_akses_id: number;
    created_at: string;
    updated_at: string;
    mahasiswa?: Mahasiswa;
}