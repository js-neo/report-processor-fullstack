// client/src/interfaces/objects.interface.ts

export interface ObjectReport {
    id: string;
    name: string;
    employees: {
        id: string;
        position: string;
        workerName: string;
        rate: number;
        totalHours: number;
        totalCost: number;
        dailyHours: number[];
        comment?: string;
    }[];
    totalHours: number;
    totalCost: number;
}