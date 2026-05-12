import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    meta?: {
        from: number;
        to: number;
        total: number;
    };
}

export function Pagination({ links, meta }: PaginationProps) {
    if (links.length <= 3) return null;

    const renderLabel = (label: string) => {
        if (label.includes('pagination.previous') || label.includes('Previous') || label.includes('&laquo;')) {
            return <ChevronLeft className="h-4 w-4" />;
        }
        if (label.includes('pagination.next') || label.includes('Next') || label.includes('&raquo;')) {
            return <ChevronRight className="h-4 w-4" />;
        }
        return label;
    };

    return (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            {meta && (
                <div className="text-sm text-muted-foreground">
                    Menampilkan {meta.from} hingga {meta.to} dari {meta.total} hasil
                </div>
            )}
            <div className="flex flex-wrap gap-1">
                {links.map((link, index) => (
                    <Button
                        key={index}
                        variant={link.active ? 'default' : 'outline'}
                        size="sm"
                        disabled={!link.url}
                        onClick={() => link.url && router.get(link.url)}
                        className={!link.url ? 'opacity-50' : ''}
                    >
                        {typeof renderLabel(link.label) === 'string' ? (
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        ) : (
                            renderLabel(link.label)
                        )}
                    </Button>
                ))}
            </div>
        </div>
    );
}
