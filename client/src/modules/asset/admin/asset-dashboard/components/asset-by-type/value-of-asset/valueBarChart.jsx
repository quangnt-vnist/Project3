
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';

class ValueBarChart extends Component {
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
        const { listAssets, assetType, setValueOfAsset } = this.props;

        let typeName = [], shortName = [], countAssetValue = [], idAssetType = [];
        for (let i in assetType) {
            countAssetValue[i] = 0;
            idAssetType.push(assetType[i]._id)
        }

        let chart = [];
        if (listAssets) {
            listAssets.map(asset => {
                for (let k in asset.assetType) {
                    let idx = idAssetType.indexOf(asset.assetType[k]._id);
                    countAssetValue[idx] += asset.cost / 1000000;
                }
            })
            for (let i in assetType) {

                let longName = assetType[i].typeName.slice(0, 20) + "...";
                let name = assetType[i].typeName.length > 20 ? longName : assetType[i].typeName;
                shortName.push(name);
                typeName.push(assetType[i].typeName);

            }
        }
        let data = {
            count: countAssetValue,
            type: typeName,
            shortName: shortName
        }

        if (listAssets && assetType && setValueOfAsset) {
            setValueOfAsset(data);
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
            bindto: this.refs.valueBarChart,
            data: {
                columns: [count],
                type: 'bar',
            },
            padding: {
                bottom: 20,
                right: 20
            },
            axis: {
                x: {
                    fit: true,
                    type: 'category',
                    categories: dataPieChart.shortName,
                    tick: {
                        multiline: false,

                    }
                },
                y: {
                    label: {
                        text: translate('asset.dashboard.sum_value'),
                        position: 'outer-right',
                    }
                },
                rotated: true
            },
            size: {
                height: height
            },
            color: {
                pattern: ['#1f77b4']
            },
            legend: {
                show: false
            },
            tooltip: {
                format: {
                    title: function (index) { return dataPieChart.type[index] },

                }
            }
        });
    }

    render() {
        this.barChart();
        return (
            <React.Fragment>

                <div ref="valueBarChart"></div>
            </React.Fragment>
        )
    }
}

export default withTranslate(ValueBarChart);