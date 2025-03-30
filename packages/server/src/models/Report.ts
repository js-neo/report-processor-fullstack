// server/src/models/Report.ts

import { Document, Schema, model, Model } from 'mongoose';
import { IUser, IMediaMetadata, IMediaData, IAnalysisData, IReportLog, IReportBase } from "shared";

interface IReport extends IReportBase, Document {
    _id: string;
}

interface IPartialReport extends Pick<IReportBase,
    'timestamp' | 'analysis' | 'media' | 'transcript'
> {}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true },
    telegram_id: { type: Number, required: true },
    user_id: { type: String, required: true },
    name: { type: String, required: true }
}, { _id: false });

const ReportWorkerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    worker_id: {
        type: String,
        ref: 'Worker',
        required: true
    }
}, { _id: false });

const MediaMetadataSchema = new Schema<IMediaMetadata>({
    creation_date: { type: String },
    gps_latitude: { type: Number, default: null },
    gps_longitude: { type: Number, default: null },
    duration: { type: String }
}, { _id: false });

const MediaDataSchema = new Schema<IMediaData>({
    file_id: { type: String, required: true },
    file_url: { type: String, required: true },
    local_path: { type: String, required: true },
    file_name: { type: String, required: true },
    file_size_mb: { type: Number, required: true },
    mime_type: { type: String, required: true },
    metadata: { type: MediaMetadataSchema, required: true },
    drive_link: { type: String, required: true },
    is_audio: { type: Boolean, required: true }
}, { _id: false });

const AnalysisDataSchema = new Schema<IAnalysisData>({
    objectName: { type: String },
    task: { type: String, required: true },
    workers: { type: [ReportWorkerSchema], required: true },
    time: { type: Number, required: true }
}, { _id: false });

const ReportLogSchema = new Schema<IReportLog>({
    timestamp: { type: Date, required: true },
    field: { type: String, required: true },
    old_value: { type: Schema.Types.Mixed },
    new_value: { type: Schema.Types.Mixed, required: true },
    type: { type: String, required: true, enum: ['create', 'update', 'delete'] }
}, { _id: false });

const ReportSchema = new Schema<IReport>({
    _id: { type: String, required: true },
    timestamp: { type: Date, required: true },
    user: { type: UserSchema, required: true },
    media: { type: MediaDataSchema, required: true },
    transcript: { type: String, required: true },
    analysis: { type: AnalysisDataSchema, required: true },
    telegram_id: { type: String, required: true },
    report_logs: { type: [ReportLogSchema], default: [] },
    updated_at: { type: Date, required: true },
    sent_to_managers: { type: [String], default: [] }
});

ReportSchema.index({ 'analysis.workers.worker_id': 1 });
ReportSchema.index({ 'analysis.objectName': 1, timestamp: 1 });

ReportSchema.pre('save', async function(next) {
    for (const worker of this.analysis.workers) {
        const exists = await model('Worker').exists({ worker_id: worker.worker_id });
        if (!exists) {
            throw new Error(`Worker with ID ${worker.worker_id} not found`);
        }
    }
    next();
});

const Report: Model<IReport> = model<IReport>('Report', ReportSchema);

export { IReport, IPartialReport };
export default Report;