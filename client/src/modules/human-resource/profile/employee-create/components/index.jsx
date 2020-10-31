import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { EmployeeCreatePage } from './combinedContent';

class EmployeeCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <React.Fragment>
                <EmployeeCreatePage />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(EmployeeCreate)); 
