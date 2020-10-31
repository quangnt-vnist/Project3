
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox, TreeSelect } from '../../../../../common-components';

class GoodIssueReceiptByGood extends Component {
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
                x : 'x',
                columns: [
                    ['x', 'Albendazole', 'Afatinib', 'Zoledronic Acid', 'Abobotulinum', 'Acid Thioctic', 'Mometasone (bôi)', 'Capecitabine', 'Mytomycin C'],
                    ['Xuất kho', 100, 200, 140, 200, 600, 228, 600, 200, 130],
                    ['Nhập kho', 300, 150, 340, 300, 500, 228, 290, 300, 100],
                    ['Tồn kho', 400, 100, 540, 100, 200, 328, 190, 100, 700],
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
        this.barAndChart();
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <i className="fa fa-bar-chart-o" />
                        <h3 className="box-title">
                            Số lượng xuất, nhập, tồn trong tất cả các kho
                        </h3>
                        <div className="form-inline" style={{marginTop: '10px'}}>
                            <div className="form-group" style={{display: 'flex', marginBottom: '10px', width: '20%'}}>
                                    <label>Chọn danh mục</label>
                                    <TreeSelect
                                    data={typeArr}
                                    value=""
                                    handleChange={this.handleAssetTypeChange}
                                    mode="hierarchical"
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

export default withTranslate(GoodIssueReceiptByGood);