// shared/types/api.ts
import {IReport, ObjectReportEmployee} from "./report.ts";

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data: T;
    count?: number;
    total?: number;
    [key: string]: any;
}

export type EmployeeReportsResponse = ApiResponse<IReport[]> & { count: number };

export type ObjectReportResponse = ApiResponse<{
    objectName: string;
    period: { start: string; end: string };
    employees: ObjectReportEmployee[];
    totalHours: number;
    totalCost: number;
}>;