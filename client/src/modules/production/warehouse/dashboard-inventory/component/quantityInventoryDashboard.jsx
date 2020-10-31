
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox, TreeSelect } from '../../../../../common-components';

class QuantityInventoryDashboard extends Component {
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
            bindto: this.refs.quantityInventoryDashboard,
            data: {
                x : 'x',
                columns: [
                    ['x', 'Albendazole', 'Afatinib', 'Zoledronic Acid', 'Abobotulinum', 'Acid Thioctic', 'Mometasone (bôi)', 'Capecitabine', 'Mytomycin C'],
                    ['Số lượng tồn', 100, 200, 140, 200, 600, 228, 600, 200, 100],
                    ['Số lượng sắp nhập', 50, 150, 70, 30, 50, 228, 200, 60, 40],
                    ['Số lượng sắp xuất', 200, 100, 100, 100, 400, 128, 270, 130, 230]
                ],
                type: 'bar'
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
        const dataTree = [
            {
                id: "1",
                code: "B1",
                name: "Sản phẩm",
                description: "Nơi lưu trữ kho số 1",
                stock: "Tạ Quang Bửu",
                status: "Đang trống",
                users: ["Nguyễn Văn Thắng"],
                text: "Sản phẩm",
                state: { "open": true },
                parent: "#",
                child: "3"
            },
            {
                id: "2",
                code: "D5",
                name: "Nguyên vật liệu",
                description: "Nơi lưu trữ kho số 2",
                stock: "Trần Đại Nghĩa",
                status: "Đang trống",
                users: ["Nguyễn Văn Thắng"],
                text: "Nguyên vật liệu",
                state: { "open": true },
                parent: "#",
                child: "5"
            },
            {
                id: "3",
                code: "T1",
                name: "Dạng viên",
                description: "Nơi lưu trữ kho số B1",
                stock: "Tạ Quang Bửu",
                status: "Đang trống",
                users: ["Nguyễn Văn Thắng"],
                text: "Dạng viên",
                state: { "open": true },
                parent: "1",
                child: "4"
            },
            {
                id: "7",
                code: "T1",
                name: "Dạng bột",
                description: "Nơi lưu trữ kho số B1",
                stock: "Tạ Quang Bửu",
                status: "Đang trống",
                users: ["Nguyễn Văn Thắng"],
                text: "Dạng bột",
                state: { "open": true },
                parent: "1",
                child: "4"
            },
            {
                id: "8",
                code: "T1",
                name: "Dạng siro",
                description: "Nơi lưu trữ kho số B1",
                stock: "Tạ Quang Bửu",
                status: "Đang trống",
                users: ["Nguyễn Văn Thắng"],
                text: "Dạng siro",
                state: { "open": true },
                parent: "1",
                child: "4"
            },
            {
                id: "4",
                code: "P101",
                name: "Phòng 101",
                description: "Nơi lưu trữ kho số 1",
                stock: "Tạ Quang Bửu",
                status: "Đang trống",
                users: ["Nguyễn Văn Thắng"],
                enableGoods: [
                    {
                        good: "Jucca Nước",
                        type: "Nguyên Vật liệu",
                        capacity: "50 thùng",
                        contained: "10 thùng"
                    },
                    {
                        good: "Jucca",
                        type: "Nguyên Vật liệu",
                        capacity: "50 thùng",
                        contained: "10 thùng"
                    },
                ],
                text: "Phòng 101",
                state: { "open": true },
                parent: "3",
                child: "#"
            },
            {
                id: "5",
                code: "T2",
                name: "Tầng 2",
                description: "Nơi lưu trữ kho số 1",
                stock: "Tạ Quang Bửu",
                status: "Đang trống",
                users: ["Nguyễn Văn Thắng"],
                enableGoods: [
                    {
                        good: "Jucca Nước",
                        type: "Nguyên Vật liệu",
                        capacity: "50 thùng",
                        contained: "10 thùng"
                    },
                    {
                        good: "Jucca",
                        type: "Nguyên Vật liệu",
                        capacity: "50 thùng",
                        contained: "10 thùng"
                    },
                ],
                text: "Tầng 2",
                state: { "open": true },
                parent: "2",
                child: "#"
            },
            {
                id: "6",
                code: "C1",
                name: "Công cụ dụng cụ",
                description: "Nơi lưu trữ kho số 1",
                stock: "Tạ Quang Bửu",
                status: "Đang trống",
                users: ["Nguyễn Văn Thắng"],
                text: "Công cụ dụng cụ",
                state: { "open": true },
                parent: "#",
                child: "#"
            }
        ]

        let typeArr = [];
        dataTree.map(item => {
            typeArr.push({
                _id: item.id,
                id: item.id,
                name: item.name,
                parent: item.parent ? item.parent : null
            })
        })
        this.barChart();
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <i className="fa fa-bar-chart-o" />
                        <h3 className="box-title">
                            Số lượng tồn kho của các mặt hàng
                        </h3>
                        <div className="form-inline" style={{display: 'flex'}}>
                            <div className="form-group" style={{display: 'flex', marginRight: '20px'}}>
                                <label>Kho</label>
                                <SelectMulti id="multiSelectOrganizatio"
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
                                    <label>Danh mục</label>
                                    <TreeSelect
                                    data={typeArr}
                                    value=""
                                    handleChange={this.handleAssetTypeChange}
                                    mode="hierarchical"
                                />
                            </div>
                        </div>
                        <div className="form-inline" style={{marginTop: '10px'}}>
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
                        <div ref="quantityInventoryDashboard"></div>
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

export default withTranslate(QuantityInventoryDashboard);