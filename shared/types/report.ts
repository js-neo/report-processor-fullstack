export interface IUser {
    username: string;
    telegram_id: string;
}

export interface IVideoMetadata {
    creation_date?: Date;
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
    task: string;
    workers: string[];
    time: number;
}

export interface IReportLog {
    timestamp: Date;
    field: string;
    old_value?: any;
    new_value: any;
    type: 'create' | 'update' | 'delete';
}

export interface IReport {
    _id: string;
    timestamp: Date;
    user: IUser;
    video: IVideoData;
    transcript: string;
    analysis: IAnalysisData;
    telegram_id: string;
    report_logs: IReportLog[];
    updated_at: Date;
}