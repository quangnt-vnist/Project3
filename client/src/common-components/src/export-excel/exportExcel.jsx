import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as Excel from "exceljs";
import * as FileSaver from 'file-saver';

class ExportExcel extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static export(exportData) {
        let workbook = new Excel.Workbook();

        exportData.dataSheets.forEach(x => {
            if (x.sheetName && x.tables.length !== 0) {
                let sheetName = x.sheetName.replace(/[*?:\\\/]/gi, '');
                let worksheet = workbook.addWorksheet(sheetName);

                let currentRow = 1;
                if (x.sheetTitle) { // Thêm tiêu đề sheet
                    worksheet.getCell('A1').value = x.sheetTitle;
                    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
                    worksheet.getCell('A1').font = { name: 'Arial', family: 4, size: 18, bold: true, color: { argb: 'FF2D1075' } };
                    if (x.sheetTitleWidth) {
                        let endMergeSheetTitle = worksheet.getRow(currentRow).getCell(x.sheetTitleWidth).address;
                        worksheet.mergeCells(`A1:${endMergeSheetTitle}`);
                    } else {
                        worksheet.mergeCells('A1:M1');
                    }
                    currentRow = currentRow + 2;
                };


                x.tables.forEach(y => {
                    let rowHeader = y.rowHeader,
                        columns = y.columns,
                        merges = y.merges,
                        styleColumn = y.styleColumn,
                        moreInform = y.moreInform;

                    if (moreInform) { // Thêm thông tin thêm của bảng
                        moreInform.forEach(info => {
                            if (info.title) {
                                worksheet.getCell(`B${currentRow}`).value = info.title;
                                worksheet.getCell(`B${currentRow}`).alignment = { vertical: 'middle' };
                                worksheet.getCell(`B${currentRow}`).font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF2D1075' } };
                                currentRow = currentRow + 1;
                            }
                            if (info.value) {
                                info.value.forEach(row => {
                                    worksheet.getCell(`B${currentRow}`).value = row;
                                    worksheet.getCell(`B${currentRow}`).alignment = { vertical: 'middle' };
                                    worksheet.getCell(`B${currentRow}`).font = { name: 'Arial' };
                                    currentRow = currentRow + 1;
                                })
                            }
                            currentRow = currentRow + 2;
                        })
                    }


                    if (y.tableName) { // Thêm tên bảng
                        worksheet.getCell(`A${currentRow}`).value = y.tableName;
                        worksheet.getCell(`A${currentRow}`).alignment = { vertical: 'middle' };
                        worksheet.getCell(`A${currentRow}`).font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FF2D1075' } };

                        let endMergeTablename = worksheet.getRow(currentRow).getCell(columns.length).address;
                        worksheet.mergeCells(`A${currentRow}:${endMergeTablename}`);
                        currentRow = currentRow + 1;
                    };


                    // Thêm chú ý cho bảng
                    if (y.note) {
                        worksheet.getCell(`A${currentRow}`).value = y.note;
                        worksheet.getCell(`A${currentRow}`).font = { name: 'Arial', size: 10, color: { argb: "FFFF0000" } };
                        worksheet.getCell(`A${currentRow}`).alignment = { vertical: 'middle', wrapText: true };
                        if (y.noteHeight) {
                            worksheet.getRow(currentRow).height = y.noteHeight;
                        }
                        let endMergeTablename = worksheet.getRow(currentRow).getCell(columns.length).address;
                        worksheet.mergeCells(`A${currentRow}:${endMergeTablename}`);
                        currentRow = currentRow + 1;
                    }


                    // Thêm header cho bảng
                    let arrHeader = [];
                    if (rowHeader && merges && Number(rowHeader) > 1) {
                        for (let i = 0; i < Number(rowHeader); i++) {
                            arrHeader = [...arrHeader, columns]
                        }
                        for (let j = arrHeader.length - 2; j >= 0; j--) {
                            arrHeader[j] = arrHeader[j].map(arr => {
                                let key = arr.key;
                                merges.forEach(mer => {
                                    if (key === mer.keyMerge) {
                                        arr = { ...arr, key: mer.key, colspan: mer.colspan, value: mer.columnName }
                                    }
                                })
                                return arr;
                            });
                            for (let count = 0; count < j; count++) {
                                arrHeader[count] = arrHeader[j].map(arr => { return { key: arr.key, value: arr.value } });
                            }
                        };

                        // Lấy mảng rowspan cho header table
                        let rowspans = arrHeader[0].map(rowspan => Number(rowHeader));
                        for (let k = 0; k < arrHeader[0].length; k++) {
                            for (let row = 0; row < Number(rowHeader); row++) {
                                let rowData = arrHeader[row];
                                if (rowData[k].colspan && rowData[k].colspan > 1) {
                                    for (let count = 0; count < rowData[k].colspan; count++) {
                                        rowspans[k + count] = rowspans[k + count] - 1;
                                    }
                                }
                            }
                        }

                        // Thêm header của bảng khi rowHeader > 1
                        arrHeader.forEach((arr, index) => {
                            arr = arr.map(cell => cell.value);
                            worksheet.getRow(currentRow + index).values = arr;
                            for (let n = 1; n <= columns.length; n++) { // Thêm style cho header
                                let cell = worksheet.getRow(currentRow + index).getCell(n).address;
                                worksheet.getCell(cell).font = { name: 'Arial', size: 10, bold: true, color: { argb: "FFFFFFFF" } };
                                worksheet.getCell(cell).alignment = {
                                    vertical: columns[n - 1].vertical ? columns[n - 1].vertical : 'middle',
                                    horizontal: columns[n - 1].horizontal ? columns[n - 1].horizontal : 'center',
                                    wrapText: true
                                };
                                worksheet.getCell(cell).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: "FF2D1075" } };
                                worksheet.getCell(cell).border = { left: { style: "thin", color: { argb: "FFFFFFFF" } }, top: { style: "thin", color: { argb: "FFFFFFFF" } } };
                            }

                        });
                        arrHeader.forEach((arr, index) => {
                            arr = arr.map((cell, key) => {
                                let startMergeCell = worksheet.getRow(currentRow + index).getCell(key + 1).address;
                                if (cell.colspan && Number(cell.colspan) > 1) {
                                    let endMergeColum = worksheet.getRow(currentRow + index).getCell(key + Number(cell.colspan)).address;
                                    worksheet.mergeCells(`${startMergeCell}:${endMergeColum}`);
                                };
                                if (rowspans[key] === Number(rowHeader) - index && rowspans[key] > 1) {
                                    let endMergeRow = startMergeCell;
                                    endMergeRow = endMergeRow.replace(/[0-9]/gi, '').trim();
                                    worksheet.mergeCells(`${startMergeCell}:${endMergeRow}${currentRow + rowspans[key] - 1}`);
                                }
                            })
                        })
                        currentRow = currentRow + arrHeader.length;
                    } else {
                        // Thêm header của bảng khi rowHeader = 1
                        worksheet.getRow(currentRow).values = columns.map(col => col.value);
                        for (let n = 1; n <= columns.length; n++) { // Thêm style cho header
                            let cell = worksheet.getRow(currentRow).getCell(n).address;
                            worksheet.getCell(cell).font = { name: 'Arial', size: 10, bold: true, color: { argb: "FFFFFFFF" } };
                            worksheet.getCell(cell).alignment = {
                                vertical: columns[n - 1].vertical ? columns[n - 1].vertical : 'middle',
                                horizontal: columns[n - 1].horizontal ? columns[n - 1].horizontal : 'center',
                                wrapText: true
                            };
                            worksheet.getCell(cell).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: "FF2D1075" } };
                            worksheet.getCell(cell).border = { left: { style: "thin", color: { argb: "FFFFFFFF" } } };
                        }
                        currentRow += 1;
                    };

                    worksheet.columns = columns.map(col => {
                        if (styleColumn) {
                            let vertical = "", horizontal = "";
                            for (let n in styleColumn) {
                                if (n === col.key) {
                                    vertical = styleColumn[n].vertical;
                                    horizontal = styleColumn[n].horizontal;
                                    break;
                                }
                            };
                            return { key: col.key, width: col.width ? Number(col.width) : 15, style: { alignment: { vertical: vertical, horizontal: horizontal, wrapText: true } } }
                        } else {
                            return { key: col.key, width: col.width ? Number(col.width) : 15, style: { alignment: { wrapText: true } } }
                        }
                    });



                    // Thêm dữ liệu vào body table
                    worksheet.addRows(y.data);
                    y.data.forEach((obj, index) => {
                        if (obj.merges && typeof obj.merges === 'object') {
                            let keyColumns = columns.map(col => col.key);
                            let merges = obj.merges;
                            for (let n in merges) {
                                if (merges[n] > 1) {
                                    let startMergeCell = worksheet.getRow(currentRow + index).getCell(keyColumns.indexOf(n) + 1).address;
                                    let endMergeRow = startMergeCell;
                                    endMergeRow = endMergeRow.replace(/[0-9]/gi, '').trim();
                                    worksheet.mergeCells(`${startMergeCell}:${endMergeRow}${currentRow + index + merges[n] - 1}`);
                                }
                            }
                        }
                        worksheet.getRow(currentRow + index).font = { name: 'Arial' };
                    })
                    currentRow = currentRow + y.data.length + 3;
                })
            }
        });

        workbook.xlsx.writeBuffer().then(data => {
            const blob = new Blob([data], { type: this.blobType });
            FileSaver.saveAs(blob, `${exportData.fileName}.xlsx`);
        });
    }

    /**
     * Function bắt sự kiện click xuất báo cáo
     */
    handleExportExcel = () => {
        const { exportData } = this.state;
        if (this.props.onClick) {
            this.props.onClick();
        } else {
            ExportExcel.export(exportData);
        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            id: nextProps.id,
            exportData: nextProps.exportData,
        }
    };

    render() {
        const { type = 'button', buttonName = 'Xuất báo cáo', style = {}, className = "btn btn-primary pull-right", title = "" } = this.props;
        return (
            <React.Fragment>
                {type === 'button' && <button type="button" style={style} className={className} title={title} onClick={this.handleExportExcel} >{buttonName}<i className="fa fa-fw fa-file-excel-o"> </i></button>}
                {type === 'link' &&
                    <a className='pull-right' style={Object.assign({ cursor: "pointer" }, style)} onClick={this.handleExportExcel}>
                        <i className="fa fa-fw fa-download"></i> {buttonName}<i className="fa fa-fw fa-file-excel-o"></i>
                    </a>
                }
            </React.Fragment>
        )
    }
};

const exportExcel = connect(null, null)(ExportExcel);
export { exportExcel as ExportExcel };