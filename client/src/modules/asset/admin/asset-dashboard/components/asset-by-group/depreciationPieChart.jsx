
import React, { Component } from 'react';
import { connect } from 'react-redux';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import c3 from 'c3';
import 'c3/c3.css';



class DepreciationPieChart extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.refs.depreciationExpenseOfAsset) this.pieChart();
    }

    // Hàm để tính các giá trị khấu hao cho tài sản
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
        return parseInt(cost - remainingValue);
    }

    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { listAssets, translate, setDepreciationOfAsset } = this.props;
        let dataPieChart, depreciationExpenseOfBuilding = 0, depreciationExpenseOfVehicle = 0, depreciationExpenseOfMachine = 0, depreciationExpenseOfOther = 0;
        let depreciationOfAsset = [];

        if (listAssets) {
            for (let i in listAssets) {
                depreciationOfAsset.push({
                    name: listAssets[i].assetName,
                    type: listAssets[i].assetType,
                    group: listAssets[i].group,
                    depreciationExpense: this.calculateDepreciation(listAssets[i].depreciationType, listAssets[i].cost, listAssets[i].usefulLife, listAssets[i].estimatedTotalProduction, listAssets[i].unitsProducedDuringTheYears, listAssets[i].startDepreciation)
                })
            }
        }
        if (depreciationOfAsset.length) {
            depreciationOfAsset.map(asset => {
                switch (asset.group) {
                    case "building":
                        depreciationExpenseOfBuilding += asset.depreciationExpense;
                        break;
                    case "vehicle":
                        depreciationExpenseOfVehicle += asset.depreciationExpense;
                        break;
                    case "machine":
                        depreciationExpenseOfMachine += asset.depreciationExpense;
                        break;
                    case "other":
                        depreciationExpenseOfOther += asset.depreciationExpense;
                        break;
                }
            });
        }

        dataPieChart = [
            [translate('asset.dashboard.building'), depreciationExpenseOfBuilding > 0 ? depreciationExpenseOfBuilding : 0],
            [translate('asset.dashboard.vehicle'), depreciationExpenseOfVehicle],
            [translate('asset.dashboard.machine'), depreciationExpenseOfMachine],
            [translate('asset.dashboard.other'), depreciationExpenseOfOther],
        ];

        if (setDepreciationOfAsset) {
            setDepreciationOfAsset(dataPieChart);
        }

        return dataPieChart;
    }

    // Khởi tạo PieChart bằng C3
    pieChart = () => {
        let dataPieChart = this.setDataPieChart();
        this.chart = c3.generate({
            bindto: this.refs.depreciationExpenseOfAsset,

            data: {
                columns: dataPieChart,
                type: 'pie',
            },
            pie: {
                label: {
                    format: function (value) {
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
                <div>
                    <section ref="depreciationExpenseOfAsset"></section>
                </div>
            </React.Fragment>
        )
    }
}

export default (withTranslate(DepreciationPieChart));

