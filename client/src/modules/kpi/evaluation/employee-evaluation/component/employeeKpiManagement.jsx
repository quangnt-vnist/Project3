import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { kpiMemberActions } from '../redux/actions';
import { managerActions } from '../../../organizational-unit/management/redux/actions';
import { DataTableSetting, ExportExcel } from '../../../../../common-components';
import { DatePicker, SelectBox } from '../../../../../common-components/index';
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { EmployeeKpiApproveModal } from './employeeKpiApproveModal';
import { EmployeeKpiEvaluateModal } from './employeeKpiEvaluateModal';
import getEmployeeSelectBoxItems from '../../../../task/organizationalUnitHelper';
import { withTranslate } from 'react-redux-multilingual';

class EmployeeKpiManagement extends Component {

    constructor(props) {
        super(props);

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        this.state = {
            commenting: false,
            userId: '',
            status: -1,
            startDate: currentMonth === 0 ? (currentYear - 1) + '-' + 12 : currentYear + '-' + currentMonth,
            endDate: (currentMonth > 10) ? ((currentYear + 1) + '-' + (currentMonth - 10)) : (currentYear + '-' + (currentMonth + 2)),
            infosearch: {
                role: localStorage.getItem("currentRole"),
                user: '',
                status: -1,
                startDate: currentMonth === 0 ? (currentYear - 1) + '-' + 12 : currentYear + '-' + currentMonth,
                endDate: (currentMonth > 10) ? ((currentYear + 1) + '-' + (currentMonth - 10)) : (currentYear + '-' + (currentMonth + 2)),
            },
            showApproveModal: null,
            showEvaluateModal: null,
            dataStatus : this.DATA_STATUS.NOT_AVAILABLE
        };
    }

    componentDidMount () {
        const { infosearch } = this.state;
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
        this.props.getEmployeeKPISets(infosearch);
    }

    shouldComponentUpdate = (nextProps, nextStates) => {
        const { dataStatus } =this.state;
        if (dataStatus === this.DATA_STATUS.QUERYING)
        {
            if (!nextProps.kpimembers.tasksList) {
                return false;
            } else {
                let exportData = this.convertDataToExportTotalData();
                if (exportData) ExportExcel.export(exportData);

                this.setState(state => {
                    return {
                        ...state,
                        dataStatus: this.DATA_STATUS.FINISHED,
                    }
                });
                return false;
            }
        }
        return true;
    }

    formatDateBack (date) {
        let d = new Date(date), month, day, year;
        if (d.getMonth() === 0) {
            month = '' + 12;
            day = '' + d.getDate();
            year = d.getFullYear() - 1;
        } else {
            month = '' + (d.getMonth() + 1);
            day = '' + d.getDate();
            year = d.getFullYear();
        }
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    formatDate (date) {
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

    formatTaskStatus = (translate, status) => {
        switch (status) {
            case "inprocess":
                return translate('task.task_management.inprocess');
            case "wait_for_approval":
                return translate('task.task_management.wait_for_approval');
            case "finished":
                return translate('task.task_management.finished');
            case "delayed":
                return translate('task.task_management.delayed');
            case "canceled":
                return translate('task.task_management.canceled');
        }
    }

    checkStatusKPI = (status) => {
        if (status === 0) {
            return "Đang thiết lập";
        } else if (status === 1) {
            return "Chờ phê duyệt";
        } else if (status === 2) {
            return "Đã kích hoạt";
        }
    }

    handleStartDateChange = (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        this.setState(state => {
            return {
                ...state,
                startDate: month
            }
        });

    }

    handleEndDateChange = (value) => {
        let month;

        if (value.slice(0, 2) < 12) {
            month = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)) + 1);
        } else {
            month = (new Number(value.slice(3, 7)) + 1) + '-' + '1';
        }
        
