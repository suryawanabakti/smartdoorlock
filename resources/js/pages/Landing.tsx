import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLogoIcon from '@/components/app-logo-icon';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Building,
    Calendar,
    CheckCircle,
    Fingerprint,
    GraduationCap,
    LayoutDashboard,
    LogIn,
    Scan,
    Shield,
    Smartphone,
    UserPlus,
    Users,
} from 'lucide-react';

const features = [
    {
        icon: Fingerprint,
        title: 'Kontrol Akses Cerdas',
        description:
            'Atur izin akses ruangan berdasarkan peran dan jadwal. Setiap pintu dikontrol secara real-time dengan sistem keamanan berlapis.',
    },
    {
        icon: Scan,
        title: 'Integrasi Scanner RFID/NFC',
        description:
            'Check-in dan check-out melalui scanner pintu dengan kartu RFID atau NFC. Data tercatat otomatis dan akurat.',
    },
    {
        icon: LayoutDashboard,
        title: 'Monitoring & Laporan',
        description:
            'Pantau histori akses, rekap absensi, dan statistik penggunaan ruangan secara real-time dengan dashboard interaktif.',
    },
    {
        icon: Users,
        title: 'Manajemen Multi-Role',
        description:
            'Dukungan penuh untuk Admin, Penjaga, dan Mahasiswa dengan hak akses dan tampilan yang berbeda sesuai peran.',
    },
    {
        icon: Smartphone,
        title: 'Notifikasi WhatsApp',
        description:
            'Pemberitahuan otomatis via WhatsApp untuk persetujuan akses, jadwal, dan aktivitas penting lainnya.',
    },
    {
        icon: Calendar,
        title: 'Jadwal Ruangan Terpadu',
        description:
            'Kalender akses ruangan yang terorganisir dengan tampilan mingguan dan bulanan untuk memudahkan perencanaan.',
    },
];

const steps = [
    {
        number: '01',
        title: 'Daftar & Verifikasi',
        description: 'Buat akun sebagai Mahasiswa, Dosen, atau Penjaga. Admin akan memverifikasi data Anda.',
    },
    {
        number: '02',
        title: 'Ajukan atau Atur Akses',
        description: 'Ajukan permintaan akses ruangan atau atur jadwal akses untuk mahasiswa sesuai kebutuhan.',
    },
    {
        number: '03',
        title: 'Scan & Masuk',
        description: 'Gunakan kartu RFID/NFC Anda di scanner pintu untuk mengakses ruangan yang telah diizinkan.',
    },
];

