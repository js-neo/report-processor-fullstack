// packages/shared/src/types/api.ts

import {IReport, IObjectReport} from "./report.js";

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    count?: number;
    total?: number;
}

export type EmployeeReportsResponse = ApiResponse<{
    workerName: string;
    reports: IReport[];
}> & { count: number };

export type ObjectReportResponse = ApiResponse<IObjectReport>