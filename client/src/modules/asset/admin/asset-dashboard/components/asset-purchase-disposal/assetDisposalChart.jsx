import React, { Component } from 'react';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DatePicker, SelectBox } from '../../../../../../common-components';
import Swal from 'sweetalert2';

import c3 from 'c3';
import 'c3/c3.css';

class AssetDisposalChart extends Component {
    constructor(props) {
        super(props);

        let d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;

        if (day.length < 2)
            day = '0' + day;

        this.INFO_SEARCH = {
            disposalDateAfter: year + '-' + (month - 3),
            disposalDateBefore: [year, month].join('-'),
        }

        this.state = {
            disposalDateAfter: this.INFO_SEARCH.disposalDateAfter,
            disposalDateBefore: this.INFO_SEARCH.disposalDateBefore,
            defaultStartMonth: '0' + (month - 3) + '-' + year,
            defaultEndMonth: [month, year].join('-'),
            year: "false",
        }
    }
    // Lấy dữ liệu biểu đồ trường hợp chọn hiển thị theo tháng
    setDataColumnChartForMonth = () => {
        const { getDisposalData, listAssets, translate } = this.props;
        let { disposalDateAfter, disposalDateBefore } = this.state;

        let startDate = new Date(disposalDateAfter);
        let endDate = new Date(disposalDateBefore);
        let period = Math.round((endDate - startDate) / 2592000000) + 1;
        let listMonth = [], value = [], countAsset = [], category = [], arr = [];
        let m = disposalDateAfter.slice(5, 7);
        let y = disposalDateAfter.slice(0, 4);

        // Lấy danh sách các tháng trong khoảng tìm kiếm
        for (let i = 0; i <= period; i++) {
            if (m > 12) {
                m = 1;
                y++;
            }
            if (m < 10) {
                m = '0' + m;
            }
            category.push([m, y].join('-'));
            listMonth.push([y, m].join(','));
            m++;
        }

        if (listAssets) {
            for (let i = 0; i < listMonth.length - 1; i++) {
                let cnt = 0, val = 0;
                let minDate = new Date(listMonth[i]).getTime();
                let maxDate = new Date(listMonth[i + 1]).getTime();

                for (let j in listAssets) {
                    if (listAssets[j].status === "disposed") {
                        let disposalDate = new Date(listAssets[j].disposalDate).getTime();
                        if (disposalDate < maxDate && disposalDate >= minDate) {
                            cnt++;
                            val += listAssets[j].disposalCost / 1000000;
                        }
                    }

                }
                countAsset.push(cnt);
                value.push(val);
            }
        }
        let maxCnt = Math.max.apply(Math, countAsset);

        for (let i = 0; i <= maxCnt; i++) {
            arr.push(i)
        }
        category.pop();
        category.unshift('x');
        countAsset.unshift(translate('asset.dashboard.amount'));
        value.unshift(translate('asset.dashboard.value'));

        let dataColumnChart = {
            category: category,
            count: countAsset,
            value: value,
            yValues: arr
        };

        if (getDisposalData && listAssets) {
            getDisposalData(dataColumnChart);
        }

        return dataColumnChart;
    }

    // Lấy dữ liệu biểu đồ trường hợp chọn hiển thị theo năm
    setDataColumnChartForYear = () => {
        const { getDisposalData, listAssets, translate } = this.props;
        let { disposalDateAfter, disposalDateBefore } = this.state;

        let startDate = disposalDateAfter.slice(0, 4);
        let endDate = disposalDateBefore.slice(0, 4);
        let period = endDate - startDate + 1;
        let value = [], countAsset = [], category = [], arr = [];

        // Lấy danh sách các năm trong khoảng tìm kiếm
        for (let i = 0; i < period; i++) {
            category.push(parseInt(startDate) + i);
        }

        if (listAssets) {
            for (let i = 0; i < category.length; i++) {
                let cnt = 0, val = 0;
                for (let j in listAssets) {
                    if (listAssets[j].status === "disposed") {
                        let disposalDate = new Date(listAssets[j].disposalDate).getFullYear();
                        if (disposalDate == category[i]) {
                            cnt++;
                            val += listAssets[j].disposalCost / 1000000;
                        }
                    }

                }
                countAsset.push(cnt);
                value.push(val);
            }
        }
        let maxCnt = Math.max.apply(Math, countAsset);

        for (let i = 0; i <= maxCnt; i++) {
            arr.push(i)
        }

        category.unshift('x');
        countAsset.unshift(translate('asset.dashboard.amount'));
        value.unshift(translate('asset.dashboard.value'));

        let dataColumnChart = {
            category: category,
            count: countAsset,
            value: value,
            yValues: arr
        };

        if (getDisposalData && listAssets) {
            getDisposalData(dataColumnChart);
        }

        return dataColumnChart;
    }

