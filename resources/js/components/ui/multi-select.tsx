// components/ui/multi-select.tsx
import { Check, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export interface MultiSelectOption {
    value: string | number;
    label: string;
}

interface MultiSelectProps {
    options: MultiSelectOption[];
    value: MultiSelectOption[];
    onChange: (value: MultiSelectOption[]) => void;
    placeholder?: string;
    className?: string;
}

export function MultiSelect({
    options,
    value,
    onChange,
    placeholder = "Pilih opsi...",
    className
}: MultiSelectProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (selectedValue: string | number) => {
        const option = options.find(opt => opt.value === selectedValue);
        if (option && !value.find(v => v.value === selectedValue)) {
            onChange([...value, option]);
        }
        setOpen(false);
    };

    const handleRemove = (valueToRemove: string | number) => {
        onChange(value.filter(item => item.value !== valueToRemove));
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", className)}
                >
                    <div className="flex flex-wrap gap-1">
                        {value.length === 0 && (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                        {value.map((item) => (
                            <Badge
                                key={item.value}
                                variant="secondary"
                                className="mr-1"
                            >
                                {item.label}
                                <X
                                    className="ml-1 h-3 w-3 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(item.value);
                                    }}
                                />
                            </Badge>
                        ))}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Cari..." />
                    <CommandList>
                        <CommandEmpty>Opsi tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.label}
                                    onSelect={() => handleSelect(option.value)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value.find(v => v.value === option.value)
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}