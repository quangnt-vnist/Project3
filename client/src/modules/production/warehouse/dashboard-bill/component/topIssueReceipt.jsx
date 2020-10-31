
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';

class TopIssueReceipt extends Component {
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
            bindto: this.refs.topIssueReceipt,
            data: {
                x : 'x',
                columns: [
                    ['x', 'Bút', 'Chuột', 'Bình nước', 'Sách vở', 'Điện thoại'],
                    ['Số lượng', 600, 500, 450, 450, 300],
                ],
                type: 'bar',
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
                            Tốp những mặt hàng nhập, xuất nhiều nhất
                        </h3>
                            <div className="form-inline" style={{display: 'flex', marginTop: '10px'}}>
                                <div className="form-group">
                                    <SelectBox 
                                        id="multiSelectIssueReceipt"
                                        className="form-control select2"
                                        items={[
                                            { value: '1', text: 'Nhập'},
                                            { value: '0', text: 'Xuất'},
                                        ]}
                                        onChange={this.handleSelectOrganizationalUnit}
                                    />
                                </div>
                                <div className="form-group" style={{display: 'flex'}}>
                                    <label>Top</label>
                                    <SelectBox 
                                        id="multiSelectIssueRe"
                                        className="form-control select2"
                                        items={[
                                            { value: '1', text: '5'},
                                            { value: '2', text: '10'},
                                            { value: '3', text: '15'},
                                            { value: '4', text: '20'},
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
                                    <button type="button" className="btn btn-success" title={translate('manage_warehouse.bill_management.search')} onClick={this.handleSubmitSearch}>{translate('manage_warehouse.bill_management.search')}</button>
                                </div>
                            </div>
                        
                        <div ref="topIssueReceipt"></div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default withTranslate(TopIssueReceipt);