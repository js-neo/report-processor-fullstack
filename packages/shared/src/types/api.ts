// packages/shared/src/types/api.ts

import {IReport, IObjectReport} from "./report.js";

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data: NonNullable<T>;
    count?: number;
    total?: number;
    [key: string]: any;
}

export type EmployeeReportsResponse = ApiResponse<IReport[]> & { count: number };

export type ObjectReportResponse = ApiResponse<IObjectReport>