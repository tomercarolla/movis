import {useMemo, useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {ChevronDown} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Label} from "@/components/ui/label.tsx";

type MultiSelectProps<T> = {
    options: T[];
    selectedValues: T[];
    onChange: (selected: T[]) => void;
    getOptionLabel: (option: T) => string;
    getOptionValue: (option: T) => string | number;
    placeholder?: string;
    widthClass?: string;
    emptyMessage?: string;
}

const triggerStyles = 'max-w-[200px] font-normal border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-input/30 hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50';

export function MultiSelect<T>({
                                   options,
                                   selectedValues,
                                   onChange,
                                   getOptionLabel,
                                   getOptionValue,
                                   placeholder = 'Select',
                                   emptyMessage = 'No options found',
                                   widthClass
                               }: MultiSelectProps<T>) {
    const [search, setSearch] = useState('');

    const isSelected = (option: T) =>
        selectedValues.some(item => getOptionValue(item) === getOptionValue(option));
    const toggleValue = (option: T) => {
        if (isSelected(option)) {
            onChange(selectedValues.filter(item => getOptionValue(item) !== getOptionValue(option)));
        } else {
            onChange([...selectedValues, option]);
        }
    }
    const clearAll = () => onChange([]);

    const filteredOptions = useMemo(() => {
        return options.filter(option => getOptionLabel(option).toLowerCase().includes(search.toLowerCase()));
    }, [search, options, getOptionLabel]);

    const selectedLabels = useMemo(() => {
        return selectedValues.map(getOptionLabel).join(', ');
    }, [selectedValues, getOptionLabel]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button role="combobox"
                        className={`${triggerStyles} ${selectedValues.length > 0 ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                    <span className='truncate'>
                        {selectedValues.length > 0 ? selectedLabels : placeholder}
                    </span>

                    <ChevronDown className="h-4 w-4 opacity-50"/>
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align='start'
                className={`${widthClass} w-fit rounded-md border text-popover-foreground shadow-md p-0 max-h-[300px] overflow-auto sm:max-h-[400px]`}
            >
                <div className='p-2 overflow-auto'>
                    <div className='mb-2'>
                        <Input placeholder='Search...'
                               value={search}
                               onChange={(e) => setSearch(e.target.value)}
                               className='h-8 flex-1'
                        />
                    </div>

                    <div>
                        {filteredOptions.length === 0 && (
                            <p className='text-sm text-muted-foreground px-2 py-1'>{emptyMessage}</p>
                        )}

                        {filteredOptions.map((option) => {
                                const selected = isSelected(option);
                                const id = String(getOptionValue(option));

                                return (
                                    <div
                                        className={`${selected ? 'bg-muted' : ''} flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-muted`}>
                                        <Checkbox id={id} onCheckedChange={() => toggleValue(option)}/>
                                        <Label htmlFor={id} className='text-md'>{getOptionLabel(option)}</Label>
                                    </div>
                                );
                            }
                        )}
                    </div>
                    {selectedValues.length > 0 && (
                        <div className='mt-2 border-t pt-2'>
                            <Button variant='secondary' size='sm' onClick={clearAll} className='w-full'>
                                Clear All
                            </Button>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
                                        