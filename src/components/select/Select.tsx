import {Select as ShadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

type SelectProps<T> = {
    options: Array<{
        label: string;
        value: T;
        disabled?: boolean;
    }>;
    onChange: (value: T) => void;
    placeholder?: string;
    className?: string;
    value?: T;
}

export function Select<T extends string>({options, onChange, placeholder = 'Select', className, value}: SelectProps<T>) {
    return (
        <ShadSelect value={value} onValueChange={onChange}>
            <SelectTrigger className={`${className} hover:bg-input/50`}>
                <SelectValue placeholder={placeholder}/>
            </SelectTrigger>

            <SelectContent>
                {options.map((option) => (
                    <SelectItem disabled={option.disabled} key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </ShadSelect>
    )
}