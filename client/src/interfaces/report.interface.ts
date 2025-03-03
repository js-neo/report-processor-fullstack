// client/src/interfaces/report.interface.ts

import {IReport,
    IUser,
    IAnalysisData} from '@shared/types/report';



interface IGroupedReports {
    [key: string]: IReport[];
}

export type {IReport, IUser, IAnalysisData, IGroupedReports};