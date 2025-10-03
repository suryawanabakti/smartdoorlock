// components/Calendar.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarProps } from '@/types/hak-akses';
import { Link, router } from '@inertiajs/react';
import {
    Building,
    Calendar as CalendarIcon,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Trash2,
} from 'lucide-react';
import React, { useState } from 'react';

const Calendar: React.FC<CalendarProps> = ({
    year,
    month,
    weeks,
    monthName,
    previousMonth,
    nextMonth,
}) => {
    const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [confirmText, setConfirmText] = useState('');

    const getHakAksesVariant = (approved: number, pending: number) => {
        if (approved > 0 && pending === 0) return 'success';
        if (pending > 0) return 'warning';
        return 'secondary';
    };

    const getHakAksesText = (approved: number, pending: number) => {
        if (approved > 0 && pending > 0) return `${approved}✓ ${pending}⏳`;
        if (approved > 0) return `${approved}✓`;
        if (pending > 0) return `${pending}⏳`;
        return '';
    };

    const openDeleteModal = (date: string) => {
        setSelectedDate(date);
        setConfirmText('');
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedDate('');
        setConfirmText('');
    };

    const handleDeleteByDate = () => {
        if (confirmText === 'HAPUS SEMUA HAK AKSES') {
            router.delete('/hak-akses/destroy-by-date', {
                data: {
                    tanggal: selectedDate,
                    confirm_text: 'HAPUS SEMUA HAK AKSES',
                },
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal();
                },
            });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getTotalHakAksesByDate = (date: string) => {
        const day = weeks.flat().find((d) => d.date === date);
        return day ? day.hak_akses.count : 0;
    };

    return (
        <>
            <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-2xl font-bold text-foreground">
                        {monthName} {year}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link
                                href={`/calendar?year=${previousMonth.year}&month=${previousMonth.month}`}
                                preserveScroll
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link
                                href={`/calendar?year=${nextMonth.year}&month=${nextMonth.month}`}
                                preserveScroll
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Days of Week Header */}
                    <div className="mb-2 grid grid-cols-7 gap-1">
                        {daysOfWeek.map((day) => (
                            <div
                                key={day}
                                className="py-2 text-center text-sm font-medium text-muted-foreground"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {weeks.map((week, weekIndex) =>
                            week.map((day, dayIndex) => {
                                // Skip empty days di akhir bulan jika tidak ada tanggal
                                if (!day.date) {
                                    return (
                                        <div
                                            key={`empty-${weekIndex}-${dayIndex}`}
                                            className="min-h-[120px] rounded-lg border border-transparent p-2"
                                        />
                                    );
                                }

                                const totalHakAkses = day.hak_akses.count;
                                const hasHakAkses = totalHakAkses > 0;

                                return (
                                    <div
                                        key={`${weekIndex}-${dayIndex}`}
                                        className={`min-h-[120px] rounded-lg border p-2 transition-colors ${
                                            day.is_current_month
                                                ? 'border-border bg-background hover:bg-accent/50'
                                                : 'border-muted bg-muted/30 text-muted-foreground'
                                        } ${day.is_today ? 'ring-2 ring-primary ring-offset-1' : ''} `}
                                    >
                                        {/* Date Number dan Tombol Hapus */}
                                        <div className="mb-1 flex items-start justify-between">
                                            <span
                                                className={`text-sm font-medium ${day.is_today ? 'text-primary' : ''} ${!day.is_current_month ? 'text-muted-foreground/50' : ''} `}
                                            >
                                                {new Date(day.date).getDate()}
                                            </span>

                                            <div className="flex items-center gap-1">
                                                {/* Badge Hak Akses */}
                                                {hasHakAkses && (
                                                    <Badge
                                                        variant={getHakAksesVariant(
                                                            day.hak_akses
                                                                .approved,
                                                            day.hak_akses
                                                                .pending,
                                                        )}
                                                        className="h-5 text-xs"
                                                    >
                                                        {getHakAksesText(
                                                            day.hak_akses
                                                                .approved,
                                                            day.hak_akses
                                                                .pending,
                                                        )}
                                                    </Badge>
                                                )}

                                                {/* Tombol Hapus - hanya tampil jika ada hak akses */}
                                                {hasHakAkses && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                day.date!,
                                                            )
                                                        }
                                                        title={`Hapus semua hak akses pada ${formatDate(day.date!)}`}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Hak Akses List */}
                                        <div className="max-h-[70px] space-y-1 overflow-y-auto">
                                            {day.hak_akses.items.map(
                                                (hakAkses) => (
                                                    <Button
                                                        key={hakAkses.id}
                                                        variant="ghost"
                                                        size="sm"
                                                        className={`h-auto w-full justify-start p-1 text-xs ${
                                                            hakAkses.is_approve
                                                                ? 'text-green-600 hover:bg-green-50 hover:text-green-700'
                                                                : 'text-amber-600 hover:bg-amber-50 hover:text-amber-700'
                                                        } `}
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/hak-akses/${hakAkses.id}`}
                                                            className="flex items-center gap-1"
                                                        >
                                                            {hakAkses.is_approve ? (
                                                                <CheckCircle2 className="h-3 w-3" />
                                                            ) : (
                                                                <Clock className="h-3 w-3" />
                                                            )}
                                                            <Building className="h-3 w-3" />
                                                            <span
                                                                className="truncate"
                                                                title={
                                                                    hakAkses
                                                                        .ruangan
                                                                        .nama
                                                                }
                                                            >
                                                                {
                                                                    hakAkses
                                                                        .ruangan
                                                                        .nama
                                                                }
                                                            </span>
                                                        </Link>
                                                    </Button>
                                                ),
                                            )}
                                        </div>

                                        {/* Placeholder untuk hari tanpa hak akses */}
                                        {!hasHakAkses &&
                                            day.is_current_month && (
                                                <div className="flex h-[70px] items-center justify-center text-muted-foreground/50">
                                                    <span className="text-xs">
                                                        Tidak ada hak akses
                                                    </span>
                                                </div>
                                            )}
                                    </div>
                                );
                            }),
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Modal */}
            <Dialog open={showDeleteModal} onOpenChange={closeDeleteModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <Trash2 className="h-5 w-5" />
                            Hapus Semua Hak Akses
                        </DialogTitle>
                        <DialogDescription className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <CalendarIcon className="h-4 w-4" />
                                <span>{formatDate(selectedDate)}</span>
                            </div>
                            <div>
                                Anda akan menghapus{' '}
                                <strong>
                                    semua {getTotalHakAksesByDate(selectedDate)}{' '}
                                    hak akses
                                </strong>{' '}
                                pada tanggal tersebut.
                                <br />
                                <strong className="text-destructive">
                                    Tindakan ini tidak dapat dibatalkan.
                                </strong>
                            </div>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="confirm-text">
                                Ketik <strong>HAPUS SEMUA HAK AKSES</strong>{' '}
                                untuk konfirmasi
                            </Label>
                            <Input
                                id="confirm-text"
                                value={confirmText}
                                onChange={(e) =>
                                    setConfirmText(e.target.value.toUpperCase())
                                }
                                placeholder="HAPUS SEMUA HAK AKSES"
                                className="font-medium tracking-wide uppercase"
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeDeleteModal}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDeleteByDate}
                            disabled={confirmText !== 'HAPUS SEMUA HAK AKSES'}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus Semua ({getTotalHakAksesByDate(selectedDate)})
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Calendar;