    // Thiết lập biểu đồ
    columnChart = () => {
        let { translate } = this.props;
        let { year } = this.state;
        let dataColumnChart = year == "true" ? this.setDataColumnChartForYear() : this.setDataColumnChartForMonth();

        if (translate('asset.dashboard.amount') === "Số lượng") {
            let chart = c3.generate({
                bindto: this.refs.DisposalColumnChart,

                data: {
                    x: 'x',
                    columns: [
                        dataColumnChart.category,
                        dataColumnChart.count,
                        dataColumnChart.value
                    ],
                    type: 'bar',
                    axes: {
                        'Giá trị': 'y2',
                        'Số lượng': 'y'
                    }
                },
                axis: {
                    x: {
                        type: 'category'
                    },
                    y: {
                        tick: {
                            values: dataColumnChart.yValues
                        },
                        label: {
                            text: translate('asset.dashboard.amount'),
                            position: 'outer-top'
                        }
                    },
                    y2: {
                        show: true,
                        label: {
                            text: translate('asset.dashboard.sum_value'),
                            position: 'outer-top'
                        }
                    }
                },
                padding: {
                    top: 20,
                    bottom: 20
                },
                legend: {
                    show: true
                }
            })
        } else {
            let chart = c3.generate({
                bindto: this.refs.DisposalColumnChart,

                data: {
                    x: 'x',
                    columns: [
                        dataColumnChart.category,
                        dataColumnChart.count,
                        dataColumnChart.value
                    ],
                    type: 'bar',
                    axes: {
                        'Value': 'y2',
                        'Amount': 'y'
                    }
                },
                axis: {
                    x: {
                        type: 'category'
                    },
                    y: {
                        tick: {
                            values: dataColumnChart.yValues
                        },
                        label: {
                            text: translate('asset.dashboard.amount'),
                            position: 'outer-top'
                        }
                    },
                    y2: {
                        show: true,
                        label: {
                            text: translate('asset.dashboard.sum_value'),
                            position: 'outer-top'
                        }
                    }
                },
                padding: {
                    bottom: 20
                },

                legend: {
                    show: true
                }
            });
        }
    }

    //Bắt sự kiện thay đổi ngày bắt đầu
    handleChangeDateAfter = async (value) => {
        let month = value.length == 4 ? value : value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));
        this.INFO_SEARCH.disposalDateAfter = month;
    }

    //Bắt sự kiện thay đổi ngày kết thúc
    handleChangeDateBefore = async (value) => {
        let month = value.length == 4 ? value : value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));
        this.INFO_SEARCH.disposalDateBefore = month;
    }

    //Bắt sự kiện tìm kiếm
    handleSearchData = async () => {
        let disposalDateAfter = new Date(this.INFO_SEARCH.disposalDateAfter);
        let disposalDateBefore = new Date(this.INFO_SEARCH.disposalDateBefore);

        if (disposalDateAfter.getTime() > disposalDateBefore.getTime()) {
            const { translate } = this.props;
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm'),
            })
        } else {
            await this.setState(state => {
                return {
                    ...state,
                    disposalDateAfter: this.INFO_SEARCH.disposalDateAfter,
                    disposalDateBefore: this.INFO_SEARCH.disposalDateBefore,
                }
            })
        }
    }

    //Bắt sự kiện thay đổi kiểu hiển thị
    handleChangeViewChart = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                year: value[0]
            }
        })
    }

    render() {
        const { translate } = this.props;
        let { year } = this.state;
        let { disposalDateAfter, disposalDateBefore } = this.INFO_SEARCH;

        let dateFormat = year === "true" ? "year" : "month-year";
        let startValue = year === "true" ? disposalDateAfter.slice(0, 4) : disposalDateAfter.slice(5, 7) + ' - ' + disposalDateAfter.slice(0, 4);
        let endValue = year === "true" ? disposalDateBefore.slice(0, 4) : disposalDateBefore.slice(5, 7) + ' - ' + disposalDateBefore.slice(0, 4);

        this.columnChart();
        return (
            <React.Fragment>

                <div className="form-inline" style={{ textAlign: "right" }}>

                    {/* Chọn hiển thị theo tháng/năm */}
                    <div className="form-group">
                        <label>{translate('asset.dashboard.statistic_by')}</label>
                        <SelectBox
                            id="selectTypeOfStatistic"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                { value: false, text: `${translate('general.month')}` },
                                { value: true, text: `${translate('general.year')}` }
                            ]}
                            onChange={this.handleChangeViewChart}
                            value={year}
                            multiple={false}
                            options={{ minimumResultsForSearch: 3 }}
                        />
                    </div>

                    {/* Chọn ngày bắt đầu và kết thúc để tìm kiếm */}
                    <div className="form-group">
                        <label style={{ width: "60px" }}>{translate('task.task_management.from')}</label>
                        <DatePicker
                            id={`disposal_after${dateFormat}`}
                            dateFormat={dateFormat}
                            value={startValue}
                            onChange={this.handleChangeDateAfter}
                            disabled={false}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ width: "60px" }}>{translate('task.task_management.to')}</label>
                        <DatePicker
                            id={`disposal_before${dateFormat}`}
                            dateFormat={dateFormat}
                            value={endValue}
                            onChange={this.handleChangeDateBefore}
                            disabled={false}
                        />
                    </div>
                    <button className="btn btn-success" onClick={this.handleSearchData}>{translate('task.task_management.search')}</button>
                </div>

                {/* Biểu đồ */}
                <div ref="DisposalColumnChart"></div>

            </React.Fragment>
        )
    }
}

export default withTranslate(AssetDisposalChart);