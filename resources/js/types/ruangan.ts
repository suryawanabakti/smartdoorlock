import { Mahasiswa } from "./mahasiswa";
import { ScanerStatus } from "./scaner-status";

export interface Ruangan {
    id: number;
    nama_ruangan: string | null;
    type: 'umum' | 'kelas' | 'lab';
    open_api: boolean;
    kode: string | null;
    pin: string | null;
    pin_active: boolean;
    parent_id: number | null;
    jam_buka: string;
    jam_tutup: string;
    max_register: number;
    mahasiswa_id: number | null;
    penanggung_jawab: string | null;
    created_at: string;
    updated_at: string;
    parent?: Ruangan;
    mahasiswa?: any;
    scaner_statuses?: ScanerStatus[];
    mahasiswas?: Mahasiswa[];
    penjaga_ruangans?: any[];
    mahasiswa_penanggung_jawab?: Mahasiswa;
}

export interface RuanganShowData {
    ruangan: Ruangan;
    statistics: {
        total_scanners: number;
        scanners_dalam: number;
        scanners_luar: number;
        total_mahasiswa: number;
        total_penjaga: number;
        total_scan_24jam: number;
    };
}