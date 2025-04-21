// packages/client/src/components/UI/DatePicker.tsx
'use client';

type DatePickerProps = {
    label: string;
    selected: string;
    onChangeAction: (value: string) => void;
    onBlur?: () => void;
    className?: string;
    hasError?: boolean;
};

export const DatePicker = ({
                               label,
                               selected,
                               onChangeAction,
                               onBlur,
                               className = '',
                               hasError = false
                           }: DatePickerProps) => {
    return (
        <div className={className}>
            <label className={`block text-sm font-medium mb-1 ${
                hasError ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
            }`}>
                {label}
            </label>
            <input
                type="date"
                value={selected}
                onChange={(e) => onChangeAction(e.target.value)}
                onBlur={onBlur}
                className={`w-full p-2 border rounded-md ${
                    hasError
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                } bg-white dark:bg-gray-700 dark:text-gray-100 focus:ring-2`}
            />
        </div>
    );
};