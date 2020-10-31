import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { UploadFile } from '../../../common-components'

import XLSX from 'xlsx';

class ImportFileExcel extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // Bắt xự kiện chọn file import
    handleChangeFileImport = (files) => {
        let { configData } = this.props;
        let sheets = configData.sheets.value;
        let rowHeader = configData.rowHeader ? Number(configData.rowHeader.value) : 1;
        let file = files[0];

        if (file !== undefined) {
            const reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = (evt) => {
                let sheet_lists = [];
                const fileImport = evt.target.result;
                const workbook = XLSX.read(fileImport, { type: 'binary' });
                let sheet_name_list = workbook.SheetNames;

                // Kiểm tra lọc lấy các sheet tồn tại mà người dùng muốn import
                for (let n in sheets) {
                    sheet_lists = sheet_lists.concat(sheet_name_list.filter(x => x.trim().toLowerCase() === sheets[n].trim().toLowerCase()));
                }
                let indexKeyImport = {}, importData = [];
                for (let key in configData) {
                    if (key !== 'sheets' && key !== 'rowHeader' && key !== 'file') {
                        let data = configData[key];
                        data = data.value;
                        if (Array.isArray(data)) {
                            data = data.map(x => x.toString());
                        } else {
                            data = data.toString();
                        }
                        indexKeyImport = { ...indexKeyImport, [key]: data }
                    }
                }

                let checkFileImport = false;
                sheet_lists.length !== 0 && sheet_lists.forEach(x => {
                    // console.log(XLSX.utils.decode_col("A"));
                    let data = XLSX.utils.sheet_to_json(workbook.Sheets[x], { header: 1, blankrows: false, defval: null });
                    // Lấy index của các tiều đề cột mà người dùng muốn import
                    for (let i = 0; i < data.length - rowHeader; i++) {
                        let indexKey = { ...indexKeyImport };
                        for (let j = 0; j < rowHeader; j++) {
                            data[i + j].forEach((x, index) => {
                                if (x !== null) {
                                    for (let key in configData) {
                                        let config = configData[key];
                                        if (key !== 'sheets' && key !== 'rowHeader' && key !== 'file' && Array.isArray(config.value)) {
                                            let arr = indexKey[key];
                                            arr = arr.map(y => {
                                                if (typeof y === 'string' && x.toString().trim().toLowerCase() === y.toString().trim().toLowerCase()) {
                                                    return index
                                                } else {
                                                    return y
                                                }
                                            });
                                            indexKey[key] = arr;
                                            // break;
                                        } else if (key !== 'sheets' && key !== 'rowHeader' && key !== 'file') {
                                            if (!Array.isArray(config.value) && x.toString().trim().toLowerCase() === config.value.toString().trim().toLowerCase()) {
                                                if (config.colspan) {
                                                    let arr = [];
                                                    for (let i = 0; i < Number(config.colspan); i++) {
                                                        arr = [...arr, i + index];
                                                    }
                                                    indexKey[key] = arr;
                                                    rowHeader += 1;
                                                } else {
                                                    indexKey[key] = index;
                                                }
                                                // break;
                                            }
                                        }
                                    }
                                }
                            });
                        }
                        let done = true;
                        for (let key in indexKey) {
                            if (Array.isArray(indexKey[key])) {
                                indexKey[key].forEach(y => {
                                    if (typeof y !== 'number') {
                                        done = false;
                                    }
                                })
                            } else if (typeof indexKey[key] !== 'number') {
                                done = false;
                            }
                        };
                        if (done) {
                            checkFileImport = true;
                            indexKeyImport = indexKey;
                            rowHeader = rowHeader + i;
                            break;
                        }
                    }

                    // Convert dữ liệu thành dạng array json theo key trong configData
                    data.splice(0, rowHeader);
                    data.forEach((x, index) => {
                        let rowData;
                        for (let n in indexKeyImport) {
                            if (Array.isArray(indexKeyImport[n])) {
                                let obj = indexKeyImport[n].map(ob => x[ob]);
                                rowData = { ...rowData, [n]: obj };
                            } else {
                                rowData = { ...rowData, [n]: x[indexKeyImport[n]] }
                            }
                        }
                        data[index] = rowData;
                    })
                    importData = importData.concat(data);
                })

                this.props.handleImportExcel(importData, checkFileImport);
            };
        } else {
            this.props.handleImportExcel([], true);
        }
    }

    render() {
        const { translate } = this.props;

        const { disabled = false } = this.props;

        return (
            <React.Fragment>
                <label>{translate('human_resource.choose_file')}</label>
                <UploadFile onChange={this.handleChangeFile} deleteValue={false} importFile={this.handleChangeFileImport} disabled={disabled}
                    accept=".xlms,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
            </React.Fragment>
        )
    }
}

const importExcel = connect(null, null)(withTranslate(ImportFileExcel));
export { importExcel as ImportFileExcel };