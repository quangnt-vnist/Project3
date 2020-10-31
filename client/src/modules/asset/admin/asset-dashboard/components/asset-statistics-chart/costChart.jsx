import React, { Component } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

class CostChart extends Component {

    constructor(props) {
        super(props);
    }

    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { listAssets, getAssetCostData } = this.props;

        const { translate } = this.props;
        let dataPieChart, lessThanOneHundred = 0, oneHundred = 0, twoHundred = 0, fiveHundred = 0, oneBillion = 0, twoBillion = 0, fiveBillion = 0, tenBillion = 0;

        if (listAssets) {
            for (let i in listAssets) {
                let cost = listAssets[i].cost;

                if (cost < 100000000) {
                    lessThanOneHundred++;
                } else if (cost >= 100000000 && cost < 200000000) {
                    oneHundred++;
                } else if (cost >= 200000000 && cost < 500000000) {
                    twoHundred++;
                } else if (cost >= 500000000 && cost < 1000000000) {
                    fiveHundred++;
                } else if (cost >= 100000000 && cost < 2000000000) {
                    oneBillion++;
                } else if (cost >= 200000000 && cost < 5000000000) {
                    twoBillion++;
                } else if (cost >= 500000000 && cost < 10000000000) {
                    fiveBillion++;
                } else if (cost >= 10000000000) {
                    tenBillion++;
                }
            }
        }

        dataPieChart = [
            ["< 100M", lessThanOneHundred],
            ["100M - 200M", oneHundred],
            ["200M - 500M", twoHundred],
            ["500M - 1B", fiveHundred],
            ["1B - 2B", oneBillion],
            ["2B - 5B", twoBillion],
            ["5B - 10B", fiveBillion],
            ["> 10B", tenBillion],
        ];

        if (getAssetCostData && listAssets) {
            getAssetCostData(dataPieChart);
        }

        return dataPieChart;
    }

    // Khởi tạo PieChart bằng C3
    pieChart = () => {
        let dataPieChart = this.setDataPieChart();

        this.chart = c3.generate({
            bindto: '#assetCost',

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
                <div className="box-body qlcv" id="assetCostChart">
                    <section id="assetCost"></section>
                </div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
}

const actions = {
}

const AmountOfAssetChartConnected = connect(mapState, actions)(withTranslate(CostChart));

export { AmountOfAssetChartConnected as CostChart }