// components/ExportToExcelButton.tsx
'use client'

import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import {IReport} from '@/interfaces/report.interface'
import { ObjectReport } from '@/interfaces/object.interface'
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

        if (type === 'employee') {
            const reports = data as IReport[]
            const grouped = groupByDay(reports)

            worksheet.columns = [
                { header: 'Число', key: 'date', width: 15 },
                { header: 'Объект', key: 'object', width: 25 },
                { header: 'Вид работы', key: 'task', width: 35 },
                { header: 'Часы', key: 'hours', width: 12 },
                { header: 'Общее за день', key: 'dailyTotal', width: 15 },
                { header: 'Ссылка', key: 'link', width: 40 },
                { header: 'Комментарий', key: 'comment', width: 50 },
                { header: 'Дата создания', key: 'created', width: 20 }
            ]

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
                        link: report.video.drive_link,
                        comment: report.transcript,
                        created: report.video.metadata.creation_date ? formatDate(report.video.metadata.creation_date) : "-"
                    })
                })

                if (dailyReports.length > 1) {
                    worksheet.mergeCells(`A${startRow}:A${startRow + dailyReports.length - 1}`)
                    worksheet.mergeCells(`E${startRow}:E${startRow + dailyReports.length - 1}`)
                }
            })
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

        worksheet.getRow(1).eachCell(cell => {
            cell.style = {
                font: { bold: true, color: { argb: 'FFFFFFFF' } },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0070C0' } },
                alignment: { vertical: 'middle', horizontal: 'center' }
            }
        })

        const buffer = await workbook.xlsx.writeBuffer()
        saveAs(new Blob([buffer]), `${fileName}.xlsx`)
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
