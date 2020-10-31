
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';

class ManufacturingQuantityChart extends Component {
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
                    ['Tổng sản lượng', 300, 200, 140, 200, 600, 228, 600, 200, 130, 400],
                    ['Thành phẩm', 100, 150, 70, 100, 500, 100, 320, 100, 50, 100],
                    ['Phế phẩm', 200, 50, 70, 100, 100, 128, 280, 100, 80, 300],
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
                            Tổng sản lượng sản xuất, thành phẩm, phế phẩm trong 2/2020 - 10/2020
                        </h3>
                        <div className="form-inline">
                            <div className="form-group">
                                <label className="form-control-static">{translate('manage_warehouse.bill_management.from_date')}</label>
                                <DatePicker
                                    id="purchase-month"
                                    dateFormat="month-year"
                                    value=""
                                    onChange={this.handlePurchaseMonthChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-control-static">{translate('manage_warehouse.bill_management.to_date')}</label>
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
            </React.Fragment>
        )
    }
}

export default withTranslate(ManufacturingQuantityChart);