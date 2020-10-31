/* Biểu đồ top 20 nhân sự có lương thưởng cao nhất */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';

class HighestSalaryChart extends Component {
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

    /** Render chart */
    renderChart = (data) => {
        data.data1.shift();
        let fakeData1 = data.data1.map((x, index) => {
            if (index % 2 === 0) {
                return x * 2
            } else return x / 2
        });

        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.rotateChart,
            data: {
                columns: [],
                hide: true,
                type: 'bar',
            },
            size: {
                height: 400
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
            if (dataCovert.length > 1) {
                for (let i = 0; i < dataCovert.length - 1; i++) {
                    for (let j = i + 1; j < dataCovert.length; j++) {
                        if (dataCovert[i].total < dataCovert[j].total) {
                            let value = dataCovert[i];
                            dataCovert[i] = dataCovert[j];
                            dataCovert[j] = value;
                        }
                    }
                };
                console.log(dataCovert);
                let data = [];
                dataCovert.forEach((x, index) => {
                    if (index < 20) {
                        data = [...data, x]
                    }
                });
                let ratioX = data.map(x => x.employee ? x.employee.fullName : 'Deleted')
                let data1 = data.map(x => x.unit === 'VND' ? x.total / 1000 : x.total);
                return {
                    nameData: 'Lương thưởng',
                    ratioX: ratioX,
                    data1: ['data1', ...data1],
                }
            }
            return {
                nameData: 'Lương thưởng',
                ratioX: [dataCovert[0].employee ? dataCovert[0].employee.fullName : 'Deleted'],
                data1: ['data1', dataCovert[0].unit === 'VND' ? dataCovert[0].total / 1000 : dataCovert[0].total],
            }
        };
        return {
            nameData: 'Lương thưởng',
            ratioX: [],
            data1: ['data1'],
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
        };
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
        })
        this.renderChart(this.convertData(result));

        return (
            <React.Fragment>
                <div className="box box-solid">
                    <div className="box-header with-border">
                        <h3 className="box-title">{`Top 20 nhân sự của ${(!organizationalUnits || organizationalUnits.length === department.list.length) ? "công ty" : organizationalUnitsName.join(', ')} nhận lương thưởng cao nhất ${monthShow} `}</h3>
                    </div>
                    <div className="box-body">
                        <div style={{ height: 420 }}>
                            <p className="pull-right" style={{ marginBottom: 0 }} > < b > ĐV tính: {data[0] && data[0].unit === 'VND' ? '1000VND' : "USD"}</b></p >
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

const highestSalaryChart = connect(mapState, null)(withTranslate(HighestSalaryChart));
export { highestSalaryChart as HighestSalaryChart };
