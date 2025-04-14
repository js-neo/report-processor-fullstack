// packages/shared/src/types/worker.ts
import {IObject} from "./object.js";

export interface IWorker {
    _id: string,
    workerId: string;
    name: string;
    position: string;
    salary_rate: number;
    objectRef: IObject | null;
    created_at: Date;
    updated_at: Date;
}