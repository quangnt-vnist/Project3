import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { MaintainanceManagement } from './maintainanceManagement';

class MaintainanceManager extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <MaintainanceManagement />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(MaintainanceManager)); 
