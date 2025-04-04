// packages/client/src/components/ExportToExcelButton.tsx
'use client'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { IReport, IObjectReport } from "shared"
import { groupByDay } from "@/utils/helpers"
import { formatDate, extractLocation, generateDateHeaders, formatReportPeriod, getColumnLetter } from '@/utils/helpers'

interface ExportButtonProps {
    type: 'employee' | 'object'
    data: IReport[] | IObjectReport
    fileName: string
    startDate?: string
    endDate?: string
    name: string
}

interface RowData {
    id: number;
    position: string;
    employee: string;
    rate: string;
    totalHours: number;
    totalCost: string;
    comment: string;
    [key: string]: number | string;
}

export const ExportToExcelButton = ({
                                        type,
                                        data,
                                        fileName,
                                        startDate,
                                        endDate,
                                        name
                                    }: ExportButtonProps) => {
    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Отчет')


        const borderStyle: Partial<ExcelJS.Borders> = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };

        const headerStyle: Partial<ExcelJS.Style> = {
            font: { bold: true, color: { argb: 'FFFFFFFF' } },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF16A34A'} },
            alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
            border: borderStyle,
        };

        const contentStyle: Partial<ExcelJS.Style> = {
            font: { name: "Arial", size: 9, bold: false },
            alignment: { horizontal: "center", vertical: "middle", wrapText: true },
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
            alignment: { horizontal: "center", vertical: "middle", wrapText: true },
            border: borderStyle
        };

        const createEmptyRow = (columnsCount: number) =>
            new Array(columnsCount).fill("");

        if (type === 'employee') {
            const reports = data as IReport[]
            const grouped = groupByDay(reports) as { [key: string]: IReport[] };
            const employeeName = decodeURIComponent(name);

            worksheet.columns = [
                { key: 'date', width: 10 },
                { key: 'object', width: 20 },
                { key: 'task', width: 35 },
                { key: 'hours', width: 10 },
                { key: 'dailyTotal', width: 10 },
                { key: 'link', width: 10 },
                { key: 'comment', width: 50 },
                { key: 'created_media', width: 20 },
                { key: 'created_report', width: 20 }
            ] as ExcelJS.Column[];

            const columnsCount = worksheet.columns.length;

            const titleRow = worksheet.addRow(createEmptyRow(columnsCount));
            worksheet.mergeCells(`A${titleRow.number}:${getColumnLetter(columnsCount)}${titleRow.number}`);
            titleRow.getCell(1).value = 'Табель выполнения работ';
            titleRow.eachCell({includeEmpty: true}, cell => {
                cell.style = {
                    font: { bold: true, size: 14 },
                    alignment: { horizontal: 'center', vertical: 'middle' },
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } },
                    border: borderStyle
                }
            })

            const employeeRow = worksheet.addRow(createEmptyRow(columnsCount))
            employeeRow.getCell(1).value = 'Сотрудник:'
            employeeRow.getCell(3).value = employeeName;
            worksheet.mergeCells(`A${employeeRow.number}:B${employeeRow.number}`)
            worksheet.mergeCells(`C${employeeRow.number}:E${employeeRow.number}`)
            employeeRow.eachCell({includeEmpty: true}, cell => {
                cell.style = {
                    font: { size: 11 },
                    alignment: { vertical: 'middle' },
                    border: borderStyle
                }
            })
            employeeRow.getCell(1).style.font = { bold: true }

            const periodRow = worksheet.addRow(createEmptyRow(columnsCount))
            periodRow.getCell(1).value = 'Отчетный период:'
            periodRow.getCell(3).value = formatReportPeriod(startDate!, endDate!)
            worksheet.mergeCells(`A${periodRow.number}:B${periodRow.number}`)
            worksheet.mergeCells(`C${periodRow.number}:E${periodRow.number}`)
            periodRow.eachCell({includeEmpty: true}, cell => {
                cell.style = {
                    font: { size: 11 },
                    alignment: { vertical: 'middle' },
                    border: borderStyle
                }
            })
            periodRow.getCell(1).style.font = { bold: true }

            const headerRow = worksheet.insertRow(4, [
                'Дата',
                'Объект',
                'Вид работы',
                'Часы',
                'Общее за день',
                'Ссылка на медиа',
                'Транскрипт',
                'Дата формирования медиа',
                'Дата отправки отчета'
            ])

            headerRow.eachCell(cell => {
                cell.style = headerStyle
            })

            const totalHours = reports.reduce((sum: number, report: IReport) => sum + report.analysis.time, 0)

            Object.entries(grouped).forEach(([date, dailyReports]) => {
                const dailyTotal = dailyReports.reduce((sum: number, r: IReport) => sum + r.analysis.time, 0)
                const startRow = worksheet.rowCount + 1

                dailyReports.forEach((report, index) => {
                    const rowData = {
                        date: index === 0 ? formatDate(date, 'dd.MM') : '',
                        object: extractLocation(report.analysis),
                        task: report.analysis.task,
                        hours: report.analysis.time.toFixed(1),
                        dailyTotal: index === 0 ? dailyTotal.toFixed(1) : '',
                        link: {text: "Ссылка", hyperlink: report.media.drive_link},
                        comment: report.transcript,
                        created_media: formatDate(report.media.metadata.creation_date),
                        created_report: formatDate(report.timestamp)
                    }
                    const newRow = worksheet.addRow(rowData)

                    newRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                        if (colNumber === 6) {
                            cell.style = linkStyle
                        } else {
                            cell.style = contentStyle
                        }
                    })
                })

                if (dailyReports.length > 1) {
                    worksheet.mergeCells(`A${startRow}:A${startRow + dailyReports.length - 1}`)
                    worksheet.mergeCells(`E${startRow}:E${startRow + dailyReports.length - 1}`)
                }
            })

            const totalRow = worksheet.addRow(createEmptyRow(columnsCount))
            worksheet.mergeCells(`A${totalRow.number}:C${totalRow.number}`)
            totalRow.getCell(1).value = 'Всего часов за месяц:';
            totalRow.getCell(4).value = totalHours.toFixed(1);
            totalRow.eachCell({includeEmpty: true}, cell => {
                cell.style = {
                    ...contentStyle,
                    font: {...contentStyle.font, bold: cell.address === `A${totalRow.number}`}
                }
            })
        }

        if (type === 'object') {
            const reportData = data as IObjectReport
            const objectName = decodeURIComponent(name);

            const dateHeaders = generateDateHeaders(startDate!, endDate!)
            worksheet.columns = [
                { key: 'id', width: 8 },
                { key: 'position', width: 20 },
                { key: 'employee', width: 25 },
                { key: 'rate', width: 15 },
                { key: 'totalHours', width: 15 },
                { key: 'totalCost', width: 15 },
                ...dateHeaders.map(date => ({ key: date, width: 12 })),
                { key: 'comment', width: 30 }
            ] as ExcelJS.Column[]

            const columnsCount = worksheet.columns.length;

            const titleRow = worksheet.addRow(createEmptyRow(columnsCount));
            worksheet.mergeCells(`A${titleRow.number}:${getColumnLetter(columnsCount)}${titleRow.number}`);
            titleRow.getCell(1).value = 'Табель учета рабочего времени';
            titleRow.eachCell({includeEmpty: true}, cell => {
                cell.style = {
                    font: { bold: true, size: 14 },
                    alignment: { horizontal: 'left', vertical: 'middle', indent: 20 },
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } },
                    border: borderStyle
                }
            })

            const infoObjectRow = worksheet.addRow(createEmptyRow(columnsCount))
            infoObjectRow.getCell(1).value = 'Отчет по объекту:'
            infoObjectRow.getCell(3).value = objectName;
            worksheet.mergeCells(`A${infoObjectRow.number}:B${infoObjectRow.number}`)
            worksheet.mergeCells(`C${infoObjectRow.number}:E${infoObjectRow.number}`)
            infoObjectRow.eachCell({includeEmpty: true}, cell => {
                cell.style = {
                    font: { size: 11 },
                    alignment: { vertical: 'middle' },
                    border: borderStyle
                }
            })
            infoObjectRow.getCell(1).style.font = { bold: true }

            const periodObjectRow = worksheet.addRow(createEmptyRow(columnsCount))
            periodObjectRow.getCell(1).value = 'Отчетный период:'
            periodObjectRow.getCell(3).value = formatReportPeriod(startDate!, endDate!)
            worksheet.mergeCells(`A${periodObjectRow.number}:B${periodObjectRow.number}`)
            worksheet.mergeCells(`C${periodObjectRow.number}:E${periodObjectRow.number}`)
            periodObjectRow.eachCell({includeEmpty: true}, cell => {
                cell.style = {
                    font: { size: 11 },
                    alignment: { vertical: 'middle' },
                    border: borderStyle
                }
            })
            periodObjectRow.getCell(1).style.font = { bold: true }

            const headerObjectRow =  worksheet.insertRow(4, [
                  '№',
                'Должность',
                'Сотрудник',
                'Ставка',
                'Всего часов',
                'Стоимость',
                ...dateHeaders.map(date => (date)),
                'Примечания'
            ]);

            headerObjectRow.eachCell(cell => {
                cell.style = headerStyle
            })

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

                const newRows = worksheet.addRow(rowData)

                newRows.eachCell({ includeEmpty: true }, (cell) => {
                    cell.style = contentStyle;

                })
            })

            const totalRow = worksheet.addRow(createEmptyRow(columnsCount))
            totalRow.getCell(1).value = 'Итого:'
            totalRow.getCell(5).value = reportData.totalHours;
            totalRow.getCell(6).value = `${reportData.totalCost} ₽`;
            worksheet.mergeCells(`A${totalRow.number}:D${totalRow.number}`)
            totalRow.eachCell({includeEmpty: true}, cell => {
                cell.style = {
                    ...contentStyle,
                    font: {...contentStyle.font, bold: cell.address === `A${totalRow.number}`}
                }
            })
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