
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox, TreeSelect } from '../../../../../common-components';

class QuantityInventoryByTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barChart: true
        }
    }

    componentDidMount() {
        this.barChart();
    }

    // Thiết lập dữ liệu biểu đồ
    setDataBarChart = () => {
        let data = {
            count: ["5", "6", "7", "8", "9", "10"],
            type: ["Thắng", "Phương", "Tài", "An", "Sang"],
            shortName: ["T", "P","T", "A", "S"]
        }

        return data;
    }

    // Khởi tạo BarChart bằng C3
    barChart = () => {
        let { translate } = this.props;
        let dataPieChart = this.setDataBarChart();
        let count = dataPieChart.count;
        let heightCalc = dataPieChart.type.length * 24.8;
        let height = heightCalc < 320 ? 320 : heightCalc;
        let chart = c3.generate({
            bindto: this.refs.quantityInventoryByTime,
            data: {
                x : 'x',
                columns: [
                    ['x', '01-2020', '02-2020', '03-2020', '04-2020', '05-2020', '06-2020', '07-2020', '08-2020'],
                    ['Số lượng tồn', 100, 200, 140, 200, 600, 228, 600, 200, 100],
                    ['Số lượng sắp nhập', 50, 150, 70, 30, 50, 228, 200, 60, 40],
                    ['Số lượng sắp xuất', 200, 100, 100, 100, 400, 128, 270, 130, 230]
                ],
                type: 'bar',
                types: {
                    'Số lượng sắp nhập': 'line',
                    'Số lượng sắp xuất': 'line'
                }
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
            },
        });
    }

    render() {
        const { translate } = this.props;
        this.barChart();
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <i className="fa fa-bar-chart-o" />
                        <h3 className="box-title">
                            Số lượng tồn kho theo thời gian của từng mặt hàng
                        </h3>
                        <div className="form-inline" style={{display: 'flex'}}>
                            <div className="form-group" style={{display: 'flex', marginRight: '20px'}}>
                                <label>Kho</label>
                                <SelectMulti id="multiSelectOrganizati"
                                    items={[
                                        { value: '1', text: 'Tạ Quang Bửu'},
                                        { value: '2', text: 'Trần Đại Nghĩa'},
                                        { value: '3', text: 'Đại Cồ Việt'},
                                        { value: '4', text: 'Lê Thanh Nghị'}
                                    ]}
                                    options={{ nonSelectedText: "Tất cả kho(4)", allSelectedText: "Tất cả kho(4)" }}
                                    onChange={this.handleSelectOrganizationalUnit}
                                >
                                </SelectMulti>
                            </div>
                            <div className="form-group" style={{display: 'flex'}}>
                                <label>Mặt hàng</label>
                                <SelectBox 
                                        id="multiSelectOrgan"
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
                        <div className="form-inline" style={{marginTop: '10px'}}>
                                <div className="form-group" style={{display: 'flex'}}>
                                    <label>Thống kê theo</label>
                                    <SelectBox 
                                        id="multiSelectO"
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
                        <div ref="quantityInventoryByTime"></div>
                        <div  style={{marginLeft: '70%'}}>
                        <ul class="pagination">
                            <li class="page-item"><a class="page-link" href="#">Trước</a></li>
                            <li class="page-item active"><a class="page-link" href="#">1</a></li>
                            <li class="page-item"><a class="page-link" href="#">2</a></li>
                            <li class="page-item"><a class="page-link" href="#">3</a></li>
                            <li class="page-item"><a class="page-link" href="#">4</a></li>
                            <li class="page-item"><a class="page-link" href="#">5</a></li>
                            <li class="page-item"><a class="page-link" href="#">Sau</a></li>
                        </ul>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default withTranslate(QuantityInventoryByTime);