import { User } from ".";
import { Ruangan } from "./ruangan";

export interface Mahasiswa {
    id: number;
    user_id: number | null;
    id_tag: string | null;
    nama: string;
    nim: string;
    pin: string | null;
    ruangan_id: number | null;
    ket: 'mhs' | 'dsn';
    status: number;
    tahun_masuk: number;
    created_at: string;
    updated_at: string;
    user?: User;
    ruangan?: Ruangan;
}

export interface Mahasiswa {
  id: number;
  nama: string;
  nim: string;
  id_tag: string;
}

export interface Ruangan {
  id: number;
  nama: string;
  kode: string;
}

export interface HakAkses {
  id: number;
  ruangan_id: number;
  tanggal: string;
  jam_masuk: string;
  jam_keluar: string;
  is_approve: boolean;
  tujuan: string;
  ruangan: Ruangan;
  status: string;
  jadwal: string;
}

export interface Absensi {
  id: number;
  id_tag: string;
  nama: string;
  nim: string;
  tahun: string;
  ruangan_id: number;
  waktu_masuk: string;
  waktu_keluar: string | null;
  ruangan: Ruangan;
  status: string;
  durasi: string | null;
}

export interface DashboardStatistics {
  hak_akses_disetujui: number;
  hak_akses_menunggu: number;
  total_absensi: number;
  absensi_hari_ini: number;
}

export interface DashboardData {
  statistics: DashboardStatistics;
  hakAksesDisetujui: HakAkses[];
  aktivitasTerkini: Absensi[];
  mahasiswa: Mahasiswa;
}

export interface MahasiswaFormData {
    user_id?: number | null;
    id_tag?: string;
    nama: string;
    nim: string;
    pin?: string;
    ruangan_id?: number | null;
    ket: 'mhs' | 'dsn';
    status: boolean;
    tahun_masuk: number;
    create_user?: boolean;
    email?: string;
    password?: string;
}