import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { createKpiSetActions } from '../../creation/redux/actions';

import { DatePicker } from '../../../../../common-components';

import Swal from 'sweetalert2';
import c3 from 'c3';
import 'c3/c3.css';


var translate ='';
class ResultsOfEmployeeKpiChart extends Component {

    constructor(props) {
        super(props);

        translate = this.props.translate;

        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        this.INFO_SEARCH = {
            startMonth: currentYear + '-' + 1,
            endMonth: (currentMonth > 10) ? ((currentYear + 1) + '-' + (currentMonth - 10)) : (currentYear + '-' + (currentMonth + 2))
        }

        this.state = {
            dataStatus: this.DATA_STATUS.QUERYING,

            userId: localStorage.getItem("userId"),

            startMonth: this.INFO_SEARCH.startMonth,
            endMonth: this.INFO_SEARCH.endMonth
        };
    }

    componentDidMount = () => {
        this.props.getAllEmployeeKpiSetByMonth(this.state.userId, this.state.startMonth, this.state.endMonth);

        this.setState(state => {
            return {
                ...state,
                dataStatus: this.DATA_STATUS.QUERYING,
            }
        });
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if(nextState.startMonth !== this.state.startMonth || nextState.endMonth !== this.state.endMonth) {
            // Cầ đặt await, và phải đặt trước setState để kịp thiết lập createEmployeeKpiSet.employeeKpiSetByMonth là null khi gọi service
            await this.props.getAllEmployeeKpiSetByMonth(this.state.userId, nextState.startMonth, nextState.endMonth);
       
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                }
            });

            return false;
        }

        if(nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if(!nextProps.createEmployeeKpiSet.employeeKpiSetByMonth) {
                return false
            }

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE
                }
            })
            return false;
        } else if(nextState.dataStatus === this.DATA_STATUS.AVAILABLE) {
            this.multiLineChart();
            
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED
                }
            })
        }

        return false;
    }

    /**
     * 
     * Chọn các thông tin để vẽ biểu đồ
     */

    handleSelectMonthStart = (value) => {
        let month = value.slice(3,7) + '-' + value.slice(0,2);

        this.INFO_SEARCH.startMonth = month;
    }

    handleSelectMonthEnd = (value) => {
        let month;

        if (value.slice(0,2)<12) {
            month = value.slice(3,7) + '-' + (new Number(value.slice(0,2)) + 1);
        } else {
            month = (new Number(value.slice(3, 7)) + 1) + '-' + '1';
        }

        this.INFO_SEARCH.endMonth = month;
    }

    /**Gửi req và vẽ biểu đồ */
    handleSearchData = async () => {
        let startMonth = new Date(this.INFO_SEARCH.startMonth);
        let endMonth = new Date(this.INFO_SEARCH.endMonth);

        if (startMonth.getTime() >= endMonth.getTime()) {
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText:  translate('kpi.evaluation.employee_evaluation.confirm')
            })
        } else {
            await this.setState(state => {
                return {
                    ...state,
                    startMonth: this.INFO_SEARCH.startMonth,
                    endMonth: this.INFO_SEARCH.endMonth
                }
            })
        }
    }

    /**Thiết lập dữ liệu biểu đồ */
    setDataMultiLineChart = () => {
        const { createEmployeeKpiSet } = this.props;
        let listEmployeeKpiSetEachYear, automaticPoint, employeePoint, approvedPoint, date, dataMultiLineChart,exportData;

        if(createEmployeeKpiSet.employeeKpiSetByMonth) {
            listEmployeeKpiSetEachYear = createEmployeeKpiSet.employeeKpiSetByMonth
            exportData =this.convertDataToExportData(listEmployeeKpiSetEachYear);
            this.handleExportData(exportData)
            
        }

        if(listEmployeeKpiSetEachYear) {

            automaticPoint = [translate('kpi.organizational_unit.dashboard.result_kpi_unit_chart.automatic_point')];
            employeePoint = [translate('kpi.organizational_unit.dashboard.result_kpi_unit_chart.employee_point')];
            approvedPoint = [translate('kpi.organizational_unit.dashboard.result_kpi_unit_chart.approved_point')];
            date = ['x'];

            listEmployeeKpiSetEachYear.map(x => {
                automaticPoint.push(x.automaticPoint);
                employeePoint.push(x.employeePoint);
                approvedPoint.push(x.approvedPoint);

                let newDate = new Date(x.date);
                newDate = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + (newDate.getDate() - 1);
                date.push(newDate);
            });
        }
        
        dataMultiLineChart = [date, automaticPoint, employeePoint, approvedPoint];

        return dataMultiLineChart;
    };

    /**Xóa các chart đã render trước khi đủ dữ liệu */
    removePreviosMultiLineChart = () => {
        const chart =  this.refs.chart;
        while(chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild)
        }
    }

    /**Khởi tạo MultiLineChart bằng C3 */
    multiLineChart = () => {
        this.removePreviosMultiLineChart();
        
        // Tạo mảng dữ liệu
        let dataMultiLineChart = this.setDataMultiLineChart();

        this.chart = c3.generate({
            bindto: this.refs.chart,       // Đẩy chart vào thẻ div có id="multiLineChart"

            padding: {                              // Căn lề biểu đồ
                top: 20,
                bottom: 20,
                right: 20
            },

            data: {                                 // Dữ liệu biểu đồ
                x: 'x',
                columns: dataMultiLineChart,
                type: 'spline'
            },

            axis : {                                // Config trục tọa độ
                x : {
                    type : 'timeseries',
                    tick: {
                        format: function (x) { return (x.getMonth() + 1) + "-" + x.getFullYear(); }
                    }
                },
                y: {
                    max: 100,
                    min: 0,
                    label: {
                        text: translate('kpi.organizational_unit.dashboard.point'),
                        position: 'outer-right'
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                }
            },
            zoom: {                                 // Cho phép zoom biểu đồ
                enabled: false
            }
        });
    }

    handleExportData =(exportData)=>
    {
        const { onDataAvailable } = this.props;
        if (onDataAvailable) {
            onDataAvailable(exportData);
        }
    }

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    convertDataToExportData = (data,name,email) => {
        let fileName = "Biểu đồ theo dõi kết quả KPI cá nhân";

        if (data) {           
            data = data.map((x, index) => {
                let automaticPoint = (x.automaticPoint === null)?"Chưa đánh giá":parseInt(x.automaticPoint);
                let employeePoint = (x.employeePoint === null)?"Chưa đánh giá":parseInt(x.employeePoint);
                let approverPoint =(x.approvedPoint===null)?"Chưa đánh giá":parseInt(x.approvedPoint);
                let d = new Date(x.date),
                    month = '' + (d.getMonth() + 1),
                    year = d.getFullYear(),
                    date =month+'-'+year;

                return {              
                    automaticPoint: automaticPoint,
                    employeePoint: employeePoint,
                    approverPoint: approverPoint,
                    time : date,                
                };
            })
        }

        let exportData = {
            fileName: fileName,
            dataSheets: [
                {
                    sheetName: "Biểu đồ theo dõi kết quả KPI cá nhân của ",
                    sheetTitle: fileName,
                    tables: [
                        {
                            tableTitle: "Dữ liệu để vẽ biểu đồ "+ fileName,
                            columns: [                            
                                { key: "time", value: "Thời gian" },
                                { key: "automaticPoint", value: "Điểm KPI tự động" },
                                { key: "employeePoint", value: "Điểm KPI tự đánh giá" },
                                { key: "approverPoint", value: "Điểm KPI được đánh giá" }
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
        const { createEmployeeKpiSet } = this.props;

        let listEmployeeKpiSetEachYear;
        
        if (createEmployeeKpiSet.employeeKpiSetByMonth) {
            listEmployeeKpiSetEachYear = createEmployeeKpiSet.employeeKpiSetByMonth;
        }

        let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        let defaultendMonth = [month, year].join('-');
        let defaultstartMonth = ['01', year].join('-');

        return (
            <React.Fragment>
                {/**Chọn ngày bắt đầu */}
                <section className="form-inline">
                    <div className="form-group">
                        <label>{translate('kpi.evaluation.employee_evaluation.from')}</label>
                        <DatePicker 
                            id="monthStartInDashBoardEmployeeKpiSet"      
                            dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                            value={defaultstartMonth}                 // giá trị mặc định cho datePicker    
                            onChange={this.handleSelectMonthStart}
                            disabled={false}                    // sử dụng khi muốn disabled, mặc định là false
                        />
                    </div>
                </section>

                {/**Chọn ngày kết thúc */}
                <section className="form-inline">
                    <div className="form-group">
                        <label>{translate('kpi.evaluation.employee_evaluation.to')}</label>
                        <DatePicker 
                            id="monthEndInDashBoardEmployeeKpiSet"      
                            dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                            value={defaultendMonth}                 // giá trị mặc định cho datePicker    
                            onChange={this.handleSelectMonthEnd}
                            disabled={false}                    // sử dụng khi muốn disabled, mặc định là false
                        />
                    </div>

                    {/**button tìm kiếm data để vẽ biểu đồ */}
                    <div className="form-group">
                        <button type="button" className="btn btn-success" onClick={this.handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                    </div>
                </section>

                <section ref="chart"></section>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { createEmployeeKpiSet } = state;
    return { createEmployeeKpiSet };
}

const actions = {
    getAllEmployeeKpiSetByMonth: createKpiSetActions.getAllEmployeeKpiSetByMonth
}

const connectedResultsOfEmployeeKpiChart = connect(mapState, actions)(withTranslate(ResultsOfEmployeeKpiChart));
export { connectedResultsOfEmployeeKpiChart as ResultsOfEmployeeKpiChart }