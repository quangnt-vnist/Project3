
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';

class TopTenProductBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barChart: true
        }
    }

    componentDidMount() {
        this.barAndChart();
    }

    handleChangeViewChart = (value) => {
        this.setState({
            ...this.state,
            barChart: value
        })
    }

    // Khởi tạo BarChart bằng C3
    barAndChart = () => {
        let { translate } = this.props;
        const { barChart } = this.state;
        let chart = c3.generate({
            bindto: this.refs.goodIssueReceipt,
            data: {
                x: 'x',
                columns: [
                    ['x', 'Thuốc Cúm gà', 'Thuốc bột trẻ em', 'Thuốc tiêm lợn', 'Hanceft', 'Paracetamol', 'tiffy', 'paradol', 'Thuốc bạc hà', 'C sủi', 'Insulin'],
                    ['Số lượng thuốc', 3000, 4000, 5000, 4500, 6000, 8000, 6000, 7000, 6000, 4000, 5000],
                ],
                type: barChart ? 'bar' : 'line',
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        rotate: 75,
                        multiline: false
                    },
                    height: 100
                },
                y: {
                    label: {
                        text: "Số lượng",
                        position: "outer-middle"
                    }
                }
            }
        });
    }

    render() {
        const { translate } = this.props;
        const { barChart } = this.state;
        this.barAndChart();
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <i className="fa fa-bar-chart-o" />
                        <h3 className="box-title">
                            Top 10 SP sản xuất nhiều nhất trong 2/2020 - 10/2020
                        </h3>
                        <div className="form-inline">
                            <div className="form-group">
                                <SelectBox id="selectBoxDay"
                                    items={[
                                        { value: '0', text: 'Tháng' },
                                        { value: '1', text: 'Ngày' },
                                        { value: '2', text: 'Tuần' },
                                        { value: '3', text: 'Năm' },
                                    ]}
                                    onChange={this.handleSelectOrganizationalUnit}
                                />
                            </div>
                        </div>
                        <div className="form-inline">
                            <div className="form-group">
                                <label className="form-control-static">Từ</label>
                                <DatePicker
                                    id="purchase-month"
                                    dateFormat="month-year"
                                    value=""
                                    onChange={this.handlePurchaseMonthChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-control-static">Đến</label>
                                <DatePicker
                                    id="purchase-month"
                                    dateFormat="month-year"
                                    value=""
                                    onChange={this.handlePurchaseMonthChange}
                                />
                            </div>
                            <div className="form-group">
                                <button className="btn btn-success">Lọc</button>
                            </div>
                        </div>
                        {/* <div className="box-tools pull-right">
                                <div className="btn-group pull-rigth">
                                    <button type="button" className={`btn ${barChart === true ? 'btn-danger' : null}`} onClick={() => this.handleChangeViewChart(true)}>Bar chart</button>
                                    <button type="button" className={`btn ${barChart === false ? 'btn-danger' : null}`} onClick={() => this.handleChangeViewChart(false)}>Line chart</button>
                                </div>
                            </div> */}

                        <div ref="goodIssueReceipt"></div>
                    </div>
                </div>
            </React.Fragment >
        )
    }
}

export default withTranslate(TopTenProductBarChart);