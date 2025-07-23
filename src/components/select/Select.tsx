import {Select as ShadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

type SelectProps<T> = {
    options: Array<{
        label: string;
        value: T;
    }>;
    onChange: (value: T) => void;
    defaultValue?: T;
    placeholder?: string;
}

export function Select<T extends string>({options, onChange, defaultValue, placeholder = 'Select'}: SelectProps<T>) {
    return (
        <ShadSelect defaultValue={defaultValue?.toString()} onValueChange={onChange}>
            <SelectTrigger className='hover:bg-input/50'>
                <SelectValue placeholder={placeholder}/>
            </SelectTrigger>

            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </ShadSelect>
    )
}