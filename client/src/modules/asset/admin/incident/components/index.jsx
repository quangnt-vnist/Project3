import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { IncidentManagement } from './incidentManagement';

class IncidentManager extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <IncidentManagement />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(IncidentManager)); 
