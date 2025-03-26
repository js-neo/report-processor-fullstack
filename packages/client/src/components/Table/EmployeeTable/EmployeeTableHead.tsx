// client/src/components/Table/EmployeeTable/EmployeeTableHead.tsx

'use client';

import { IReport } from "shared";
import { formatReportPeriod } from "@/utils/helpers";

interface HeadTableProps {
    reports: IReport[];
    startDate: string;
    endDate: string;
    workerName: string;
}

const EmployeeTableHead = ({ startDate, endDate, workerName }: HeadTableProps) => {
    const employeeName = decodeURIComponent(workerName);
    console.log('employeeName: ', employeeName);

    return (
        <thead className="bg-gray-50">
        <tr>
            <th colSpan={9} className="px-2 py-4 text-center text-lg font-semibold">
                Табель выполнения работ
            </th>
        </tr>
        <tr>
            <td colSpan={2} className="px-2 py-2 font-medium">Сотрудник:</td>
            <td colSpan={3} className="px-2 py-2">{employeeName}</td>
            <td colSpan={4}></td>
        </tr>
        <tr>
            <td colSpan={2} className="px-2 py-2 font-medium">Отчетный период:</td>
            <td colSpan={3} className="px-2 py-2">{formatReportPeriod(startDate, endDate)}</td>
            <td colSpan={4}></td>
        </tr>
        <tr>
            {['Дата', 'Объект', 'Вид работы', 'Затраченное время/час', 'Общее время за день/час', 'Ссылка на медиа', 'Транскрипт', 'Дата формирования медиа', 'Дата отправки отчета']
                .map((header, idx) => (
                    <th key={idx} className={`px-2 py-3 text-center text-xs font-medium text-gray-500 
                    uppercase tracking-wider border border-gray-300 ${getColumnWidthClass(idx)}`}>
                        {header}
                    </th>
                ))}
        </tr>
        </thead>
    );
};


const getColumnWidthClass = (index: number) => {
    switch (index) {
        case 0: return 'w-1/12';
        case 1: return 'w-1/12';
        case 2: return 'w-1/6';
        case 3: return 'w-1/12';
        case 4: return 'w-1/12';
        case 5: return 'w-1/12';
        case 6: return 'w-1/4';
        case 7: return 'w-1/12';
        case 8: return 'w-1/12';
        default: return '';
    }
};

export default EmployeeTableHead;
