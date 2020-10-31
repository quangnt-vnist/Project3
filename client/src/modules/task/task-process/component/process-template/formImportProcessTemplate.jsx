import React, { Component } from 'react';
import { configProcessTemplate, templateImportProcessTemplate } from './fileConfigurationImportProcessTemplate';
import { DialogModal, ImportFileExcel, ShowImportData, ConFigImportFile, ExportExcel } from '../../../../../common-components';
import { TaskProcessActions } from '../../redux/actions';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../../../auth/redux/actions';

class FormImportProcessTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            configData: configProcessTemplate,
            // templateImportProcessTemplate: templateImportProcessTemplate,
            checkFileImport: true,
            rowError: [],
            importData: [],
            importShowData: [],
            processData: [],
            limit: 100,
            page: 0
        };
    }

    // Function thay đổi cấu hình file import
    handleChangeConfig = (value) => {
        this.setState({
            configData: value,
            importData: [],
        })
    }

    handleDataSend = () => {

    }

    handleImportExcel = (value, checkFileImport) => {
        let values = [];
        let valueShow = [];
        let k = -1;
        for (let i = 0; i < value.length; i++) {
            let x = value[i];
            k = k + 1;
            values = [...values, {
                // "STT": x.processName ? k + 1 : '',
                "processName": x.processName ? x.processName : "",
                "processDescription": x.processDescription ? x.processDescription : '',
                "manager": x.manager ? x.manager : '',
                "viewer": x.viewer ? x.viewer : '',
                "xmlDiagram": x.xmlDiagram ? x.xmlDiagram : '',

                "taskName": x.taskName ? x.taskName : '',
                "taskDescription": x.taskDescription ? x.taskDescription : '',
                "code": x.code ? x.code : '',
                "responsibleEmployees": x.responsibleEmployees ? x.responsibleEmployees : '',
                "accountableEmployees": x.accountableEmployees ? x.accountableEmployees : '',
                "consultedEmployees": x.consultedEmployees ? x.consultedEmployees : '',
                "informedEmployees": x.informedEmployees ? x.informedEmployees : '',
                "organizationalUnit": x.organizationalUnit ? x.organizationalUnit : '',
                "priority": x.priority ? x.priority : '',
                "formula": x.formula ? x.formula : '',

                "taskActions": [x.taskActions],
                "taskInformations": [x.taskInformations],
            }];
            valueShow = [...valueShow, {
                // "STT":  x.processName ? k + 1 : '',
                "processName": x.processName ? x.processName : "",
                "processDescription": x.processDescription ? x.processDescription : '',
                "manager": x.manager ? x.manager : '',
                "viewer": x.viewer ? x.viewer : '',
                "xmlDiagram": x.xmlDiagram ? x.xmlDiagram : '',

                "taskName": x.taskName ? x.taskName : '',
                "taskDescription": x.taskDescription ? x.taskDescription : '',
                "code": x.code ? x.code : '',
                "responsibleEmployees": x.responsibleEmployees ? x.responsibleEmployees : '',
                "accountableEmployees": x.accountableEmployees ? x.accountableEmployees : '',
                "consultedEmployees": x.consultedEmployees ? x.consultedEmployees : '',
                "informedEmployees": x.informedEmployees ? x.informedEmployees : '',
                "organizationalUnit": x.organizationalUnit ? x.organizationalUnit : '',
                "priority": x.priority ? x.priority : '',
                "formula": x.formula ? x.formula : '',

                "taskActions": [x.taskActions],
                "taskInformations": [x.taskInformations],
            }];
        }
        console.log('quangdz \n\n\n\n', value, values);

        // Xử lý dữ liệu gửi lên server
        let processData = [];
        let itemProcess = {};
        let taskList = [];
        let prevRow = {};
        for (let i = 0; i < values.length; i++) {

            let e = values[i];
            if (e.processName !== "") {

                // reset giá trị của itemProcess, taskList
                itemProcess = {};
                taskList = []

                itemProcess.processName = e.processName;
                itemProcess.processDescription = e.processDescription;
                itemProcess.manager = e.manager.split(",");
                itemProcess.viewer = e.viewer.split(",");
                itemProcess.xmlDiagram = e.xmlDiagram;

                // phần tử lưu trữ dữ liệu task hiện tại
                let elm = {};

                elm.name = e.taskName;
                elm.description = e.taskDescription;
                elm.code = e.code;
                elm.organizationalUnit = e.organizationalUnit;
                elm.priority = e.priority;
                elm.formula = e.formula;

                elm.responsibleEmployees = (e.responsibleEmployees !== "") ? e.responsibleEmployees.split(',') : [];
                elm.accountableEmployees = (e.accountableEmployees !== "") ? e.accountableEmployees.split(',') : [];
                elm.consultedEmployees = (e.consultedEmployees !== "") ? e.consultedEmployees.split(',') : [];
                elm.informedEmployees = (e.informedEmployees !== "") ? e.informedEmployees.split(',') : [];

                elm.taskActions = [e.taskActions];
                elm.taskInformations = [e.taskInformations];

                // gán gia trị của task khởi tạo để dùng cho việc check các dòng dữ liệu sau dòng này
                prevRow = elm

            } else {
                let elm = {};
                if (e.taskName !== "") {

                    elm.name = e.taskName;
                    elm.description = e.taskDescription;
                    elm.code = e.code;
                    elm.organizationalUnit = e.organizationalUnit;
                    elm.priority = e.priority;
                    elm.formula = e.formula;

                    elm.responsibleEmployees = (e.responsibleEmployees !== "") ? e.responsibleEmployees.split(',') : [];
                    elm.accountableEmployees = (e.accountableEmployees !== "") ? e.accountableEmployees.split(',') : [];
                    elm.consultedEmployees = (e.consultedEmployees !== "") ? e.consultedEmployees.split(',') : [];
                    elm.informedEmployees = (e.informedEmployees !== "") ? e.informedEmployees.split(',') : [];

                    elm.taskActions = [e.taskActions];
                    elm.taskInformations = [e.taskInformations];

                    // gán gia trị của task khởi tạo để dùng cho việc check các dòng dữ liệu sau dòng này
                    prevRow = elm;
                }
                else {
                    prevRow.taskActions.push(e.taskActions);
                    prevRow.taskInformations.push(e.taskInformations);
                }

            }

            // cập nhật taskList và itemProcess
            if (i === values.length - 1 || values[i + 1]?.taskName !== "") {
                taskList.push(prevRow);
                itemProcess.tasks = taskList;
            }

            // cập nhật giá trị của mảng ProcessData
            if (i === values.length - 1 || values[i + 1]?.processName !== "") {
                processData.push(itemProcess);
            }
        }

        // kiểm tra validate
        if (checkFileImport) {
            let rowError = [];
            for (let i = 0; i < value.length; i++) {
                let x = value[i];
                let errorAlert = [];
                if (x.processName === null || x.processDescription === null || x.viewer === null || x.manager === null) {
                    rowError = [...rowError, i + 1];
                    x = { ...x, error: true };
                }
                if (x.processDescription === null) {
                    errorAlert = [...errorAlert, 'Tên mẫu quy trình không được để trống'];
                }
                if (x.viewer === null) {
                    errorAlert = [...errorAlert, 'Tên phòng ban không được để trống'];
                }
                if (x.manager === null) {
                    errorAlert = [...errorAlert, 'Tên mô tả mẫu công việc không được để trống'];
                }
                // if (x.organizationalUnit === null) {
                //     errorAlert = [...errorAlert, 'Đơn vị công việc không được để trống'];
                // }
                // if (x.taskName === null) {
                //     errorAlert = [...errorAlert, 'Tên công việc không được để trống'];
                // }
                x = { ...x, errorAlert: errorAlert };
                value[i] = x;
            };
            // convert dữ liệu thành dạng array json mong muốn để gửi lên server

            this.setState({
                importData: value,
                importShowData: valueShow,
                processData: processData,
                rowError: rowError,
                checkFileImport: checkFileImport,
            })
        } else {
            this.setState({
                checkFileImport: checkFileImport,
            })
        }
    }

    save = () => {
        let { importShowData, importData, processData } = this.state;
        console.log(importShowData, importData);
        console.log("processData", processData);
        this.props.importProcessTemplate(processData);
    }

    requestDownloadFile = (e, path, fileName) => {
        e.preventDefault()
        this.props.downloadFile(path, fileName)
    }

    convertDataExport = (dataExport) => {
        for (let va = 0; va < dataExport.dataSheets.length; va++) {
            for (let val = 0; val < dataExport.dataSheets[va].tables.length; val++) {
                let datas = [];
                let data = dataExport.dataSheets[va].tables[val].data;

                for (let idx = 0; idx < data.length; idx++) {
                    let dataItem = data[idx];
                    let taskList = data[idx].tasks;
                    let lengthOfTask = 0;
                    let taskData = [];

                    for (let k = 0; k < taskList?.length; k++) {
                        let x = taskList[k];
                        let length = 0;
                        let actionName = [], actionDescription = [], mandatory = [];

                        if (x.taskActions && x.taskActions.length > 0) {
                            if (x.taskActions.length > length) {
                                length = x.taskActions.length;
                            }
                            for (let i = 0; i < x.taskActions.length; i++) {
                                actionName[i] = x.taskActions[i].name;
                                actionDescription[i] = x.taskActions[i].description;
                                if (x.taskActions[i].mandatory) {
                                    mandatory[i] = "true";
                                } else {
                                    mandatory[i] = "false";
                                }
                            }
                        }
                        let infomationName = [], type = [], infomationDescription = [], filledByAccountableEmployeesOnly = [];
                        if (x.taskInformations && x.taskInformations.length !== 0) {
                            if (x.taskInformations.length > length) {
                                length = x.taskInformations.length;
                            }
                            for (let i = 0; i < x.taskInformations.length; i++) {
                                infomationName[i] = x.taskInformations[i].name;
                                infomationDescription[i] = x.taskInformations[i].description;
                                type[i] = x.taskInformations[i].type;
                                filledByAccountableEmployeesOnly[i] = x.taskInformations[i].filledByAccountableEmployeesOnly;
                            }
                        }
                        let code = '';
                        if (x.code !== 0) {
                            code = x.code;
                        }
                        let responsibleEmployees, accountableEmployees, consultedEmployees, informedEmployees;

                        if (Array.isArray(x.responsibleEmployees)) {
                            responsibleEmployees = x.responsibleEmployees.join(', ');
                        } else {
                            responsibleEmployees = x.responsibleEmployees;
                        }
                        if (Array.isArray(x.accountableEmployees)) {
                            accountableEmployees = x.accountableEmployees.join(', ');
                        } else {
                            accountableEmployees = x.accountableEmployees;
                        }
                        if (Array.isArray(x.consultedEmployees)) {
                            consultedEmployees = x.consultedEmployees.join(', ');
                        } else {
                            consultedEmployees = x.consultedEmployees;
                        }
                        if (Array.isArray(x.informedEmployees)) {
                            informedEmployees = x.informedEmployees.join(', ');
                        } else {
                            informedEmployees = x.informedEmployees;
                        }
                        let generalData;
                        if (k === 0) {
                            generalData = {
                                STT: idx + 1,
                                processName: dataItem.processName,
                                processDescription: dataItem.processDescription,
                                manager: dataItem.manager,
                                viewer: dataItem.viewer,
                                xmlDiagram: dataItem.xmlDiagram,
                            }
                        } else {
                            generalData = {
                                STT: "",
                                processName: "",
                                processDescription: "",
                                manager: "",
                                viewer: "",
                                xmlDiagram: "",
                            }
                        }
                        let out = {
                            STT: generalData.STT,
                            processName: generalData.processName,
                            processDescription: generalData.processDescription,
                            manager: generalData.manager,
                            viewer: generalData.viewer,
                            xmlDiagram: generalData.xmlDiagram,

                            taskName: x.taskName,
                            taskDescription: x.taskDescription,
                            code: code,
                            responsibleEmployees: responsibleEmployees,
                            accountableEmployees: accountableEmployees,
                            consultedEmployees: consultedEmployees,
                            informedEmployees: informedEmployees,
                            organizationalUnits: x.organizationalUnit,
                            priority: x.priority,
                            formula: x.formula,

                            actionName: actionName[0],
                            actionDescription: actionDescription[0],
                            mandatory: mandatory[0],

                            infomationName: infomationName[0],
                            infomationDescription: infomationDescription[0],
                            type: type[0],
                            filledByAccountableEmployeesOnly: filledByAccountableEmployeesOnly[0]
                        }

                        datas = [...datas, out];

                        if (length > 1) {
                            for (let i = 1; i < length; i++) {
                                out = {
                                    STT: "",
                                    processName: "",
                                    processDescription: "",
                                    manager: "",
                                    viewer: "",
                                    xmlDiagram: "",

                                    taskName: "",
                                    taskDescription: "",
                                    code: "",
                                    creator: "",
                                    responsibleEmployees: "",
                                    accountableEmployees: "",
                                    consultedEmployees: "",
                                    informedEmployees: "",
                                    organizationalUnits: "",
                                    priority: "",
                                    formula: "",

                                    actionName: actionName[i],
                                    actionDescription: actionDescription[i],
                                    mandatory: mandatory[i],

                                    infomationName: infomationName[i],
                                    infomationDescription: infomationDescription[i],
                                    type: type[i],
                                    filledByAccountableEmployeesOnly: filledByAccountableEmployeesOnly[i]
                                };
                                lengthOfTask = lengthOfTask + length;
                                datas = [...datas, out];
                            }

                        }
                    }
                    dataExport.dataSheets[va].tables[val].data = datas;
                }
            }
        }
        return dataExport;
    }

    render() {
        const { translate } = this.props;
        let { limit, page, importData, importShowData, rowError, configData, checkFileImport } = this.state;
        let templateImportProcessTemplate2 = this.convertDataExport(templateImportProcessTemplate);

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-import-process-task`} isLoading={false}
                    formID={`form_import_file`}
                    title="Thêm mẫu quy trình bằng import file excel"
                    func={this.save}
                    disableSubmit={false}
                    size={75}
                >
                    <form className="form-group" id={`form_import_file`}>
                        <ConFigImportFile
                            id="import_taskTemplate_config"
                            configData={configData}
                            // textareaRow={8}
                            scrollTable={false}
                            handleChangeConfig={this.handleChangeConfig}
                        />
                        <div className="row">
                            <div className="form-group col-md-4 col-xs-12">
                                <ImportFileExcel
                                    configData={configData}
                                    handleImportExcel={this.handleImportExcel}
                                />
                            </div>
                            <div className="form-group col-md-4 col-xs-12">
                                <label></label>
                                <ExportExcel id="download_template_task_template" type='link' exportData={templateImportProcessTemplate2}
                                    buttonName='Download file import mẫu' />
                            </div>
                            <div className="form-group col-md-12 col-xs-12">
                                <ShowImportData
                                    id="import_process_template_show_data"
                                    configData={configData}
                                    importData={importData}
                                    rowError={rowError}
                                    scrollTable={false}
                                    checkFileImport={checkFileImport}
                                    limit={limit}
                                    page={page}
                                />
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        )
    }

}

function mapState(state) {
    const { taskProcess } = state;
    return { taskProcess };
};
const actionCreators = {
    importProcessTemplate: TaskProcessActions.importProcessTemplate,
    downloadFile: AuthActions.downloadFile,
};
const importFileExcel = connect(mapState, actionCreators)(withTranslate(FormImportProcessTemplate));
export { importFileExcel as FormImportProcessTemplate };