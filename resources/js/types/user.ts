import { Ruangan } from "./ruangan";

export interface User {
    id: number;
    name: string;
    email: string;
    nowa: string | null;
    email_notifikasi: string | null;
    role: 'super' | 'admin' | 'penjaga' | 'mahasiswa';
    image: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    ruangans?: Ruangan[];
    image_url?: string;
}

export interface UserFormData {
    name: string;
    email: string;
    email_notifikasi?: string;
    password?: string;
    password_confirmation?: string;
    role: 'super' | 'admin' | 'penjaga' | 'mahasiswa';
    nowa?: string;
    image?: File | null;
    ruangan_ids?: number[];
}