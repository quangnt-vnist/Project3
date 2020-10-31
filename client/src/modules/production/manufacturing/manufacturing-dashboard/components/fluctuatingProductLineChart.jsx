
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';

class FluctuatingProductLineChart extends Component {
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
                    ['x', '2/2020', '3/2020', '4/2020', '5/2020', '6/2020', '7/2020', '8/2020', '9/2020', '10/2020'],
                    ['Tổng sản phẩm', 3100, 4200, 5300, 4500, 6100, 8400, 6200, 7600, 6700, 4800],
                    ['Thành phẩm', 3000, 4000, 5000, 4300, 6000, 8000, 6000, 7000, 6000, 4000],
                    ['Phế phẩm', 100, 200, 300, 200, 100, 400, 200, 700, 700, 800],
                ],
                type: barChart ? 'line' : 'bar',
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
                            Biến động SLSX thuốc trong 2/2020 - 10/2020
                        </h3>
                        <div className="form-inline">
                            <div className="form-group">
                                <label style={{ width: 'auto' }} >Sản phẩm</label>
                                <SelectBox id="multiSelectO"
                                    items={[
                                        { value: '0', text: 'Tất cả' },
                                        { value: '1', text: 'Panadol Extra' },
                                        { value: '2', text: 'Penicillin' },
                                        { value: '3', text: 'C sủi' },
                                        { value: '4', text: 'Tamiflu' }
                                    ]}
                                    onChange={this.handleSelectOrganizationalUnit}
                                />
                            </div>
                        </div>
                        <div className="form-inline">
                            <div className="form-group">
                                <label style={{ width: 'auto' }}>Xưởng</label>
                                <SelectMulti id={`select-mill`} multiple="multiple"
                                    options={{ nonSelectedText: "Tất cả", allSelectedText: "Tất cả các xưởng" }}
                                    onChange={this.handleGroupChange}
                                    items={[
                                        { value: "1", text: "Xưởng A" },
                                        { value: "2", text: "Xưởng B" },
                                        { value: "3", text: "Xưởng C" },
                                        { value: "4", text: "Xưởng D" },
                                    ]}
                                >
                                </SelectMulti>
                            </div>
                        </div>
                        <div className="form-inline">
                            <div className="form-group">
                                <SelectBox id="selectBoxDay"
                                    style={{ marginLeft: "3rem" }}
                                    className="form-control select"
                                    items={[
                                        { value: '0', text: 'Tháng' },
                                        { value: '1', text: 'Ngày' },
                                        { value: '2', text: 'Tuần' },
                                        { value: '3', text: 'Năm' },
                                    ]}
                                    onChange={this.handleSelectOrganizationalUnit}
                                />
                            </div>

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
                            <div className="box-tools pull-right" >
                                <div className="btn-group pull-rigth">
                                    <button type="button" className={`btn btn-xs ${this.state.barChart ? "btn-danger" : "active"}`} onClick={() => this.handleChangeViewChart(true)}>Đường</button>
                                    <button type="button" className={`btn btn-xs ${this.state.barChart ? 'active' : "btn-danger"}`} onClick={() => this.handleChangeViewChart(false)}>Cột</button>
                                </div>
                            </div>

                            {/* <div className="form-group">
                                <button className="btn btn-success">Lọc</button>
                            </div> */}
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
            </React.Fragment>
        )
    }
}

export default withTranslate(FluctuatingProductLineChart);