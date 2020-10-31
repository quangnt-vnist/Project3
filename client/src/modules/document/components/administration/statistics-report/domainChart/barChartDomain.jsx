import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { Tree } from '../../../../../../common-components';
import c3 from 'c3';
import 'c3/c3.css';

class BarChartDomain extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
        this.barChartDocumentInDomain();
    }
    removePreviousDomainChart() {
        const chart = this.refs.a;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }
    barChartDocumentInDomain = () => {
        this.removePreviousDomainChart();
        let dataChart = this.setDataDomainBarchart();
        let count = dataChart.count;
        let heightCalc
        if (dataChart.type) {
            heightCalc = dataChart.type.length * 24.8;
        }
        let height = heightCalc < 320 ? 320 : heightCalc;
        let chart = c3.generate({
            bindto: this.refs.domains,

            data: {
                columns: [count],
                type: 'bar',
            },

            padding: {
                top: 10,
                bottom: 20,
                right: 0,
                left: 100
            },

            axis: {
                x: {
                    type: 'category',
                    categories: dataChart.shortName,
                    tick: {
                        multiline: false
                    }
                },
                y: {
                    label: {
                        text: 'Số lượng',
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
                    title: function (index) { return dataChart.type[index] },

                }
            }
        });
    }
    setDataDomainBarchart = () => {
        const domains = this.props.domains;
        const docs = this.props.docs;
        let typeName = [], shortName = [], countDomain = [], idDomain = [];
        for (let i in domains) {
            countDomain[i] = 0;
            idDomain.push(domains[i].id)
        }

        if (docs) {
            docs.map(doc => {
                doc.domains.map(domain => {
                    let idx = idDomain.indexOf(domain);
                    countDomain[idx]++;
                })
            })
            for (let i in domains) {
                let longName = domains[i].name.slice(0, 15) + "...";
                let name = domains[i].name.length > 15 ? longName : domains[i].name;
                shortName.push(name);
                typeName.push(domains[i].name);

            }
        }
        let data = {
            count: countDomain,
            type: typeName,
            shortName: shortName
        }
        return data;
    }

    render() {
        const domains = this.props.domains;
        const docs = this.props.documents;
        this.barChartDocumentInDomain();
        return (
            <React.Fragment>
                <div ref="domains"></div>
            </React.Fragment>
        )
    }

}


export default BarChartDomain;