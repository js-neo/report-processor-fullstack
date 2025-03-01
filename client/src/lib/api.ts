import { IReport } from '@shared/types/report';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchReports = async (
    options?: RequestInit
): Promise<IReport[]> => {
    const res = await fetch(`${BASE_URL}/reports`, options);

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Ошибка загрузки отчетов');
    }

    return res.json();
};