import { Absensi } from "./absensi";
import { HakAkses } from "./hak-akses";

export interface DashboardData {
    statistics: {
        absensi_hari_ini: number;
        sedang_akses: number;
        total_users: number;
        total_mahasiswa: number;
        total_dosen: number;
        total_penjaga: number;
        total_ruangan: number;
        ruangan_aktif: number;
        total_scanner: number;
        scanner_aktif: number;
        hak_akses_hari_ini: number;
    };
    charts: {
        absensi_7_hari: {
            labels: string[];
            data: number[];
        };
        absensi_per_ruangan: Array<{
            nama_ruangan: string;
            total: number;
        }>;
        user_status: {
            admin: number;
            super: number;
            penjaga: number;
            mahasiswa: number;
            dosen: number;
        };
    };
    aktivitas_terkini: Absensi[];
    hak_akses_mendatang: HakAkses[];
}