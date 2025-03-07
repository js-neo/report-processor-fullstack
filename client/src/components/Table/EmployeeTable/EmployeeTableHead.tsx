// client/src/components/Table/EmployeeTable/EmployeeTableHead.tsx

'use client';

import { IReport } from '@/interfaces/report.interface';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface HeadTableProps {
    reports: IReport[];
    startDate: string;
    endDate: string;
    workerName: string;
}

const EmployeeTableHead = ({ startDate, endDate, workerName }: HeadTableProps) => {
    const employeeName = workerName;

    const formatPeriod = () => {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (isNaN(start.getTime())) return 'Некорректный период';
            if (isNaN(end.getTime())) return 'Некорректный период';

            return format(start, 'LLLL yyyy', { locale: ru });
        } catch (e) {
            return 'Некорректный период';
        }
    };

    return (
        <thead className="bg-gray-50">
        <tr>
            <th colSpan={9} className="px-6 py-4 text-center text-lg font-semibold">
                Табель выполнения работ
            </th>
        </tr>
        <tr>
            <td colSpan={2} className="px-6 py-2 font-medium">Сотрудник:</td>
            <td colSpan={3} className="px-6 py-2">{employeeName}</td>
            <td colSpan={4}></td>
        </tr>
        <tr>
            <td colSpan={2} className="px-6 py-2 font-medium">Отчетный период:</td>
            <td colSpan={3} className="px-6 py-2">{formatPeriod()}</td>
            <td colSpan={4}></td>
        </tr>
        <tr>
            {['Число', 'Объект', 'Вид работы', 'Затраченное время/час', 'Общее время за день/час', 'Ссылка на медиа', 'Транскрипт', 'Дата формирования медиа', 'Дата отправки отчета'].map((header, idx) => (
                <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                </th>
            ))}
        </tr>
        </thead>
    );
};

export default EmployeeTableHead;