
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';

class QuantityExpirationDate extends Component {
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
            bindto: this.refs.quantityExpirationDate,
            data: {
                x : 'x',
                columns: [
                    ['x', 'Albendazole', 'Afatinib', 'Zoledronic Acid', 'Abobotulinum', 'Acid Thioctic', 'Mometasone (bôi)', 'Capecitabine', 'Mytomycin C'],
                    ['Số lượng', 10, 20, 30, 20, 10, 22, 50, 60, 20],
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
            }
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
                            Số lượng mặt hàng tồn kho sắp hết hạn sử dụng
                        </h3>
                        <div className="form-group" style={{width: '100%', display: 'flex', margin: '10px'}}>
                            <label style={{marginRight: '10px'}} className="form-control-static">{translate('manage_warehouse.bill_management.to_date')}</label>
                            <DatePicker
                                id="purchase-month"
                                dateFormat="month-year"
                                value=""
                                onChange={this.handlePurchaseMonthChange}
                            />
                        </div>
                        <div ref="quantityExpirationDate"></div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default withTranslate(QuantityExpirationDate);