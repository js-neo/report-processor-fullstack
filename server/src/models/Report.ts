// server/src/models/Report.ts
import { Document, Schema, model, Model } from 'mongoose';
import {
    IUser,
    IVideoMetadata,
    IVideoData,
    IAnalysisData,
    IReportLog,
    IReportBase
} from "@shared/types/report.ts";

interface IReport extends IReportBase, Document {
    _id: "string";
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true },
    telegram_id: { type: String, required: true }
}, { _id: false });

const VideoMetadataSchema = new Schema<IVideoMetadata>({
    creation_date: { type: String },
    gps_latitude: { type: String, default: null },
    gps_longitude: { type: String, default: null },
    duration: { type: String }
}, { _id: false });

const VideoDataSchema = new Schema<IVideoData>({
    file_id: { type: String, required: true },
    file_url: { type: String, required: true },
    local_path: { type: String, required: true },
    file_name: { type: String, required: true },
    file_size_mb: { type: Number, required: true },
    mime_type: { type: String, required: true },
    metadata: { type: VideoMetadataSchema, required: true },
    drive_link: { type: String, required: true }
}, { _id: false });

const AnalysisDataSchema = new Schema<IAnalysisData>({
    task: { type: String, required: true },
    workers: { type: [String], required: true },
    time: { type: Number, required: true }
}, { _id: false });

const ReportLogSchema = new Schema<IReportLog>({
    timestamp: { type: Date, required: true },
    field: { type: String, required: true },
    old_value: { type: Schema.Types.Mixed },
    new_value: { type: Schema.Types.Mixed, required: true },
    type: { type: String, required: true }
}, { _id: false });

const ReportSchema = new Schema<IReport>({
    _id: { type: String, required: true },
    timestamp: { type: Date, required: true },
    user: { type: UserSchema, required: true },
    video: { type: VideoDataSchema, required: true },
    transcript: { type: String, required: true },
    analysis: { type: AnalysisDataSchema, required: true },
    telegram_id: { type: String, required: true },
    report_logs: { type: [ReportLogSchema], default: [] },
    updated_at: { type: Date, required: true }
});

ReportSchema.index({ 'analysis.workers': 1, timestamp: 1 });
ReportSchema.index({ 'analysis.objectName': 1, timestamp: 1 });

const Report: Model<IReport> = model<IReport>('Report', ReportSchema);
export {IReport};
export default Report;