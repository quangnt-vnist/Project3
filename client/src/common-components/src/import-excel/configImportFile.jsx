import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SlimScroll } from '../../../common-components'

class ConFigImportFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textareaValue: this.convertConfigurationToString(this.props.configData),
            configData: this.props.configData,
        };
    }

    /**
     *Chuyển đổi dữ liệu file cấu hình (object) thành String
     * @param {*} configData : Dữ liệu file cấu hình
     */
    convertConfigurationToString = (configData) => {
        let stringData = "{";
        let config = { ...configData }, headerTable = [];
        delete config.file;
        for (let key in config) {
            headerTable = [...headerTable, { key: key, value: config[key].value, description: config[key].description }]
        }
        for (let n in headerTable) {
            if (!Array.isArray(headerTable[n].value)) {
                stringData = stringData + `
                "${headerTable[n].description}": "${headerTable[n].value}",`
            } else {
                let arr = headerTable[n].value;
                if (arr.length > 1) {
                    arr = arr.map(x => `"${x}"`);
                    arr = arr.join(', ');
                } else {
                    arr = `"${arr}"`
                }
                stringData = stringData + `
                "${headerTable[n].description}": [${arr}],`
            }
        }
        stringData = stringData + `
}`
        return stringData;
    }

    /**
     * Chuyển đổi dữ liệu người dùng nhập vào ở textarea (String) thành object
     * @param {*} data : Dữ liệu textarea
     * @param {*} configData : Dữ liệu cấu hình file import
     */
    convertStringToObject = (data, configData) => {
        let config = { ...configData };
        delete config.file;
        try {
            data = data.substring(1, data.length - 1); // xoá dấu "{" và "}"" ở đầu và cuối String
            data = data.split(',').map(x => x.trim()); // xoá các space dư thừa
            data = data.join(',');

            if (data[data.length - 1] === ',') {    // xoá dấu "," nếu tồn tại ở cuối chuỗi để chuyển đổi dc về dạng string
                data = data.substring(0, data.length - 1);
            }
            data = JSON.parse(`{${data}}`);
            let obj = {};
            for (let key in config) {
                for (let index in data) {
                    if (index === config[key].description) {
                        obj = { ...obj, [key]: { ...config[key], value: data[index] } }
                    }
                }
            }
            return obj
        } catch (error) {
            return null
        }
    }

    /** Bắt sự kiện thay đổi (textarea) */
    handleChange = (e) => {
        const { configData, handleChangeConfig } = this.props;
        const { value } = e.target;
        let config = this.convertStringToObject(value, configData);
        if (config) {
            this.setState({
                textareaValue: value,
                configData: config,
            })
            config = { ...config, file: configData.file }
            handleChangeConfig(config);
        } else {
            this.setState({
                textareaValue: value,
            })
        }

    }

    render() {
        const { translate } = this.props;
        const { id, scrollTableWidth = 1000, scrollTable = true, textareaRow = 10 } = this.props;

        const { textareaValue, configData } = this.state;

        let config = [];
        for (let key in configData) {
            if (key !== "file" && key != "rowHeader" && key !== "sheets") {
                config = [...config, configData[key]];
            }
        }

        return (
            <React.Fragment>
                <button type="button" data-toggle="collapse" data-target={`#confic_import_file-${id}`} className="pull-right"
                    style={{ border: "none", background: "none", padding: 0 }}><i className="fa fa-gear" style={{ fontSize: "19px" }}></i></button>

                <div id={`confic_import_file-${id}`} className="box box-solid box-default collapse col-sm-12 col-xs-12" style={{ padding: 0 }}>
                    <div className="box-header with-border">
                        <h3 className="box-title">Cấu hình file import</h3>
                        <div className="box-tools pull-right">
                            <button type="button" className="btn btn-box-tool" data-toggle="collapse"
                                data-target={`#confic_import_file-${id}`} ><i className="fa fa-times"></i></button>
                        </div>
                    </div>
                    <div className="box-body row">
                        <div className="form-group col-sm-12 col-xs-12">
                            <textarea className="form-control" rows={textareaRow} name="reason"
                                value={textareaValue} onChange={this.handleChange}></textarea>
                        </div>

                        <div className="form-group col-sm-12 col-xs-12">
                            <label>Cấu hình file import của bạn như sau:</label><br />
                            <span>File import đọc dữ liệu các sheet: </span>
                            <span className="text-success" style={{ fontWeight: "bold" }}>&nbsp;{configData.sheets.value.length > 1 ? configData.sheets.value.join(', ') : configData.sheets.value}</span>

                            <div id={`croll-table-${id}`} style={{ marginTop: 5 }}>
                                <table id={`importConfig-${id}`} className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>Tên các thuộc tính</th>
                                            {config.map((x, key) => {
                                                return <th key={key}>{x.columnName}</th>
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>Tiêu đề tương ứng</th>
                                            {config.map((x, key) => {
                                                if (!Array.isArray(x.value)) {
                                                    return <td key={key}>{x.value}</td>
                                                } else {
                                                    let arr = x.value
                                                    return <td key={key}>{arr.join(', ')}</td>
                                                }
                                            })}

                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            {scrollTable && <SlimScroll outerComponentId={`croll-table-${id}`} innerComponentId={`importConfig-${id}`} innerComponentWidth={scrollTableWidth} activate={true} />}
                        </div>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}

const config = connect(null, null)(withTranslate(ConFigImportFile));
export { config as ConFigImportFile };