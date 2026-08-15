import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface StatCardProps {
    title: string;
    value: number;
    description?: string;
    icon?: React.ReactNode;
    className?: string;
}

export function StatCard({
    title,
    value,
    description,
    icon,
    className,
}: StatCardProps) {
    const [open, setOpen] = useState(true);

    return (
        <Collapsible open={open} onOpenChange={setOpen} className={cn('', className)}>
            <Card>
                <CollapsibleTrigger asChild>
                    <CardHeader className="flex cursor-pointer select-none flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{title}</CardTitle>
                        <div className="flex items-center gap-1">
                            {icon}
                            <ChevronDown
                                className={cn(
                                    'h-4 w-4 text-muted-foreground transition-transform duration-200',
                                    open ? 'rotate-180' : '',
                                )}
                            />
                        </div>
                    </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent>
                        <div className="text-2xl font-bold">{value}</div>
                        {description && (
                            <p className="text-xs text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}