export default function Landing() {
    const { auth, name } = usePage<SharedData>().props;
    const isAuthenticated = !!auth.user;

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <>
            <Head title="Smart Door Lock System">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex min-h-screen flex-col">
                {/* Navigation */}
                <header className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center">
                                <AppLogoIcon className="size-10 fill-current text-primary" />
                            </div>
                            <span className="hidden text-lg font-bold text-foreground sm:block">
                                {name}
                            </span>
                        </Link>

                        <div className="flex items-center gap-3">
                            {isAuthenticated ? (
                                <Link href={dashboard()}>
                                    <Button variant="default" size="sm">
                                        <LayoutDashboard className="mr-1 size-4" />
                                        Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={login()}>
                                        <Button variant="ghost" size="sm">
                                            <LogIn className="mr-1 size-4" />
                                            Masuk
                                        </Button>
                                    </Link>
                                    <Link href={register()}>
                                        <Button variant="default" size="sm">
                                            <UserPlus className="mr-1 size-4" />
                                            Daftar
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
                    {/* Background decoration */}
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
                        <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl" />
                        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
                    </div>

                    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            {/* Left content */}
                            <div className="text-center lg:text-left">
                                <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                                    <Shield className="mr-2 size-4" />
                                    Smart Door Lock System v2.0
                                </div>
                                <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                    Sistem Keamanan &amp; Manajemen Akses{' '}
                                    <span className="text-primary">Ruangan Cerdas</span>
                                </h1>
                                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
                                    Solusi terintegrasi untuk manajemen akses ruangan kampus berbasis
                                    RFID/NFC. Kelola izin akses, pantau kehadiran, dan amankan setiap
                                    ruangan dengan teknologi pintar.
                                </p>
                                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                                    {isAuthenticated ? (
                                        <Link href={dashboard()}>
                                            <Button
                                                variant="default"
                                                size="lg"
                                                className="w-full sm:w-auto"
                                            >
                                                <LayoutDashboard className="mr-2 size-5" />
                                                Buka Dashboard
                                                <ArrowRight className="ml-2 size-4" />
                                            </Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href={register()}>
                                                <Button
                                                    variant="default"
                                                    size="lg"
                                                    className="w-full sm:w-auto"
                                                >
                                                    <UserPlus className="mr-2 size-5" />
                                                    Daftar Sekarang
                                                    <ArrowRight className="ml-2 size-4" />
                                                </Button>
                                            </Link>
                                            <Link href={login()}>
                                                <Button
                                                    variant="outline"
                                                    size="lg"
                                                    className="w-full sm:w-auto"
                                                >
                                                    <LogIn className="mr-2 size-5" />
                                                    Masuk
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground lg:justify-start">
                                    <span className="flex items-center gap-1.5">
                                        <CheckCircle className="size-4 text-green-500" />
                                        Real-time
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <CheckCircle className="size-4 text-green-500" />
                                        Multi-Role
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <CheckCircle className="size-4 text-green-500" />
                                        Terintegrasi
                                    </span>
                                </div>
                            </div>

                            {/* Right illustration */}
                            <div className="relative hidden lg:block">
                                <div className="relative mx-auto aspect-square max-w-md">
                                    <div className="flex h-full w-full items-center justify-center">
                                        <div className="relative">
                                            {/* Decorative circles */}
                                            <div className="absolute -inset-20 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent blur-2xl" />
                                            <div className="relative flex h-80 w-80 items-center justify-center rounded-2xl border border-border bg-card shadow-2xl">
                                                <div className="flex flex-col items-center gap-4 p-8 text-center">
                                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                                                        <Building className="size-10 text-primary" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-foreground">
                                                        Smart Door Lock
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Sistem Manajemen Akses Ruangan
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                                            A
                                                        </div>
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                                                            P
                                                        </div>
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                                                            M
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Scan className="size-4 text-primary" />
                                                        RFID / NFC Enabled
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="border-y border-border/40 bg-muted/30">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                            {[
                                { label: 'Ruangan Terkelola', value: '50+' },
                                { label: 'Pengguna Aktif', value: '500+' },
                                { label: 'Transaksi Harian', value: '1.000+' },
                                { label: 'Scanner Terpasang', value: '25+' },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                                    <div className="mt-1 text-sm text-muted-foreground">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Fitur Unggulan
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Berbagai fitur dirancang untuk memudahkan manajemen akses dan keamanan
                                ruangan kampus.
                            </p>
                        </div>
                        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature) => {
                                const Icon = feature.icon;
                                return (
                                    <Card
                                        key={feature.title}
                                        className="group transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
                                    >
                                        <CardHeader>
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                                <Icon className="size-6" />
                                            </div>
                                            <CardTitle className="mt-4 text-lg">
                                                {feature.title}
                                            </CardTitle>
                                            <CardDescription className="text-sm leading-relaxed">
                                                {feature.description}
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="bg-muted/30 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
                                Cara Kerja
                            </span>
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Mudah Digunakan dalam 3 Langkah
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Mulai menggunakan Smart Door Lock System dengan cepat dan mudah.
                            </p>
                        </div>
                        <div className="mt-16 grid gap-8 md:grid-cols-3">
                            {steps.map((step, index) => (
                                <div key={step.number} className="relative text-center">
                                    {index < steps.length - 1 && (
                                        <div className="absolute left-[60%] top-12 hidden h-0.5 w-[80%] bg-gradient-to-r from-primary/40 to-transparent md:block" />
                                    )}
                                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                                        <span className="text-3xl font-bold text-primary">
                                            {step.number}
                                        </span>
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold text-foreground">
                                        {step.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Roles Section */}
                <section id="roles" className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Untuk Semua Peran
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Dirancang untuk memenuhi kebutuhan setiap pengguna di lingkungan kampus.
                            </p>
                        </div>
                        <div className="mt-16 grid gap-8 md:grid-cols-3">
                            {[
                                {
                                    role: 'Admin',
                                    icon: Shield,
                                    desc: 'Kelola seluruh sistem, data master, laporan, dan konfigurasi akses ruangan.',
                                    color: 'text-red-500',
                                    bg: 'bg-red-100 dark:bg-red-900/20',
                                },
                                {
                                    role: 'Penjaga',
                                    icon: GraduationCap,
                                    desc: 'Pantau ruangan yang diawasi, setujui akses, dan lihat histori kehadiran.',
                                    color: 'text-amber-500',
                                    bg: 'bg-amber-100 dark:bg-amber-900/20',
                                },
                                {
                                    role: 'Mahasiswa',
                                    icon: Users,
                                    desc: 'Daftar akses ruangan, lihat jadwal, dan riwayat kehadiran pribadi.',
                                    color: 'text-emerald-500',
                                    bg: 'bg-emerald-100 dark:bg-emerald-900/20',
                                },
                            ].map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Card
                                        key={item.role}
                                        className="group text-center transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
                                    >
                                        <CardHeader>
                                            <div
                                                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${item.bg} ${item.color}`}
                                            >
                                                <Icon className="size-8" />
                                            </div>
                                            <CardTitle className="mt-4 text-xl">
                                                {item.role}
                                            </CardTitle>
                                            <CardDescription className="text-sm leading-relaxed">
                                                {item.desc}
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-primary py-20">
                    <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                            Siap Mengelola Akses Ruangan dengan Cerdas?
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
                            Bergabunglah dengan sistem manajemen akses ruangan terintegrasi untuk kampus
                            yang lebih aman dan efisien.
                        </p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            {isAuthenticated ? (
                                <Link href={dashboard()}>
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="w-full sm:w-auto"
                                    >
                                        <LayoutDashboard className="mr-2 size-5" />
                                        Buka Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={register()}>
                                        <Button
                                            variant="secondary"
                                            size="lg"
                                            className="w-full sm:w-auto"
                                        >
                                            <UserPlus className="mr-2 size-5" />
                                            Daftar Sekarang
                                            <ArrowRight className="ml-2 size-4" />
                                        </Button>
                                    </Link>
                                    <Link href={login()}>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="w-full border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
                                        >
                                            <LogIn className="mr-2 size-5" />
                                            Masuk
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-border/40 bg-background py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center">
                                    <AppLogoIcon className="size-8 fill-current text-primary" />
                                </div>
                                <span className="text-sm font-semibold text-foreground">{name}</span>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <Link href="/" className="hover:text-foreground">
                                    Beranda
                                </Link>
                                {!isAuthenticated && (
                                    <>
                                        <Link href={login()} className="hover:text-foreground">
                                            Masuk
                                        </Link>
                                        <Link href={register()} className="hover:text-foreground">
                                            Daftar
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} {name}. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
