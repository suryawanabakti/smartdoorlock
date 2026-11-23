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
    showSelectAll?: boolean;
    selectAllText?: string;
    clearAllText?: string;
}

export function MultiSelect({
    options,
    value,
    onChange,
    placeholder = "Pilih opsi...",
    className,
    showSelectAll = true,
    selectAllText = "Pilih Semua",
    clearAllText = "Hapus Semua"
}: MultiSelectProps) {
    const [open, setOpen] = useState(false);

    const isAllSelected = options.length > 0 && value.length === options.length;

    const handleSelect = (selectedValue: string | number) => {
        const option = options.find(opt => opt.value === selectedValue);
        if (!option) return;

        const isAlreadySelected = value.some(v => v.value === selectedValue);
        if (isAlreadySelected) {
            onChange(value.filter(item => item.value !== selectedValue));
        } else {
            onChange([...value, option]);
        }
    };

    const handleSelectAll = () => {
        onChange([...options]);
    };

    const handleClearAll = () => {
        onChange([]);
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
                    className={cn("w-full justify-between min-h-10 h-auto py-2", className)}
                >
                    <div className="flex flex-wrap gap-1 text-left">
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
                                    style={{ pointerEvents: 'auto' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(item.value);
                                    }}
                                />
                            </Badge>
                        ))}
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[280px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Cari..." />
                    {showSelectAll && options.length > 0 && (
                        <div className="flex items-center justify-between border-b px-3 py-2 text-xs">
                            <span className="text-muted-foreground">
                                {value.length} dari {options.length} dipilih
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={isAllSelected ? handleClearAll : handleSelectAll}
                                    className="font-medium text-primary hover:underline"
                                >
                                    {isAllSelected ? clearAllText : selectAllText}
                                </button>
                                {!isAllSelected && value.length > 0 && (
                                    <>
                                        <span className="text-muted-foreground">•</span>
                                        <button
                                            type="button"
                                            onClick={handleClearAll}
                                            className="text-muted-foreground hover:text-destructive hover:underline"
                                        >
                                            {clearAllText}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    <CommandList>
                        <CommandEmpty>Opsi tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = value.some(v => v.value === option.value);
                                return (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        onSelect={() => handleSelect(option.value)}
                                        className="cursor-pointer"
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <span>{option.label}</span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}