        this.setState(state => {
            return {
                ...state,
                endDate: month,
            }
        });

    }

    handleEmployeeChange = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                userId: value
            }
        });
    }

    handleStatusChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                status: value
            }
        });
    }

    handleSearchData = async () => {
        const { translate } = this.props;
        const { startDate, endDate, userId, status } = this.state;

        if (startDate === "") startDate = null;
        if (endDate === "") endDate = null;
        await this.setState(state => {
            return {
                ...state,
                infosearch: {
                    ...state.infosearch,
                    user: userId,
                    status: status,
                    startDate: startDate,
                    endDate: endDate
                },
                kpiId: null,
                employeeKpiSet: { _id: null },
            }
        })

        let startdate = null, enddate = null;
        if (startDate) {
            startdate = new Date(startDate);
        }
        if (endDate) {
            enddate = new Date(endDate);
        }

        if (startdate && enddate && startdate.getTime() >= Date.parse(enddate)) {
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        }
        else {
            let { infosearch } = this.state;
            this.props.getEmployeeKPISets(infosearch);
        }
    }

    handleShowApproveModal = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                kpiId: id
            }
        })
        window.$(`modal-approve-KPI-member`).modal('show');
    }

    showEvaluateModal = async (item) => {
        await this.setState(state => {
            return {
                ...state,
                employeeKpiSet: item
            }
        })
        window.$(`employee-kpi-evaluation-modal`).modal('show');
    }

    handleExportTotalData = () => {
        let kpimember;
        const { kpimembers } = this.props;
        if(kpimembers.kpimembers)
        {
            kpimember = kpimembers.kpimembers
        }
        let data = kpimember.map(item=>{
            return item._id;
        })
        this.props.getTaskByListKpis(data);
        this.props.getAllKPIUnit({
            role: localStorage.getItem("currentRole"),
            status: -1,
            startDate: null,
            endDate: null
        })
        
        this.setState(state => {
            return {
                ...state,
                dataStatus: this.DATA_STATUS.QUERYING,
            }
        });
    }

    pushDataIntoTable =(dataOfOneSheet)=>{
        let tables =[],table=[],names=[],kpiSetApproverPoint=[],kpiSetAutomaticPoint=[],kpiSetEmployeePoint=[],kpiNum=[],numTask=0,row;

        for(let i=0;i<dataOfOneSheet.data.length;i++)
        {
            names.push(dataOfOneSheet.data[i].name);
            kpiSetApproverPoint.push(dataOfOneSheet.data[i].kpiSetApproverPoint);
            kpiSetAutomaticPoint.push(dataOfOneSheet.data[i].kpiSetAutomaticPoint);
            kpiSetEmployeePoint.push(dataOfOneSheet.data[i].kpiSetEmployeePoint);
            kpiNum.push(dataOfOneSheet.data[i].kpiNum)
            table=[];
            let kpis = dataOfOneSheet.data[i].kpis;
            let tasks= dataOfOneSheet.data[i].oneKpiSetTasks;

            for(let k =0;k<kpis.length;k++)
            {
                let numberRowToMerge =parseInt(tasks[k].length);
                numTask+=numberRowToMerge;
                let task = tasks[k];   
                //khi 1 Kpis chưa có công việc nào hoặc chỉ có 1 công việc
                if(numberRowToMerge < 2)
                {
                    row = {
                        STT : k+1,
                        kpiName : kpis[k].name,
                        kpiWeight : kpis[k].weight,
                        kpiAutomaticPoint : kpis[k].automaticPoint,
                        kpiEmployeePoint: kpis[k].employeePoint,
                        kpiApprovedPoint :kpis[k].approverPoint,
                        kpiStatus : kpis[k].status,
                        taskName : task[0] ? (task[0].name):"",
                        unit: task[0] ? (task[0].unit) : "",
                        importantLevel: task[0] ?task[0].importantLevel:"",
                        contributionPoint: task[0] ?task[0].contributionPoint:"",
                        automaticPoint: task[0] ?task[0].automaticPoint:"",
                        employeePoint: task[0] ?task[0].employeePoint:"",
                        approverPoint: task[0] ?task[0].approverPoint:"",
                        startTaskDate: task[0] ?task[0].startTaskDate:"",
                        endTaskDate:(task[0] )? task[0].endTaskDate:"",
                        startApproveDate:task[0] ?task[0].startApproveDate:"",
                        endApproveDate:task[0] ?task[0].endApproveDate:"",
                        taskStatus: task[0] ?task[0].status:"",
                        progress:task[0] ?task[0].progress:"",

                    }
                    table.push(row);
                }
                else 
                {
                    row = {
                        merges: { 
                            STT: numberRowToMerge,
                            kpiName: numberRowToMerge,
                            kpiWeight: numberRowToMerge, 
                            kpiAutomaticPoint: numberRowToMerge, 
                            kpiEmployeePoint: numberRowToMerge,
                            kpiApprovedPoint: numberRowToMerge,
                            kpiStatus :numberRowToMerge
                        },
                        STT : k+1,
                        kpiName : kpis[k].name,
                        kpiWeight : kpis[k].weight,
                        kpiAutomaticPoint : kpis[k].automaticPoint,
                        kpiEmployeePoint: kpis[k].employeePoint,
                        kpiApprovedPoint :kpis[k].approverPoint,
                        kpiStatus : kpis[k].status,
                        taskName : task[0].name,
                        unit: task[0].unit,
                        importantLevel: task[0].importantLevel,
                        contributionPoint: task[0].contributionPoint,
                        automaticPoint: task[0].automaticPoint,
                        employeePoint: task[0].employeePoint,
                        approverPoint: task[0].approverPoint,
                        startTaskDate: task[0].startTaskDate,
                        endTaskDate:task[0].endTaskDate,
                        startApproveDate:task[0].startApproveDate,
                        endApproveDate:task[0].endApproveDate,
                        taskStatus: task[0].status,
                        progress:task[0].progress
                    }
                    table.push(row);
                    for(let j =1; j < (numberRowToMerge); j++)
                    {
                        let row = {
                            STT : "",
                            kpiName : "",
                            kpiWeight : "",
                            kpiAutomaticPoint : "",
                            kpiEmployeePoint: "",
                            kpiApprovedPoint : "",
                            kpiStatus : "",
                            taskName : task[j].name,
                            unit: task[j].unit,
                            importantLevel: task[j].importantLevel,
                            contributionPoint: task[j].contributionPoint,
                            automaticPoint: task[j].automaticPoint,
                            employeePoint: task[j].employeePoint,
                            approverPoint: task[j].approverPoint,
                            startTaskDate: task[j].startTaskDate,
                            endTaskDate:task[j].endTaskDate,
                            startApproveDate:task[j].startApproveDate,
                            endApproveDate:task[j].endApproveDate,
                            taskStatus: task[j].status,
                            progress:task[j].progress
                        }
                        table.push(row);
                    }
                }   
            }
            tables.push(table);
        }
        
        return {
            tables : tables,
            names : names,
            kpiSetApproverPoint,
            kpiSetAutomaticPoint,
            kpiSetEmployeePoint,
            kpiNum,
            numTask
        }
    }

    convertDataToExportTotalData =()=>{
        const { kpimembers, managerKpiUnit, user, translate } = this.props;
        let listTasks, listKpis, data = {}, convertedData = [], listKpiUnit = [], unitName;
        
        if (user.userdepartments) {
            unitName = user.userdepartments.department;
        }
        if (kpimembers.tasksList)
        {
            
            listTasks =kpimembers.tasksList;
            listKpis =kpimembers.kpimembers;
        }
        if (managerKpiUnit)
        {
            listKpiUnit = managerKpiUnit.kpis;
        }
 
        if (listTasks && listKpis && listKpiUnit && unitName)
        {
            //Convert dữ liệu RAW
            for (let i = 0; i < listKpis.length; i++) {
                let d = new Date(listKpis[i].date),
                    month = (d.getMonth()+1),
                    year = d.getFullYear(),
                    date = month+"-"+year;
                if (!data.hasOwnProperty(date))
                {
                    data[date]=[]
                }
                let kpiSetAutomaticPoint = (listKpis[i].automaticPoint === null) ? "Chưa đánh giá" : parseInt(listKpis[i].automaticPoint);
                let kpiSetEmployeePoint = (listKpis[i].employeePoint === null) ? "Chưa đánh giá" : parseInt(listKpis[i].employeePoint);
                let kpiSetApproverPoint = (listKpis[i].approvedPoint === null) ? "Chưa đánh giá" : parseInt(listKpis[i].approvedPoint);
                let kpiNum = listKpis[i].kpis.length;
                let kpis =listKpis[i].kpis.map((x,index)=>{
                    let name = x.name;
                    let createdAt = new Date(x.createdAt);
                    let automaticPoint = (x.automaticPoint === null) ? "Chưa đánh giá" : parseInt(x.automaticPoint);
                    let employeePoint = (x.employeePoint === null) ? "Chưa đánh giá" : parseInt(x.employeePoint);
                    let approverPoint = (x.approvedPoint === null) ? "Chưa đánh giá" : parseInt(x.approvedPoint);
                    let status = this.checkStatusKPI(x.status);
                    let criteria = x.criteria;
                    let weight = x.weight;
                    
                    return {
                        STT: index + 1,
                        name: name,
                        criteria: criteria,
                        automaticPoint: automaticPoint,
                        status: status,
                        employeePoint: employeePoint,
                        approverPoint: approverPoint,
                        createdAt: createdAt,
                        weight: weight,
                    }
                });

                let oneKpiSetTasks = listTasks[i].map((item, index) => {
                    let oneKpiTasks = item.map((x,idx) => {
                        let name = x.name;
                        let startTaskD = new Date(x.startDate);
                        let endTaskD = new Date(x.endDate);
                        let startApproveD = new Date(x.preEvaDate);
                        let endApproveD = new Date(x.date);
                        let automaticPoint = (x.results.automaticPoint === null) ? "Chưa đánh giá" : parseInt(x.results.automaticPoint);
                        let employeePoint = (x.results.employeePoint === null) ? "Chưa đánh giá" : parseInt(x.results.employeePoint);
                        let approverPoint = (x.results.approvedPoint === null) ? "Chưa đánh giá" : parseInt(x.results.approvedPoint);
                        let status = this.formatTaskStatus(translate, x.status);
                        let contributionPoint = parseInt(x.results.contribution);
                        let importantLevel = parseInt(x.results.taskImportanceLevel);
                        let progress = parseInt(x.progress);
                        let unit = x.unit && x.unit[0] && x.unit[0].name;

                        return {
                            STT: idx + 1,
                            name: name,
                            automaticPoint: automaticPoint,
                            status: status,
                            employeePoint: employeePoint,
                            approverPoint: approverPoint,
                            startTaskDate: startTaskD,
                            endTaskDate: endTaskD,
                            startApproveDate: startApproveD,
                            endApproveDate: endApproveD,
                            contributionPoint: contributionPoint,
                            importantLevel: importantLevel,
                            progress: progress,
                            unit: unit
                        };
                    })
                    return oneKpiTasks;
                })
                let oneSet = {
                    name:listKpis[i].creator.name,
                    oneKpiSetTasks : oneKpiSetTasks,
                    kpis:kpis,
                    kpiSetAutomaticPoint:kpiSetAutomaticPoint,
                    kpiSetEmployeePoint: kpiSetEmployeePoint,
                    kpiSetApproverPoint: kpiSetApproverPoint,
                    kpiNum : kpiNum
                }
                data[date].push( oneSet);
            }
            
            let keys= Object.keys(data);
            for(let i=0;i<keys.length;i++){
                let temp ={
                    time:keys[i],
                    data:data[keys[i]],
                }
                convertedData.push(temp);
            }       

            //Convert xong, push data theo form data của component ExportExcel
            let dataSheets =[],sheetInfo =[];
            for(let i=0;i<listKpiUnit.length;i++)
            {
                let d = new Date(listKpiUnit[i].date),
                    time = (d.getMonth()+1) + "-" + (d.getFullYear());
                let employeeNumber = parseInt(listKpiUnit[i].organizationalUnit.deans.length) + parseInt(listKpiUnit[i].organizationalUnit.viceDeans.length) + parseInt(listKpiUnit[i].organizationalUnit.employees.length);
                let kpisUnitNumber = listKpiUnit[i].kpis.length;
                let automaticPoint = (listKpiUnit[i].automaticPoint === null) ? "Chưa đánh giá" : parseInt(listKpiUnit[i].automaticPoint);
                let employeePoint = (listKpiUnit[i].employeePoint === null) ? "Chưa đánh giá" : parseInt(listKpiUnit[i].employeePoint);
                let approverPoint = (listKpiUnit[i].approvedPoint === null) ? "Chưa đánh giá" : parseInt(listKpiUnit[i].approvedPoint);
                if (time === (convertedData[i].time))
                {
                    let info = {
                        employeeNumber,
                        kpisUnitNumber,
                        automaticPoint,
                        employeePoint,
                        approverPoint
                    }
                    sheetInfo.push(info);
                }
            }
            for(let i = 0; i < convertedData.length; i++)
            {
                let tablesData = this.pushDataIntoTable(convertedData[i]);
                let temp = {
                    sheetName : convertedData[i].time,
                    sheetTitle:"Báo cáo tổng hợp " + unitName + " tháng " + convertedData[i].time,
                    tables: tablesData.tables,
                    names : tablesData.names,
                    kpiSetEmployeePoint: tablesData.kpiSetEmployeePoint,
                    kpiSetAutomaticPoint: tablesData.kpiSetAutomaticPoint,
                    kpiSetApproverPoint: tablesData.kpiSetApproverPoint,
                    kpiNum: tablesData.kpiNum,
                    numTask: tablesData.numTask
                }
                dataSheets.push(temp);
            }
            let exportData = {
                fileName: "Báo cáo tổng hợp ",
                dataSheets: dataSheets.map((item,idx)=>{
                    return {
                        sheetName : item.sheetName,
                        sheetTitle : item.sheetTitle,
                        tables: item.tables.map((x,index)=>{
                            return {
                                moreInform: [
                                    (index===0)?{
                                        title: "Thông tin chung KPI "+ (unitName) +" "+ item.sheetName,
                                        value: [
                                                "Số nhân viên: "+ sheetInfo[idx].employeeNumber,
                                                "Số lượng KPI đơn vị: "+ sheetInfo[idx].kpisUnitNumber,
                                                "Điểm KPI tự động của đơn vị: "+ sheetInfo[idx].automaticPoint,
                                                "Điểm KPI tự đánh giá của đơn vị: "+ sheetInfo[idx].employeePoint,
                                                "Điểm KPI được phê duyệt của đơn vị: "+ sheetInfo[idx].approverPoint,
                                                "Số công việc được đánh giá: "+ item.numTask
                                            ]
                                    }:"",
                                    {
                                        title: "Báo cáo "+ (item.names[index]? item.names[index]:"") +" "+ item.sheetName,
                                        value: [
                                                "Số KPI: "+ item.kpiNum[index],
                                                "Điểm KPI tự động: "+ item.kpiSetAutomaticPoint[index],
                                                "Điểm KPI tự đánh giá: "+ item.kpiSetEmployeePoint[index],
                                                "Điểm KPI được phê duyệt: "+ item.kpiSetApproverPoint[index]
                                            ]
                                    }],
                                merges: [{
                                    key: "kpiPoint",
                                    columnName: "Kết quả KPI",
                                    keyMerge: 'kpiAutomaticPoint',
                                    colspan: 3
                                }, {
                                    key: "taskInfomations",
                                    columnName: "Điểm công việc",
                                    keyMerge: 'automaticPoint',
                                    colspan: 3
                                },
                                {
                                    key: "taskTime",
                                    columnName: "Thời gian thực hiện công việc",
                                    keyMerge: 'startTaskDate',
                                    colspan: 2
                                }, {
                                    key: "taskApprovedTime",
                                    columnName: "Thời gian đánh giá công việc",
                                    keyMerge: 'startApproveDate',
                                    colspan: 2
                                }],
                                rowHeader: 2,
                                columns: [
                                    { key: "STT", value: "STT" ,vertical:'center' ,horizontal:'center'},
                                    { key: "kpiName", value: "KPI",vertical:'center' ,horizontal:'center' }, 
                                    { key: "kpiWeight", value : "Trọng số",vertical:'center' ,horizontal:'center'},                               
                                    { key: "kpiStatus", value: "Trạng thái KPI" ,vertical:'center' ,horizontal:'center'},
                                    { key: "kpiAutomaticPoint", value: "Tự động",vertical:'center' ,horizontal:'center' },
                                    { key: "kpiEmployeePoint", value: "Tự đánh giá",vertical:'center' ,horizontal:'center' },
                                    { key: "kpiApprovedPoint", value: "Được phê duyệt",vertical:'center' ,horizontal:'center' },
                                    { key: "taskName", value: "Tên công việc" },
                                    { key: "unit", value: "Đơn vị quản lý công việc" },
                                    { key: "importantLevel", value: "Độ quan trọng" },
                                    { key: "contributionPoint", value: "% Đóng góp công việc" },
                                    { key: "automaticPoint", value: "Tự động" },
                                    { key: "employeePoint", value: "Tự đánh giá" },
                                    { key: "approverPoint", value: "Được phê duyệt" },
                                    { key: "startTaskDate", value: "Bắt đầu" },
                                    { key: "endTaskDate", value: "Kết thúc" },
                                    { key: "startApproveDate", value: "Bắt đầu" },
                                    { key: "endApproveDate", value: "Kết thúc" },
                                    { key: "taskStatus", value: "Trạng thái" },
                                    { key: "progress", value: "% Hoàn thành công việc" }                                    
                                    ],
                                data: x
                            }
                        })
                    }
                })
            }
            return exportData;
        }
        
    }

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    convertDataToExportData = (data, unitName) => {
        let fileName = "Bảng theo dõi KPI nhân viên "+ (unitName?unitName:"");
        if (data) {           
            data = data.map((x, index) => {
               
                let fullName =x.creator.name;
                let email = x.creator.email;
                let automaticPoint = (x.automaticPoint === null) ? "Chưa đánh giá" : parseInt(x.automaticPoint);
                let employeePoint = (x.employeePoint === null) ? "Chưa đánh giá" : parseInt(x.employeePoint);
                let approverPoint = (x.approvedPoint===null) ? "Chưa đánh giá" : parseInt(x.approvedPoint);
                let time = new Date(x.date)
                let status = this.checkStatusKPI(x.status);
                let numberTarget = parseInt(x.kpis.length);               

                return {
                    STT: index + 1,
                    fullName: fullName,    
                    email:email,               
                    automaticPoint: automaticPoint,
                    status: status,
                    employeePoint: employeePoint,
                    approverPoint: approverPoint,
                    time :time,
                    numberTarget:numberTarget                   
                };
            })
        }

        let exportData = {
            fileName: fileName,
            dataSheets: [
                {
                    sheetName: "sheet1",
                    sheetTitle : fileName,
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "time", value: "Thời gian" },
                                { key: "fullName", value: "Họ và tên" }, 
                                { key: "email", value : "Email nhân viên"},                               
                                { key: "numberTarget", value: "Số lượng mục tiêu" },
                                { key: "status", value: "Trạng thái mục tiêu" },
                                { key: "automaticPoint", value: "Điểm KPI tự động" },
                                { key: "employeePoint", value: "Điểm KPI tự đánh giá" },
                                { key: "approverPoint", value: "Điểm KPI được phê duyệt" }
                            ],
                            data: data
                        }
                    ]
                },
            ]
        }

        return exportData;        
       
    }

    render() {
        const { user, kpimembers } = this.props;
        const { translate } = this.props;
        const { status, startDate, endDate, kpiId, employeeKpiSet, perPage, userId } = this.state;
        let userdepartments, kpimember, unitMembers, exportData;
        if (user.userdepartments) userdepartments = user.userdepartments;
        if (kpimembers.kpimembers) {
            kpimember = kpimembers.kpimembers;
        }
        if (userdepartments) {
            unitMembers = getEmployeeSelectBoxItems([userdepartments]);
            unitMembers = [{ text: translate('kpi.evaluation.employee_evaluation.choose_employee'), value: 0 }, ...unitMembers[0].value];
        }

        if(kpimember&&userdepartments){
            exportData = this.convertDataToExportData(kpimember,userdepartments.department);            
        }
       
        let startDateDefault, endDateDefault;
        let d = new Date(),
            endmonth = d.getMonth(),
            month = '' + (d.getMonth() + 1),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (endmonth == 0) {
            endmonth = 12;
            startDateDefault = [endmonth, year-1].join('-');
        } else if (endmonth < 10) {
            endmonth = '0' + endmonth;
            startDateDefault = [endmonth, year].join('-');
        } else startDateDefault = [endmonth, year].join('-');
        endDateDefault = [month, year].join('-');

        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-body qlcv">
                        <EmployeeKpiApproveModal id={kpiId} />
                        <EmployeeKpiEvaluateModal employeeKpiSet={employeeKpiSet} />
                        <div className="form-inline">
                            <div className="form-group">
                                <label>{translate('kpi.evaluation.employee_evaluation.employee')}:</label>
                                {unitMembers &&
                                    <SelectBox
                                        id={`employee-kpi-manage`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={unitMembers}
                                        onChange={this.handleEmployeeChange}
                                        value={userId}
                                    />}
                            </div>
                            <div className="form-group">
                                <label>{translate('kpi.evaluation.employee_evaluation.status')}:</label>
                                <SelectBox
                                    id={`status-kpi`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={[
                                        { value: -1, text: translate('kpi.evaluation.employee_evaluation.choose_status') },
                                        { value: 0, text: translate('kpi.evaluation.employee_evaluation.establishing') },
                                        { value: 1, text: translate('kpi.evaluation.employee_evaluation.expecting') },
                                        { value: 2, text: translate('kpi.evaluation.employee_evaluation.activated') }
                                    ]}
                                    onChange={this.handleStatusChange}
                                    value={status}
                                />
                            </div>
                        </div>
                        <div className="form-inline">
                            <div className="form-group">
                                <label>{translate('kpi.evaluation.employee_evaluation.from')}:</label>
                                <DatePicker
                                    id='start_date'
                                    value={startDateDefault}
                                    onChange={this.handleStartDateChange}
                                    dateFormat="month-year"
                                />
                            </div>
                            <div className="form-group">
                                <label>{translate('kpi.evaluation.employee_evaluation.to')}:</label>
                                <DatePicker
                                    id='end_date'
                                    value={endDateDefault}
                                    onChange={this.handleEndDateChange}
                                    dateFormat="month-year"
                                />
                            </div>
                            <div className="form-group">
                                <button type="button" className="btn btn-success"  onClick={() => this.handleSearchData()}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                            </div>
                            {exportData&&<ExportExcel id="export-employee-kpi-evaluation-management" buttonName ="Báo cáo chung" exportData={exportData} style={{ marginRight: 15, marginTop:5 }} />}
                            {kpimember&&
                                 <ExportExcel buttonName ="Báo cáo tổng hợp" onClick={()=>this.handleExportTotalData(kpimember)}/> 
                            }
                        </div>

                        <DataTableSetting className="pull-right" tableId="kpiManagement" tableContainerId="tree-table-container" tableWidth="1300px"
                            columnArr={[
                                'STT',
                                'Thời gian',
                                'Tên nhân viên',
                                'Số lượng mục tiêu',
                                'Trạng thái KPI',
                                'Kết quả',
                                'Phê duyệt',
                                'Đánh giá']}
                            limit={perPage}
                            setLimit={this.setLimit}
                            hideColumnOption={true} />

                        <table id="kpiManagement" className="table table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th title="STT" style={{ width: "40px" }} className="col-fixed">STT</th>
                                    <th title="Thời gian">{translate('kpi.evaluation.employee_evaluation.time')}</th>
                                    <th title="Tên nhân viên">{translate('kpi.evaluation.employee_evaluation.name')}</th>
                                    <th title="Số lượng mục tiêu">{translate('kpi.evaluation.employee_evaluation.num_of_kpi')}</th>
                                    <th title="Trạng thái KPI">{translate('kpi.evaluation.employee_evaluation.kpi_status')}</th>
                                    <th title={translate('kpi.evaluation.employee_evaluation.system_evaluate')}>{translate('kpi.evaluation.employee_evaluation.system_evaluate')}</th>
                                    <th title={translate('kpi.evaluation.employee_evaluation.result_self_evaluate')}>{translate('kpi.evaluation.employee_evaluation.result_self_evaluate')}</th>
                                    <th title={translate('kpi.evaluation.employee_evaluation.evaluation_management')}>{translate('kpi.evaluation.employee_evaluation.evaluation_management')}</th>
                                    <th title="Phê duyệt" style={{ textAlign: "center" }}>{translate('kpi.evaluation.employee_evaluation.approve')}</th>
                                    <th title="Đánh giá">{translate('kpi.evaluation.employee_evaluation.evaluate')}</th>
                                </tr>
                            </thead>
                            <tbody className="task-table">
                                {(kpimember && kpimember.length !== 0) ?
                                    kpimember.map((item, index) =>
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item ? this.formatDate(item.date) : "Deleted"}</td>
                                            <td>{item.creator ? item.creator.name : "Deleted"}</td>
                                            <td>{item.kpis ? item.kpis.length : "Deleted"}</td>
                                            <td>{item ? this.checkStatusKPI(item.status) : "Deleted"}</td>
                                            <td>{item.automaticPoint === null ? translate('kpi.evaluation.employee_evaluation.not_evaluated_yet') : item.automaticPoint}</td>
                                            <td>{item.employeePoint === null ? translate('kpi.evaluation.employee_evaluation.not_evaluated_yet') : item.employeePoint}</td>
                                            <td>{item.approvedPoint === null ? translate('kpi.evaluation.employee_evaluation.not_evaluated_yet') : item.approvedPoint}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <a data-target={`#modal-approve-KPI-member`} onClick={() => this.handleShowApproveModal(item._id)} data-toggle="modal" className="approve"
                                                    title={translate('kpi.evaluation.employee_evaluation.approve_this_kpi')}><i className="fa fa-bullseye"></i></a>
                                            </td>
                                            <td>
                                                <a data-target={`#employee-kpi-evaluation-modal`} onClick={() => this.showEvaluateModal(item)} data-toggle="modal"
                                                    className="copy" title={translate('kpi.evaluation.employee_evaluation.evaluate_this_kpi')}><i className="fa fa-list"></i></a>
                                            </td>
                                        </tr>
                                    ) : <tr>
                                        <td colSpan={10}>
                                            <center>{translate('kpi.evaluation.employee_evaluation.data_not_found')}</center>
                                        </td>
                                    </tr>}
                            </tbody>
                            
                        </table>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { user, kpimembers, KPIPersonalManager,managerKpiUnit } = state;
    return { user, kpimembers, KPIPersonalManager,managerKpiUnit };
}

const actionCreators = {
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getEmployeeKPISets: kpiMemberActions.getEmployeeKPISets,
    getTaskByListKpis: kpiMemberActions.getTaskByListKpis,
    getAllKPIUnit: managerActions.getAllKPIUnit,
};
const connectedKPIMember = connect(mapState, actionCreators)(withTranslate(EmployeeKpiManagement));
export { connectedKPIMember as EmployeeKpiManagement };