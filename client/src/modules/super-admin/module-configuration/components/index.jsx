import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ManageConfiguration } from './combinedContent';

class ConfigurationManager extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <React.Fragment>
                <ManageConfiguration />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(ConfigurationManager)); 
