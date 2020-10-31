import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { getStorage } from '../../../../config';
import { ErrorLabel, DatePicker, SelectBox, TextEditor } from '../../../../common-components/index';
import { performTaskAction } from '../redux/actions';
import { managerKpiActions } from '../../../kpi/employee/management/redux/actions';
import { TaskInformationForm } from './taskInformationForm';
import { AutomaticTaskPointCalculator } from './automaticTaskPointCalculator';
import { ModalShowAutoPointInfo } from './modalShowAutoPointInfo';
import moment from 'moment';
import Swal from 'sweetalert2';

var currentTask;

class EvaluateByAccountableEmployee extends Component {
    constructor(props) {
        super(props);

        let { date, id } = this.props;
        let data = this.getData(date);
        currentTask = data;
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        this.state = {
            // id: id,
            errorInfo: {},
            errorApprovedPoint: {},
            errorContribute: {},
            task: data.task,
            userId: data.userId,
            info: data.info,
            results: data.results,
            empPoint: data.empPoint,
            status: data.statusOptions,
            progress: data.progress,
            autoPoint: data.calcAuto,
            oldAutoPoint: data.automaticPoint,
            date: data.date,
            checkSave: data.checkSave,
            prevDate: data.prevDate,
            dentaDate: data.dentaDate,
            indexReRender: 0,
            hasAccountable: data.hasAccountable,

            kpi: data.kpi,
            unit: data.unit,
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,
        }
    }

