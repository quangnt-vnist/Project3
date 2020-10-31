
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';

class GoodIssueReceiptByTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barAndLineChart: false
        }
    }

    componentDidMount() {
        this.barAndChart();
    }

    handleChangeViewChart = (value) => {
        this.setState({
            ...this.state,
            barAndLineChart: value
        })
    }

    // Khởi tạo BarChart bằng C3
    barAndChart = () => {
        let { translate } = this.props;
        const { barAndLineChart } = this.state;
        let chart = c3.generate({
            bindto: this.refs.goodIssueReceiptByTime,
            data: {
                x : 'x',
                columns: [
                    ['x', '01-2020', '02-2020', '03-2020', '04-2020', '05-2020', '06-2020', '07-2020', '08-2020'],
                    ['Xuất kho', 100, 200, 140, 200, 600, 228, 600, 200, 130],
                    ['Nhập kho', 300, 150, 140, 200, 500, 228, 290, 200, 130],
                    ['Tồn kho', 400, 100, 540, 100, 200, 328, 190, 100, 700],
                ],
                type: barAndLineChart ? 'bar' : 'spline',
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        rotate: 75,
                        multiline: false
                    },
                    height: 70
                }
            }
        });
    }

    render() {
        const { translate } = this.props;
        const { barAndLineChart } = this.state;
        this.barAndChart();
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <i className="fa fa-bar-chart-o" />
                        <h3 className="box-title">
                            Số lượng xuất, nhập, tồn theo từng mặt hàng
                        </h3>
                        <div className="form-inline" style={{marginTop: '10px'}}>
                            <div className="form-group" style={{display: 'flex', marginBottom: '10px'}}>
                                    <label>Chọn mặt hàng</label>
                                    <SelectBox 
                                        id="multiSelectOrgani"
                                        className="form-control select2"
                                        items={[
                                            { value: '0', text: 'Albendazole'},
                                            { value: '1', text: 'Afatinib'},
                                            { value: '2', text: 'Zoledronic Acid'},
                                            { value: '3', text: 'Abobotulinum'},
                                            { value: '4', text: 'Acid Thioctic'}
                                        ]}
                                        onChange={this.handleSelectOrganizationalUnit}
                                    />
                                </div>
                        </div>
                            <div className="form-inline" style={{ textAlign: "right" }}>
                                <div className="form-group" style={{display: 'flex'}}>
                                    <label>Thống kê theo</label>
                                    <SelectBox 
                                        id="multiSelectOr"
                                        className="form-control select2"
                                        items={[
                                            { value: '1', text: 'Tháng'},
                                            { value: '0', text: 'Ngày'},
                                            { value: '2', text: 'Năm'},
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
                                <div className="form-group">
                                    <button type="button" className="btn btn-success" title={translate('manage_warehouse.bill_management.search')} onClick={this.handleSubmitSearch}>{translate('manage_warehouse.bill_management.search')}</button>
                                </div>
                            </div>
                            <div className="dashboard_box_body">
                            <p className="pull-left" style={{ marginBottom: 0 }}><b>ĐV tính: Hộp</b></p>
                            <div className="box-tools pull-right">
                                <div className="btn-group pull-rigth">
                                    <button type="button" className={`btn btn-xs ${barAndLineChart ? "active" : "btn-danger"}`} onClick={() => this.handleChangeViewChart(false)}>Spline chart</button>
                                    <button type="button" className={`btn btn-xs ${barAndLineChart ? 'btn-danger' : "active"}`} onClick={() => this.handleChangeViewChart(true)}>Bar chart</button>
                                </div>
                            </div>
                            <div ref="goodIssueReceiptByTime"></div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default withTranslate(GoodIssueReceiptByTime);