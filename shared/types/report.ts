// shared/types/report.ts

export interface IUser {
    username: string;
    telegram_id: string;
}

export interface IVideoMetadata {
    creation_date?: string;
    gps_latitude?: number | null;
    gps_longitude?: number | null;
    duration?: number;
}

export interface IVideoData {
    file_id: string;
    file_url: string;
    local_path: string;
    file_name: string;
    file_size_mb: number;
    mime_type: string;
    metadata: IVideoMetadata;
    drive_link: string;
}

export interface IAnalysisData {
    objectName?: string;
    task: string;
    workers: string[];
    time: number;
}

export interface IReportLog {
    timestamp: Date;
    field: string;
    old_value?: unknown;
    new_value: unknown;
    type: 'create' | 'update' | 'delete';
}

export interface IReportBase {
    timestamp: Date;
    user: IUser;
    video: IVideoData;
    transcript: string;
    analysis: IAnalysisData;
    telegram_id: string;
    report_logs: IReportLog[];
    updated_at: Date;
}

export interface IReport extends IReportBase {
    _id: string;
}

export interface ObjectReportEmployee {
    id: string;
    position: string;
    workerName: string;
    rate: number;
    totalHours: number;
    totalCost: number;
    dailyHours: number[];
    comment?: string;
}

export interface ObjectReport {
    id: string;
    objectName: string;
    employees: ObjectReportEmployee[];
    totalHours: number;
    totalCost: number;
    period: {
        start: Date;
        end: Date;
    };
}

export interface IGroupedReports {
    [key: string]: IReport[];
}