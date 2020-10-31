/* Biểu đồ nhân sự phân theo dải lương */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';

class HumanResourceChartBySalary extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /** Xóa các chart đã render khi chưa đủ dữ liệu */
    removePreviousChart() {
        const chart = this.refs.rotateBarChart;
        while (chart && chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    /**
     * Render chart
     * @param {*} data : Dữ liệu của chart
     */
    renderChart = (data) => {
        data.data1.shift();
        let fakeData1 = data.data1.map((x, index) => {
            if (index % 2 === 0) {
                return x * 2
            } else return x / 2
        });

        // this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.rotateChart,
            data: {
                columns: [],
                hide: true,
                type: 'bar',
            },
            axis: {
                rotated: true,
                x: {
                    type: 'category', categories: data.ratioX,
                    tick: { outer: false, centered: true },
                },
                y: {
                    tick: {
                        outer: false
                    },
                }
            }
        });

        setTimeout(function () {
            chart.load({
                columns: [[data.nameData, ...fakeData1]],
            });
        }, 100);

        setTimeout(function () {
            chart.load({
                columns: [[data.nameData, ...data.data1]],
            });
        }, 300);
    };

    /**
     * Function chyển dữ liệu thành dữ liệu chart
     * @param {*} dataCovert 
     */
    convertData = (dataCovert) => {
        if (dataCovert.length !== 0) {
            if (dataCovert[0].unit && dataCovert[0].unit === 'VND') {
                let ratioX = [">100tr", "90tr-100tr", "80tr-90tr", "70tr-80tr", "60tr-70tr", "50tr-60tr", "40tr-50tr", "30tr-40tr", "20tr-30tr", "10tr-20tr", "<10tr"];
                let data1 = ['data1', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                dataCovert.forEach(x => {
                    let check = x.total / 1000000;
                    if (check > 100) {
                        data1[1] = data1[1] + 1;
                    } else if (90 < check && check <= 100) {
                        data1[2] = data1[2] + 1;
                    } else if (80 < check && check <= 90) {
                        data1[3] = data1[3] + 1;
                    } else if (70 < check && check <= 80) {
                        data1[4] = data1[4] + 1;
                    } else if (60 < check && check <= 70) {
                        data1[5] = data1[5] + 1;
                    } else if (50 < check && check <= 60) {
                        data1[6] = data1[6] + 1;
                    } else if (40 < check && check <= 50) {
                        data1[7] = data1[7] + 1;
                    } else if (30 < check && check <= 40) {
                        data1[8] = data1[8] + 1;
                    } else if (20 < check && check <= 30) {
                        data1[9] = data1[9] + 1;
                    } else if (10 < check && check <= 20) {
                        data1[10] = data1[10] + 1;
                    } else {
                        data1[11] = data1[11] + 1;
                    }
                });
                return {
                    ratioX: ratioX,
                    data1: data1,
                    nameData: 'Nhân viên',
                }
            };
            if (dataCovert[0].unit && dataCovert[0].unit === 'USD') {
                let ratioX = [">5000", "4500-5000", "4000-4500", "3500-4000tr", "3000-3500", "2500-3000", "2000-2500", "1500-2000", "1000-1500", "500-1000", "<500"];
                let data1 = ['data1', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                dataCovert.forEach(x => {
                    if (x.total > 5000) {
                        data1[1] = data1[1] + 1;
                    } else if (4500 < x.total && x.total <= 5000) {
                        data1[2] = data1[2] + 1;
                    } else if (4000 < x.total && x.total <= 4500) {
                        data1[3] = data1[3] + 1;
                    } else if (3500 < x.total && x.total <= 4000) {
                        data1[4] = data1[4] + 1;
                    } else if (3000 < x.total && x.total <= 3500) {
                        data1[5] = data1[5] + 1;
                    } else if (2500 < x.total && x.total <= 3000) {
                        data1[6] = data1[6] + 1;
                    } else if (2000 < x.total && x.total <= 2500) {
                        data1[7] = data1[7] + 1;
                    } else if (1500 < x.total && x.total <= 2000) {
                        data1[8] = data1[8] + 1;
                    } else if (1000 < x.total && x.total <= 1500) {
                        data1[9] = data1[9] + 1;
                    } else if (500 < x.total && x.total <= 1000) {
                        data1[10] = data1[10] + 1;
                    } else {
                        data1[11] = data1[11] + 1;
                    }
                });
                return {
                    ratioX: ratioX,
                    data1: data1,
                    nameData: 'Nhân viên',
                }
            }
        };
        return {
            ratioX: [">100tr", "90tr-100tr", "80tr-90tr", "70tr-80tr", "60tr-70tr", "50tr-60tr", "40tr-50tr", "30tr-40tr", "20tr-30tr", "10tr-20tr", "<10tr"],
            data1: ['data1', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            nameData: 'Nhân viên',
        }
    }

    render() {
        const { translate, salary, department } = this.props;

        const { monthShow, organizationalUnits } = this.props;

        let data = salary.listSalaryByMonthAndOrganizationalUnits;
        let organizationalUnitsName;
        if (organizationalUnits) {
            organizationalUnitsName = department.list.filter(x => organizationalUnits.includes(x._id));
            organizationalUnitsName = organizationalUnitsName.map(x => x.name);
        }

        if (data.length !== 0) {
            data = data.map(x => {
                let total = parseInt(x.mainSalary);
                if (x.bonus.length !== 0) {
                    for (let count in x.bonus) {
                        total = total + parseInt(x.bonus[count].number)
                    }
                };
                return { ...x, total: total }
            })
        }

        let result = [];
        data.forEach(x => {
            let check;
            result.forEach(y => {
                if (y._id === x._id) {
                    y.total = y.total + x.total;
                    check = y;
                }
            })
            if (check) {
                result = [...result, check];
            } else {
                result = [...result, x]
            }
        });

        this.renderChart(this.convertData(result));

        return (
            <React.Fragment>
                <div className="box box-solid">
                    <div className="box-header with-border">
                        <h3 className="box-title">{`Biểu đồ nhân sự của ${(!organizationalUnits || organizationalUnits.length === department.list.length) ? "công ty" : organizationalUnitsName.join(', ')} phân theo dải lương ${monthShow}`}</h3>
                    </div>
                    <div className="box-body">
                        <div className="dashboard_box_body">
                            <p className="pull-right" style={{ marginBottom: 0 }} > < b > ĐV tính: Người</b></p >
                            <div ref="rotateChart"></div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { salary, department } = state;
    return { salary, department };
};

const humanResourceChartBySalary = connect(mapState, null)(withTranslate(HumanResourceChartBySalary));
export { humanResourceChartBySalary as HumanResourceChartBySalary };
