import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import WorkSchedule from '../../manufacturing-plan/components/workScheduleComponent/workSchedule';

class ManufacturingProcess extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <WorkSchedule />
        );
    }
}
export default connect(null, null)(withTranslate(ManufacturingProcess));