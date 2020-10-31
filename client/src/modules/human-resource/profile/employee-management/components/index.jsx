import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { EmployeeManagement } from './combinedContent';

class EmpoyeeManager extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <EmployeeManagement />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(EmpoyeeManager)); 
