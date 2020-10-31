import React, { useState, useEffect, memo } from 'react';
import { withTranslate } from 'react-redux-multilingual';

import './hoursSpentOfEmployeeChart.css';
import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

function HoursSpentOfEmployeeChart(props) {
    const { data, refs } = props;
    
    useEffect(() => {
        if (data) {
            pieChart(refs, data);
        }
    })

    const removePreviousChart = (refs) => {
        const chart = document.getElementById(refs);

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        } 
    }

    const setDataPieChart = (data) => {
        let dataChart;
        dataChart = Object.entries(data);
        
        if (dataChart && dataChart.length !== 0) {
            dataChart = dataChart.map(item => {
                return [item[0] + " (" + item[1] + "h)", item[1]]
            })
        }
        return dataChart;
    }

    const pieChart = (refs, data) => {
        removePreviousChart(refs);

        let dataPieChart;
        dataPieChart = setDataPieChart(data);
        
        const chart = c3.generate({
            bindto: document.getElementById(refs),
            size: {
                height: 160,
            },

            data: {
                columns: dataPieChart,
                type: 'pie',
            },

            tooltip: {
                format: {
                    name: function (name) {
                        name = name.split("(");
                        return name[0];
                    },
                    value: function (value) {
                        return value + "h"
                    }
                }
            },

            legend: {
                position: 'right'
            }
        });
    }

    return (
        <React.Fragment>
            <div id={refs} className={"hoursSpentOfEmployee " + refs}></div>
        </React.Fragment>
    )
}

const shouldNotComponentUpdate = (prevProps, nextProps) => {
    if (nextProps.refs !== prevProps.refs) {
        return false;
    }
};

const connectedHoursSpentOfEmployeeChart = withTranslate(memo(HoursSpentOfEmployeeChart, shouldNotComponentUpdate));
export { connectedHoursSpentOfEmployeeChart as HoursSpentOfEmployeeChart }
