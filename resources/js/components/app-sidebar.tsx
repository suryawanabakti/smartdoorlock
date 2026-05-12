import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Building,
    Calendar,
    ClipboardCheck,
    DoorOpen,
    Folder,
    GraduationCap,
    History,
    Key,
    LayoutDashboard,
    ScanLine,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'Ruangan',
        href: '/ruangans',
        icon: DoorOpen,
    },
    {
        title: 'Penjaga',
        href: '/users',
        icon: Users,
    },
    {
        title: 'Mahasiswa',
        href: '/mahasiswas?ket=mhs',
        icon: GraduationCap,
    },
    {
        title: 'Dosen',
        href: '/mahasiswas?ket=dsn',
        icon: BookOpen,
    },
    {
        title: 'Scanner',
        href: '/scaner-status',
        icon: ScanLine,
    },
    {
        title: 'Hak Akses',
        href: '/hak-akses',
        icon: Key,
    },
    {
        title: 'Riwayat',
        href: '/histori',
        icon: History,
    },
    {
        title: 'Absensi',
        href: '/absensi',
        icon: ClipboardCheck,
    },
    {
        title: 'Calendar',
        href: '/calendar',
        icon: Calendar,
    },
];

const penjagaNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/penjaga/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Hak Akses',
        href: '/penjaga/hak-akses',
        icon: Key,
    },
    {
        title: 'Ruangan',
        href: '/penjaga/ruangan',
        icon: Building,
    },
    {
        title: 'Riwayat',
        href: '/penjaga/histori',
        icon: History,
    },
    {
        title: 'Calendar',
        href: '/calendar',
        icon: Calendar,
    },
];

const mahasiswaNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/mahasiswa/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Hak Akses',
        href: '/mahasiswa/hak-akses',
        icon: Key,
    },
];

const footerNavItems: NavItem[] = [

];

export function AppSidebar() {
    const page = usePage<SharedData>();
    const { auth } = page.props;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {auth.user.role === 'admin' && (
                    <NavMain items={adminNavItems} title="Menu Admin" />
                )}
                {auth.user.role === 'penjaga' && (
                    <NavMain items={penjagaNavItems} title="Menu Penjaga" />
                )}
                {auth.user.role === 'mahasiswa' && (
                    <NavMain items={mahasiswaNavItems} title="Menu Mahasiswa" />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
