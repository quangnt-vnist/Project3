import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DashBoardEmployees } from './combinedContent';

class EmployeeDashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <DashBoardEmployees />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(EmployeeDashBoard));
