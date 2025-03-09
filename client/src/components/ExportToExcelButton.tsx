// components/ExportToExcelButton.tsx
'use client'

import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import {IReport, ObjectReport} from "@shared/types/report";
import {groupByDay} from "@/utils/helpers";
import { formatDate, extractLocation, generateDateHeaders } from '@/utils/helpers'

interface ExportButtonProps {
    type: 'employee' | 'object'
    data: IReport[] | ObjectReport
    fileName: string
    startDate?: string
    endDate?: string
}

interface RowData {
    id: number;
    position: string;
    employee: string;
    rate: string;
    totalHours: number;
    totalCost: string;
    comment: string;
    [key: string]: any;
}


export const ExportToExcelButton = ({
                                        type,
                                        data,
                                        fileName,
                                        startDate,
                                        endDate
                                    }: ExportButtonProps) => {
    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Отчет')

        const borderStyle: Partial<ExcelJS.Borders> = {
            top: {
                style: "thin"
            },
            left: {
                style: "thin"
            },
            bottom: {
                style: "thin"
            },
            right: {
                style: "thin"
            }
        };
        const headerStyle: Partial<ExcelJS.Style> = {
            font: { bold: true, color: { argb: 'FFFFFFFF' } },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0070C0' } },
            alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
            border: borderStyle,
        };

        const contentStyle: Partial<ExcelJS.Style> = {
            font: {
                name: "Arial",
                    size: 9,
                    bold: false
            },
            alignment: {
                horizontal: "center",
                    vertical: "middle",
                    wrapText: true
            },
            border: borderStyle
        }

        const linkStyle: Partial<ExcelJS.Style> = {
            font: {
                name: "Arial",
                size: 9,
                bold: true,
                color: { argb: 'FF0000FF' },
                underline: true
            },
            alignment: {
                horizontal: "center",
                vertical: "middle",
                wrapText: true
            },
            border: borderStyle
        };


        if (type === 'employee') {
            const reports = data as IReport[]
            const grouped = groupByDay(reports)

            worksheet.columns = [
                { header: 'Дата', key: 'date', width: 15 },
                { header: 'Объект', key: 'object', width: 25 },
                { header: 'Вид работы', key: 'task', width: 35 },
                { header: 'Часы', key: 'hours', width: 12 },
                { header: 'Общее за день', key: 'dailyTotal', width: 15 },
                { header: 'Ссылка на медиа', key: 'link', width: 40 },
                { header: 'Транскрипт', key: 'comment', width: 50 },
                { header: 'Дата формирования медиа', key: 'created_media', width: 20 },
                { header: 'Дата отправки отчета', key: 'created_report', width: 20 }
            ]

            const totalHours = reports.reduce((sum, report) => sum + report.analysis.time, 0);

            Object.entries(grouped).forEach(([date, dailyReports]) => {
                const dailyTotal = dailyReports.reduce((sum, r) => sum + r.analysis.time, 0)
                const startRow = worksheet.rowCount + 1

                dailyReports.forEach((report, index) => {
                    worksheet.addRow({
                        date: index === 0 ? formatDate(date, 'dd') : '',
                        object: extractLocation(report.analysis),
                        task: report.analysis.task,
                        hours: report.analysis.time.toFixed(1),
                        dailyTotal: index === 0 ? dailyTotal.toFixed(1) : '',
                        link: {text: "Ссылка", hyperlink: report.video.drive_link},
                        comment: report.transcript,
                        created_media: formatDate(report.video.metadata.creation_date),
                        created_report: formatDate(report.timestamp)
                    })
                })

                if (dailyReports.length > 1) {
                    worksheet.mergeCells(`A${startRow}:A${startRow + dailyReports.length - 1}`)
                    worksheet.mergeCells(`E${startRow}:E${startRow + dailyReports.length - 1}`)
                }
            })

            console.log("totalHours:", totalHours);
            const totalRow = worksheet.addRow(['', '', '', totalHours]);

            worksheet.mergeCells(`A${totalRow.number}:C${totalRow.number}`);
            worksheet.getCell(`A${totalRow.number}`).value = 'Всего часов за месяц:';

            //worksheet.mergeCells(`D${totalRow.number}:E${totalRow.number}`);
        }

        if (type === 'object') {
            const reportData = data as ObjectReport

            const dateHeaders = generateDateHeaders(startDate!, endDate!)
            worksheet.columns = [
                { header: '№', key: 'id', width: 8 },
                { header: 'Должность', key: 'position', width: 20 },
                { header: 'Сотрудник', key: 'employee', width: 25 },
                { header: 'Ставка', key: 'rate', width: 15 },
                { header: 'Всего часов', key: 'totalHours', width: 15 },
                { header: 'Стоимость', key: 'totalCost', width: 15 },
                ...dateHeaders.map(date => ({ header: date, key: date, width: 12 })),
                { header: 'Примечания', key: 'comment', width: 30 }
            ]

            reportData.employees.forEach((emp, idx) => {
                const rowData: RowData = {
                    id: idx + 1,
                    position: emp.position,
                    employee: emp.workerName,
                    rate: `${emp.rate} ₽/ч`,
                    totalHours: emp.totalHours,
                    totalCost: `${emp.totalCost} ₽`,
                    comment: emp.comment || ''
                }

                dateHeaders.forEach((date, i) => {
                    rowData[date] = emp.dailyHours[i] || '-'
                })

                worksheet.addRow(rowData)
            })

            const totalRow = worksheet.addRow({
                id: 'Итого',
                totalHours: reportData.totalHours,
                totalCost: `${reportData.totalCost} ₽`
            })
            worksheet.mergeCells(`A${totalRow.number}:D${totalRow.number}`)
        }

        const totalRows = worksheet.rowCount;

        for (let row = 1; row <= totalRows; row++) {

            for (let col = 1; col <= worksheet.columnCount; col++) {
                const cell = worksheet.getCell(row, col);

                if (row === 1) {
                    cell.style = headerStyle;
                } else if (row !== 1 && col === 6) {
                    cell.style = linkStyle;
                } else {
                    cell.style = contentStyle;
                }

            }
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const sanitizedFileName = decodeURIComponent(fileName).replace(/\s+/g, '_');
        saveAs(new Blob([buffer]), `${sanitizedFileName}.xlsx`);
    }

    return (
        <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
            Скачать Excel
        </button>
    )
}
