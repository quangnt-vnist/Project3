/* Biểu đồ thể hiện lương thưởng các đơn vị trong công ty */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';

class SalaryOfOrganizationalUnitsChart extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /** Xóa các chart đã render khi chưa đủ dữ liệu */
    removePreviousChart() {
        const chart = this.refs.salaryChart;
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
            bindto: this.refs.salaryChart,
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

    render() {
        const { translate, salary, department } = this.props;

        const { monthShow } = this.props;

        let organizationalUnitsName = department.list.map(x => { return { _id: x._id, name: x.name, salary: 0 } });
        let data = salary.listSalaryByMonth;
        if (data.length !== 0) {
            data = data.map(x => {
                let total = parseInt(x.mainSalary);
                if (x.bonus.length !== 0) {
                    for (let count in x.bonus) {
                        total = total + parseInt(x.bonus[count].number)
                    }
                };
                return { ...x, total: x.unit === 'VND' ? total / 1000000 : total / 1000 }
            })
        };

        organizationalUnitsName = organizationalUnitsName.map(x => {
            data.forEach(y => {
                if (x._id === y.organizationalUnit) {
                    x.salary = x.salary + y.total
                }
            })
            return x;
        })

        let ratioX = organizationalUnitsName.map(x => x.name);
        let data1 = organizationalUnitsName.map(x => x.salary);
        let dataChart = {
            nameData: 'Lương thưởng',
            ratioX: ratioX,
            data1: ['data1', ...data1],
        }


        this.renderChart(dataChart);

        return (
            <React.Fragment>
                <div className="box box-solid">
                    <div className="box-header with-border">
                        <h3 className="box-title">{`Biểu đồ lương thưởng các đơn vị trong công ty ${monthShow} `}</h3>
                    </div>
                    <div className="box-body">
                        <div style={{ height: 420 }}>
                            <p className="pull-right" style={{ marginBottom: 0 }} > < b > ĐV tính: {data[0] && data[0].unit === 'VND' ? 'Triệu VND' : "1000USD"}</b></p >
                            <div ref="salaryChart"></div>
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

const salaryOfOrganizationalUnits = connect(mapState, null)(withTranslate(SalaryOfOrganizationalUnitsChart));
export { salaryOfOrganizationalUnits as SalaryOfOrganizationalUnitsChart };
