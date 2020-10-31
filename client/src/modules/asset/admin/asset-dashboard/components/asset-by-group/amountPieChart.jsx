import React, { Component } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

class AmountPieChart extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.refs.amountPieChart) this.pieChart();
    }

    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { listAssets, setAmountOfAsset } = this.props;
        const { translate } = this.props;
        let dataPieChart, numberOfBuilding = 0, numberOfVehicle = 0, numberOfMachine = 0, numberOfOther = 0;

        if (listAssets) {
            listAssets.map(asset => {
                switch (asset.group) {
                    case "building":
                        numberOfBuilding++;
                        break;
                    case "vehicle":
                        numberOfVehicle++;
                        break;
                    case "machine":
                        numberOfMachine++;
                        break;
                    case "other":
                        numberOfOther++;
                        break;
                }
            });
        }

        dataPieChart = [
            [translate('asset.dashboard.building'), numberOfBuilding],
            [translate('asset.dashboard.vehicle'), numberOfVehicle],
            [translate('asset.dashboard.machine'), numberOfMachine],
            [translate('asset.dashboard.other'), numberOfOther],
        ];

        // CHuyển dữ liệu lên component cha để export
        if (setAmountOfAsset) {
            setAmountOfAsset(dataPieChart);
        }

        return dataPieChart;
    }

    // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviousChart() {
        const chart = this.refs.amountPieChart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    // Khởi tạo PieChart bằng C3
    pieChart = () => {

        let dataPieChart = this.setDataPieChart();
        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.amountPieChart,

            data: {
                columns: dataPieChart,
                type: 'pie',
            },

            pie: {
                label: {
                    format: function (value, ratio, id) {
                        return value;
                    }
                }
            },

            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            tooltip: {
                format: {
                    title: function (d) { return d; },
                    value: function (value) {
                        return value;
                    }
                }
            },

            legend: {
                show: true
            }
        });
    }

    render() {
        this.pieChart();

        return (
            <React.Fragment>
                <section ref="amountPieChart"></section>
            </React.Fragment>
        )
    }
}

export default (withTranslate(AmountPieChart));
