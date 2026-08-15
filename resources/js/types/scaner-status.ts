import { Ban, CircleCheck, CircleHelp, OctagonX, type LucideIcon } from 'lucide-react';

export interface Histori {
    id: number;
    kode: string;
    waktu: string;
    id_tag: string;
    nama: string | null;
    nim: string | null;
    status: number; // 0: Blok, 1: Terbuka, 2: Tidak Terdaftar, 3: No Akses
    created_at: string;
    updated_at: string;
    status_label?: string;
}

// Helper function untuk mendapatkan label status
export const getStatusLabels = (): string[] => {
    return ["Blok", "Terbuka", "Tidak Terdaftar", "No Akses"];
};

// Helper function untuk mendapatkan label status berdasarkan angka
export const getStatusLabel = (status: number): string => {
    const statusLabels = getStatusLabels();
    return statusLabels[status] || "Unknown";
};

// Helper function untuk mendapatkan variant badge berdasarkan status
export const getStatusBadgeVariant = (status: number): "destructive" | "default" | "secondary" | "outline" => {
    switch (status) {
        case 0: // Blok
            return "destructive";
        case 1: // Terbuka
            return "default";
        case 2: // Tidak Terdaftar
            return "secondary";
        case 3: // No Akses
            return "outline";
        default:
            return "secondary";
    }
};

// Helper function untuk mendapatkan icon berdasarkan status
export const getStatusIcon = (status: number): LucideIcon => {
    switch (status) {
        case 0: // Blok
            return Ban;
        case 1: // Terbuka
            return CircleCheck;
        case 2: // Tidak Terdaftar
            return CircleHelp;
        case 3: // No Akses
            return OctagonX;
        default:
            return CircleHelp;
    }
};