import { Command as CommandPrimitive } from "cmdk";
import {useMemo, useState} from "react";
import {Popover, PopoverAnchor, PopoverContent} from "@/components/ui/popover.tsx";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../ui/command";
import {Skeleton} from "@/components/ui/skeleton.tsx";

type Props<T extends string> = {
    onSelectedValueChange: (value: T) => void;
    searchValue: string;
    onSearchValueChange: (value: string) => void;
    items: { value: T; label: string }[];
    isLoading?: boolean;
    emptyMessage?: string;
    placeholder?: string;
};

export function AutoComplete<T extends string>({
                                                   onSelectedValueChange,
                                                   searchValue,
                                                   onSearchValueChange,
                                                   items,
                                                   isLoading,
                                                   emptyMessage = "No items.",
                                                   placeholder = "Search...",
                                               }: Props<T>) {
    const [open, setOpen] = useState(false);

    const labels = useMemo(
        () =>
            items.reduce((acc, item) => {
                acc[item.value] = item.label;
                return acc;
            }, {} as Record<string, string>),
        [items]
    );

    const reset = () => {
        onSelectedValueChange("" as T);
        onSearchValueChange("");
    };

    const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!e.relatedTarget?.hasAttribute("cmdk-list")) {
            const matchedItem = Object.entries(labels).find(
                ([_, label]) => label === searchValue
            );

            if (!matchedItem) {
                reset();
            } else {
                onSelectedValueChange(matchedItem[0] as T);
            }
        }
    };

    const onSelectItem = (inputValue: string) => {
        onSelectedValueChange(inputValue as T);
        onSearchValueChange(labels[inputValue] ?? "");
        setOpen(false);
    };

    return (
        <div className="flex items-center">
            <Popover open={open} onOpenChange={setOpen}>
                <Command>
                    <PopoverAnchor asChild>
                        <CommandInput
                            placeholder={placeholder}
                            value={searchValue}
                            onValueChange={onSearchValueChange}
                            onKeyDown={(e) => setOpen(e.key !== "Escape")}
                            onMouseDown={() => setOpen((open) => !!searchValue || !open)}
                            onFocus={() => setOpen(true)}
                            onBlur={onInputBlur}
                        />
                    </PopoverAnchor>
                    {!open && <CommandList aria-hidden="true" className="hidden" />}
                    <PopoverContent
                        align='start'
                        asChild
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        onInteractOutside={(e) => {
                            if (
                                e.target instanceof Element &&
                                e.target.hasAttribute("cmdk-input")
                            ) {
                                e.preventDefault();
                            }
                        }}
                        className="w-[--radix-popover-trigger-width] p-0"
                    >
                        <CommandList>
                            {isLoading && (
                                <CommandPrimitive.Loading>
                                    <div className="p-1">
                                        <Skeleton className="h-6 w-full" />
                                    </div>
                                </CommandPrimitive.Loading>
                            )}
                            {items.length > 0 && !isLoading ? (
                                <CommandGroup>
                                    {items.map((option) => (
                                        <CommandItem
                                            className='cursor-pointer'
                                            key={option.value}
                                            value={option.value}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onSelect={onSelectItem}
                                        >
                                            {option.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            ) : null}
                            {!isLoading ? (
                                <CommandEmpty className='px-4 text-sm'>{emptyMessage ?? "No items."}</CommandEmpty>
                            ) : null}
                        </CommandList>
                    </PopoverContent>
                </Command>
            </Popover>
        </div>
    );
}