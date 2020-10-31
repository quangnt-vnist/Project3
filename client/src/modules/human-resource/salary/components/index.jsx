import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SalaryManagement } from './combinedContent';

class SalaryManager extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <React.Fragment>
                <SalaryManagement />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(SalaryManager)); 
