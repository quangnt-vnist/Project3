import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskTemplateActions } from '../../../task/task-template/redux/actions';
import { TaskReportActions } from '../redux/actions';
import { DialogModal, ErrorLabel, SelectBox, DatePicker } from '../../../../common-components';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import ValidationHelper from '../../../../helpers/validationHelper';
import './transferList.css';
class TaskReportEditForm extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.state = {
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,
            editingReport: {
                // readByEmployees: [],
                status: 0,
                coefficient: 1,
                itemListTempLeft: [],
                itemListTempRight: [],
            },
        }
    }

    componentDidMount() {
        // get department of current user 
        this.props.getDepartment();
        // lấy tất cả nhân viên của công ty
        this.props.getAllUserOfCompany();
        // Lấy tất cả nhân viên trong công ty
        this.props.getAllUserInAllUnitsOfCompany();
        this.props.getTaskTemplateByUser(1, 0, []);
        this.props.getRoleSameDepartment(localStorage.getItem("currentRole"));
    }

    /**
     * Hàm xử lý sự kiện thay đổi đơn vị
     * @param {*} e 
     */
    handleReportOrganizationalUnitChangeEditForm = (value) => {
        let { editingReport } = this.state;
        value = value[0];

        if (value) {
            this.props.getAllUserOfDepartment(value);
            this.props.getChildrenOfOrganizationalUnits(value);
            this.setState({
                editingReport: {
                    ...editingReport,
                    organizationalUnit: value,
                    responsibleEmployees: [],
                    accountableEmployees: [],
                    readByEmployees: [],
                    taskTemplate: '',
                },
                nameErrorEditForm: undefined,
                descriptionErrorEditForm: undefined,
                readByEmployeeErrorCreateForm: undefined,
                startDateErrorEditForm: undefined,
                taskTemplateErrorEditForm: undefined,
            });
        }
    }


    /**
     * Hàm xử lý sự kiện thay đổi tên báo cáo
     * @param {*} value 
     * @param {*} willUpdateState 
     */
    handleNameTaskReportChangeEditForm = (e) => {
        let { editingReport } = this.state;
        const { translate } = this.props;
        let { value } = e.target;

        this.setState({
            editingReport: {
                ...editingReport,
                name: value,
            }
        })
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ nameErrorEditForm: message });
    }


    /**
    * Bắt sự kiện thay đổi cho ô input mô tả báo cáo
    * @param {*} e 
    */
    handleDesTaskReportChangeEditForm = (e) => {
        let { editingReport } = this.state;
        const { translate } = this.props;
        let value = e.target.value;

        this.setState({
            editingReport: {
                ...editingReport,
                description: value,
            }
        });
        let { message } = ValidationHelper.validateDescription(translate, value);
        this.setState({ descriptionErrorEditForm: message });
    }


    /**
     * Hàm xử lý sự kiện thay đổi mẫu công việc
     * @param {*} e 
     */
    handleTaskTemplateChangeEditForm = (value) => {
        let { editingReport } = this.state;
        value = value[0];

        if (value) {
            let taskTemplate = this.props.tasktemplates.items.find((taskTemplate) =>
                taskTemplate._id === value
            );

            let taskInformations = [];
            if (taskTemplate.taskInformations) {
                for (let [index, value] of taskTemplate.taskInformations.entries()) {
                    taskInformations[index] = {
                        ...value,
                        charType: '0',
                        aggregationType: '0',
                    }
                }
            }

            this.setState({
                editingReport: {
                    ...editingReport,
                    taskTemplate: taskTemplate._id,
                    responsibleEmployees: taskTemplate.responsibleEmployees.map(o => o._id),
                    accountableEmployees: taskTemplate.accountableEmployees.map(o => o._id),
                    taskInformations: taskInformations,
                },
                nameErrorEditForm: undefined,
                descriptionErrorEditForm: undefined,
                readByEmployeeErrorCreateForm: undefined,
                startDateErrorEditForm: undefined,
                taskTemplateErrorEditForm: undefined
            })
        }
    }


    /**
     * Hàm xử lý sự kiện thay đổi đặc thù công việc
     * @param {*} value 
     */
    handleStatusChangeEditForm = (value) => {
        let { editingReport } = this.state;
        this.setState({
            editingReport: {
                ...editingReport,
                status: value,
            }
        })
    }

    /**
     * Hàm xử lý sự kiện thay đổi tần suất
     * @param {*} value 
     */
    handleFrequencyChangeEditForm = (value) => {
        let { editingReport } = this.state;
        this.setState({
            editingReport: {
                ...editingReport,
                frequency: value[0],
            }
        })
    }

    /**
     * Hàm xử lý sự kiện thay đổi người thực hiện
     * @param {*} value 
     */
    handleResponsibleEmployeesChangeEditForm = (value) => {
        let { editingReport } = this.state;
        this.setState({
            editingReport: {
                ...editingReport,
                responsibleEmployees: value,
            }
        })
    }

    /**
     * Hàm xử lý sự kiện thay đổi người phê duyệt
     * @param {*} value 
     */
    handleAccountableEmployeesChangeEditForm = (value) => {
        let { editingReport } = this.state;
        this.setState({
            editingReport: {
                ...editingReport,
                accountableEmployees: value,
            }
        })
    }


    handleTaskReportReadChangeEditForm = (value) => {
        let { editingReport } = this.state;
        const { translate } = this.props;

        this.setState({
            editingReport: {
                ...editingReport,
                readByEmployees: value
            }
        })

        let { message } = ValidationHelper.validateEmpty(translate, value.toString());
        this.setState({ readByEmployeeErrorCreateForm: message })
    }
    /**
     * Hàm bắt sự kiện thay đổi ngày bắt đầu
     * @param {*} value 
     */
    handleStartDateChangeEditForm = (value) => {
        let { editingReport } = this.state;
        const { translate } = this.props;

        if (typeof value === 'undefined') {
            this.setState({
                editingReport: {
                    ...editingReport,
                    startDate: '',
                }
            });
        } else {
            this.setState({
                editingReport: {
                    ...editingReport,
                    startDate: value,
                }
            })
        }

        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({ startDateErrorEditForm: message });
    }


    /**
     * Hàm bắt sự kiện thy đổi ngày kết thúc
     * @param {*} value 
     */
    handleEndDateChangeEditForm = (value) => {
        let { editingReport } = this.state
        if (typeof value === 'undefined') {
            this.setState({
                editingReport: {
                    ...editingReport,
                    endDate: '',
                }
            });
        } else {
            this.setState({
                editingReport: {
                    ...editingReport,
                    endDate: value,
                }
            })
        }
    }


    /**
     * Hàm bắt sự kiện thay đổi điều kiện lọc
     * @param {*} index 
     * @param {*} e 
     */
    handleEditFilter = (index, e) => {
        let { value } = e.target;
        let { editingReport } = this.state;
        let taskInformations = editingReport.taskInformations;

        taskInformations[index] = { ...taskInformations[index], filter: value };

        this.setState({
            editingReport: {
                ...editingReport,
                taskInformations: taskInformations,
            }
        })
    }


    /**
     * Hàm xử lý sự kiện thay đổi trường showInReport
     * @param {*} index 
     * @param {*} item 
     */
    handleEditShowInReport = (index, item) => {
        let { editingReport } = this.state;
        let value = item.target.checked;
        let taskInformations = editingReport.taskInformations;

        taskInformations[index] = { ...taskInformations[index], showInReport: value };
        this.setState({
            editingReport: {
                ...editingReport,
                taskInformations: taskInformations,
            }
        })
    }

    /**
     * Hàm xử lý sự kiện thay đổi trường newName
     * @param {*} index 
     * @param {*} e 
     */
    handleEditNewName = (index, e) => {
        let { value } = e.target;
        let { editingReport } = this.state;
        let taskInformations = editingReport.taskInformations;

        taskInformations[index] = { ...taskInformations[index], newName: value }

        this.setState({
            editingReport: {
                ...editingReport,
                taskInformations: taskInformations,
            }
        })
    }

    /**
     * Hàm xử lý sự kiện khi thay đổi cách tính
     * @param {*} index 
     * @param {*} value 
     */
    handleAggregationTypeChangeEditForm = (index, value) => {
        let { editingReport } = this.state;
        let taskInformations = editingReport.taskInformations;

        taskInformations[index] = { ...taskInformations[index], aggregationType: value.toString() }

        this.setState({
            editingReport: {
                ...editingReport,
                taskInformations: taskInformations,
            }
        })
    }


    /**
     * Hàm xử lý khi thay đổi input chọn dạng biểu đồ
     * @param {*} index 
     * @param {*} value 
     */
    handleChartTypeChangeEditForm = (index, value) => {
        let { editingReport } = this.state;
        let taskInformations = editingReport.taskInformations;

        taskInformations[index] = { ...taskInformations[index], charType: value.toString() };
        this.setState({
            editingReport: {
                ...editingReport,
                taskInformations: taskInformations,
            }
        })
    }


    /**
     * Hàm kiểm tra đã validate chưa
     */
    isFormValidated = () => {
        let { editingReport } = this.state;
        let { name, description, startDate } = editingReport;
        const { translate } = this.props;

        if (!ValidationHelper.validateName(translate, name).status
            || !ValidationHelper.validateDescription(translate, description).status
            || !ValidationHelper.validateEmpty(translate, startDate).status)
            return false;
        return true;
    }


    /**
    * Hàm xử lý khi ấn lưu
    */
    save = () => {
        const { taskReportEditId, editingReport } = this.state;
        if (this.isFormValidated()) {
            this.props.editTaskReport(taskReportEditId, editingReport);
        }
    }


    static getDerivedStateFromProps(props, state) {
        if (props.taskReportId !== state.taskReportEditId) {
            props.getTaskReportById(props.taskReportId);
            return {
                dataStatus: 1,
                taskReportEditId: props.taskReportId,
            }
        } else {
            return null;
        }
    }


    shouldComponentUpdate = async (nextProps, nextState) => {
        let { editingReport } = this.state;
        if (this.state.dataStatus === this.DATA_STATUS.QUERYING && !nextProps.reports.isLoading) {
            let listTaskReport = nextProps.reports.listTaskReportById;

            editingReport = {
                ...editingReport,
                ...listTaskReport,
                organizationalUnit: listTaskReport && listTaskReport.organizationalUnit._id,
                responsibleEmployees: listTaskReport && listTaskReport.responsibleEmployees.map(x => x._id),
                accountableEmployees: listTaskReport && listTaskReport.accountableEmployees.map(x => x._id),
                readByEmployees: listTaskReport && listTaskReport.readByEmployees.map(x => x._id),
                taskTemplate: listTaskReport && listTaskReport.taskTemplate._id,
                startDate: listTaskReport && this.formatDate(listTaskReport.startDate),
                endDate: listTaskReport && this.formatDate(listTaskReport.endDate),
                taskInformations: listTaskReport && listTaskReport.configurations,
            }
            this.setState({
                dataStatus: this.DATA_STATUS.AVAILABLE,
                editingReport,
            });
            return false;
        }

        if (this.state.dataStatus === this.DATA_STATUS.AVAILABLE) {
            this.setState({
                dataStatus: this.DATA_STATUS.FINISHED,
            });
            return true;
        }
        return false;
    }

    // componentDidUpdate() {
    //     if (this.state.dataStatus === this.DATA_STATUS.AVAILABLE) {
    //         let { reports } = this.props;
    //         this.props.getChildrenOfOrganizationalUnits(reports.listTaskReportById.organizationalUnit._id);
    //     }
    // }

    //format date sang string
    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }
        return date
    }


    /**
     * Hàm xử lý khi listbox chọn chiều dữ liệu thay đổi
     * @param {} e 
     */
    handleLeftListChange = (e) => {
        const { editingReport } = this.state;
        let { value, name, checked } = e.target;
        let { itemListTempLeft, listDataChart } = editingReport;

        // Kiểm tra xem item nào được click 
        let listBoxLeftLength = listDataChart.length;

        for (let i = 0; i < listBoxLeftLength; i++) {
            if (listDataChart[i].name === value) {
                listDataChart[i].checked = checked;
                break;
            }
        }

        // set lại giá trị cho State 
        this.setState({
            editingReport: {
                ...editingReport,
                listDataChart,
            }
        });

        // Nếu click 2 lần vào check bõ thì xóa item đó trong biến tạm itemListTempLeft
        // kiểm tra xem trong mảng itemListTempLeft đã tồn tại item được click hay chưa: false = -1, nếu tồn tại nghĩa là click 2 lần thì xóa nó đi
        const findIndexItem = itemListTempLeft.findIndex(x => x.id === parseInt(name)); // name là id get từ input 

        // Nếu trong mảng có tồn tại item được click thì xóa nó đi, dùng slice cắt lấy các item khác item dc click
        if (findIndexItem > -1) {
            itemListTempLeft = [...itemListTempLeft.slice(0, findIndexItem), ...itemListTempLeft.slice(findIndexItem + 1)]
        }
        else {
            // Nếu chưa có trong mảng thì thêm nó vào itemListTempLeft
            itemListTempLeft.push({ id: parseInt(name), name: value, checked: false });
        }

        this.setState({
            editingReport: {
                ...editingReport,
                itemListTempLeft: itemListTempLeft,
            }
        })
    }

    // Bắt sự kiện click nút chuyển data sang listBox dữ liệu được đưa vào biểu đồ
    handleClickTransferRightList = () => {
        const { editingReport } = this.state;
        let { itemListTempLeft, listDataChart, dataForAxisXInChart } = editingReport;

        let idInListBoxLeft = listDataChart.map(x => x.id); // array id in listDataChart
        let idInListTemp = itemListTempLeft.map(x => parseInt(x.id)); // array id khi mình chọn vào checkbox của listBoxLeft

        /**
         * Check xem id khi mình chọn checkbox thì item đó có trong list item box left hay ko
         * mục đích: phần setState
         * nếu trùng thì xóa đi item đó trong listBoxleft 
         * nếu không trùng thì add thêm vào 
         */
        // const checkId = idInListBoxLeft.includes(parseInt(idInListTemp));
        const checkId = idInListTemp.some(item => idInListBoxLeft.indexOf(item) >= 0);

        // Lọc Lấy item khác với item đã chọn--> mục đích remove item đó bên listLeft 
        idInListTemp.forEach(x => {
            listDataChart = listDataChart.filter(y => y.id !== x)
        })

        // 
        this.setState({
            editingReport: {
                ...editingReport,
                listDataChart: checkId ? listDataChart
                    : listDataChart,

                dataForAxisXInChart: checkId ? [...dataForAxisXInChart, itemListTempLeft].flat(1) : dataForAxisXInChart,
                itemListTempLeft: [],
            }
        })
    }

    /**
     * Hàm xử lý khi listbox chiều dữ liệu được đưa vào biểu đồ thay đổi
     * @param {} e
     */
    handleRightListChange = (e) => {
        const { editingReport } = this.state;

        let { value, name, checked } = e.target;
        let { itemListTempRight, dataForAxisXInChart } = editingReport;
        let listBoxRightLength = dataForAxisXInChart.length;

        for (let i = 0; i < listBoxRightLength; i++) {
            if (dataForAxisXInChart[i].name === value) {
                dataForAxisXInChart[i].checked = checked;
                break;
            }
        }

        // set lại giá trị cho State 
        this.setState({
            editingReport: {
                ...editingReport,
                dataForAxisXInChart,
            }
        });

        // kiểm tra xem trong mảng itemListTempRight đã tồn tại item được click hay chưa: false = -1
        const findIndexItem = itemListTempRight.findIndex(x => x.id === parseInt(name)); // name là id get từ input 

        // Nếu trong mảng có tồn tại item được click thì xóa nó đi, dùng slice cắt lấy các item khác item dc click
        if (findIndexItem > -1) {
            itemListTempRight = [...itemListTempRight.slice(0, findIndexItem), ...itemListTempRight.slice(findIndexItem + 1)]
        } else {
            // Nếu chưa có trong mảng thì thêm nó vào itemListTempRight
            itemListTempRight.push({ id: parseInt(name), name: value, checked: false });
        }

        this.setState({
            editingReport: {
                ...editingReport,
                itemListTempRight: itemListTempRight,
            }
        })
    }

    // Hàm bắt sự kiện click nút chuyển data sang listBox chiều dữ liệu trong biểu đồ 
    handleClickTransferLeftList = () => {
        const { editingReport } = this.state;
        let { itemListTempRight, listDataChart, dataForAxisXInChart } = editingReport;

        let idInListBoxRight = dataForAxisXInChart.map(x => x.id); // array id in dataForAxisXInChart
        let idInListTemp = itemListTempRight.map(x => parseInt(x.id)); // array id khi mình chọn vào checkbox của listBoxRight

        // const checkId = idInListBoxRight.includes(parseInt(idInListTemp)); // true or false
        const checkId = idInListTemp.some(item => idInListBoxRight.indexOf(item) >= 0); // true or false

        // Lọc item khác với item đã chọn
        idInListTemp.forEach(x => {
            dataForAxisXInChart = dataForAxisXInChart.filter(y => y.id !== x)
        })


        this.setState({
            editingReport: {
                ...editingReport,
                dataForAxisXInChart: checkId ? dataForAxisXInChart
                    : dataForAxisXInChart,

                listDataChart: checkId ? [...listDataChart, itemListTempRight].flat(1) : listDataChart,
                itemListTempRight: [],
            }
        })
    }

    render() {
        const { translate, reports, tasktemplates, user, taskReportId } = this.props;
        const { editingReport,
            nameErrorEditForm,
            descriptionErrorEditForm,
            startDateErrorEditForm,
            readByEmployeeErrorCreateForm,
        } = this.state;
        const { name } = this.state.editingReport;

        let listTaskTemplate, units, listRole, listRoles = [];
        let listTaskReportById = reports.listTaskReportById;

        // Lấy danh sách đơn vị của người dùng hiện tại
        if (user.organizationalUnitsOfUser) {
            units = user.organizationalUnitsOfUser;
        }

        let usersOfChildrenOrganizationalUnit;
        if (user.usersOfChildrenOrganizationalUnit) {
            usersOfChildrenOrganizationalUnit = user.usersOfChildrenOrganizationalUnit;
        }

        // Lấy thông tin nhân viên của đơn vị
        let unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit);

        if (user.roledepartments) {
            listRole = user.roledepartments;
            for (let x in listRole.deans)
                listRoles[x] = listRole.deans[x];
            for (let x in listRole.viceDeans)
                listRoles = [...listRoles, listRole.viceDeans[x]];
            for (let x in listRole.employees)
                listRoles = [...listRoles, listRole.employees[x]];
        }

        // Lấy danh sách mẫu công việc theo đơn vị
        if (tasktemplates.items && editingReport.organizationalUnit) {
            listTaskTemplate = tasktemplates.items.filter(function (taskTemplate) {
                return taskTemplate.organizationalUnit._id === editingReport.organizationalUnit
            })
        }

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-edit-report" isLoading={reports.isLoading}
                    formID="form-edit-report"
                    title="Chỉnh sửa báo cáo"
                    func={this.save}
                    size={100}
                    disableSubmit={!this.isFormValidated()}
                >
                    <div className="row">
                        <div className="col-md-6">
                            {/* Chọn đơn vị */}
                            <div className={`form-group `}>
                                <label className="control-label">Đơn vị <span className="text-red">*</span></label>
                                {
                                    units && units.length > 0 &&
                                    <SelectBox
                                        id="editOrganizationalUnitId"
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={editingReport.organizationalUnit}
                                        onChange={this.handleReportOrganizationalUnitChangeEditForm}
                                        items={
                                            units.map(o => ({ value: o._id, text: o.name }))
                                        }
                                        options={{ minimumResultsForSearch: 100 }}
                                        multiple={false}
                                    />
                                }
                            </div>
                        </div>
                        <div className="col-md-6">
                            {/* Người được xem */}
                            <div className={`form-group ${!readByEmployeeErrorCreateForm ? "" : "has-error"}`}>
                                <label className="control-label">{translate('task_template.permission_view')}<span className="text-red">*</span></label>
                                {(listRoles) &&
                                    <SelectBox
                                        id={`read-select-box-editform`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={
                                            listRoles.map(x => { return { value: x._id, text: x.name } })
                                        }
                                        value={editingReport.readByEmployees}
                                        onChange={this.handleTaskReportReadChangeEditForm}
                                        multiple={true}
                                        options={{ placeholder: "Người được xem" }}
                                    />
                                }
                                <ErrorLabel content={readByEmployeeErrorCreateForm} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            {/* Mẫu công việc */}
                            <div className={`form-group `}>
                                <label className="control-label">Mẫu công việc <span className="text-red">*</span></label>
                                {
                                    listTaskTemplate && listTaskTemplate.length > 0 &&
                                    <SelectBox
                                        id="editTaskTemplateId"
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={editingReport.taskTemplate}
                                        onChange={this.handleTaskTemplateChangeEditForm}
                                        items={
                                            listTaskTemplate.map(o => ({ value: o._id, text: o.name }))
                                        }
                                        multiple={false}
                                    />
                                }
                            </div>

                            {/* Tên báo cáo */}
                            {
                                listTaskReportById && <div className={`form-group ${!nameErrorEditForm ? "" : "has-error"}`}>
                                    <label>{translate('report_manager.name')}
                                        <span className="text-red">*</span>
                                    </label>
                                    <input type="text" className="form-control" value={name ? name : ''} onChange={this.handleNameTaskReportChangeEditForm} />
                                    <ErrorLabel content={nameErrorEditForm} />
                                </div>
                            }
                        </div>

                        <div className="col-md-6">
                            {/* Mô tả báo cáo */}
                            {
                                listTaskReportById && <div className={`form-group ${!descriptionErrorEditForm ? "" : "has-error"}`}>
                                    <label htmlFor="Descriptionreport">{translate('report_manager.description')}
                                        <span className="text-red">*</span>
                                    </label>
                                    <textarea rows={5} type="text" className="form-control" id="Descriptionreport" name="description" value={editingReport.description} onChange={this.handleDesTaskReportChangeEditForm} />
                                    <ErrorLabel content={descriptionErrorEditForm} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            {/* Đặc thù công việc */}
                            <div className={`form-group `}>
                                <label className="control-label">Đặc thù công việc</label>
                                {
                                    listTaskReportById &&
                                    <SelectBox
                                        id="edit-select-status"
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        onChange={this.handleStatusChangeEditForm}
                                        value={listTaskReportById.status}
                                        items={
                                            [
                                                { value: 0, text: 'Tất cả' },
                                                { value: 1, text: 'Đã hoàn thành' },
                                                { value: 2, text: 'Đang thực hiện' },
                                            ]
                                        }
                                        multiple={false}
                                    />
                                }
                            </div>
                        </div>

                        <div className="col-md-6">
                            {/* Tần suất */}
                            <div className={`form-group`}>
                                <label className="control-label">Tần suất</label>
                                {
                                    listTaskReportById && <SelectBox
                                        id="select-box-frequency"
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        onChange={this.handleFrequencyChangeEditForm}
                                        value={listTaskReportById.frequency}
                                        items={
                                            [
                                                { value: 'month', text: 'Tháng' },
                                                { value: 'quarter', text: 'Quý' },
                                                { value: 'year', text: 'Năm' },
                                            ]
                                        }
                                        multiple={false}
                                        options={{ minimumResultsForSearch: 100 }}
                                    />
                                }
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            {/* Chọn người thực hiện */}
                            <div className={`form-group`}>
                                <label className="control-label">Người thực hiện</label>
                                {
                                    unitMembers &&
                                    <SelectBox
                                        id={`responsible-select-box-${taskReportId}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={unitMembers}
                                        onChange={this.handleResponsibleEmployeesChangeEditForm}
                                        value={editingReport.responsibleEmployees ? editingReport.responsibleEmployees : []}
                                        multiple={true}
                                    />
                                }
                            </div>
                        </div>
                        <div className="col-md-6">
                            {/* Chọn người phê duyệt */}
                            <div className={`form-group`}>
                                <label className="control-label">Người phê duyệt</label>
                                {
                                    unitMembers &&
                                    <SelectBox
                                        id={`accounttable-select-box-${taskReportId}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={unitMembers}
                                        onChange={this.handleAccountableEmployeesChangeEditForm}
                                        value={editingReport.accountableEmployees ? editingReport.accountableEmployees : []}
                                        multiple={true}
                                    />
                                }
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className={`col-md-6 ${!startDateErrorEditForm ? "" : "has-error"}`}>
                            {/* Thống kê từ ngày */}
                            {
                                <div className="form-group">
                                    <label>Thống kê từ ngày <span className="text-red">*</span></label>
                                    <DatePicker
                                        id="start-date"
                                        value={editingReport.startDate ? editingReport.startDate : ''}
                                        onChange={this.handleStartDateChangeEditForm}
                                        disabled={false}
                                    />
                                    <ErrorLabel content={startDateErrorEditForm} />
                                </div>
                            }
                        </div>

                        <div className="col-md-6">
                            {/* Thống kê đến ngày */}
                            {
                                <div className="form-group">
                                    <label>Thống kê đến ngày </label>
                                    <DatePicker
                                        id="end-date"
                                        value={editingReport.endDate ? editingReport.endDate : ''}
                                        onChange={this.handleEndDateChangeEditForm}
                                        disabled={false}
                                    />
                                </div>
                            }
                        </div>
                    </div>

                    {
                        (editingReport.taskTemplate !== '') &&
                        <React.Fragment>
                            <div className="row" id="showTable">
                                <hr />
                                <div className="col-md-12">
                                    <table className="table table-hover table-striped table-bordered" id="report_manager">
                                        <thead>
                                            <tr>
                                                <th>Mã thông tin</th>
                                                <th>Trường thông tin</th>
                                                <th>Kiểu dữ liệu</th>
                                                <th>Điều kiện lọc</th>
                                                <th>Hiển thị trong báo cáo</th>
                                                <th>Tên mới</th>
                                                <th>Cách tính</th>
                                                <th>Dạng biểu đồ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                editingReport && editingReport.taskInformations ? editingReport.taskInformations.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.code}</td>
                                                        <td>{item.name}</td>
                                                        <td>{(item.type === 'set_of_values' ? 'Tập dữ liệu' : (item.type))}</td>

                                                        {
                                                            editingReport && editingReport.taskInformations &&
                                                            <td><input className="form-control" style={{ width: '100%' }} type="text" value={item.filter} onChange={(e) => this.handleEditFilter(index, e)} /></td>
                                                        }
                                                        <td>
                                                            {
                                                                (item.type === 'number') ?
                                                                    <div className="checkbox" style={{ paddingLeft: "20%" }}>
                                                                        <label>
                                                                            <input name="showInReport" type="checkbox" checked={item.showInReport} onChange={(e) => this.handleEditShowInReport(index, e)} />

                                                                        </label>
                                                                    </div>
                                                                    : ''
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                (item.type === 'number') ?
                                                                    <input className="form-control" style={{ width: '100%' }} type="text" value={item.newName} onChange={(e) => this.handleEditNewName(index, e)} /> : ''
                                                            }

                                                        </td>
                                                        <td>
                                                            {
                                                                (item.type === 'number') ?
                                                                    <SelectBox
                                                                        id={`select-box-calulator-${item.code}`}
                                                                        className="form-control select2"
                                                                        style={{ width: "100%" }}
                                                                        onChange={(e) => this.handleAggregationTypeChangeEditForm(index, e)}
                                                                        value={item.aggregationType}
                                                                        items={
                                                                            [
                                                                                { value: 0, text: 'Trung bình cộng' },
                                                                                { value: 1, text: 'Tổng' },
                                                                            ]
                                                                        }
                                                                        multiple={false}
                                                                    />
                                                                    : ''
                                                            }
                                                        </td>
                                                        <td data-select2-id="1111">
                                                            {
                                                                (item.type === 'number') ?
                                                                    <SelectBox
                                                                        id={`select-box-chart-${item.code}`}
                                                                        className="form-control select2"
                                                                        style={{ width: "100%" }}
                                                                        onChange={(e) => this.handleChartTypeChangeEditForm(index, e)}
                                                                        value={item.chartType}
                                                                        items={
                                                                            [
                                                                                { value: 0, text: 'Cột' },
                                                                                { value: 1, text: 'Đường' },
                                                                                { value: 2, text: 'Tròn' },
                                                                            ]
                                                                        }
                                                                        multiple={false}
                                                                    />
                                                                    : ''
                                                            }
                                                        </td>
                                                    </tr>
                                                )) : <tr><td colSpan={8}><center>{translate('report_manager.no_data')}</center></td></tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* form chọn chiều dữ liệu */}
                            <div className="row" style={{ marginTop: '15px' }}>
                                <div className="col-md-6 col-sm-12">
                                    <div className="row">
                                        <div className="box-display" >
                                            <div className="col-md-5 ">
                                                <div className="border">
                                                    <div className="box-title">
                                                        <span><b>Chọn chiều dữ liệu trong biểu đồ</b></span>
                                                    </div>
                                                    <div className="box-body box-size">
                                                        <div className="listItem-left">
                                                            {
                                                                editingReport && editingReport.listDataChart && editingReport.listDataChart.map((x, index) => (
                                                                    <div className="item" key={index}>
                                                                        <input className="checkbox-input" type="checkbox" id={`myCheckBoxId${index}-left`} name={x.id} value={x.name} checked={!!x.checked} onChange={this.handleLeftListChange} />
                                                                        <div className=" checkbox-text">
                                                                            <label htmlFor={`myCheckBoxId${index}-left`}>{x.name}</label>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-2 " align="center" style={{ margin: 'auto' }} >
                                                {/* Button khi hiển thị trên giao diện tren pc */}
                                                <div className="only-pc">
                                                    <div className="listButton ">
                                                        <div className="item-button">
                                                            <button type="button" className="btn btn-sm btn-default" onClick={this.handleClickTransferRightList}>
                                                                <span className="material-icons">
                                                                    keyboard_arrow_right
                                                                </span>
                                                            </button>
                                                        </div>
                                                        <div className="item-button">
                                                            <button type="button" className="btn btn-sm btn-default" onClick={this.handleClickTransferLeftList}>
                                                                <span className="material-icons">
                                                                    keyboard_arrow_left
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* end */}

                                                {/* Giao diện trên mobile  */}
                                                <div className="only-mobile">
                                                    <div className="listButton ">
                                                        <div className="item-button">
                                                            <button type="button" ref="btn-down" className="btn btn-sm btn-default" onClick={this.handleClickTransferRightList}>
                                                                <span className="material-icons">
                                                                    keyboard_arrow_down
                                                            </span>
                                                            </button>
                                                        </div>
                                                        <div className="item-button">
                                                            <button type="button" ref="btn-up" className="btn btn-sm btn-default" onClick={this.handleClickTransferLeftList}>
                                                                <span className="material-icons">
                                                                    keyboard_arrow_up
                                                            </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-5 ">
                                                <div className="border">
                                                    <div className="box-title">
                                                        <span><b>Dữ liệu được đưa vào biểu đồ</b></span>
                                                    </div>
                                                    <div className="box-body box-size">
                                                        <div className="listItem-left">
                                                            {
                                                                editingReport && editingReport.dataForAxisXInChart && editingReport.dataForAxisXInChart.map((x, index) => (
                                                                    <div className="item" key={index} >
                                                                        <input className="checkbox-input" type="checkbox" id={`myCheckBoxId${index}-right`} name={x.id} value={x.name} checked={!!x.checked} onChange={this.handleRightListChange} />
                                                                        <div className=" checkbox-text">
                                                                            <label htmlFor={`myCheckBoxId${index}-right`}>{`${index + 1}. ${x.name}`}</label>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    }

                </DialogModal>
            </React.Fragment>

        );
    }
}

const mapState = state => state;
const actionCreators = {
    getTaskReportById: TaskReportActions.getTaskReportById,
    editTaskReport: TaskReportActions.editTaskReport,

    getTaskTemplateByUser: taskTemplateActions.getAllTaskTemplateByUser,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,

    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getDepartment: UserActions.getDepartmentOfUser,
    getRoleSameDepartment: UserActions.getRoleSameDepartment,
};
const editReport = connect(mapState, actionCreators)(withTranslate(TaskReportEditForm));

export { editReport as TaskReportEditForm };