import { Button } from '@/components/ui/button';
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
import { useState } from 'react';

interface DeleteAllByDateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (tanggal: string) => void;
    selectedDate: string;
}

const DeleteAllByDateModal: React.FC<DeleteAllByDateModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    selectedDate,
}) => {
    const [confirmText, setConfirmText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (confirmText === 'HAPUS SEMUA HAK AKSES') {
            onConfirm(selectedDate);
            setConfirmText('');
            onClose();
        }
    };

    const handleClose = () => {
        setConfirmText('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-destructive">
                        Hapus Semua Hak Akses
                    </DialogTitle>
                    <DialogDescription>
                        Anda akan menghapus <strong>semua hak akses</strong>{' '}
                        pada tanggal <strong>{selectedDate}</strong>. Tindakan
                        ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="confirm-text">
                                Ketik <strong>HAPUS SEMUA HAK AKSES</strong>{' '}
                                untuk konfirmasi
                            </Label>
                            <Input
                                id="confirm-text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder="HAPUS SEMUA HAK AKSES"
                                className="uppercase"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={confirmText !== 'HAPUS SEMUA HAK AKSES'}
                        >
                            Hapus Semua
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteAllByDateModal;
