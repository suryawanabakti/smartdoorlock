import MahasiswaIndex from '@/pages/Mahasiswa/Index';

export default function DosenIndex(props: any) {
    // Reuse MahasiswaIndex but present it as Dosen listing
    return <MahasiswaIndex {...props} />;
}
