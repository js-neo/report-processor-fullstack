// client/src/components/UI/Dropdown/DynamicDropdown.tsx

import LoadingSpinner from "@/components/Common/LoadingSpinner";

interface Worker {
    _id: string;
    name: string;
}

interface Object {
    _id: string;
    objectName: string;
}

interface DynamicDropdownProps {
    type: 'employee' | 'object';
    data: Worker[] | Object[];
    selectedValue: string;
    onChange: (value: string) => void;
    placeholder?: string;
    loading?: boolean;
    error?: string;
}

const DynamicDropdown = ({
                             type,
                             data,
                             selectedValue,
                             onChange,
                             placeholder = 'Выберите значение',
                             loading = false,
                             error
                         }: DynamicDropdownProps) => {
    if (loading) return <div className="p-2 border rounded-md bg-gray-50"><LoadingSpinner small /></div>;
    console.log("error: ", error);

    console.log("data: ", data);

    return (
        <select
            value={selectedValue}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full p-2 border rounded-md ${ error ? "border-red-500 text-red-600" : "border-blue-300"} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        >
            <option value="" disabled>{error || placeholder}</option>
            {data.map((item) => (
                <option key={item._id} value={type === 'employee'
                    ? (item as Worker).name
                    : (item as Object).objectName
                }>
                    {type === 'employee'
                        ? (item as Worker).name
                        : (item as Object).objectName
                    }
                </option>
            ))}
        </select>
    );
};

export default DynamicDropdown;
