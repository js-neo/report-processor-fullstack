// shared/types/report.ts

export interface IUser {
    username: string;
    telegram_id: number;
    user_id: string;
    name: string;
}

export interface IWorker {
    name: string;
    worker_id: string;
    position?: string;
    salary_rate?: number;
}

export interface IMediaMetadata {
    creation_date?: string;
    gps_latitude?: number | null;
    gps_longitude?: number | null;
    duration?: string;
}

export interface IMediaData {
    file_id: string;
    file_url: string;
    local_path: string;
    file_name: string;
    file_size_mb: number;
    mime_type: string;
    metadata: IMediaMetadata;
    drive_link: string;
    is_audio: boolean;
}

export interface IAnalysisData {
    objectName?: string;
    task: string;
    workers: IWorker[];
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
    media: IMediaData;
    transcript: string;
    analysis: IAnalysisData;
    telegram_id: string;
    report_logs: IReportLog[];
    updated_at: Date;
    sent_to_managers?: string[];
}

export interface IReport extends IReportBase {
    _id: string;
}

export interface IObjectReportEmployee {
    id: string;
    position: string;
    workerName: string;
    rate: number;
    totalHours: number;
    totalCost: number;
    dailyHours: number[];
    comment?: string;
}

export interface IObjectReport {
    id: string;
    objectName: string;
    employees: IObjectReportEmployee[];
    totalHours: number;
    totalCost: number;
    period: {
        start: string;
        end: string;
    };
}

export interface IGroupedReports {
    [key: string]: IReport[];
}