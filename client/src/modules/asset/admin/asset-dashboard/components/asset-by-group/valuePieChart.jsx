import React, { Component } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';


class ValuePieChart extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.refs.valuePieChart) this.pieChart();
    }

    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { translate } = this.props;
        const { listAssets, setValueOfAsset } = this.props;

        let dataPieChart, valueOfBuilding = 0, valueOfVehicle = 0, valueOfMachine = 0, valueOfOther = 0;

        if (listAssets) {
            listAssets.map(asset => {
                switch (asset.group) {
                    case "building":
                        valueOfBuilding += asset.cost;
                        break;
                    case "vehicle":
                        valueOfVehicle += asset.cost;
                        break;
                    case "machine":
                        valueOfMachine += asset.cost;
                        break;
                    case "other":
                        valueOfOther += asset.cost;
                        break;
                }
            });
        }

        dataPieChart = [
            [translate('asset.dashboard.building'), valueOfBuilding],
            [translate('asset.dashboard.vehicle'), valueOfVehicle],
            [translate('asset.dashboard.machine'), valueOfMachine],
            [translate('asset.dashboard.other'), valueOfOther],
        ];

        if (setValueOfAsset) {
            setValueOfAsset(dataPieChart);
        }
        return dataPieChart;
    }


    // Khởi tạo PieChart bằng C3
    pieChart = () => {
        let dataPieChart = this.setDataPieChart();
        this.chart = c3.generate({
            bindto: this.refs.valuePieChart,

            data: {
                columns: dataPieChart,
                type: 'pie',
            },

            pie: {
                label: {
                    format: function (value) {
                        return value / 1000000 + " M";
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
                    value: function (value, ratio, id) {
                        let valueByUnit, unit;
                        if (value >= 1000000000) {
                            valueByUnit = Math.round(value / 1000000000);
                            unit = "B";
                        }
                        else {
                            valueByUnit = Math.round(value / 1000000);
                            unit = "M";
                        }
                        return valueByUnit + unit;
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
                <div >
                    <section ref="valuePieChart"></section>
                </div>
            </React.Fragment>
        )
    }
}

export default (withTranslate(ValuePieChart));
