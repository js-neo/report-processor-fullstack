import { IReport } from '@shared/types/report';

interface ReportsTableProps {
    data: IReport[];
}

export const ReportsTable = ({ data }: ReportsTableProps) => {
    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-2 text-left">Пользователь</th>
                    <th className="px-4 py-2 text-left">Видео</th>
                    <th className="px-4 py-2 text-left">Длительность</th>
                    <th className="px-4 py-2 text-left">Задача анализа</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {data.map((report) => (
                    <tr key={report._id}>
                        <td className="px-4 py-3">
                            <div className="font-medium">{report.user.username}</div>
                            <div className="text-sm text-gray-500">
                                {report.user.telegram_id}
                            </div>
                        </td>
                        <td className="px-4 py-3">
                            <a
                                href={report.video.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                {report.video.file_name}
                            </a>
                            <div className="text-sm text-gray-500">
                                {report.video.file_size_mb.toFixed(2)} MB
                            </div>
                        </td>
                        <td className="px-4 py-3">
                            {report.video.metadata.duration} сек
                        </td>
                        <td className="px-4 py-3">
                            {report.analysis.task}
                            <div className="text-sm text-gray-500">
                                Время анализа: {report.analysis.time} сек
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};