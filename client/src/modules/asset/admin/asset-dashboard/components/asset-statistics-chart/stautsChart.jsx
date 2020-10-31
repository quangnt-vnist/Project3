import React, { Component } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

class StautsChart extends Component {
    constructor(props) {
        super(props);
    }

    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { listAssets } = this.props;

        const { translate, getAssetStatusData } = this.props;
        let dataPieChart, numberOfReadyToUse = 0, numberOfInUse = 0, numberOfBroken = 0, numberOfLost = 0, numberOfDisposed = 0;

        if (listAssets) {
            for (let i in listAssets) {
                switch (listAssets[i].status) {
                    case "ready_to_use":
                        numberOfReadyToUse++;
                        break;
                    case "in_use":
                        numberOfInUse++;
                        break;
                    case "broken":
                        numberOfBroken++;
                        break;
                    case "lost":
                        numberOfLost++;
                        break;
                    case "disposed":
                        numberOfDisposed++;
                        break;
                }
            }
        }

        dataPieChart = [
            [translate('asset.general_information.ready_use'), numberOfReadyToUse],
            [translate('asset.general_information.using'), numberOfInUse],
            [translate('asset.general_information.damaged'), numberOfBroken],
            [translate('asset.general_information.lost'), numberOfLost],
            [translate('asset.general_information.disposal'), numberOfDisposed],
        ];

        if (getAssetStatusData && listAssets) {
            getAssetStatusData(dataPieChart);
        }

        return dataPieChart;
    }

    // Khởi tạo PieChart bằng C3
    pieChart = () => {
        let dataPieChart = this.setDataPieChart();

        this.chart = c3.generate({
            bindto: '#assetStatus',

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
                    title: function (d) {
                        return d;
                    },
                    value: function (value, ratio, id) {
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
        const { translate } = this.props;
        const { listAssets } = this.props;

        this.pieChart();

        return (
            <React.Fragment>
                <div className="box-body qlcv" id="assetStatusChart">
                    <section id="assetStatus"></section>
                </div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
}

const actions = {
}

const StautsChartConnected = connect(mapState, actions)(withTranslate(StautsChart));

export { StautsChartConnected as StautsChart }