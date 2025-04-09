// packages/client/src/components/UI/DatePicker.tsx
'use client';

type DatePickerProps = {
    label: string;
    selected: string;
    onChange: (value: string) => void;
    className?: string;
};

export const DatePicker = ({
                               label,
                               selected,
                               onChange,
                               className
                           }: DatePickerProps) => {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
            </label>
            <input
                type="date"
                value={selected}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-700
          dark:border-gray-600 dark:text-gray-100 focus:ring-2
          focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
    );
};