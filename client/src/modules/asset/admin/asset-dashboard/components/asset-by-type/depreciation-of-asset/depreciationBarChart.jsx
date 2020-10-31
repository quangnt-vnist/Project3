
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { translate } from 'react-redux-multilingual/lib/utils';

class DepreciationBarChart extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.barChart();
    }

    calculateDepreciation = (depreciationType, cost, usefulLife, estimatedTotalProduction, unitsProducedDuringTheYears, startDepreciation) => {
        let annualDepreciation = 0, monthlyDepreciation = 0, remainingValue = cost;

        if (depreciationType === "straight_line") { // Phương pháp khấu hao theo đường thẳng
            annualDepreciation = ((12 * cost) / usefulLife);
            monthlyDepreciation = cost / usefulLife;
            remainingValue = cost - (cost / usefulLife) * ((new Date().getFullYear() * 12 + new Date().getMonth()) - (new Date(startDepreciation).getFullYear() * 12 + new Date(startDepreciation).getMonth()));

        } else if (depreciationType === "declining_balance") { // Phương pháp khấu hao theo số dư giảm dần
            let lastYears = false,
                t,
                usefulYear = usefulLife / 12,
                usedTime = (new Date().getFullYear() * 12 + new Date().getMonth()) - (new Date(startDepreciation).getFullYear() * 12 + new Date(startDepreciation).getMonth());

            if (usefulYear < 4) {
                t = (1 / usefulYear) * 1.5;
            } else if (usefulYear >= 4 && usefulYear <= 6) {
                t = (1 / usefulYear) * 2;
            } else if (usefulYear > 6) {
                t = (1 / usefulYear) * 2.5;
            }

            // Tính khấu hao đến năm hiện tại
            for (let i = 1; i <= usedTime / 12; i++) {
                if (!lastYears) {
                    if (remainingValue * t > (remainingValue / (usefulYear - i + 1))) {
                        annualDepreciation = remainingValue * t;
                    } else {
                        annualDepreciation = (remainingValue / (usefulYear - i + 1));
                        lastYears = true;
                    }
                }

                remainingValue = remainingValue - annualDepreciation;
            }

            // Tính khấu hao đến tháng hiện tại
            if (usedTime % 12 !== 0) {
                if (!lastYears) {
                    if (remainingValue * t > (remainingValue / (usefulYear - Math.floor(usedTime / 12)))) {
                        annualDepreciation = remainingValue * t;
                    } else {
                        annualDepreciation = (remainingValue / (usefulYear - Math.floor(usedTime / 12)));
                        lastYears = true;
                    }
                }

                monthlyDepreciation = annualDepreciation / 12;
                remainingValue = remainingValue - (monthlyDepreciation * (usedTime % 12))
            }

        } else if (depreciationType === "units_of_production") { // Phương pháp khấu hao theo sản lượng
            let monthTotal = unitsProducedDuringTheYears.length; // Tổng số tháng tính khấu hao
            let productUnitDepreciation = cost / (estimatedTotalProduction * (usefulLife / 12)); // Mức khấu hao đơn vị sản phẩm
            let accumulatedDepreciation = 0; // Giá trị hao mòn lũy kế

            for (let i = 0; i < monthTotal; i++) {
                accumulatedDepreciation += unitsProducedDuringTheYears[i].unitsProducedDuringTheYear * productUnitDepreciation;
            }

            remainingValue = cost - accumulatedDepreciation;
            annualDepreciation = monthTotal ? accumulatedDepreciation * 12 / monthTotal : 0;
        }
        // console.log('cost', parseInt(cost - remainingValue));
        return parseInt(cost - remainingValue);
    }

    setDataBarChart = () => {
        const { listAssets, assetType, setDepreciationOfAsset } = this.props;
        let countDepreciation = [], typeName = [], shortName = [], idAssetType = [];

        for (let i in assetType) {
            countDepreciation[i] = 0;
            idAssetType.push(assetType[i]._id)
        }

        if (listAssets) {
            listAssets.map(asset => {
                for (let k in asset.assetType) {
                    let idx = idAssetType.indexOf(asset.assetType[k]._id);
                    countDepreciation[idx] += this.calculateDepreciation(asset.depreciationType, asset.cost, asset.usefulLife, asset.estimatedTotalProduction, asset.unitsProducedDuringTheYears, asset.startDepreciation) / 1000000;
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
            count: countDepreciation,
            type: typeName,
            shortName: shortName
        }

        if (listAssets && assetType && setDepreciationOfAsset) {
            setDepreciationOfAsset(data);
        }

        return data;
    }

    // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviousChart() {
        const chart = this.refs.depreciationBarChart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    // Khởi tạo BarChart bằng C3
    barChart = () => {
        let { translate, setDepreciationOfAsset } = this.props;
        let dataPieChart = this.setDataBarChart();
        let count = dataPieChart.count;
        let heightCalc = dataPieChart.type.length * 24.8;
        let height = heightCalc < 320 ? 320 : heightCalc;

        let chart = c3.generate({
            bindto: this.refs.depreciationBarChart,

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
                    type: 'category',
                    categories: dataPieChart.shortName,
                    tick: {
                        multiline: false
                    }
                },

                y: {
                    label: {
                        text: translate('asset.dashboard.lost_value'),
                        position: 'outer-right'
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
                <div ref="depreciationBarChart"></div>
            </React.Fragment>
        )
    }
}

export default withTranslate(DepreciationBarChart);