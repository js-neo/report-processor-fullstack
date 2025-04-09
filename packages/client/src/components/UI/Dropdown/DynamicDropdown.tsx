// packages/client/src/components/UI/Dropdown/DynamicDropdown.tsx

import LoadingSpinner from "@/components/Common/LoadingSpinner";
import { useMemo } from 'react';

interface Worker {
    _id: string;
    name: string;
}

interface WorkObject {
    _id: string;
    name: string;
}

type DynamicDropdownProps =
    | {
    type: 'employee';
    data: Worker[];
    selectedValue: string;
    onChange: (value: string) => void;
    placeholder?: string;
    loading?: boolean;
    error?: string;
}
    | {
    type: 'object';
    data: WorkObject[];
    selectedValue: string;
    onChange: (value: string) => void;
    placeholder?: string;
    loading?: boolean;
    error?: string;
};

const DynamicDropdown = (props: DynamicDropdownProps) => {
    const {
        type,
        data,
        selectedValue,
        onChange,
        placeholder = 'Выберите значение',
        loading = false,
        error
    } = props;

    const sortedData = useMemo(() => {
        if (!data || !Array.isArray(data)) return [];

        return type === 'employee'
            ? ([...data] as Worker[]).sort((a, b) =>
                (a.name || '').localeCompare(b.name || '', "ru"))
            : ([...data] as WorkObject[]).sort((a, b) =>
                (a.name || '').localeCompare(b.name || '', "ru"));
    }, [data, type]);

    if (loading) {
        return (
            <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                <LoadingSpinner small />
            </div>
        );
    }

    return (
        <select
            value={selectedValue}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full p-2 border rounded-md transition-colors
                ${
                error
                    ? "border-red-500 text-red-600 dark:border-red-400 dark:text-red-300"
                    : "border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100"
            }
                bg-white dark:bg-gray-700
                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                focus:border-blue-500 dark:focus:border-blue-400
                placeholder-gray-400 dark:placeholder-gray-500`}
        >
            <option value="" disabled className="dark:bg-gray-700">
                {error || placeholder}
            </option>
            {sortedData.map((item) => {
                if (type === 'employee') {
                    const worker = item as Worker;
                    return (
                        <option
                            key={worker._id}
                            value={worker._id}
                            className="dark:bg-gray-700 dark:text-gray-100"
                        >
                            {worker.name}
                        </option>
                    );
                }

                const workObject = item as WorkObject;
                return (
                    <option
                        key={workObject._id}
                        value={workObject._id}
                        className="dark:bg-gray-700 dark:text-gray-100"
                    >
                        {workObject.name}
                    </option>
                );
            })}
        </select>
    );
};

export default DynamicDropdown;