    componentDidMount() {
        let { userId, unit } = this.state;
        let { date } = this.props;
        let defaultDepartment = unit;

        this.props.getAllKpiSetsOrganizationalUnitByMonth(userId, defaultDepartment, date);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                // id: nextProps.id,

                errorOnDate: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                errorOnPoint: undefined,
                errorOnProgress: undefined,
                errorInfo: {},
                errorApprovedPoint: {},
                errorContribute: {},
                errSumContribution: undefined,
                errorOnAccountablePoint: undefined,
                errorOnAccountableContribution: undefined,
                errorOnMyPoint: undefined
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.id !== this.state.id) {
            let { task, userId, unit } = this.state;
            let department = unit;
            let date = nextProps.date;
            this.props.getAllKpiSetsOrganizationalUnitByMonth(userId, department, date);
            let data = this.getData(date);

            this.setState(state => {
                return {
                    ...state,
                    id: nextProps.id,
                    task: data.task,
                    userId: data.userId,
                    info: data.info,
                    results: data.results,
                    empPoint: data.empPoint,
                    status: data.statusOptions,
                    progress: data.progress,
                    autoPoint: data.calcAuto,
                    oldAutoPoint: data.automaticPoint,
                    date: data.date,
                    checkSave: data.checkSave,
                    prevDate: data.prevDate,
                    dentaDate: data.dentaDate,
                    // errorInfo: {},
                    // errorApprovedPoint: {},
                    // errorContribute: {},
                    errorOnProgress: undefined,
                    indexReRender: state.indexReRender + 1,

                    kpi: data.kpi,
                    unit: data.unit,

                    dataStatus: this.DATA_STATUS.QUERYING,
                }
            });
            return false;
        }
        if (this.state.dataStatus === this.DATA_STATUS.QUERYING) {
            if (!(nextProps.KPIPersonalManager && nextProps.KPIPersonalManager.kpiSets)) {
                return true;
            } else {
                let date = nextProps.date;
                let data = this.getData(date);
                this.setState(state => {
                    return {
                        ...state,
                        kpi: data.kpi,
                        dataStatus: this.DATA_STATUS.FINISHED,
                    }
                });
                return false;
            }
        }
        return true;
    }

    // hàm lấy dữ liệu khởi tạo
    getData = (dateParam) => {
        const { user, KPIPersonalManager } = this.props;
        let { task, hasAccountable } = this.props;
        let idUser = getStorage("userId");
        let checkSave = false;
        let date = dateParam;
        let prevDate = this.formatDate(task.startDate);
        let dentaDate = 0;
        let evaluations, prevEval;

        let splitter = dateParam.split("-");
        let dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let dateOfPrevEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        var newMonth = dateOfPrevEval.getMonth() - 1;
        if (newMonth < 0) {
            newMonth += 12;
            dateOfPrevEval.setYear(dateOfPrevEval.getYear() - 1);
        }
        dateOfPrevEval.setDate(15);
        dateOfPrevEval.setMonth(newMonth);

        let monthOfEval = dateOfEval.getMonth();
        let monthOfPrevEval = dateOfPrevEval.getMonth();
        let yearOfEval = dateOfEval.getFullYear();
        let yearOfPrevEval = dateOfPrevEval.getFullYear();

        evaluations = task.evaluations.find(e => (monthOfEval === new Date(e.date).getMonth() && yearOfEval === new Date(e.date).getFullYear()));
        prevEval = task.evaluations.find(e => ((monthOfPrevEval) === new Date(e.date).getMonth() && yearOfPrevEval === new Date(e.date).getFullYear()));
        if (prevEval) {
            prevDate = this.formatDate(prevEval.date);
        }
        let automaticPoint = (evaluations && evaluations.results.length !== 0) ? evaluations.results[0].automaticPoint : undefined;
        let progress = evaluations ? evaluations.progress : undefined;

        let unit;
        if (user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
            unit = user.organizationalUnitsOfUser[0]._id;
        }
        let cloneKpi = []
        if (hasAccountable === true && KPIPersonalManager && KPIPersonalManager.kpiSets) {
            cloneKpi = (KPIPersonalManager.kpiSets.kpis.filter(e => (e.type === 1)).map(x => { return x._id }));
        }
        // let date = this.formatDate(new Date());
        // if (this.props.perform === "stop") { // nếu dừng thì cho ngày là ngày hiện tại
        //     date = this.formatDate(new Date());
        // }
        // else if (this.props.perform === "evaluate") { // nếu đánh giá thì cho ngày đánh giá là cuối tháng
        //     date = moment().endOf("month").format('DD-MM-YYYY');
        // }
        let info = {};

        let infoEval = task.taskInformations;
        for (let i in infoEval) {

            if (infoEval[i].type === "set_of_values") {
                let splitSetOfValues = infoEval[i].extra.split('\n');
                info[`${infoEval[i].code}`] = {
                    value: [splitSetOfValues[0]],
                    code: infoEval[i].code,
                    type: infoEval[i].type
                }
            }

        }

        let empPoint = {}, results = {};
        let inactiveEmp = task.inactiveEmployees.map(e => e._id);

        for (let i in task.responsibleEmployees) {
            if (inactiveEmp.indexOf(task.responsibleEmployees[i]._id) === -1) {
                results[`approvedPointResponsible${task.responsibleEmployees[i]._id}`] = {
                    value: undefined,
                    employee: task.responsibleEmployees[i]._id,
                    role: "responsible",
                    target: "Point"
                }
                results[`contributeResponsible${task.responsibleEmployees[i]._id}`] = {
                    value: undefined,
                    employee: task.responsibleEmployees[i]._id,
                    role: "responsible",
                    target: "Contribution"
                }
            }
        }
        for (let i in task.consultedEmployees) {
            if (inactiveEmp.indexOf(task.consultedEmployees[i]._id) === -1) {
                results[`approvedPointConsulted${task.consultedEmployees[i]._id}`] = {
                    value: undefined,
                    employee: task.consultedEmployees[i]._id,
                    role: "consulted",
                    target: "Point"
                }
                results[`contributeConsulted${task.consultedEmployees[i]._id}`] = {
                    value: undefined,
                    employee: task.consultedEmployees[i]._id,
                    role: "consulted",
                    target: "Contribution"
                }
            }
        }
        for (let i in task.accountableEmployees) {
            if (inactiveEmp.indexOf(task.accountableEmployees[i]._id) === -1) {
                results[`approvedPoint${task.accountableEmployees[i]._id}`] = {
                    value: undefined,
                    employee: task.accountableEmployees[i]._id,
                    role: "accountable",
                    target: "Point"
                }
                results[`contributeAccountable${task.accountableEmployees[i]._id}`] = {
                    value: undefined,
                    employee: task.accountableEmployees[i]._id,
                    role: "accountable",
                    target: "Contribution"
                }
            }
        }

        if (evaluations) {
            if (evaluations.results.length !== 0) {
                let role = "accountable";
                if (!hasAccountable) {
                    role = "responsible";
                }

                let tmp = evaluations.results.find(e => (String(e.employee._id) === String(idUser) && String(e.role) === role));
                if (tmp) {
                    if (tmp.organizationalUnit) {
                        unit = tmp.organizationalUnit._id;
                    };
                    let kpi = tmp.kpis;
                    cloneKpi = [];
                    for (let i in kpi) {
                        cloneKpi.push(kpi[i]._id);
                    }
                }


                let listResult = evaluations.results;
                for (let i in listResult) {
                    if (listResult[i].role === "responsible") {
                        empPoint[`responsible${listResult[i].employee._id}`] = listResult[i].employeePoint ? listResult[i].employeePoint : undefined;
                        results[`approvedPointResponsible${listResult[i].employee._id}`] = {
                            value: listResult[i].approvedPoint ? listResult[i].approvedPoint : undefined,
                            employee: listResult[i].employee._id,
                            role: "responsible",
                            target: "Point"
                        }
                        results[`contributeResponsible${listResult[i].employee._id}`] = {
                            value: listResult[i].contribution ? listResult[i].contribution : undefined,
                            employee: listResult[i].employee._id,
                            role: "responsible",
                            target: "Contribution"
                        }
                    }
                    else if (listResult[i].role === "consulted") {
                        empPoint[`consulted${listResult[i].employee._id}`] = listResult[i].employeePoint ? listResult[i].employeePoint : undefined;
                        results[`approvedPointConsulted${listResult[i].employee._id}`] = {
                            value: listResult[i].approvedPoint ? listResult[i].approvedPoint : undefined,
                            employee: listResult[i].employee._id,
                            role: "consulted",
                            target: "Point"
                        }
                        results[`contributeConsulted${listResult[i].employee._id}`] = {
                            value: listResult[i].contribution ? listResult[i].contribution : undefined,
                            employee: listResult[i].employee._id,
                            role: "consulted",
                            target: "Contribution"
                        }
                    }
                    else if (listResult[i].role === "accountable") {
                        empPoint[`accountable${listResult[i].employee._id}`] = listResult[i].employeePoint ? listResult[i].employeePoint : undefined;
                        results[`approvedPoint${listResult[i].employee._id}`] = {
                            value: listResult[i].approvedPoint ? listResult[i].approvedPoint : undefined,
                            employee: listResult[i].employee._id,
                            role: "accountable",
                            target: "Point"
                        }
                        results[`contributeAccountable${listResult[i].employee._id}`] = {
                            value: listResult[i].contribution ? listResult[i].contribution : undefined,
                            employee: listResult[i].employee._id,
                            role: "accountable",
                            target: "Contribution"
                        }
                    }
                }
            }


            let infoEval = evaluations.taskInformations;
            let chkHasInfo = false;
            for (let i in infoEval) {
                if (infoEval[i].value !== undefined) {
                    chkHasInfo = true;
                    break;
                }
            }

            if (chkHasInfo) {
                for (let i in infoEval) {

                    if (infoEval[i].type === "date") {
                        if (infoEval[i].value) {
                            info[`${infoEval[i].code}`] = {
                                value: this.formatDate(infoEval[i].value),
                                code: infoEval[i].code,
                                type: infoEval[i].type
                            }
                        }
                        else {
                            info[`${infoEval[i].code}`] = {
                                // value: this.formatDate(Date.now()),
                                code: infoEval[i].code,
                                type: infoEval[i].type
                            }
                        }
                    }
                    else if (infoEval[i].type === "set_of_values") {
                        let splitSetOfValues = infoEval[i].extra.split('\n');
                        if (infoEval[i].value) {
                            info[`${infoEval[i].code}`] = {
                                value: [infoEval[i].value],
                                code: infoEval[i].code,
                                type: infoEval[i].type
                            }
                        }
                        else {
                            info[`${infoEval[i].code}`] = {
                                value: [splitSetOfValues[0]],
                                code: infoEval[i].code,
                                type: infoEval[i].type
                            }
                        }
                    }
                    else {
                        if (infoEval[i].value) {
                            info[`${infoEval[i].code}`] = {
                                value: infoEval[i].value,
                                code: infoEval[i].code,
                                type: infoEval[i].type
                            }
                        }
                    }
                }

            }
            // if (this.props.perform === "stop") {
            //     if (chkHasInfo) {
            //         date = this.formatDate(evaluations.date);
            //     }
            //     else date = this.formatDate(new Date());
            // }
            // else if (this.props.perform === "evaluate") {
            //     date = this.formatDate(evaluations.date);

            // }
        }

        let statusOptions = []; statusOptions.push(task && task.status);

        let taskInfo = {
            task: task,
            progress: progress,
            date: date,
            info: info,
        };

        let calcAuto = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(calcAuto)) calcAuto = undefined;
        if (calcAuto < 0) calcAuto = 0;

        dentaDate = Math.round(((new Date()).getTime() - dateOfEval.getTime()) / (1000 * 3600 * 24));

        return {
            info: info,
            date: date,
            progress: progress,
            task: task,
            userId: idUser,
            empPoint: empPoint,
            results: results,
            automaticPoint: automaticPoint,
            statusOptions: statusOptions,
            calcAuto: calcAuto,
            checkSave: checkSave,
            prevDate: prevDate,
            dentaDate: dentaDate,
            unit: unit,
            kpi: cloneKpi,
            hasAccountable: hasAccountable
        }
    }

    // hàm lấy thông tin từ thông tin công việc
    getInfo = (dateParam) => {
        let info = {};
        let checkSave = false;

        let date = dateParam;
        let evaluation;
        let task = this.props.task;
        let splitter = dateParam.split("-");
        let dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let monthOfEval = dateOfEval.getMonth();
        let yearOfEval = dateOfEval.getFullYear();

        evaluation = task.evaluations.find(e => (monthOfEval === new Date(e.date).getMonth() && yearOfEval === new Date(e.date).getFullYear()));
        let automaticPoint = (evaluation && evaluation.results.length !== 0) ? evaluation.results[0].automaticPoint : undefined;
        let infoTask = task.taskInformations;

        for (let i in infoTask) {
            if (infoTask[i].type === "date") {
                if (infoTask[i].value) {
                    info[`${infoTask[i].code}`] = {
                        value: this.formatDate(infoTask[i].value),
                        code: infoTask[i].code,
                        type: infoTask[i].type
                    }
                }
                else if (!infoTask[i].filledByAccountableEmployeesOnly) {
                    info[`${infoTask[i].code}`] = {
                        value: this.formatDate(Date.now()),
                        code: infoTask[i].code,
                        type: infoTask[i].type
                    }
                }
            }
            else if (infoTask[i].type === "set_of_values") {
                let splitSetOfValues = infoTask[i].extra.split('\n');
                if (infoTask[i].value) {
                    info[`${infoTask[i].code}`] = {
                        value: [infoTask[i].value],
                        code: infoTask[i].code,
                        type: infoTask[i].type
                    }
                }
                else if (!infoTask[i].filledByAccountableEmployeesOnly) {
                    info[`${infoTask[i].code}`] = {
                        value: [splitSetOfValues[0]],
                        code: infoTask[i].code,
                        type: infoTask[i].type
                    }
                }
            }
            else {
                if (infoTask[i].value) {
                    info[`${infoTask[i].code}`] = {
                        value: infoTask[i].value,
                        code: infoTask[i].code,
                        type: infoTask[i].type
                    }
                }
            }
        }

        let progress = task.progress;

        let taskInfo = {
            task: task,
            progress: progress,
            date: date,
            info: info,
        };

        let calcAuto = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(calcAuto)) calcAuto = undefined
        if (calcAuto < 0) calcAuto = 0;

        return {
            info: info,
            autoPoint: automaticPoint,
            progress: progress,
            calcAuto: calcAuto,
            checkSave: checkSave,
        }
    }

    // hàm cập nhật thông tin 
    updateInfo = async () => {
        let data = this.getInfo(this.state.date);
        await this.setState(state => {
            return {
                ...state,
                info: data.info,
                autoPoint: data.calcAuto,
                oldAutoPoint: data.autoPoint,
                progress: data.progress,
                checkSave: data.checkSave,
                indexReRender: state.indexReRender + 1,
            }
        });
    }


    // Function format ngày hiện tại thành dạnh dd-mm-yyyy
    formatDate = (date) => {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

    // hàm cập nhật điểm tự đánh giá
    handleChangePoint = async (e) => {
        let value = parseInt(e.target.value);
        await this.setState(state => {
            return {
                ...state,
                point: value,
                errorOnPoint: this.validatePoint(value)
            }
        })
    }

    // hàm cập nhật progress
    handleChangeProgress = async (e) => {
        let { translate } = this.props;
        let msg;
        let value = parseInt(e.target.value);
        if (value < 0 || value > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_range');
        }
        await this.setState(state => {
            return {
                ...state,
                progress: value,
                errorOnProgress: msg,
            }
        })
        await this.handleChangeAutoPoint();
    }

    // hàm tính điểm tự dộng
    calcAutomaticPoint = () => {
        let taskInfo = {
            task: this.state.task,
            progress: this.state.progress,
            date: this.state.date,
            info: this.state.info,
        };

        let automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined

        return automaticPoint;
    }

    // hàm cập nhật điểm tự động
    handleChangeAutoPoint = async () => {
        let automaticPoint = this.calcAutomaticPoint();
        if (automaticPoint < 0) {
            automaticPoint = 0;
        };
        await this.setState(state => {
            return {
                ...state,
                autoPoint: automaticPoint,
                showAutoPointInfo: undefined
            }
        });
    }

    validateEvaluateResult = (value) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value < 0 || value > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_range');
        }
        return msg;
    }

    validateEvaluateContribute = (value) => {
        let { translate } = this.props;
        let msg = undefined;
        let sum = this.calcSumContribution();
        if (value < 0 || value > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_range');
        }
        return msg;
    }

    validateSumContribute = () => {
        let { translate } = this.props;
        let msg = undefined;
        let res = this.calcSumContribution();
        console.log('res', res);
        if (res.sum > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_contribute');
        }
        else if (res.checkAllEvalContribution && res.sum < 100) {
            msg = translate('task.task_perform.modal_approve_task.err_not_enough_contribute');
            // msg = "ko đủ 100 %"
        }
        return msg;
    }

    // hàm tính tổng phần trăm đóng góp hiện tại ->> để validate
    calcSumContribution = () => {
        let { results, task } = this.state;
        let sum = 0;
        let numOfContributor = 0;
        let checkAllEvalContribution = false;

        let numOfMember = 0;
        numOfMember = task.accountableEmployees.length + task.responsibleEmployees.length + task.consultedEmployees.length;

        for (let i in results) {
            if (results[i].target === "Contribution") {
                if (results[i].value) {
                    sum = sum + results[i].value;
                    numOfContributor = numOfContributor + 1;
                }
            }
        }

        if (numOfContributor === numOfMember) {
            checkAllEvalContribution = true;
        }

        return { sum, checkAllEvalContribution };
    }

    // begin: các hàm cập nhật đóng góp và điểm phê duyệt
    handleChangeAccountablePoint = async (e, id) => {
        let value = parseInt(e.target.value);
        let name = e.target.name
        await this.setState(state => {
            state.results[`${name}`] = {
                value: value,
                employee: id,
                role: "accountable",
                target: "Point"
            }
            if (id === state.userId) state.empPoint[`accountable${id}`] = value;
            state.errorApprovedPoint[`accountable${id}`] = this.validateEvaluateResult(value);
            return {
                ...state,
            }
        })
    }

    handleChangeAccountableContribution = async (e, id) => {
        let value = parseInt(e.target.value);
        let name = e.target.name;
        await this.setState(state => {
            state.results[`${name}`] = {
                value: value,
                employee: id,
                role: "accountable",
                target: "Contribution"
            }
            state.errorContribute[`accountable${id}`] = this.validateEvaluateContribute(value);
            return {
                ...state,
                errSumContribution: this.validateSumContribute(),
            }
        })
    }

    handleChangeApprovedPointForResponsible = async (e, id) => {
        let value = parseInt(e.target.value);
        let name = e.target.name
        await this.setState(state => {
            state.results[`${name}`] = {
                value: isNaN(value) ? undefined : value,
                employee: id,
                role: "responsible",
                target: "Point"
            }
            if (this.props.hasAccountable === false && id === state.userId) state.empPoint[`responsible${id}`] = value;
            state.errorApprovedPoint[`responsible${id}`] = this.validateEvaluateResult(value);
            return {
                ...state,
            }
        })
    }

    handleChangeResponsibleContribution = async (e, id) => {
        let value = parseInt(e.target.value);
        let name = e.target.name;
        await this.setState(state => {
            state.results[`${name}`] = {
                value: isNaN(value) ? undefined : value,
                employee: id,
                role: "responsible",
                target: "Contribution"
            }
            state.errorContribute[`responsible${id}`] = this.validateEvaluateContribute(value);
            return {
                ...state,
                errSumContribution: this.validateSumContribute(),
            }
        })
    }

    handleChangeApprovedPointForConsulted = async (e, id) => {
        let value = parseInt(e.target.value);
        let name = e.target.name
        await this.setState(state => {
            state.results[`${name}`] = {
                value: value,
                employee: id,
                role: "consulted",
                target: "Point"
            }
            state.errorApprovedPoint[`consulted${id}`] = this.validateEvaluateResult(value);
            return {
                ...state,
            }
        })
    }

    handleChangeConsultedContribution = async (e, id) => {
        let value = parseInt(e.target.value);
        let name = e.target.name;
        await this.setState(state => {
            state.results[`${name}`] = {
                value: value,
                employee: id,
                role: "consulted",
                target: "Contribution"
            }
            state.errorContribute[`consulted${id}`] = this.validateEvaluateContribute(value);
            return {
                ...state,
                errSumContribution: this.validateSumContribute(),
            }
        })
    }

    handleChangeMyPoint = async (e) => {
        let value = parseInt(e.target.value);
        await this.setState(state => {
            return {
                ...state,
                myPoint: value,
                errorOnMyPoint: this.validatePoint(value)
            }
        })
    }

    onContributeChange = async (e, id) => {
        let { name, value } = e.target;
        await this.setState(state => {
            state.results[`${name}`] = {
                value: value,
                employee: id,
            }
            return {
                ...state,
            }
        });
    }

    onApprovedPointChange = async (e, id) => {
        let { name, value } = e.target;
        await this.setState(state => {
            state.results[`${name}`] = {
                value: value,
                employee: id,
            }
            return {
                ...state,
            }
        });
    }
    // -->end

    // hàm cập nhật thông tin số
    handleChangeNumberInfo = async (e) => {
        let value = parseInt(e.target.value);
        let name = e.target.name;
        await this.setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'number'
            }
            state.errorInfo[name] = this.validateNumberInfo(value);
            return {
                ...state,
            }
        })
        await this.handleChangeAutoPoint();
    }

    // hàm cập nhật ttin văn bản
    handleChangeTextInfo = async (e) => {
        let value = e.target.value;
        let name = e.target.name;
        await this.setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'text'
            }
            state.errorInfo[name] = this.validateTextInfo(value);
            return {
                ...state,
            }
        })
    }


    // hàm validate thoogn tin ngày tháng
    handleInfoDateChange = (value, code) => {
        this.setState(state => {
            state.info[`${code}`] = {
                value: value,
                code: code,
                type: 'date'
            }
            state.errorInfo[code] = this.validateDate(value);
            return {
                ...state,
            }
        });
    }

    // hàm validate ttin boolean
    handleInfoBooleanChange = (event) => {
        let { name, value } = event.target;
        this.setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'boolean'
            }
            return {
                ...state,
            }
        });
    }

    // hàm validate ngày tháng
    validateDate = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value.trim() === "") {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }

        return msg;
    }

    // hàm validate ttin van bản
    validateTextInfo = (value) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value === "") {
            // msg = translate('task.task_perform.modal_approve_task.err_empty')
        }
        return msg;
    }

    // hàm validate số
    validatePoint = (value) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value < 0 || value > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_range');
        }
        if (isNaN(value)) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }

    // hàm cập nhật ttin số
    validateNumberInfo = (value) => {
        let { translate } = this.props;
        let msg = undefined;

        if (isNaN(value)) {
            // msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }


    validateInfoBoolean = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value.indexOf("") !== -1) {
            // msg = translate('task.task_perform.modal_approve_task.err_empty');
        }

        return msg;
    }


    // hàm cập nhật thông tin tập giá trị
    handleSetOfValueChange = async (value, code) => {
        console.log('valSet', value);
        this.setState(state => {
            state.info[`${code}`] = {
                value: value,
                code: code,
                type: 'set_of_values'
            }
            return {
                ...state,
            }
        });
    }

    // hàm cập nhật tùy chọn trạng thái lấy thông tin công việc
    handleChangeSaveInfo = async (e) => {
        let { checked } = e.target;
        await this.setState(state => {
            return {
                ...state,
                checkSave: checked,
            }
        });
    }

    // hàm cập nhật trạng thái
    handleStatusChange = (value) => {
        console.log('valStatus', value);
        this.setState(state => {
            return {
                ...state,
                status: value
            }
        });
    }


    // hàm thay đổi kpi
    handleKpiChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                kpi: value
            }
        });
    }

    // hàm cập nhật đơn vị
    handleChangeUnit = (value) => {
        this.setState(state => {
            return {
                ...state,
                unit: value[0],
                kpi: [],
            }
        });
        this.props.getAllKpiSetsOrganizationalUnitByMonth(this.state.userId, value[0], this.state.date);
    }

    // hàm cập nhật ngày đánh giá
    handleDateChange = (value) => {
        let { translate } = this.props;
        let { task, userId, unit } = this.state;
        let data = this.getData(value);
        this.props.getAllKpiSetsOrganizationalUnitByMonth(userId, unit, value);

        let endOfMonth = new moment().endOf("month").toDate();
        let startOfMonth = new moment().startOf("month").toDate();

        let startDate = new Date(task.startDate);
        let endDate = new Date(task.endDate);

        let splitter = value.split('-');
        let dateValue = new Date(splitter[2], splitter[1] - 1, splitter[0]);

        let de = (endOfMonth.getTime() - dateValue.getTime()); // < 0 -> err
        let ds = (dateValue.getTime() - startOfMonth.getTime()); // < 0 -> err

        let dst = (dateValue.getTime() - startDate.getTime()); // < 0 -> err
        let det = (endDate.getTime() - dateValue.getTime()); // < 0 -> err

        let err;
        if (value.trim() === "") {
            err = translate('task.task_perform.modal_approve_task.err_empty');
        }
        else if (dst < 0) {
            err = translate('task.task_management.err_eval_start');
        }
        else if (de < 0 || ds < 0) {
            err = translate('task.task_management.err_eval_on_month');
        }
        let automaticPoint = data.automaticPoint;
        let taskInfo = {
            task: data.task,
            progress: this.state.progress,
            date: value,
            info: this.state.info,
        };

        automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined
        if (automaticPoint < 0) automaticPoint = 0;

        this.setState(state => {
            return {
                ...state,
                errorOnDate: err,
                date: value,
                empPoint: data.empPoint,
                autoPoint: automaticPoint,
                oldAutoPoint: data.automaticPoint,
                indexReRender: state.indexReRender + 1,
            }
        });

    }
    validateDate = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value.trim() === "") {
            // msg = translate('task.task_perform.modal_approve_task.err_empty');
        }

        return msg;
    }

    // hàm validate submit
    isFormValidated = () => {
        const { errorOnDate, errorOnPoint, errorOnAccountablePoint, errorOnAccountableContribution, errorOnMyPoint,
            errorOnProgress, errorOnInfoDate, errorOnInfoBoolean, errorOnNumberInfo, errorOnTextInfo, errorApprovedPoint, errorContribute, errSumContribution } = this.state;
        let { info, results, empPoint, progress, } = this.state;

        let checkErrorContribute = true;
        let checkErrorApprovedPoint = true;

        if (Object.keys(errorApprovedPoint).length === 0) {

        }
        for (let i in errorApprovedPoint) {
            if (errorApprovedPoint[i]) {
                checkErrorApprovedPoint = false;
                break;
            }
        }

        for (let i in errorContribute) {
            if (errorContribute[i]) {
                checkErrorContribute = false;
                break;
            }
        }

        return checkErrorApprovedPoint && checkErrorContribute && (errorOnDate === undefined && errorOnPoint === undefined
            && errorOnInfoDate === undefined && errorOnAccountablePoint === undefined && errorOnProgress === undefined
            && errorOnAccountableContribution === undefined && errorOnMyPoint === undefined && errSumContribution === undefined
            && errorOnInfoBoolean === undefined && errorOnNumberInfo === undefined && errorOnTextInfo === undefined) ? true : false;
    }

    // hàm hiển thị modal show autopoint
    handleShowAutomaticPointInfo = async () => {
        await this.setState(state => {
            return {
                ...state,
                showAutoPointInfo: 1
            }
        });
        window.$(`#modal-automatic-point-info`).modal('show');

    }

    // format vai trò multi language
    formatRole = (data) => {
        const { translate } = this.props;
        if (data === "consulted") return translate('task.task_management.consulted');
        if (data === "accountable") return translate('task.task_management.accountable');
        if (data === "responsible") return translate('task.task_management.responsible');
    }

    // hàm ghi lại lich sử đánh giá
    handleAddTaskLog = () => {
        let title = '';
        let description = '';

        let { date, autoPoint, progress, status, results } = this.state;

        if (date !== currentTask.date ||
            autoPoint !== currentTask.automaticPoint ||
            status !== currentTask.statusOptions ||
            JSON.stringify(results) !== JSON.stringify(currentTask.results)
        ) {
            title = title + 'Chỉnh sửa thông tin đánh giá theo vai trò người thực hiện';

            if (date !== currentTask.date) {
                description = description + 'Ngày đánh giá mới: ' + date;
            }

            if (JSON.stringify(results) !== JSON.stringify(currentTask.results)) {
                let inactiveEmp = currentTask.task.inactiveEmployees.map(e => e._id);

                for (let i in currentTask.task.responsibleEmployees) {
                    if (inactiveEmp.indexOf(currentTask.task.responsibleEmployees[i]._id) === -1) {
                        if (results[`approvedPointResponsible${currentTask.task.responsibleEmployees[i]._id}`].value !== currentTask.results[`approvedPointResponsible${currentTask.task.responsibleEmployees[i]._id}`].value) {
                            description = description === '' ? description + `Điểm đánh giá mới cho ${currentTask.task.responsibleEmployees[i].name}: ` + results[`approvedPointResponsible${currentTask.task.responsibleEmployees[i]._id}`].value : description + '. ' + `Điểm đánh giá mới cho ${currentTask.task.responsibleEmployees[i].name}: ` + results[`approvedPointResponsible${currentTask.task.responsibleEmployees[i]._id}`].value;
                        }

                        if (results[`contributeResponsible${currentTask.task.responsibleEmployees[i]._id}`].value !== currentTask.results[`contributeResponsible${currentTask.task.responsibleEmployees[i]._id}`].value) {
                            description = description === '' ? description + `% đóng góp mới cho ${currentTask.task.responsibleEmployees[i].name}: ` + results[`contributeResponsible${currentTask.task.responsibleEmployees[i]._id}`].value : description + '. ' + `% đóng góp mới cho ${currentTask.task.responsibleEmployees[i].name}: ` + results[`contributeResponsible${currentTask.task.responsibleEmployees[i]._id}`].value;
                        }
                    }
                }

                for (let i in currentTask.task.consultedEmployees) {
                    if (inactiveEmp.indexOf(currentTask.task.consultedEmployees[i]._id) === -1) {
                        if (results[`approvedPointConsulted${currentTask.task.consultedEmployees[i]._id}`].value !== currentTask.results[`approvedPointConsulted${currentTask.task.consultedEmployees[i]._id}`].value) {
                            description = description === '' ? description + `Điểm đánh giá mới cho ${currentTask.task.consultedEmployees[i].name}: ` + results[`approvedPointConsulted${currentTask.task.consultedEmployees[i]._id}`].value : description + '. ' + `Điểm đánh giá mới cho ${currentTask.task.consultedEmployees[i].name}: ` + results[`approvedPointConsulted${currentTask.task.consultedEmployees[i]._id}`].value;
                        }

                        if (results[`approvedPointConsulted${currentTask.task.consultedEmployees[i]._id}`].value !== currentTask.results[`approvedPointConsulted${currentTask.task.consultedEmployees[i]._id}`].value) {
                            description = description === '' ? description + `% đóng góp mới cho ${currentTask.task.consultedEmployees[i].name}: ` + results[`approvedPointConsulted${currentTask.task.consultedEmployees[i]._id}`].value : description + '. ' + `% đóng góp mới cho ${currentTask.task.consultedEmployees[i].name}: ` + results[`approvedPointConsulted${currentTask.task.consultedEmployees[i]._id}`].value;
                        }
                    }
                }

                for (let i in currentTask.task.accountableEmployees) {
                    if (inactiveEmp.indexOf(currentTask.task.accountableEmployees[i]._id) === -1) {
                        if (results[`approvedPoint${currentTask.task.accountableEmployees[i]._id}`].value !== currentTask.results[`approvedPoint${currentTask.task.accountableEmployees[i]._id}`].value) {
                            description = description === '' ? description + `Điểm đánh giá mới cho ${currentTask.task.accountableEmployees[i].name}: ` + results[`approvedPoint${currentTask.task.accountableEmployees[i]._id}`].value : description + '. ' + `Điểm đánh giá mới cho ${currentTask.task.accountableEmployees[i].name}: ` + results[`approvedPoint${currentTask.task.accountableEmployees[i]._id}`].value;
                        }

                        if (results[`approvedPoint${currentTask.task.accountableEmployees[i]._id}`].value !== currentTask.results[`approvedPoint${currentTask.task.accountableEmployees[i]._id}`].value) {
                            description = description === '' ? description + `% đóng góp mới cho ${currentTask.task.accountableEmployees[i].name}: ` + results[`approvedPoint${currentTask.task.accountableEmployees[i]._id}`].value : description + '. ' + `% đóng góp mới cho ${currentTask.task.accountableEmployees[i].name}: ` + results[`approvedPoint${currentTask.task.accountableEmployees[i]._id}`].value;
                        }
                    }
                }
            }

            if (autoPoint !== currentTask.automaticPoint) {
                description = description === '' ? description + 'Điểm chấm tự động mới: ' + autoPoint : description + '. ' + 'Điểm chấm tự động mới: ' + autoPoint;
            }

            if (status !== currentTask.statusOptions) {
                description = description === '' ? description + 'Trạng thái công việc mới: ' + status : description + '. ' + 'Trạng thái công việc mới: ' + status;
            }
        }

        if (currentTask.task.progress !== progress) {
            title = title === '' ? title + 'Chỉnh sửa thông tin công việc' : title + '. ' + 'Chỉnh sửa thông tin công việc';
            description = description === '' ? description + 'Mức độ hoàn thành mới: ' + progress + "%" : description + '. ' + 'Mức độ hoàn thành mới: ' + progress + "%";
        }

        if (title !== '' || description !== '') {
            this.props.addTaskLog({
                createdAt: Date.now(),
                creator: getStorage("userId"),
                title: title,
                description: description,
            }, this.state.task._id)
        }

    }

    // format tháng
    formatMonth(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    checkHasEval = (date, performtasks) => {
        let splitter = date.split("-");
        let dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);

        let monthOfEval = dateOfEval.getMonth();
        let yearOfEval = dateOfEval.getFullYear();

        let taskId, evaluation;
        taskId = performtasks.task?._id;
        evaluation = performtasks.task?.evaluations.find(e => (monthOfEval === new Date(e.date).getMonth() && yearOfEval === new Date(e.date).getFullYear()));

        if (evaluation) return true;
        return false;
    }

    // hàm delete 
    deleteEval = async () => {
        let { translate, date, performtasks } = this.props;
        Swal.fire({
            title: translate('task.task_management.delete_eval_title'),
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: translate('general.yes'),
            cancelButtonText: translate('general.no'),
        }).then(async (res) => {
            if (res.value) {
                let splitter = date.split("-");
                let dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);

                let monthOfEval = dateOfEval.getMonth();
                let yearOfEval = dateOfEval.getFullYear();

                // Xóa Evaluation
                let taskId, evaluation, evaluationId;
                taskId = performtasks.task?._id;
                evaluation = performtasks.task?.evaluations.find(e => (monthOfEval === new Date(e.date).getMonth() && yearOfEval === new Date(e.date).getFullYear()));
                evaluationId = evaluation?._id;

                await this.props.deleteEvaluation(taskId, evaluationId);
                this.props.addTaskLog({
                    createdAt: Date.now(),
                    creator: getStorage("userId"),
                    title: `Xóa đánh giá công việc tháng ${this.formatMonth(new Date())}`,
                    description: ``,
                }, taskId);
                this.props.handleChangeDataStatus(1); // 1 = DATA_STATUS.QUERYING
            }
        });
    }

    // hàm submit
    save = () => {
        let taskId;
        taskId = this.state.task._id;
        let data = {
            user: getStorage("userId"),
            progress: this.state.progress,
            automaticPoint: this.state.autoPoint,
            role: "accountable",
            status: this.state.status,
            hasAccountable: this.state.hasAccountable,

            date: this.state.date,

            info: this.state.info,
            results: this.state.results,
            checkSave: this.state.checkSave,

            kpi: this.state.kpi,
            unit: this.state.unit,
        }

        this.handleAddTaskLog();

        this.props.evaluateTaskByAccountableEmployees(data, taskId);

        this.setState(state => {
            return {
                ...state,
                oldAutoPoint: state.autoPoint,
            }
        });
    }

    // hàm kiểm tra thông báo
    checkNote = () => {
        let { date } = this.props;
        let splitter = date.split("-");
        let isoDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let now = new Date();

        if (now.getMonth() === isoDate.getMonth() && now.getFullYear() === isoDate.getFullYear()) {
            return false;
        }
        return true
    }

    // hàm kiểm tra NULL, UNDEFINED
    checkNullUndefined = (x) => {
        if (x === null || x === undefined) {
            return false;
        }
        else return true;
    }

    render() {
        const { translate, user, KPIPersonalManager, performtasks } = this.props;
        const { task, date, status, oldAutoPoint, autoPoint, errorOnDate, showAutoPointInfo, dentaDate, prevDate, info, results, empPoint, progress,
            errorInfo, errorApprovedPoint, errorContribute, errSumContribution, indexReRender, unit, kpi } = this.state;
        const { id, perform, role, hasAccountable } = this.props;

        let listKpi = [];
        if (KPIPersonalManager && KPIPersonalManager.kpiSets) {
            listKpi = KPIPersonalManager.kpiSets.kpis;
        }

        let listUnits = [];
        if (user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
            listUnits = user.organizationalUnitsOfUser.map(x => { return { value: x._id, text: x.name } });
        }

        let taskActions = task.taskActions;
        let splitter = date.split('-');
        let evaluationsDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let actionsNotRating = taskActions.filter(item => (
            item.rating === -1 &&
            new Date(item.createdAt).getMonth() === evaluationsDate.getMonth()
            && new Date(item.createdAt).getFullYear() === evaluationsDate.getFullYear()
        ))

        let statusArr = [
            { value: "inprocess", text: translate('task.task_management.inprocess') },
            { value: "wait_for_approval", text: translate('task.task_management.wait_for_approval') },
            { value: "finished", text: translate('task.task_management.finished') },
            { value: "delayed", text: translate('task.task_management.delayed') },
            { value: "canceled", text: translate('task.task_management.canceled') }
        ];

        let checkNoteMonth;
        checkNoteMonth = this.checkNote();

        let disabled = false;
        if (checkNoteMonth && (dentaDate > 7)) {
            disabled = true;
        }
        let disableSubmit = !this.isFormValidated();

        return (
            <React.Fragment>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div>
                        {/* Thông báo về thời gian đánh giá */}
                        <div>
                            {checkNoteMonth && (dentaDate <= 7 && dentaDate > 0) && <p style={{ color: "red" }}>{translate('task.task_management.note_eval')}:&nbsp;&nbsp; {8 - dentaDate}</p>}
                            {checkNoteMonth && (dentaDate > 7) && <p style={{ color: "red" }}>{translate('task.task_management.note_not_eval')}</p>}
                        </div>
                        {/* Nút lưu */}
                        {!(checkNoteMonth && (dentaDate > 7)) &&
                            <div className='pull-right'>
                                {/* disabled={disabled || disableSubmit} id !== 'new' && */}
                                {(this.checkHasEval(date, performtasks) && role === "accountable") && <button style={{ marginRight: '5px' }} className="btn btn-danger" onClick={this.deleteEval}>{translate('task.task_management.delete_eval')}</button>}
                                <button disabled={disabled || disableSubmit} className="btn btn-success" onClick={this.save}>{translate('task.task_management.btn_save_eval')}</button>
                            </div>
                        }
                    </div>



                    <div>
                        {/* Đánh giá từ ngày ... đến ngày ... */}
                        <form id="form-evaluate-task-by-accountable">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('task.task_management.detail_general_info')}</legend>
                                <div className="row">
                                    {/* ngày đánh giá tháng trc hoặc ngày bắt đầu làm việc */}
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>{translate('task.task_management.eval_from')}</label>
                                            <DatePicker
                                                id={`start_date_${id}_${perform}`}
                                                value={prevDate}
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                    {/* ngày đánh giá */}
                                    <div className={`form-group col-md-6 ${errorOnDate === undefined ? "" : "has-error"}`}>
                                        <label>{translate('task.task_management.eval_to')}<span className="text-red">*</span></label>
                                        <DatePicker
                                            id={`create_date_${perform}-${id}`}
                                            value={date}
                                            onChange={this.handleDateChange}
                                            disabled={disabled}
                                        />
                                        <ErrorLabel content={errorOnDate} />
                                    </div>
                                </div>
                                {
                                    // Trạng thái công việc
                                    <div className="form-group">
                                        <label>{translate('task.task_management.detail_status')}</label>
                                        {
                                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                id={`select-priority-task-${perform}-${role}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={statusArr}
                                                onChange={this.handleStatusChange}
                                                multiple={false}
                                                value={status[0]}
                                                disabled={disabled}
                                            />
                                        }
                                    </div>
                                }
                                {/* Đơn vị đánh giá */}
                                <div className="form-group">
                                    <label>{translate('task.task_management.unit_evaluate')}</label>
                                    {
                                        <SelectBox
                                            id={`select-organizational-unit-evaluate-${perform}-${role}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={listUnits}
                                            onChange={this.handleChangeUnit}
                                            multiple={false}
                                            value={unit}
                                            disabled={disabled}
                                        />
                                    }
                                </div>

                                {/* Liên kết KPI */}
                                <div className="form-group">
                                    <label>{translate('task.task_management.detail_kpi')}</label>
                                    {
                                        <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                            id={`select-kpi-personal-evaluate-${perform}-${role}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={
                                                hasAccountable ? ((KPIPersonalManager && KPIPersonalManager.kpiSets) ?
                                                    (KPIPersonalManager.kpiSets.kpis.filter(e => (e.type === 1)).map(x => { return { value: x._id, text: x.name } }))
                                                    : []) :
                                                    ((KPIPersonalManager && KPIPersonalManager.kpiSets) ?
                                                        (KPIPersonalManager.kpiSets.kpis.filter(e => (e.type === 0)).map(x => { return { value: x._id, text: x.name } }))
                                                        : [])
                                            }
                                            onChange={this.handleKpiChange}
                                            multiple={true}
                                            value={kpi}
                                            disabled={disabled}
                                        />
                                    }
                                </div>
                            </fieldset>

                            {/* Thông tin đánh giá công việc */}
                            <div>
                                <TaskInformationForm
                                    legendText={translate('task.task_management.info_eval_month')}
                                    task={task && task}

                                    handleChangeProgress={this.handleChangeProgress}
                                    handleInfoBooleanChange={this.handleInfoBooleanChange}
                                    handleInfoDateChange={this.handleInfoDateChange}
                                    handleSetOfValueChange={this.handleSetOfValueChange}
                                    handleChangeNumberInfo={this.handleChangeNumberInfo}
                                    handleChangeTextInfo={this.handleChangeTextInfo}
                                    handleChangeSaveInfo={this.handleChangeSaveInfo}
                                    updateInfo={this.updateInfo}

                                    indexReRender={indexReRender}

                                    role={role}
                                    perform={perform}
                                    id={id}
                                    value={this.state}
                                    disabled={disabled}
                                />

                            </div>


                            <div>
                                {/* Thông tin điểm tự động */}
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('task.task_management.auto_point_field')}</legend>
                                    <div style={{ lineHeight: "3" }}>
                                        <div>
                                            <strong>{translate('task.task_management.detail_auto_point')}: &nbsp;</strong>
                                            <a style={{ cursor: "pointer" }} id={`autoPoint-${perform}`} onClick={() => this.handleShowAutomaticPointInfo()}>
                                                {this.checkNullUndefined(autoPoint) ? autoPoint : translate('task.task_management.detail_not_calc_auto_point')}
                                            </a>
                                        </div>
                                        <div>
                                            <strong>{translate('task.task_management.detail_auto_on_system')}: &nbsp;</strong>
                                            <a style={{ color: "black" }}>
                                                {this.checkNullUndefined(oldAutoPoint) ? oldAutoPoint : translate('task.task_management.detail_not_calc_auto_point')}
                                            </a>
                                        </div>
                                        <div>
                                            <strong>{translate('task.task_management.action_not_rating')}:&nbsp;&nbsp;</strong>
                                            {
                                                actionsNotRating.length === 0 ? translate('task.task_management.no_action') :
                                                    actionsNotRating.map((item, index) => (
                                                        <div>
                                                            <span key={index}>
                                                                ({index + 1})&nbsp;&nbsp;
                                                            <TextEditor data={item.description} edit={false}/>
                                                            </span>
                                                        </div>
                                                    ))
                                            }
                                        </div>
                                    </div>
                                    { // modal thông tin điểm tự động
                                        showAutoPointInfo === 1 &&
                                        <ModalShowAutoPointInfo
                                            task={task}
                                            progress={progress}
                                            date={date}
                                            info={info}
                                            autoPoint={autoPoint}
                                        />
                                    }
                                </fieldset>

                                {/* Phần chấm điểm phê duyệt */}
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('task.task_management.evaluate_member')}</legend>

                                    {
                                        <table className="table table-striped table-hover">
                                            <tr style={{ verticalAlign: "top" }}>
                                                <th><div className="form-group"><label>{translate('task.task_management.name_employee')}</label></div></th>
                                                <th><div className="form-group"><label>{translate('task.task_management.role_employee')}</label></div></th>
                                                <th><div className="form-group"><label>{translate('task.task_management.detail_emp_point')}</label></div></th>
                                                <th>
                                                    <label>% {translate('task.task_management.contribution')}</label>
                                                    <div style={{ fontWeight: "normal" }} className={`form-group ${errSumContribution === undefined ? "" : "has-error"}`}>
                                                        <ErrorLabel content={errSumContribution ? errSumContribution : ''} />
                                                    </div>
                                                </th>
                                                <th><div className="form-group"><label>{translate('task.task_management.acc_evaluate')}</label></div></th>
                                            </tr>

                                            { // Chấm điểm phê duyệt cho người thực hiện
                                                task && task.responsibleEmployees.map((item, index) =>
                                                    (task.inactiveEmployees.indexOf(item._id) === -1 &&
                                                        <tr key={index} style={{ verticalAlign: "top" }}>
                                                            <td><div style={{ marginTop: 10 }}>{item.name}</div></td>
                                                            <td><div style={{ marginTop: 10 }}>{this.formatRole('responsible')}</div></td>
                                                            <td><div style={{ marginTop: 10 }}>{this.checkNullUndefined(empPoint[`responsible${item._id}`]) ? empPoint[`responsible${item._id}`] : translate('task.task_management.not_eval')}</div></td>
                                                            <td style={{ padding: 5 }}>
                                                                <div className={errorContribute[`responsible${item._id}`] === undefined ? "form-group" : "form-group has-error"}>
                                                                    <input className='form-control'
                                                                        value={this.checkNullUndefined(results[`contributeResponsible${item._id}`]?.value) ? results[`contributeResponsible${item._id}`].value : ''}
                                                                        type="number" name={`contributeResponsible${item._id}`} placeholder={"% " + translate('task.task_management.contribution')}
                                                                        onChange={(e) => this.handleChangeResponsibleContribution(e, item._id)}
                                                                        disabled={disabled}
                                                                    />
                                                                    <ErrorLabel content={errorContribute ? errorContribute[`responsible${item._id}`] : ''} />
                                                                </div>
                                                            </td>
                                                            <td style={{ padding: 5 }}>
                                                                <div className={errorApprovedPoint[`responsible${item._id}`] === undefined ? "form-group" : "form-group has-error"}>
                                                                    <input className='form-control' type="number"
                                                                        value={this.checkNullUndefined(results[`approvedPointResponsible${item._id}`]?.value) ? results[`approvedPointResponsible${item._id}`].value : ''}
                                                                        name={`approvedPointResponsible${item._id}`} placeholder={translate('task.task_management.detail_acc_point')}
                                                                        onChange={(e) => this.handleChangeApprovedPointForResponsible(e, item._id)}
                                                                        disabled={disabled}
                                                                    />
                                                                    <ErrorLabel content={errorApprovedPoint ? errorApprovedPoint[`responsible${item._id}`] : ''} />
                                                                </div>

                                                            </td>
                                                        </tr>
                                                    )

                                                )
                                            }
                                            { // Chấm điểm phê duyệt cho người tư vấn
                                                task && task.consultedEmployees.map((item, index) =>
                                                    (task.inactiveEmployees.indexOf(item._id) === -1 &&
                                                        <tr key={index} style={{ verticalAlign: "top" }}>
                                                            <td><div style={{ marginTop: 10 }}>{item.name}</div></td>
                                                            <td><div style={{ marginTop: 10 }}>{this.formatRole('consulted')}</div></td>
                                                            <td><div style={{ marginTop: 10 }}>{this.checkNullUndefined(empPoint[`consulted${item._id}`]) ? empPoint[`consulted${item._id}`] : translate('task.task_management.not_eval')}</div></td>
                                                            <td style={{ padding: 5 }}>
                                                                <div className={errorContribute[`consulted${item._id}`] === undefined ? "form-group" : "form-group has-error"}>
                                                                    <input className='form-control' type="number"
                                                                        value={this.checkNullUndefined(results[`contributeConsulted${item._id}`]?.value) ? results[`contributeConsulted${item._id}`].value : ''}
                                                                        name={`contributeConsulted${item._id}`} placeholder={"% " + translate('task.task_management.contribution')}
                                                                        onChange={(e) => this.handleChangeConsultedContribution(e, item._id)}
                                                                        disabled={disabled}
                                                                    />
                                                                    <ErrorLabel content={errorContribute ? errorContribute[`consulted${item._id}`] : ''} />
                                                                </div>

                                                            </td>
                                                            <td style={{ padding: 5 }}>
                                                                <div className={errorApprovedPoint[`consulted${item._id}`] === undefined ? "form-group" : "form-group has-error"}>
                                                                    <input className='form-control' type="number"
                                                                        value={this.checkNullUndefined(results[`approvedPointConsulted${item._id}`]?.value) ? results[`approvedPointConsulted${item._id}`].value : ''}
                                                                        name={`approvedPointConsulted${item._id}`} placeholder={translate('task.task_management.detail_acc_point')}
                                                                        onChange={(e) => this.handleChangeApprovedPointForConsulted(e, item._id)}
                                                                        disabled={disabled}
                                                                    />
                                                                    <ErrorLabel content={errorApprovedPoint ? errorApprovedPoint[`consulted${item._id}`] : ''} />
                                                                </div>

                                                            </td>
                                                        </tr>
                                                    )

                                                )
                                            }
                                            { // Chấm điểm phê duyệt cho người phê duyệt
                                                task && task.accountableEmployees.map((item, index) =>
                                                    (task.inactiveEmployees.indexOf(item._id) === -1 &&
                                                        <tr key={index} style={{ verticalAlign: "top" }}>
                                                            <td><div style={{ marginTop: 10 }}>{item.name}</div></td>
                                                            <td><div style={{ marginTop: 10 }}>{this.formatRole('accountable')}</div></td>
                                                            <td><div style={{ marginTop: 10 }}><p id={`accountablePoint${item._id}`}>{this.checkNullUndefined(empPoint[`accountable${item._id}`]) ? empPoint[`accountable${item._id}`] : translate('task.task_management.not_eval')}</p></div></td>
                                                            <td style={{ padding: 5 }}>
                                                                <div className={errorContribute[`accountable${item._id}`] === undefined ? "form-group" : "form-group has-error"}>
                                                                    <input className='form-control' type="number"
                                                                        value={this.checkNullUndefined(results[`contributeAccountable${item._id}`]?.value) ? results[`contributeAccountable${item._id}`].value : ''}
                                                                        name={`contributeAccountable${item._id}`} placeholder={"% " + translate('task.task_management.contribution')}
                                                                        onChange={(e) => this.handleChangeAccountableContribution(e, item._id)}
                                                                        disabled={disabled}
                                                                    />
                                                                    <ErrorLabel content={errorContribute ? errorContribute[`accountable${item._id}`] : ''} />
                                                                </div>
                                                            </td>
                                                            <td style={{ padding: 5 }}>
                                                                <div className={errorApprovedPoint[`accountable${item._id}`] === undefined ? "form-group" : "form-group has-error"}>
                                                                    <input className="form-control" type="number"
                                                                        value={this.checkNullUndefined(results[`approvedPoint${item._id}`]?.value) ? results[`approvedPoint${item._id}`].value : ''}
                                                                        name={`approvedPoint${item._id}`} placeholder={translate('task.task_management.detail_acc_point')}
                                                                        onChange={(e) => this.handleChangeAccountablePoint(e, item._id)}
                                                                        disabled={disabled}
                                                                    />
                                                                    <ErrorLabel content={errorApprovedPoint ? errorApprovedPoint[`accountable${item._id}`] : ''} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            }
                                        </table>
                                    }
                                </fieldset>
                            </div>
                        </form>

                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapState = (state) => {
    const { tasks, performtasks, KPIPersonalManager, user } = state;
    return { tasks, performtasks, KPIPersonalManager, user };
}
const getState = {
    addTaskLog: performTaskAction.addTaskLog,
    deleteEvaluation: performTaskAction.deleteEvaluation,
    evaluateTaskByAccountableEmployees: performTaskAction.evaluateTaskByAccountableEmployees,
    getAllKpiSetsOrganizationalUnitByMonth: managerKpiActions.getAllKpiSetsOrganizationalUnitByMonth,
}

const evaluateByAccountableEmployee = connect(mapState, getState)(withTranslate(EvaluateByAccountableEmployee));
export { evaluateByAccountableEmployee as EvaluateByAccountableEmployee }
