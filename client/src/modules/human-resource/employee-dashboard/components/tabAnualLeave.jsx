import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { LazyLoadComponent } from '../../../../common-components';

import { TrendOfOvertime, AnnualLeaveTrendsChart } from './combinedContent';

class TabAnualLeave extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    };
    render() {
        return (
            <React.Fragment>
                <LazyLoadComponent>
                    <AnnualLeaveTrendsChart nameData1='Số lượt nghỉ' nameChart={'Xu hướng nghỉ phép'} />
                </LazyLoadComponent>
                <LazyLoadComponent>
                    <TrendOfOvertime nameData1='Số giờ tăng ca' nameChart={'Xu hướng tăng ca'} />
                </LazyLoadComponent>
            </React.Fragment>
        );
    }
};

const tabAnualLeave = connect(null, null)(withTranslate(TabAnualLeave));
export { tabAnualLeave as TabAnualLeave };