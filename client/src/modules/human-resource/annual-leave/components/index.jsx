import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AnnualLeaveManagement } from './annualLeaveManagement';

class AnnualLeaveManager extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <AnnualLeaveManagement />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(AnnualLeaveManager)); 
