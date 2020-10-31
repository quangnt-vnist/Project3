import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { TimesheetsManagement } from './combinedContent';

class TimesheetsManager extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <React.Fragment>
                <TimesheetsManagement />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(TimesheetsManager)); 
