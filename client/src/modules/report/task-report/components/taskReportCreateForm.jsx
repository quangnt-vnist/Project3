import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { getStorage } from '../../../../config';
import { DialogModal, ErrorLabel, SelectBox, DatePicker } from '../../../../common-components';

import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { TaskReportViewForm } from './taskReportViewForm';

import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskTemplateActions } from '../../../task/task-template/redux/actions';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import { TaskReportActions } from '../redux/actions';

import ValidationHelper from '../../../../helpers/validationHelper';

import './transferList.css';

class TaskReportCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newReport: {
                nameTaskReport: '',
                descriptionTaskReport: '',
                organizationalUnit: '',
                taskTemplate: '',
                status: 0,
                responsibleEmployees: [],
                accountableEmployees: [],
                readByEmployees: [],
                startDate: '',
                endDate: '',
                frequency: 'month',
                itemListBoxLeft: [
                    { id: 1, name: 'Thời gian', checked: false },
                    { id: 2, name: 'Người thực hiện', checked: false },
                    { id: 3, name: 'Người phê duyệt', checked: false },
                ],
                itemListBoxRight: [],
                itemListTempLeft: [],
                itemListTempRight: [],
            },
            currentRole: getStorage('currentRole'),
        }
    }


    /**
     * Hàm bắt sự kiên thay đổi input NameTaskReport
     * @param {*} e 
     */
    handleNameTaskReportChange = (e) => {
        let { newReport } = this.state;
        const { translate } = this.props;
        let { value } = e.target;

        this.setState({
            newReport: {
                ...newReport,
                nameTaskReport: value,
            },
        });
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ nameErrorCreateForm: message });
    }


    /**
     * Bắt sự kiện thay đổi cho ô input mô tả báo cáo
     * @param {*} e 
     */
    handleDesTaskReportChange = (e) => {
        let { newReport } = this.state;
        const { translate } = this.props;
        let { value } = e.target;

        this.setState({
            newReport: {
                ...newReport,
                descriptionTaskReport: value,
            },
        });

        let { message } = ValidationHelper.validateDescription(translate, value);
        this.setState({ descriptionErrorCreateForm: message });

    }


    /**
     * Hàm xử lý khi thay đổi đơn vị
     * @param {*} e 
     */
    handleChangeReportOrganizationalUnit = value => {
        let { newReport } = this.state;
        value = value[0];
        // đổi người trong phòng ban khi đổi đơn vị
        //  this.props.getAllUserOfDepartment(value);
        //  this.props.getChildrenOfOrganizationalUnits(value);
        this.setState({
            newReport: {
                ...newReport,
                nameTaskReport: '',
                descriptionTaskReport: '',
                organizationalUnit: value,
                responsibleEmployees: [],
                accountableEmployees: [],
                readByEmployees: [],
                taskTemplate: '',
            },
            nameErrorCreateForm: undefined,
            descriptionErrorCreateForm: undefined,
            startDateErrorCreateForm: undefined,
            readByEmployeeErrorCreateForm: undefined,
            taskTemplateErrorCreateForm: undefined,
        });
    }


    /**
     * Hàm xử lý khi thay đổi mẫu công việc
     * @param {*} e 
     */
    handleChangeTaskTemplate = (value) => {
        let { newReport } = this.state;
        const { translate } = this.props;
        value = value[0];

        if (value === '') { // Reset các input nhận giá trị tự động khi mẫu công việc trống
            this.setState({
                newReport: {
                    ...newReport,
                    nameTaskReport: '',
                    descriptionTaskReport: '',
                    taskTemplate: '',
                    status: '',
                    responsibleEmployees: [],
                    accountableEmployees: [],
                    readByEmployees: [],
                },
                nameErrorCreateForm: undefined,
                descriptionErrorCreateForm: undefined,
                startDateErrorCreateForm: undefined,
                readByEmployeeErrorCreateForm: undefined,
                taskTemplateErrorCreateForm: undefined,
            });
        } else {
            let taskTemplate = this.props.tasktemplates.items.find((taskTemplate) =>
                taskTemplate._id === value
            );

            let taskInformations = [];
            if (taskTemplate.taskInformations) {
                // Set các giá trị mặc định khi người dùng không chọn các trường này
                for (let [index, value] of taskTemplate.taskInformations.entries()) {
                    taskInformations[index] = {
                        ...value,
                        chartType: '0',
                        aggregationType: '0',
                        coefficient: 1,
                        showInReport: false,
                    }
                }
            }

            this.setState({
                newReport: {
                    ...newReport,
                    nameTaskReport: taskTemplate.name,
                    descriptionTaskReport: taskTemplate.description,
                    taskTemplate: taskTemplate._id,
                    responsibleEmployees: taskTemplate.responsibleEmployees.map(item => item._id),
                    accountableEmployees: taskTemplate.accountableEmployees.map(item => item._id),
                    taskInformations: taskInformations,
                }
            })
        }
        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({ taskTemplateErrorCreateForm: message });
    }


    shouldComponentUpdate = async (nextProps, nextState) => {
        const { user } = this.props;
        let { newReport, currentRole } = this.state;

        if (newReport.organizationalUnit === '' && user.organizationalUnitsOfUser) {
            let defaultUnit = await user.organizationalUnitsOfUser.find(item =>
                item.deans.toString() === currentRole
                || item.viceDeans.toString() === currentRole
                || item.employees.toString() === currentRole);

            // Lấy người dùng của đơn vị hiện tại và người dùng của đơn vị con
            if (defaultUnit) {
                this.props.getChildrenOfOrganizationalUnits(defaultUnit._id);
            }

            this.setState(state => {
                return {
                    ...state,
                    newReport: {
                        ...newReport,
                        organizationalUnit: defaultUnit && defaultUnit._id,
                    },
                    units: user.organizationalUnitsOfUser
                };
            });
            return false;
        }
        return true;
    }


    /**
     * Hàm xử lý ngày bắt đầu thay đổi
     * @param {*} value 
     */
    handleChangeStartDate = (value) => {
        let { newReport } = this.state;
        const { translate } = this.props;

        this.setState({
            newReport: {
                ...newReport,
                startDate: value,
            },
        })

        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({ startDateErrorCreateForm: message });
    }


    /**
     * Hàm xử lý ngày kết thúc thay đổi
     * @param {*} value 
     */
    handleChangeEndDate = (value) => {
        let { newReport } = this.state;
        this.setState({
            newReport: {
                ...newReport,
                endDate: value,
            }
        })
    }

    /**
     * Hàm xử lý khi chọn đặc thù công việc
     * @param {*} value 
     */
    handleChangeStatus = (value) => {
        let { newReport } = this.state;
        this.setState({
            newReport: {
                ...newReport,
                status: value[0],
            }
        })
    }


    /**
     * Hàm xử lý khi chọn tần suất
     * @param {*} value 
     */
    handleChangeFrequency = (value) => {
        let { newReport } = this.state;
        this.setState({
            newReport: {
                ...newReport,
                frequency: value[0],
            }
        })
    }


    /**
     * Hàm xử lý khi nhập hệ số
     * @param {*} e 
     */
    handleChangeCoefficient = (index, e) => {
        let { value } = e.target;
        let { newReport } = this.state;
        let taskInformations = newReport.taskInformations;
        // gán hệ số của riêng từng trường thông tin vào taskInformations
        taskInformations[index] = { ...taskInformations[index], coefficient: value }

        // set lại state với giá trị taskInformations mới
        this.setState({
            newReport: {
                ...newReport,
                taskInformations: taskInformations,
            }
        })
    }


    /**
     * hàm xử lý khi chọn cách tính
     * @param {*} value 
     */
    handleChangeAggregationType = (index, value) => {
        let { newReport } = this.state;
        let taskInformations = newReport.taskInformations;

        taskInformations[index] = { ...taskInformations[index], aggregationType: value.toString() }

        this.setState({
            newReport: {
                ...newReport,
                taskInformations: taskInformations,
            }
        })
    }


    /**
     * Hàm xử lý khi chọn dạng biểu đồ
     * @param {*} e 
     */
    handleChangeChart = (index, value) => {
        let { newReport } = this.state;
        let taskInformations = newReport.taskInformations;
        taskInformations[index] = { ...taskInformations[index], chartType: value.toString() };

        this.setState({
            newReport: {
                ...newReport,
                taskInformations: taskInformations,
            }
        })
    }


    /**
     * Hàm xử lý khi nhập điều kiện lọc
     * @param {*} e 
     */
    handleChangeFilter = (index, e) => {
        let { value } = e.target;
        let { newReport } = this.state;
        let taskInformations = newReport.taskInformations;
        taskInformations[index] = { ...taskInformations[index], filter: value };

        this.setState({
            newReport: {
                ...newReport,
                taskInformations: taskInformations,
            }
        })
    }


    /**
     * Hàm xử lý khi khi nhập tên mới
     * @param {*} e 
     */
    handleChangeNewName = (index, e) => {
        let { value } = e.target;
        let { newReport } = this.state;
        let taskInformations = newReport.taskInformations;
        taskInformations[index] = { ...taskInformations[index], newName: value }

        this.setState({
            newReport: {
                ...newReport,
                taskInformations: taskInformations,
            }
        })
    }


    /**
     * Hàm xử lý khi người thực hiện thay đổi
     * @param {*} value : tên người thực hiện
     */
    handleChangeReportResponsibleEmployees = (value) => {
        let { newReport } = this.state;
        this.setState({
            newReport: {
                ...newReport,
                responsibleEmployees: value,
            }
        })
    }


    /**
     * Hàm xử lý khi người phê duyệt thay đổi
     * @param {*} value 
     */
    handleChangeReportAccountableEmployees = (value) => {
        let { newReport } = this.state;
        this.setState({
            newReport: {
                ...newReport,
                accountableEmployees: value,
            }
        })
    }

    handleTaskReportRead = value => {
        let { newReport } = this.state;
        const { translate } = this.props;
        this.setState({
            newReport: {
                ...newReport,
                readByEmployees: value,
            }
        });

        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({ readByEmployeeErrorCreateForm: message });
    }

    /**
     * Hàm xử lý khi click vào checkbox
     * @param {*} item 
     */
    handleChangeShowInReport = (index, item) => {
        let { newReport } = this.state;
        let value = item.target.checked;

        let taskInformations = newReport.taskInformations;
        taskInformations[index] = { ...taskInformations[index], showInReport: value };

        this.setState({
            newReport: {
                ...newReport,
                taskInformations: taskInformations,
            }
        })
    }


    /**
     * Hàm xử lý khi listbox chọn chiều dữ liệu thay đổi
     * @param {} e 
     */
    handleLeftListChange = (e) => {
        const { newReport } = this.state;
        let { value, name, checked } = e.target;
        let { itemListTempLeft, itemListBoxLeft } = newReport;

        // Kiểm tra xem item nào được click 
        let listBoxLeftLength = itemListBoxLeft.length;

        for (let i = 0; i < listBoxLeftLength; i++) {
            if (itemListBoxLeft[i].name === value) {
                itemListBoxLeft[i].checked = checked;
                break;
            }
        }

        // set lại giá trị cho State 
        this.setState({
            newReport: {
                ...newReport,
                itemListBoxLeft,
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
            newReport: {
                ...newReport,
                itemListTempLeft: itemListTempLeft,
            }
        })
    }

    // Bắt sự kiện click nút chuyển data sang listBox dữ liệu được đưa vào biểu đồ
    handleClickTransferRightList = () => {
        const { newReport } = this.state;
        let { itemListTempLeft, itemListBoxLeft, itemListBoxRight } = newReport;

        let idInListBoxLeft = itemListBoxLeft.map(x => x.id); // array id in itemListBoxLeft
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
            itemListBoxLeft = itemListBoxLeft.filter(y => y.id !== x)
        })

        // 
        this.setState({
            newReport: {
                ...newReport,
                itemListBoxLeft: checkId ? itemListBoxLeft
                    : itemListBoxLeft,

                itemListBoxRight: checkId ? [...itemListBoxRight, itemListTempLeft].flat(1) : itemListBoxRight,
                itemListTempLeft: [],
            }
        })
    }

    /**
     * Hàm xử lý khi listbox chiều dữ liệu được đưa vào biểu đồ thay đổi
     * @param {} e
     */
    handleRightListChange = (e) => {
        const { newReport } = this.state;

        let { value, name, checked } = e.target;
        let { itemListTempRight, itemListBoxRight } = newReport;
        let listBoxRightLength = itemListBoxRight.length;

        for (let i = 0; i < listBoxRightLength; i++) {
            if (itemListBoxRight[i].name === value) {
                itemListBoxRight[i].checked = checked;
                break;
            }
        }

        // set lại giá trị cho State 
        this.setState({
            newReport: {
                ...newReport,
                itemListBoxRight,
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
            newReport: {
                ...newReport,
                itemListTempRight: itemListTempRight,
            }
        })
    }


    // Hàm bắt sự kiện click nút chuyển data sang listBox chiều dữ liệu trong biểu đồ 
    handleClickTransferLeftList = () => {
        const { newReport } = this.state;
        let { itemListTempRight, itemListBoxLeft, itemListBoxRight } = newReport;

        let idInListBoxRight = itemListBoxRight.map(x => x.id); // array id in itemListBoxRight
        let idInListTemp = itemListTempRight.map(x => parseInt(x.id)); // array id khi mình chọn vào checkbox của listBoxRight

        // const checkId = idInListBoxRight.includes(parseInt(idInListTemp)); // true or false
        const checkId = idInListTemp.some(item => idInListBoxRight.indexOf(item) >= 0); // true or false

        // Lọc item khác với item đã chọn
        idInListTemp.forEach(x => {
            itemListBoxRight = itemListBoxRight.filter(y => y.id !== x)
        })


        this.setState({
            newReport: {
                ...newReport,
                itemListBoxRight: checkId ? itemListBoxRight
                    : itemListBoxRight,

                itemListBoxLeft: checkId ? [...itemListBoxLeft, itemListTempRight].flat(1) : itemListBoxLeft,
                itemListTempRight: [],
            }
        })
    }


    /**
     * Xử lý hiện form view
     */
    handleView = async () => {
        const { newReport } = this.state;
        if (this.isFormValidated()) {
            await this.props.getTaskEvaluations(newReport);
            this.setState({
                modal: 'view'
            })
            window.$('#modal-view-taskreport').modal('show');
        }
    }

    /**
    * Hàm kiểm tra đã validate chưa
    */
    isFormValidated = () => {
        let { newReport } = this.state;
        let { nameTaskReport, descriptionTaskReport, startDate, readByEmployees } = newReport;
        const { translate } = this.props;

        if (!ValidationHelper.validateName(translate, nameTaskReport).status
            || !ValidationHelper.validateDescription(translate, descriptionTaskReport).status
            || !ValidationHelper.validateEmpty(translate, startDate).status
            || !ValidationHelper.validateEmpty(translate, readByEmployees).status)
            return false;
        return true;
    }


    /**
     * Hàm xử lý khi ấn lưu
     */
    save = () => {
        const { newReport } = this.state;
        if (this.isFormValidated()) {
            this.props.createTaskReport(newReport);
        }
    }


    componentDidMount() {
        this.props.getTaskTemplateByUser(1, 0, []);
        this.props.getDepartment();
        // Lấy tất cả nhân viên trong công ty
        this.props.getAllUserOfCompany();
        this.props.getAllUserInAllUnitsOfCompany();
        this.props.getRoleSameDepartment(localStorage.getItem("currentRole"));
    }

    render() {
        const { translate, reports, tasktemplates, user } = this.props;
        const { newReport,
            modal,
            units,
            nameErrorCreateForm,
            descriptionErrorCreateForm,
            startDateErrorCreateForm,
            readByEmployeeErrorCreateForm,
            taskTemplateErrorCreateForm,
        } = this.state;
        let { itemListBoxLeft, itemListBoxRight } = this.state.newReport;
        let listTaskTemplate, taskInformations = newReport.taskInformations, listRole, listRoles = [];

        // Lấy ra list task template theo đơn vị
        if (tasktemplates.items && newReport.organizationalUnit) {
            listTaskTemplate = tasktemplates.items.filter(function (taskTemplate) {
                return taskTemplate.organizationalUnit._id === newReport.organizationalUnit
            })
        }

        let usersOfChildrenOrganizationalUnit, unitMembers = [];
        if (user.usersOfChildrenOrganizationalUnit) {
            usersOfChildrenOrganizationalUnit = user.usersOfChildrenOrganizationalUnit;
            unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit);
        }

        // lấy list chức danh theo đơn vị hiện tại
        if (user.usersInUnitsOfCompany) {
            listRole = user.usersInUnitsOfCompany;
            listRole.forEach(item => {
                listRoles.push(Object.values(item.deans));
                listRoles.push(Object.values(item.viceDeans));
                listRoles.push(Object.values(item.employees));
            })
            listRoles = listRoles.flat(1);
        }

        // Lấy thông tin nhân viên của đơn vị

        if (listTaskTemplate) {
            listTaskTemplate = listTaskTemplate.map(x => {
                return { value: x._id, text: x.name }
            })
            listTaskTemplate.unshift({ value: '', text: 'Chọn mẫu công việc' });
        }

        // console.log('state', this.state);
        // console.log('====================')
        console.log('newReport', newReport);
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-create-task-report" isLoading={reports.isLoading && user.isLoading && tasktemplates.isLoading}
                    formID="form-create-task-report"
                    title="Thêm mới báo cáo"
                    func={this.save}
                    size={100}
                    disableSubmit={!this.isFormValidated()}
                >
                    <TaskReportViewForm modal={modal} />

                    <div className="row" >
                        <div className="col-md-12 col-lg-12" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div className="form-inline d-flex justify-content-end">
                                {
                                    !this.isFormValidated() ?
                                        <button disabled id="exportButton" className="btn btn-sm btn-success " title="Xem biểu đồ" style={{ marginBottom: '6px' }}><span className="fa fa-fw fa-line-chart" style={{ color: 'rgb(66 65 64)', fontSize: '15px', marginRight: '5px' }}></span></button>
                                        :
                                        <button id="exportButton" className="btn btn-sm btn-success " title="Xem biểu đồ" style={{ marginBottom: '6px' }} onClick={() => this.handleView()} ><span className="fa fa-fw fa-line-chart" style={{ color: 'rgb(66 65 64)', fontSize: '15px', marginRight: '5px' }}></span></button>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            {/* Chọn đơn vị */}
                            <div className={`form-group `}>
                                <label className="control-label">Đơn vị <span className="text-red">*</span></label>
                                {
                                    units &&
                                    <SelectBox
                                        id={`organizationalUnitId-create-form`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={newReport.organizationalUnit}
                                        onChange={this.handleChangeReportOrganizationalUnit}
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
                            <div className={`form-group`} >
                                <label className="control-label">{translate('task_template.permission_view')}<span className="text-red">*</span></label>
                                {listRoles &&
                                    <SelectBox
                                        id={`read-select-box-create-${newReport.organizationalUnit}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={
                                            listRoles.map(x => { return { value: x._id, text: x.name } })
                                        }
                                        value={newReport.readByEmployees}
                                        onChange={this.handleTaskReportRead}
                                        multiple={true}
                                        options={{ placeholder: "Người được xem" }}
                                    />
                                }
                                <ErrorLabel content={readByEmployeeErrorCreateForm} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className={`col-md-6`}>
                            {/* Chọn mẫu công việc */}
                            <div className={`form-group ${!taskTemplateErrorCreateForm ? "" : "has-error"}`}>
                                <label className="control-label">Mẫu công việc <span className="text-red">*</span></label>
                                {
                                    listTaskTemplate && listTaskTemplate.length > 0 &&
                                    <SelectBox
                                        id={`taskTemplateId-create-form-${newReport.organizationalUnit}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={newReport.taskTemplate}
                                        onChange={this.handleChangeTaskTemplate}
                                        items={
                                            listTaskTemplate
                                        }
                                        multiple={false}
                                    />
                                }
                                <ErrorLabel content={taskTemplateErrorCreateForm} />
                            </div>

                            {/* Tên báo cáo */}
                            <div className={`form-group ${!nameErrorCreateForm ? "" : "has-error"}`}>
                                <label>{translate('report_manager.name')}
                                    <span className="text-red">*</span>
                                </label>
                                <input type="Name" className="form-control" value={(newReport.nameTaskReport)} onChange={this.handleNameTaskReportChange} placeholder="Nhập tên báo cáo" />
                                <ErrorLabel content={nameErrorCreateForm} />
                            </div>
                        </div>

                        <div className="col-md-6">
                            {/* Mô tả báo cáo */}
                            <div className={`form-group ${!descriptionErrorCreateForm ? "" : "has-error"}`}>
                                <label htmlFor="Descriptionreport">{translate('report_manager.description')}
                                    <span className="text-red">*</span>
                                </label>
                                <textarea rows={5} type="text" className="form-control" id="Descriptionreport" name="description" value={(newReport.descriptionTaskReport)} onChange={this.handleDesTaskReportChange} />
                                <ErrorLabel content={descriptionErrorCreateForm} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            {/* Đặc thù công việc */}
                            <div className={`form-group `}>
                                <label className="control-label">Đặc thù công việc</label>
                                <SelectBox
                                    id={`status-create-form-${newReport.organizationalUnit}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    onChange={this.handleChangeStatus}
                                    value={newReport.status}
                                    items={
                                        [
                                            { value: 0, text: 'Tất cả' },
                                            { value: 1, text: 'Đã hoàn thành' },
                                            { value: 2, text: 'Đang thực hiện' },
                                        ]
                                    }
                                    multiple={false}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            {/* Tần suất */}
                            <div className={`form-group`}>
                                <label className="control-label">Tần suất</label>
                                <SelectBox
                                    id={`frequency-create-form-${newReport.organizationalUnit}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    onChange={this.handleChangeFrequency}
                                    value={newReport.frequency}
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
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            {/* Chọn người thực hiện */}
                            <div className={`form-group`}>
                                <label className="control-label">Người thực hiện</label>
                                {unitMembers &&
                                    <SelectBox
                                        id={`responsible-create-form-${newReport.organizationalUnit}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={unitMembers}
                                        onChange={this.handleChangeReportResponsibleEmployees}
                                        value={newReport.responsibleEmployees ? newReport.responsibleEmployees : []}
                                        multiple={true}
                                        options={{ placeholder: "Chọn người thực hiện" }}
                                    />
                                }
                            </div>
                        </div>

                        <div className="col-md-6">
                            {/* Chọn người phê duyệt */}
                            <div className="form-group">
                                <label className="control-label">Người phê duyệt</label>
                                {unitMembers &&
                                    <SelectBox
                                        id={`accountableEmployees-create-form-${newReport.organizationalUnit}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={unitMembers}
                                        onChange={this.handleChangeReportAccountableEmployees}
                                        value={newReport.accountableEmployees ? newReport.accountableEmployees : []}
                                        multiple={true}
                                        options={{ placeholder: "Chọn người phê duyệt" }}
                                    />
                                }
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className={`col-md-6 ${!startDateErrorCreateForm ? "" : "has-error"}`}>
                            {/* Thống kê từ ngày */}
                            <div className={`form-group`}>
                                <label className="control-label ">Thống kê từ ngày <span className="text-red">*</span></label>
                                <DatePicker
                                    id="start-date-form-create"
                                    value={newReport.startDate}
                                    onChange={this.handleChangeStartDate}
                                    disabled={false}
                                />
                                <ErrorLabel content={startDateErrorCreateForm} />
                            </div>
                        </div>

                        <div className="col-md-6">
                            {/* Thống kê đến ngày */}
                            <div className="form-group">
                                <label>Thống kê đến ngày </label>
                                <DatePicker
                                    id="end-date-form-create"
                                    value={newReport.endDate}
                                    onChange={this.handleChangeEndDate}
                                    disabled={false}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form show thông tin mẫu công việc */}
                    {
                        (newReport.taskTemplate !== '') &&
                        <React.Fragment>
                            <div className="row" id="showTable" style={{ marginTop: '15px' }}>
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
                                                <th>Hệ số</th>
                                                <th>Cách tính</th>
                                                <th>Dạng biểu đồ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                taskInformations ? taskInformations.map((item2, index) => (
                                                    <tr key={index}>
                                                        <td>{item2.code}</td>
                                                        <td>{item2.name}</td>
                                                        <td>{(item2.type === 'set_of_values' ? 'Tập dữ liệu' : (item2.type))}</td>
                                                        <td><input className="form-control" style={{ width: '100%' }} type="text" onChange={(e) => this.handleChangeFilter(index, e)} placeholder={(item2.type === 'number' ? `p${index + 1} > 3000` : (item2.type === 'set_of_values' ? `p${index + 1} = 3000` : ''))} /></td>
                                                        <td>
                                                            {(item2.type === 'number') ?
                                                                <div className="checkbox" style={{ paddingLeft: "20%" }}>
                                                                    <label>
                                                                        <input name="showInReport" type="checkbox" value={item2.name} onChange={(e) => this.handleChangeShowInReport(index, e)} />
                                                                    </label>
                                                                </div>
                                                                : ''
                                                            }
                                                        </td>
                                                        <td>
                                                            {(item2.type === 'number') ?
                                                                <input className="form-control" style={{ width: '100%' }} type="text" onChange={(e) => this.handleChangeNewName(index, e)} /> : ''
                                                            }

                                                        </td>
                                                        <td>
                                                            {(item2.type === 'number') ?
                                                                <input type="text" className="form-control" style={{ width: '100%' }} onChange={(e) => this.handleChangeCoefficient(index, e)} /> : ''
                                                            }
                                                        </td>
                                                        <td>
                                                            {(item2.type === 'number') ?
                                                                <SelectBox
                                                                    id={`select-box-calulator-${item2.code}`}
                                                                    className="form-control select2"
                                                                    style={{ width: "100%" }}
                                                                    onChange={(e) => this.handleChangeAggregationType(index, e)}
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
                                                                (item2.type === 'number') ?
                                                                    <SelectBox
                                                                        id={`select-box-chart-${item2.code}`}
                                                                        className="form-control select2"
                                                                        style={{ width: "100%" }}
                                                                        onChange={(e) => this.handleChangeChart(index, e)}
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
                                                ))
                                                    : <tr><td colSpan={8}><center>{translate('report_manager.no_data')}</center></td></tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* form chọn chiều dữ liệu đưa vào biểu đồ */}
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
                                                                itemListBoxLeft && itemListBoxLeft.map((x, index) => (
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
                                                                itemListBoxRight && itemListBoxRight.map((x, index) => (
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
function mapState(state) {
    const { tasks, user, reports, tasktemplates } = state;
    return { tasks, user, reports, tasktemplates };
}
const actionCreators = {
    createTaskReport: TaskReportActions.createTaskReport,
    getTaskTemplateByUser: taskTemplateActions.getAllTaskTemplateByUser,

    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getDepartment: UserActions.getDepartmentOfUser,
    getRoleSameDepartment: UserActions.getRoleSameDepartment,

    getTaskEvaluations: taskManagementActions.getTaskEvaluations,
}
const createForm = connect(mapState, actionCreators)(withTranslate(TaskReportCreateForm));
export { createForm as TaskReportCreateForm };
