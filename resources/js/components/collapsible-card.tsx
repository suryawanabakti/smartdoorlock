import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState, type ReactNode } from 'react';

interface CollapsibleCardProps {
    title: string;
    description?: string;
    icon?: ReactNode;
    children: ReactNode;
    defaultOpen?: boolean;
    className?: string;
    contentClassName?: string;
}

export function CollapsibleCard({
    title,
    description,
    icon,
    children,
    defaultOpen = true,
    className,
    contentClassName,
}: CollapsibleCardProps) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <Collapsible open={open} onOpenChange={setOpen} className={cn('', className)}>
            <Card>
                <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer select-none">
                        <CardTitle className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-2">
                                {icon}
                                {title}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                title={open ? 'Minimalkan' : 'Perluas'}
                            >
                                <ChevronDown
                                    className={cn(
                                        'h-4 w-4 transition-transform duration-200',
                                        open ? 'rotate-180' : '',
                                    )}
                                />
                            </Button>
                        </CardTitle>
                        {description && (
                            <CardDescription>{description}</CardDescription>
                        )}
                    </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent className={cn('', contentClassName)}>
                        {children}
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}
