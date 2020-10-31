import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { LazyLoadComponent } from '../../../../common-components';

import {
    HumanResourceChartBySalary, HumanResourceIncreaseAndDecreaseChart, QualificationChart, AgePyramidChart
} from './combinedContent';

class TabHumanResource extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    };
    render() {
        const { organizationalUnits, actionSearch, monthShow } = this.props;
        return (
            <div className="row qlcv">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <LazyLoadComponent>
                        <AgePyramidChart organizationalUnits={organizationalUnits} actionSearch={actionSearch} />
                    </LazyLoadComponent>
                    <div className='row'>
                        <LazyLoadComponent>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <HumanResourceChartBySalary organizationalUnits={organizationalUnits} monthShow={monthShow} handleMonthChange={this.handleMonthChange} />
                            </div>
                        </LazyLoadComponent>
                        <LazyLoadComponent>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <QualificationChart organizationalUnits={organizationalUnits} actionSearch={actionSearch} />
                            </div>
                        </LazyLoadComponent>
                    </div>
                    <LazyLoadComponent>
                        <HumanResourceIncreaseAndDecreaseChart nameData1='Tuyển mới' nameData2='Nghỉ làm' nameData3='Tổng nhân sự' nameChart={'Tình hình tăng giảm nhân sự'} />
                    </LazyLoadComponent>
                </div>
            </div>
        );
    }
};

const tabHumanResource = connect(null, null)(withTranslate(TabHumanResource));
export { tabHumanResource as TabHumanResource };