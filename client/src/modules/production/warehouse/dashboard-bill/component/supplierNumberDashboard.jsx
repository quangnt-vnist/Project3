
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';

class SupplierNumberDashboard extends Component {
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
            bindto: this.refs.supplierNumberDashboard,
            data: {
                x : 'x',
                columns: [
                    ['x', '01-2020', '02-2020', '03-2020', '04-2020', '05-2020', '06-2020', '07-2020', '08-2020'],
                    ['Phiếu nhập kho', 100, 200, 140, 200, 600, 228, 600, 200, 130],
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
                            Theo dõi số lượng phiếu nhập kho của mỗi nhà cung cấp
                        </h3>
                        <div className="form-inline" style={{marginTop: '10px'}}>
                            <div className="form-group" style={{display: 'flex', marginBottom: '10px'}}>
                                    <label>Khách hàng</label>
                                    <SelectBox 
                                        id="multiSelectOrgi"
                                        className="form-control select2"
                                        items={[
                                            { value: '0', text: 'Công ty TNHH ABC'},
                                            { value: '1', text: 'Công ty A'},
                                            { value: '2', text: 'Công ty B'},
                                            { value: '3', text: 'Công ty C'},
                                            { value: '4', text: 'Công ty D'}
                                        ]}
                                        onChange={this.handleSelectOrganizationalUnit}
                                    />
                                </div>
                        </div>
                            <div className="form-inline">
                                <div className="form-group" style={{display: 'flex'}}>
                                    <label>Thống kê theo</label>
                                    <SelectBox 
                                        id="multiSelectOr"
                                        className="form-control select2"
                                        items={[
                                            { value: '1', text: 'Tháng'},
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
                            <p className="pull-left" style={{ marginBottom: 0 }}><b>ĐV tính: Số phiếu</b></p>
                            <div className="box-tools pull-right">
                                <div className="btn-group pull-rigth">
                                    <button type="button" className={`btn btn-xs ${barAndLineChart ? "active" : "btn-danger"}`} onClick={() => this.handleChangeViewChart(false)}>Spline chart</button>
                                    <button type="button" className={`btn btn-xs ${barAndLineChart ? 'btn-danger' : "active"}`} onClick={() => this.handleChangeViewChart(true)}>Bar chart</button>
                                </div>
                            </div>
                            <div ref="supplierNumberDashboard"></div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default withTranslate(SupplierNumberDashboard);