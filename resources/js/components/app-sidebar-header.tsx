import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { usePage, Link } from '@inertiajs/react';
import { Bell, Check } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage<any>().props;
    const notifications = auth.user?.unreadNotifications || [];

    const markAsRead = async (id: string, url: string) => {
        try {
            await axios.post(`/notifications/${id}/mark-as-read`);
            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error('Failed to mark notification as read', error);
            if (url) {
                window.location.href = url;
            }
        }
    };

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <div className="hidden md:block">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            {notifications.length > 0 && (
                                <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-600"></span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel className="flex items-center justify-between">
                            <span>Notifikasi</span>
                            {notifications.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                    {notifications.length} Baru
                                </Badge>
                            )}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        <div className="max-h-[300px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    Tidak ada notifikasi baru.
                                </div>
                            ) : (
                                notifications.map((notification: any) => (
                                    <DropdownMenuItem
                                        key={notification.id}
                                        className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                                        onClick={() => markAsRead(notification.id, notification.data.url)}
                                    >
                                        <div className="flex w-full items-center justify-between">
                                            <span className="font-semibold text-sm">
                                                {notification.data.title}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {new Date(notification.created_at).toLocaleDateString('id-ID')}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted-foreground line-clamp-2">
                                            {notification.data.message}
                                        </span>
                                    </DropdownMenuItem>
                                ))
                            )}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
