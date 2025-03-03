// client/src/components/Table/EmployeeTable/EmployeeTableBody.tsx

'use client';

import { IReport, IGroupedReports } from '@/interfaces/report.interface';
import { formatDate, groupByDay, extractLocation } from '@/utils/helpers';

interface BodyTableProps {
    reports: IReport[];
}

const EmployeeTableBody = ({ reports }: BodyTableProps) => {
    const groupedReports: IGroupedReports = groupByDay(reports);
    const totalHours = reports.reduce((sum, report) => sum + report.analysis.time, 0);

    return (
        <tbody className="bg-white divide-y divide-gray-200">
        {Object.entries(groupedReports).map(([date, dailyReports]) => {
            const dailyTotal = dailyReports.reduce((sum, r) => sum + r.analysis.time, 0);
            return (
                <DailyReportsGroup
                    key={date}
                    date={date}
                    reports={dailyReports}
                    dailyTotal={dailyTotal}
                />
            );
        })}
        <tr>
            <td colSpan={3} className="px-6 py-3 font-medium">Всего часов за месяц:</td>
            <td colSpan={6} className="px-6 py-3">{totalHours.toFixed(1)}</td>
        </tr>
        </tbody>
    );
};

const DailyReportsGroup = ({ date, reports, dailyTotal }: { date: string; reports: IReport[]; dailyTotal: number }) => {
    const formattedDate = formatDate(date, 'dd');
    const rowCount = reports.length;

    return (
        <>
            {reports.map((report, index) => (
                <tr key={report._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {index === 0 && (
                        <td rowSpan={rowCount} className="px-6 py-4 align-top">
                            {formattedDate}
                        </td>
                    )}
                    {index === 0 && (
                        <td className="px-6 py-4">{extractLocation(report.analysis)}</td>
                    )}
                    <td className="px-6 py-4">{report.analysis.task}</td>
                    <td className="px-6 py-4">{report.analysis.time.toFixed(1)}</td>
                    {index === 0 && (
                        <td rowSpan={rowCount} className="px-6 py-4 align-top">
                            {dailyTotal.toFixed(1)}
                        </td>
                    )}
                    <td className="px-6 py-4">
                        <a
                            href={report.video.drive_link}
                            className="text-blue-600 hover:text-blue-900"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Ссылка
                        </a>
                    </td>
                    <td className="px-6 py-4 max-w-xs">{report.transcript}</td>
                    <td className="px-6 py-4">{report.video.metadata.creation_date ? formatDate(report.video.metadata.creation_date) : "-"}</td>
                    <td className="px-6 py-4">{formatDate(report.updated_at)}</td>
                </tr>
            ))}
        </>
    );
};

export default EmployeeTableBody;