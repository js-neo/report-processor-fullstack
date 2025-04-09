import {Types} from "mongoose";

export interface IWorker extends Document {
    workerId: string;
    name: string;
    position: string;
    salary_rate: number;
    objectId: Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}