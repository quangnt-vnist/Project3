import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';

class GoodWillIssue extends Component {
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
            bindto: this.refs.goodWillIssue,
            data: {
                x : 'x',
                columns: [
                    ['x', '13-10-2020', '14-10-2020', '15-10-2020', '16-10-2020', '17-10-2020', '18-10-2020', '19-10-2020', '20-10-2020'],
                    ['Số lượng', 90, 0, 100, 0, 200, 328, 100, 0],
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
                            Xem số lượng sẽ xuất kho của từng mặt hàng
                        </h3>
                        <div className="form-inline" style={{marginTop: '10px'}}>
                            <div className="form-group" style={{display: 'flex', marginBottom: '10px'}}>
                                    <label>Mặt hàng</label>
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
                            <div className="form-inline">
                                <div className="form-group">
                                    <label className="form-control-static">Từ ngày</label>
                                    <DatePicker
                                        id="purchase-month"
                                        value=""
                                        onChange={this.handlePurchaseMonthChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-control-static">Đến ngày</label>
                                    <DatePicker
                                        id="purchase-month"
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
                            <div ref="goodWillIssue"></div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default withTranslate(GoodWillIssue);