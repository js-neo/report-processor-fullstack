// client/src/components/Table/EmployeeTable/EmployeeTableBody.tsx

'use client';

import { IReport, IGroupedReports } from "shared";
import { formatDate, groupByDay, extractLocation } from '@/utils/helpers';

interface BodyTableProps {
    reports: IReport[];
}

const EmployeeTableBody = ({ reports }: BodyTableProps) => {
    const groupedReports: IGroupedReports = groupByDay(reports);
    const totalHours = reports.reduce((sum, report) => sum + report.analysis.time, 0);
    console.log("groupedReports: ", groupedReports);
    console.log("{Object.entries(groupedReports).length: ", Object.entries(groupedReports).length);

    return (
        <tbody className="bg-white divide-y divide-gray-200">
        {Object.entries(groupedReports).map(([date, dailyReports]) => {
            const dailyTotal = dailyReports.reduce((sum, r) =>
                sum + r.analysis.time, 0);
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
            <td colSpan={3} className="px-2 py-3 font-medium border border-gray-300">Всего часов за месяц:</td>
            <td colSpan={6} className="px-2 py-3 border border-gray-300">{totalHours ? totalHours.toFixed(1) : "н/д"}</td>
        </tr>
        </tbody>
    );
};

const DailyReportsGroup = ({ date, reports, dailyTotal }: { date: string; reports: IReport[]; dailyTotal: number }) => {
    const formattedDate = formatDate(date, 'dd');
    const rowCount = reports.length;
    console.log("reports_DailyReportsGroup: ", reports)

    return (
        <>
            {reports.map((report, index) => (
                <tr key={report._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {index === 0 && (
                        <td rowSpan={rowCount} className="px-2 py-4 w-1/12 border border-gray-300 text-center">
                            {formattedDate}
                        </td>
                    )}

                    <td className="px-2 py-4 w-1/12 border border-gray-300">{extractLocation(report.analysis)}</td>

                    <td className="px-2 py-4 w-1/6 border border-gray-300">{report.analysis.task}</td>
                    <td className="px-2 py-4 w-1/12 border border-gray-300">{report.analysis.time ? report.analysis.time.toFixed(1) : "н/д"}</td>
                    {index === 0 && (
                        <td rowSpan={rowCount} className="px-2 py-4 w-1/12 border border-gray-300 text-center">
                            {dailyTotal?.toFixed(1)}
                        </td>
                    )}
                    <td className="px-2 py-4 w-1/12 border border-gray-300">
                        <a
                            href={report.media.drive_link}
                            className="text-blue-600 hover:text-blue-900"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Ссылка
                        </a>
                    </td>
                    <td className="px-2 py-4 w-1/4 border border-gray-300">{report.transcript}</td>
                    <td className="px-2 py-4 w-1/12 border border-gray-300">{formatDate(report.media.metadata.creation_date)}</td>
                    <td className="px-2 py-4 w-1/12 border border-gray-300">{formatDate(report.timestamp)}</td>
                </tr>
            ))}
        </>
    );
};

export default EmployeeTableBody;
