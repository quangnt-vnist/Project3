import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { Tree } from '../../../../../../common-components';
import c3 from 'c3';
import 'c3/c3.css';

class BarChartArchive extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
        this.barChartDocumentInArchive();
    }
    removePreviousArchiveChart() {
        const chart = this.refs.a;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }
    barChartDocumentInArchive = () => {
        this.removePreviousArchiveChart();
        let dataChart = this.setDataArchiveBarchart();
        let count = dataChart.count;
        let heightCalc
        if (dataChart.type) {
            heightCalc = dataChart.type.length * 24.8;
        }
        let height = heightCalc < 320 ? 320 : heightCalc;
        let chart = c3.generate({
            bindto: this.refs.archives,

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
    setDataArchiveBarchart = () => {
        const archives = this.props.archives;
        const docs = this.props.docs;
        let typeName = [], shortName = [], countArchive = [], idArchive = [];
        for (let i in archives) {
            countArchive[i] = 0;
            idArchive.push(archives[i].id)
        }

        if (docs) {
            docs.map(doc => {
                doc.archives.map(archive => {
                    let idx = idArchive.indexOf(archive);
                    countArchive[idx]++;
                })
            })
            for (let i in archives) {
                let length = archives[i].path.length;
                let longName = "..." + archives[i].path.slice(length - 18 > 0 ? length - 18 : 0, length);
                let name = archives[i].path.length > 15 ? longName : archives[i].path;
                shortName.push(name);
                typeName.push(archives[i].path);

            }
        }
        let data = {
            count: countArchive,
            type: typeName,
            shortName: shortName
        }
        return data;
    }

    render() {
        const archives = this.props.archives;
        const docs = this.props.documents;
        this.barChartDocumentInArchive();
        return (
            <React.Fragment>
                <div ref="archives"></div>
            </React.Fragment>
        )
    }

}


export default BarChartArchive;