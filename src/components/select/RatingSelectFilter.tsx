import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

const ratingOptions = [
    {label: 'All ratings', value: 'all'},
    {label: '9+', value: '9'},
    {label: '8-8.9', value: '8'},
    {label: '7-7.9', value: '7'},
    {label: '6-6.9', value: '6'},
    {label: 'Below 6', value: 'below6'},
];

type RatingSelectFilterProps = {
    onChange: (value: string) => void;
}

export const ratingRanges: Record<string, (rating: number) => boolean> = {
    '9': (rating) => rating >= 9,
    '8': (rating) => rating >= 8 && rating < 9,
    '7': (rating) => rating >= 7 && rating < 8,
    '6': (rating) => rating >= 6 && rating < 7,
    'below6': (rating) => rating < 6,
    all: () => true,
};

export function RatingFilterSelect({onChange}: RatingSelectFilterProps) {
    return (
        <div className='w-40'>
            <Select defaultValue='all' onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder='Select rating'/>
                </SelectTrigger>

                <SelectContent>
                    {ratingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}